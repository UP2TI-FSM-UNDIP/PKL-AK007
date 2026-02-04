"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  Save, 
  RotateCcw,
  User,
  Calendar,
  FileText,
  Upload
} from "lucide-react";

export default function PenandatangananSuratPage() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [signature, setSignature] = useState<string | null>("/signature-sample.png");

  const handleSaveAndNext = () => {
    alert("Surat berhasil ditandatangani!");
    router.push("/manajerTU/dashboard");
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
              href="/manajerTU/identitas-pemohon"
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
              <DetailItem label="No. Surat" value="SM/2023/08/123" />
              <DetailItem label="Pengaju" value="Ananda Putri" />
              <DetailItem label="Perihal" value="Surat Keterangan Mahasiswa" />
              <DetailItem label="Tanggal" value="27 Oktober 2024" />
              <DetailItem label="Status" value="Menunggu TTD" />
            </div>
          </div>

          {/* Signature Panel */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Tanda Tangan Digital</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 mb-4">
              {signature ? (
                <div className="text-center">
                  <div className="mb-4">
                    <img
                      src={signature}
                      alt="Tanda Tangan"
                      className="h-16 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Tanda tangan siap digunakan</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                      Belum ada tanda tangan
                  </p>
                  <p className="text-xs text-gray-500">
                      Upload tanda tangan digital
                  </p>
                </div>

              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setSignature(signature ? null : "/signature-new.png")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                {signature ? "Ubah Tanda Tangan" : "Upload Tanda Tangan"}
              </button>
              <button
                onClick={() => setSignature(null)}
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
                href="/manajerTU/identitas-pemohon"
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
                <div className="bg-gray-100 border-2 border-gray-300 w-[800px] h-[900px] rounded-lg flex flex-col">
                  {/* Document Header */}
                  <div className="p-8 border-b">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">SURAT KETERANGAN MAHASISWA</h2>
                      <p className="text-lg">Nomor: SM/2023/08/123</p>
                    </div>
                  </div>

                  {/* Document Content */}
                  <div className="flex-1 p-8">
                    <div className="space-y-6">
                      <p>Yang bertanda tangan di bawah ini:</p>
                      
                      {/* Signer Info */}
                      <div className="ml-8 space-y-2">
                        <p>Nama: <span className="font-bold">Ahmad Douglas</span></p>
                        <p>NIP: 198012102005011001</p>
                        <p>Jabatan: Manager Tata Usaha</p>
                        <p>Fakultas Sains dan Matematika UNDIP</p>
                      </div>

                      <p>Menerangkan bahwa:</p>
                      
                      {/* Student Info */}
                      <div className="ml-8 space-y-2">
                        <p>Nama: <span className="font-bold">Ananda Putri</span></p>
                        <p>NIM: 24060131130063</p>
                        <p>Program Studi: S1 Informatika</p>
                      </div>

                      <p>Adalah benar mahasiswa aktif Fakultas Sains dan Matematika UNDIP.</p>

                      {/* Signature Area */}
                      <div className="mt-16">
                        <div className="text-center">
                          <div className="inline-block p-4">
                            <div className="mb-4">
                              <img
                                src={signature || "/signature-placeholder.png"}
                                alt="Tanda Tangan"
                                className="h-20 mx-auto"
                              />
                            </div>
                            <div className="border-t border-black w-48 mx-auto"></div>
                            <p className="mt-2 font-bold">Ahmad Douglas</p>
                            <p className="text-sm">Manager Tata Usaha</p>
                            <p className="text-sm">Fakultas Sains dan Matematika</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
              onClick={() => setSignature(null)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSaveAndNext}
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