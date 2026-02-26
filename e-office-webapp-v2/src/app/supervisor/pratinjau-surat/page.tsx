"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { StudentLetterPreview } from "@/components/letter/StudentLetterPreview";
import { applicant } from "@/data/applicant";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterValues = {
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
};

export default function SupervisorPreviewSurat() {
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(100);
  const [values, setValues] = useState<LetterValues | null>(null);
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
    if (!value) return "17 Agustus 2000";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        userLabel="Supervisor Akademik"
        initials="SA"
        userName="Ahmad Douglas"
        email="ahmaddouglas12345@gmail.com"
        idLabel="NIP"
        idValue="198012102005011001"
        prodi="Informatika"
      />
      <div className="flex flex-1">
        <SupervisorSidebar active="penerima" />
        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-4 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Form Pengajuan Surat / Pratinjau Surat</p>
              <h1 className="text-2xl font-bold text-slate-900">Pratinjau Surat</h1>
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
              <span className="text-xs text-slate-500">Halaman 1 dari 1</span>
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
                nomor="........../UN7.F8.4/AK/...../20..."
                applicant={{
                  name: values?.namaLengkap ?? applicant.fullName,
                  nim: values?.nim ?? applicant.nim ?? "240000000000",
                  program: values?.programStudi ?? `${applicant.studyProgram}`,
                  birthPlace: values?.tempatLahir ?? applicant.birthPlace ?? "Semarang",
                  birthDate: formatTanggal(values?.tanggalLahir),
                  address: values?.alamat ?? applicant.address ?? "Semarang, Jawa Tengah",
                  semester: values?.semester ?? "4 (Empat)",
                }}
                academicYear={{ start: values?.tahunMulai ?? "2024", end: values?.tahunSelesai ?? "2025" }}
                keperluan={values?.keperluan ?? "Sebagai syarat administrasi untuk pencairan tunjangan orang tua."}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link href={searchParams.get("letterId") ? `/supervisor/penerima/detail?letterId=${searchParams.get("letterId")}` : "/supervisor/penerima/detail"}>
                Kembali
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
