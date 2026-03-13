"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  FileText,
  Upload,
  RotateCcw,
  Save,
} from "lucide-react";

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
  sumber?: string;
};

type LetterApi = {
  id: string;
  status: string;
  createdAt: string;
  letterType?: {
    name: string;
  } | null;
  createdBy?: {
    name?: string | null;
    mahasiswa?: {
      tahunMasuk?: string | number | null;
      angkatan?: string | number | null;
    } | null;
  } | null;
  values?: LetterValues | null;
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


export default function PenandatangananSuratPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zoom, setZoom] = useState(1);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureMode, setSignatureMode] = useState<"scratch" | "upload">("scratch");
  const [savedScratch, setSavedScratch] = useState<string | null>(null);
  const [savedUpload, setSavedUpload] = useState<string | null>(null);
  const [signatureDate, setSignatureDate] = useState<string | null>(null);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasStrokeRef = useRef(false);

  const handleSaveAndNext = async () => {
    const letterId = searchParams?.get("letterId");
    if (!letterId) {
      alert("ID surat tidak ditemukan.");
      return;
    }
    if (!signature) {
      alert("Silakan simpan tanda tangan terlebih dahulu.");
      return;
    }
    const response = await fetch(`${API_BASE}/letters/${letterId}/actions/manager`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "APPROVE",
        signatureImage: signature,
        signedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      alert("Gagal menyimpan tanda tangan. Silakan coba lagi.");
      return;
    }
    alert("Surat berhasil ditandatangani!");
    router.push("/manajerTU/penerima");
  };

  useEffect(() => {
    const savedScratchSignature = localStorage.getItem("managerSignatureScratch");
    const savedUploadSignature = localStorage.getItem("managerSignatureUpload");
    const savedMode = localStorage.getItem("managerSignatureMode");
    const initialMode = savedMode === "upload" ? "upload" : "scratch";
    if (savedScratchSignature) {
      setSavedScratch(savedScratchSignature);
    }
    if (savedUploadSignature) {
      setSavedUpload(savedUploadSignature);
    }
    setSignatureMode(initialMode);
    if (initialMode === "scratch" && savedScratchSignature) {
      applySignature(savedScratchSignature);
    }
    if (initialMode === "upload" && savedUploadSignature) {
      applySignature(savedUploadSignature);
    }
  }, []);

  useEffect(() => {
    const letterId = searchParams?.get("letterId");
    if (!letterId) return;
    const loadLetter = async () => {
      const response = await fetch(`${API_BASE}/letters/${letterId}?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as LetterApi;
      setLetter(data);
    };
    loadLetter();
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("managerSignatureMode", signatureMode);
  }, [signatureMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = (window.devicePixelRatio || 1) * 2;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.lineWidth = 2 * ratio;
      context.lineCap = "round";
      context.lineJoin = "round";
      const isDark = document.documentElement.classList.contains("dark");
      context.strokeStyle = isDark ? "#ffffff" : "#0f172a";
      context.imageSmoothingEnabled = true;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

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
  const getTodayLabel = () => formatTanggal(new Date().toISOString());

  const applySignature = (value: string | null) => {
    setSignature(value);
    setSignatureDate(value ? getTodayLabel() : null);
  };

  const normalizeSignature = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (!context) return null;
    const { width, height } = canvas;
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    let found = false;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const idx = (y * width + x) * 4 + 3;
        if (data[idx] > 0) {
          found = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!found) return null;
    const padding = 6;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width - 1, maxX + padding);
    maxY = Math.min(height - 1, maxY + padding);
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = width;
    targetCanvas.height = height;
    const targetCtx = targetCanvas.getContext("2d");
    if (!targetCtx) return null;
    targetCtx.clearRect(0, 0, width, height);
    const drawWidth = cropWidth;
    const drawHeight = cropHeight;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;
    targetCtx.drawImage(
      canvas,
      minX,
      minY,
      cropWidth,
      cropHeight,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
    const recolor = targetCtx.getImageData(0, 0, width, height);
    const recolorData = recolor.data;
    for (let i = 0; i < recolorData.length; i += 4) {
      if (recolorData[i + 3] > 0) {
        recolorData[i] = 0;
        recolorData[i + 1] = 0;
        recolorData[i + 2] = 0;
      }
    }
    targetCtx.putImageData(recolor, 0, 0);
    return targetCanvas.toDataURL("image/png");
  };

  const values = letter?.values ?? null;
  const referenceDate = new Date();
  const academicYearStart = getAcademicYearStart(referenceDate);
  const academicYear = values?.tahunMulai || values?.tahunSelesai
    ? { start: values?.tahunMulai ?? "-", end: values?.tahunSelesai ?? "-" }
    : { start: `${academicYearStart}`, end: `${academicYearStart + 1}` };
  const entryYear =
    parseEntryYear(values?.tahunMasuk) ??
    parseEntryYear(values?.angkatan) ??
    parseEntryYear(letter?.createdBy?.mahasiswa?.tahunMasuk) ??
    parseEntryYear(letter?.createdBy?.mahasiswa?.angkatan);
  const computedSemester = getSemesterNumber(entryYear, referenceDate);
  const semesterLabel = values?.semester
    ? formatSemesterValue(values.semester)
    : computedSemester
    ? `${computedSemester} (${spellNumberId(computedSemester)})`
    : "-";

  const statusLabel = useMemo(() => {
    const status = letter?.status ?? "";
    if (!status) return "-";
    if (status === "PENDING") return "Menunggu TTD";
    if (status === "IN_PROGRESS") return "Perlu Revisi";
    if (status === "COMPLETED") return "Selesai";
    if (status === "REJECTED" || status === "MANAGER_REJECTED") return "Ditolak";
    return status;
  }, [letter?.status]);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getCanvasPoint(event);
    if (!canvas || !context || !point) return;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
    hasStrokeRef.current = false;
    setIsDrawing(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getCanvasPoint(event);
    if (!canvas || !context || !point) return;
    context.lineTo(point.x, point.y);
    context.stroke();
    hasStrokeRef.current = true;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(event.pointerId);
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = normalizeSignature(canvas) ?? canvas.toDataURL("image/png");
    localStorage.setItem("managerSignatureScratch", dataUrl);
    setSavedScratch(dataUrl);
    applySignature(dataUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (result) {
        setSignatureMode("upload");
        setSavedUpload(result);
        localStorage.setItem("managerSignatureUpload", result);
        applySignature(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleModeChange = (mode: "scratch" | "upload") => {
    setSignatureMode(mode);
    if (mode === "scratch") {
      applySignature(savedScratch ?? null);
      return;
    }
    applySignature(savedUpload ?? null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/manajerTU/penerima" className="hover:text-blue-600">
            Surat Masuk
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Penandatanganan</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Penandatanganan Surat
            </h1>
            <p className="text-sm text-gray-600">
              Tandatangani surat sebelum diterbitkan
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={searchParams?.get("letterId")
                ? `/manajerTU/identitas-pemohon?letterId=${searchParams?.get("letterId")}`
                : "/manajerTU/identitas-pemohon"}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* ===== LEFT PANEL ===== */}
        <div className="lg:w-80 space-y-6">
          {/* Detail Surat */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Detail Surat
            </h3>
            <div className="space-y-3">
              <DetailItem label="No. Surat" value={values?.nomorSurat ?? values?.nomor ?? "-"} />
              <DetailItem label="Pengaju" value={letter?.createdBy?.name ?? "-"} />
              <DetailItem label="Perihal" value={letter?.letterType?.name ?? "-"} />
              <DetailItem label="Tanggal" value={formatTanggal(letter?.createdAt)} />
              <DetailItem label="Status" value={statusLabel} />
            </div>
          </div>

          {/* Signature Panel */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Tanda Tangan Digital</h3>
            <div className="mb-4 flex gap-2 text-sm">
              <button
                type="button"
                onClick={() => handleModeChange("scratch")}
                className={`flex-1 rounded-lg border px-3 py-2 font-semibold ${
                  signatureMode === "scratch"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Scratchpad
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("upload")}
                className={`flex-1 rounded-lg border px-3 py-2 font-semibold ${
                  signatureMode === "upload"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Upload
              </button>
            </div>
            {signature ? (
              <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2">
                  <img
                    src={signature}
                    alt="Tanda Tangan"
                    className="h-16 mx-auto dark:invert"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300">Tanda tangan siap digunakan</p>
              </div>
            ) : null}
            {signatureMode === "scratch" ? (
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">Buat tanda tangan</div>
                <canvas
                  ref={canvasRef}
                  className="h-56 w-full rounded-md border border-slate-200 bg-white"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveSignature}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Simpan Tanda Tangan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const dataUrl = normalizeSignature(canvas) ?? canvas.toDataURL("image/png");
                      applySignature(dataUrl);
                    }}
                    className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  >
                    Pakai Tanda Tangan
                  </button>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Bersihkan
                  </button>
                </div>
                {savedScratch ? (
                  <button
                    type="button"
                    onClick={() => applySignature(savedScratch)}
                    className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                  >
                    Pakai Tanda Tangan Tersimpan
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  {savedUpload ? "Ganti Upload" : "Upload Tanda Tangan"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {savedUpload ? (
                  <button
                    type="button"
                    onClick={() => applySignature(savedUpload)}
                    className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                  >
                    Pakai Tanda Tangan Tersimpan
                  </button>
                ) : null}
              </div>
            )}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => applySignature(null)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Hapus Tanda Tangan
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link
                href="/manajerTU/pratinjau-surat"
                className="block text-center border border-gray-300 text-gray-700 py-3 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Lihat Pratinjau
              </Link>
              <Link
                href={searchParams?.get("letterId")
                  ? `/manajerTU/identitas-pemohon?letterId=${searchParams?.get("letterId")}`
                  : "/manajerTU/identitas-pemohon"}
                className="block text-center border border-gray-300 text-gray-700 py-3 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Kembali ke Detail
              </Link>
            </div>
          </div>
        </div>

        {/* ===== MAIN PREVIEW ===== */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Pratinjau Surat</span>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                  Halaman 1 dari 1
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="w-16 text-center text-sm font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 bg-white rounded-xl border shadow-sm p-8 overflow-auto">
            <div className="flex justify-center">
              <div
                className="transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="border border-slate-300 bg-white shadow-sm">
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
                    signatureImage={signature}
                    signatureDate={signatureDate ?? undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ACTIONS ===== */}
      <footer className="bg-white border-t px-6 py-4 mt-6">
        <div className="flex justify-between items-center">
          <Link
            href="/manajerTU/identitas-pemohon"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Detail
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => applySignature(null)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => {
                handleSaveAndNext();
              }}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              Simpan & Tandatangani
            </button>
          </div>
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
