"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Hash, FileText } from "lucide-react";

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
  signatureImage?: string;
  signedAt?: string;
};

type LetterApi = {
  id: string;
  status: string;
  createdAt: string;
  letterType?: {
    name?: string;
  } | null;
  values?: LetterValues | null;
  createdBy?: {
    name?: string | null;
    mahasiswa?: {
      tahunMasuk?: string | number | null;
      angkatan?: string | number | null;
    } | null;
  } | null;
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


export default function PenomoranSuratPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(1);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const letterId = searchParams.get("letterId");
    if (!letterId) return;
    const loadLetter = async () => {
      const response = await fetch(`${API_BASE}/letters/${letterId}?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as LetterApi;
      setLetter(data);
      setNumber(data.values?.nomorSurat ?? data.values?.nomor ?? "");
    };
    loadLetter();
  }, [searchParams]);

  const generateNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900) + 100;
    setNumber(`${random}/UN7.5.8/UPA/${year}`);
  };

  const handleSave = async () => {
    const letterId = searchParams.get("letterId");
    if (!letterId) {
      alert("ID surat tidak ditemukan.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/letters/${letterId}/actions/upa`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "NUMBER",
          nomorSurat: number || undefined,
          note: "Nomor surat diberikan oleh UPA",
        }),
      });
      if (!response.ok) {
        alert("Gagal menyimpan nomor surat. Silakan coba lagi.");
        return;
      }
      alert("Nomor surat berhasil disimpan.");
      router.push("/UPA/penerima");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const letterId = searchParams.get("letterId");
    router.push(letterId ? `/UPA/identitas-pemohon?letterId=${letterId}` : "/UPA/identitas-pemohon");
  };

  const values = letter?.values ?? null;
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

  const formatSignedDate = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const academicYear = useMemo(() => {
    const referenceDate = new Date();
    const academicYearStart = getAcademicYearStart(referenceDate);
    return values?.tahunMulai || values?.tahunSelesai
      ? { start: values?.tahunMulai ?? "-", end: values?.tahunSelesai ?? "-" }
      : { start: `${academicYearStart}`, end: `${academicYearStart + 1}` };
  }, [values?.tahunMulai, values?.tahunSelesai]);

  const semesterLabel = useMemo(() => {
    const referenceDate = new Date();
    const entryYear =
      parseEntryYear(values?.tahunMasuk) ??
      parseEntryYear(values?.angkatan) ??
      parseEntryYear(letter?.createdBy?.mahasiswa?.tahunMasuk) ??
      parseEntryYear(letter?.createdBy?.mahasiswa?.angkatan);
    const computedSemester = getSemesterNumber(entryYear, referenceDate);
    return values?.semester
      ? values.semester
      : computedSemester
      ? `${computedSemester} (${spellNumberId(computedSemester)})`
      : "-";
  }, [values?.angkatan, values?.nim, values?.semester, values?.tahunMasuk]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/UPA/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/UPA/identitas-pemohon" className="hover:text-blue-600">
            Detail Surat
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Penomoran Surat</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Penomoran Surat</h1>
            <p className="text-sm text-gray-600">Berikan nomor resmi pada surat</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Form Penomoran
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    placeholder="Nomor surat"
                  />
                  <button
                    type="button"
                    onClick={generateNumber}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Perhatian:</span> Nomor surat yang sudah diterbitkan tidak dapat diubah.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detail Surat
            </h3>
            <div className="space-y-3 text-sm">
              <DetailItem label="ID Surat" value={letter?.id ?? "-"} />
              <DetailItem label="Pengaju" value={letter?.createdBy?.name ?? "-"} />
              <DetailItem label="Jenis Surat" value={letter?.letterType?.name ?? "-"} />
              <DetailItem label="Status" value={letter?.status ?? "-"} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Pratinjau Surat</div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="w-16 text-center text-sm font-medium">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 rounded-xl border shadow-sm p-8 overflow-auto">
            <div className="flex justify-center">
              <div
                className="transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="bg-white shadow-lg border border-slate-300">
                  <StudentLetterPreview
                    nomor={number || values?.nomorSurat || values?.nomor || "-"}
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
                    signatureImage={values?.signatureImage ?? null}
                    signatureDate={formatSignedDate(values?.signedAt)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t px-6 py-4 mt-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Detail
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Terbitkan Surat"}
          </button>
        </div>
      </footer>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
