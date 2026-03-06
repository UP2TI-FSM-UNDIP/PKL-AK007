"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { StudentLetterPreview } from "@/components/letter/StudentLetterPreview";

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


export default function PratinjauSuratPage() {
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(1);
  const [values, setValues] = useState<LetterValues | null>(null);

  useEffect(() => {
    const letterId = searchParams.get("letterId");
    if (!letterId) return;
    const loadLetter = async () => {
      const response = await fetch(`${API_BASE}/letters/${letterId}?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as { values?: LetterValues };
      setValues(data.values ?? null);
    };
    loadLetter();
  }, [searchParams]);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

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
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Form Pengajuan Surat /{" "}
            <span className="font-medium">Pratinjau Surat</span>
          </p>

          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={zoomOut}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              −
            </button>

            <span className="w-14 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={zoomIn}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>

            <span className="ml-4 text-gray-400">
              Halaman 1 dari 1
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="bg-gray-200 flex justify-center py-10">
            <div
              className="origin-top transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="bg-white shadow-lg border border-slate-300">
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
          </div>
        </div>

        <div className="bg-white border-t px-6 py-4 flex justify-end">
          <Link
            href={
              searchParams.get("letterId")
                ? `/manajerTU/identitas-pemohon?letterId=${searchParams.get("letterId")}`
                : "/manajerTU/identitas-pemohon"
            }
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Kembali
          </Link>
        </div>
      </main>
    </div>
  );
}
