"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StudentLetterPreview } from "@/components/letter/StudentLetterPreview";
import { applicant } from "@/data/applicant";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type DraftData = {
  namaLengkap?: string;
  nama?: string;
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
  signatureImage?: string | null;
  signedAt?: string;
};

export default function MahasiswaPreviewPage() {
  const searchParams = useSearchParams();
  const isDownload = searchParams.get("download") === "1";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [letterValues, setLetterValues] = useState<DraftData | null>(null);
  const [letterMeta, setLetterMeta] = useState<{ createdAt?: string; letterType?: { name?: string } } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const downloadTriggeredRef = useRef(false);
  const clampZoom = (value: number) => Math.min(150, Math.max(50, value));
  const handleZoom = (delta: number) => setZoom((z) => clampZoom(z + delta));

  useEffect(() => {
    const draftId = searchParams?.get("draftId");
    const letterId = searchParams?.get("letterId");
    if (!draftId) {
      if (!letterId) {
        return;
      }
    }

    const loadDraft = async () => {
      if (draftId) {
        const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setIsLoaded(true);
          return;
        }
        const data = (await response.json()) as { data: DraftData };
        setDraft(data.data);
        setIsLoaded(true);
      }
      if (letterId) {
        const response = await fetch(`${API_BASE}/letters/${letterId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setIsLoaded(true);
          return;
        }
        const data = (await response.json()) as { values?: DraftData; createdAt?: string; letterType?: { name?: string } };
        setLetterValues(data.values ?? null);
        setLetterMeta({ createdAt: data.createdAt, letterType: data.letterType });
        setIsLoaded(true);
      }
    };

    loadDraft();
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

  const source = letterValues ?? draft;
  const getValue = (primary?: string, fallback?: string) => {
    if (primary && primary.trim()) return primary;
    if (fallback && fallback.trim()) return fallback;
    return undefined;
  };
  const letterCode = letterMeta?.letterType?.name ?? "AK007";
  const fileDate = letterMeta?.createdAt
    ? new Date(letterMeta.createdAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const fileName = `${letterCode} - ${source?.keperluan ?? "Surat"} - ${fileDate}`;
  const signatureDate = source?.signedAt ? formatTanggal(source.signedAt) : undefined;

  useEffect(() => {
    if (!isDownload || downloadTriggeredRef.current) {
      return;
    }
    if (!isLoaded || (!letterValues && !draft)) {
      return;
    }
    const previousTitle = document.title;
    document.title = fileName;
    const timer = setTimeout(() => {
      downloadTriggeredRef.current = true;
      window.print();
      document.title = previousTitle;
    }, 500);
    const closeAfterPrint = () => {
      if (window.opener) {
        window.close();
      }
    };
    window.addEventListener("afterprint", closeAfterPrint);
    return () => clearTimeout(timer);
  }, [downloadTriggeredRef, draft, fileName, isDownload, isLoaded, letterValues, searchParams]);
  const applicantData = {
    name: getValue(source?.namaLengkap, source?.nama) ?? applicant.fullName,
    nim: source?.nim ?? applicant.nim ?? "240000000000",
    program: source?.programStudi ?? `${applicant.studyProgram}`,
    birthPlace: source?.tempatLahir ?? applicant.birthPlace ?? "Semarang",
    birthDate: formatTanggal(source?.tanggalLahir),
    address: source?.alamat ?? applicant.address ?? "Semarang, Jawa Tengah",
    semester: source?.semester ?? "4 (Empat)",
  };

  if (isDownload) {
    return (
      <div className="min-h-screen bg-white">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              margin: 0;
              background: #ffffff;
            }
            .print-wrapper {
              padding: 0 !important;
              margin: 0 auto !important;
              background: #ffffff !important;
              border: none !important;
              box-shadow: none !important;
            }
            .print-letter {
              transform: none !important;
              zoom: 1 !important;
            }
          }
        `}</style>
        <div className="flex justify-center py-4 print-wrapper">
          <div className="print-letter">
            <StudentLetterPreview
              nomor={source?.nomorSurat ?? ".../UN7.F8.4/AK/2025/..."}
              applicant={applicantData}
              academicYear={{ start: source?.tahunMulai ?? "2024", end: source?.tahunSelesai ?? "2025" }}
              keperluan={source?.keperluan ?? ""}
              signatureDate={signatureDate}
              signatureImage={source?.signatureImage ?? null}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            margin: 0;
            background: #ffffff;
          }
          .app-header,
          aside,
          .print-hide {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .print-wrapper {
            padding: 0 !important;
            margin: 0 auto !important;
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-letter {
            transform: none !important;
            zoom: 1 !important;
          }
        }
      `}</style>
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="surat-saya" /> : null}
        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-4 px-6 py-6">
          <div className="flex items-center justify-between print-hide">
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

          <div className="flex justify-center overflow-auto rounded-lg border border-slate-200 bg-white p-4 print-wrapper">
            <div
              className="origin-top transform transition-transform print-letter"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                zoom: zoom / 100,
              }}
            >
              <StudentLetterPreview
                nomor={source?.nomorSurat ?? ".../UN7.F8.4/AK/2025/..."}
                applicant={applicantData}
                academicYear={{ start: source?.tahunMulai ?? "2024", end: source?.tahunSelesai ?? "2025" }}
                keperluan={source?.keperluan ?? ""}
                signatureDate={signatureDate}
                signatureImage={source?.signatureImage ?? null}
              />
            </div>
          </div>

          <div className="flex justify-end print-hide">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link href="/mahasiswa/draft-surat">Kembali</Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
