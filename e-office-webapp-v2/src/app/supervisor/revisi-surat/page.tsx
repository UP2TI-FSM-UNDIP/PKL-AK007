"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, FileText, Save } from "lucide-react";

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

const sanitizeDigits = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

const formatSemesterValue = (value?: string) => {
  if (!value) return value;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;
  return `${numeric} (${spellNumberId(numeric)})`;
};

export default function SupervisorRevisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(1);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [values, setValues] = useState<LetterValues>({});
  const [note, setNote] = useState("");
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
      setValues(data.values ?? {});
    };
    loadLetter();
  }, [searchParams]);

  useEffect(() => {
    if (!values.semester) {
      const entryYear =
        parseEntryYear(values?.tahunMasuk) ??
        parseEntryYear(values?.angkatan) ??
        parseEntryYear(letter?.createdBy?.mahasiswa?.tahunMasuk) ??
        parseEntryYear(letter?.createdBy?.mahasiswa?.angkatan);
      const computedSemester = getSemesterNumber(entryYear, new Date());
      if (computedSemester) {
        setValues((prev) => ({ ...prev, semester: String(computedSemester) }));
      }
    }
  }, [
    values.semester,
    values?.tahunMasuk,
    values?.angkatan,
    letter?.createdBy?.mahasiswa?.tahunMasuk,
    letter?.createdBy?.mahasiswa?.angkatan,
  ]);

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
      ? formatSemesterValue(values.semester)
      : computedSemester
      ? `${computedSemester} (${spellNumberId(computedSemester)})`
      : "-";
  }, [values?.angkatan, values?.nim, values?.semester, values?.tahunMasuk]);

  const handleSave = async () => {
    const letterId = searchParams.get("letterId");
    if (!letterId) {
      alert("ID surat tidak ditemukan.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          note: note || "Revisi Supervisor (dilanjutkan ke Manajer TU)",
          values,
        }),
      });
      if (!response.ok) {
        alert("Gagal menyimpan revisi supervisor.");
        return;
      }
      router.replace("/supervisor/penerima");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const letterId = searchParams.get("letterId");
    router.push(letterId ? `/supervisor/penerima/detail?letterId=${letterId}` : "/supervisor/penerima");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/supervisor/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/supervisor/penerima" className="hover:text-blue-600">
            Surat Masuk
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Revisi Supervisor</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Revisi Supervisor</h1>
            <p className="text-sm text-gray-600">Perbarui data surat sebelum diteruskan</p>
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
        <div className="lg:w-96 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Form Revisi
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={values.namaLengkap ?? values.nama ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, namaLengkap: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input
                  type="text"
                  value={values.nim ?? ""}
                  inputMode="numeric"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, nim: sanitizeDigits(e.target.value, 14) }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  value={values.programStudi ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, programStudi: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={values.tempatLahir ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, tempatLahir: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={values.tanggalLahir ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, tanggalLahir: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <input
                  type="text"
                  value={values.alamat ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, alamat: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={values.semester ?? ""}
                  inputMode="numeric"
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, semester: sanitizeDigits(e.target.value, 2) }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
                <input
                  type="text"
                  value={values.keperluan ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, keperluan: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Akademik</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={values.tahunMulai ?? ""}
                    inputMode="numeric"
                    placeholder="YYYY"
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        tahunMulai: sanitizeDigits(e.target.value, 4),
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <span className="text-slate-500">/</span>
                  <input
                    type="text"
                    value={values.tahunSelesai ?? ""}
                    inputMode="numeric"
                    placeholder="YYYY"
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        tahunSelesai: sanitizeDigits(e.target.value, 4),
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Revisi</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Catatan revisi supervisor"
                />
              </div>
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
                    nomor={values?.nomorSurat || values?.nomor || "-"}
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
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Menyimpan..." : "Simpan Revisi Supervisor"}
          </button>
        </div>
      </footer>
    </div>
  );
}
