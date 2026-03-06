"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { StudentLetterPreview } from "@/components/letter/StudentLetterPreview";
import { useSearchParams } from "next/navigation";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterValues = {
  nama?: string;
  namaLengkap?: string;
  nim?: string;
  programStudi?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  alamat?: string;
  semester?: string;
  keperluan?: string;
  tahunMulai?: string;
  tahunSelesai?: string;
  nomorSurat?: string;
  nomor?: string;
  tahunMasuk?: string;
  angkatan?: string;
};

const getAcademicYearStart = (date: Date) => {
  const month = date.getMonth() + 1;
  return month <= 6 ? date.getFullYear() - 1 : date.getFullYear();
};

const parseEntryYear = (value?: string | number | null) => {
  if (value === null || typeof value === "undefined") return null;
  const trimmed = String(value).trim();
  if (/^\d{4}$/.test(trimmed)) {
    return Number(trimmed);
  }
  return null;
};


const getSemesterNumber = (entryYear: number | null, date: Date) => {
  if (!entryYear) return null;
  const currentYear = date.getFullYear();
  const diffYears = currentYear - entryYear;
  if (diffYears < 0) return null;
  const month = date.getMonth() + 1;
  const base = diffYears * 2;
  const raw = month <= 6 ? base + 2 : base + 1;
  if (raw < 1) return null;
  return Math.min(raw, 14);
};

const spellNumberId = (value: number) => {
  const mapping: Record<number, string> = {
    1: "Satu",
    2: "Dua",
    3: "Tiga",
    4: "Empat",
    5: "Lima",
    6: "Enam",
    7: "Tujuh",
    8: "Delapan",
    9: "Sembilan",
    10: "Sepuluh",
    11: "Sebelas",
    12: "Dua Belas",
    13: "Tiga Belas",
    14: "Empat Belas",
  };
  return mapping[value] ?? `${value}`;
};
const formatSemesterValue = (value?: string) => {
  if (!value) return value;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return `${numeric} (${spellNumberId(numeric)})`;
};


export default function SupervisorPreviewSurat() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [values, setValues] = useState<LetterValues | null>(null);
  const { t } = useUiPreferences();
  const clampZoom = (value: number) => Math.min(150, Math.max(50, value));
  const handleZoom = (delta: number) => setZoom((z) => clampZoom(z + delta));

  useEffect(() => {
    const letterId = searchParams.get("letterId");
    if (!letterId) {
      return;
    }

    const loadLetter = async () => {
      const response = await fetch(`${API_BASE}/letters/${letterId}?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { values?: LetterValues };
      setValues(data.values ?? null);
    };

    loadLetter();
  }, [searchParams]);

  const formatTanggal = (value?: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const referenceDate = new Date();
  const academicYearStart = getAcademicYearStart(referenceDate);
  const academicYear = values?.tahunMulai || values?.tahunSelesai
    ? { start: values?.tahunMulai ?? "-", end: values?.tahunSelesai ?? "-" }
    : { start: `${academicYearStart}`, end: `${academicYearStart + 1}` };
  const entryYear =
    parseEntryYear(values?.tahunMasuk) ??
    parseEntryYear(values?.angkatan);
  const computedSemester = getSemesterNumber(entryYear, referenceDate);
  const semesterLabel = values?.semester
    ? formatSemesterValue(values.semester)
    : computedSemester
    ? `${computedSemester} (${spellNumberId(computedSemester)})`
    : "-";

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        dashboardHref="/supervisor/dashboard"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        {sidebarOpen ? <SupervisorSidebar active="surat-masuk" /> : null}
        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-4 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">{t("previewBreadcrumb")}</p>
              <h1 className="text-2xl font-bold text-slate-900">{t("previewTitle")}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <button
                className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50 disabled:opacity-40"
                onClick={() => handleZoom(-10)}
                disabled={zoom <= 50}
              >
                −
              </button>
              <span className="px-2">{zoom}%</span>
              <button
                className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50 disabled:opacity-40"
                onClick={() => handleZoom(10)}
                disabled={zoom >= 150}
              >
                +
              </button>
              <span className="text-xs text-slate-500">{t("pageLabel")}</span>
            </div>
          </div>

          <div className="flex justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-4">
            <div
              className="origin-top transform transition-transform border border-slate-300 bg-white shadow-sm"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                zoom: zoom / 100,
              }}
            >
              <StudentLetterPreview
                nomor={values?.nomorSurat ?? values?.nomor ?? "-"}
                applicant={{
                  name: values?.namaLengkap ?? values?.nama ?? "-",
                  nim: values?.nim ?? "-",
                  program: values?.programStudi ?? "-",
                  birthPlace: values?.tempatLahir ?? "-",
                  birthDate: formatTanggal(values?.tanggalLahir),
                  address: values?.alamat ?? "-",
                  semester: semesterLabel,
                }}
                academicYear={academicYear}
                keperluan={values?.keperluan ?? "-"}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link href={searchParams.get("letterId") ? `/supervisor/penerima/detail?letterId=${searchParams.get("letterId")}` : "/supervisor/penerima/detail"}>
                {t("back")}
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
