"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  Save, 
  Upload, 
  Hash,
  Calendar,
  User,
  FileText,
  Download,
  RotateCcw,
  FileSignature,
  Stamp
} from "lucide-react";

export default function PenomoranSuratPage() {
  const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [stamp, setStamp] = useState<File | null>(null);
  const [number, setNumber] = useState("1024/UN7.5.8/TU/2023");
  const [date, setDate] = useState("2023-10-24");

  const handleSave = () => {
    alert("Surat berhasil dinomori dan distempel!");
    router.push("/UPA/dashboard");
  };

  const handleBack = () => {
    router.push("/UPA/identitas-pemohon");
  };

  const generateNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000);
    setNumber(`${random}/UN7.5.8/UPA/${year}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
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
            <h1 className="text-xl font-semibold text-gray-800">
              Penomoran dan Stempel Surat
            </h1>
            <p className="text-sm text-gray-600">
              Berikan nomor resmi dan stempel pada surat
            </p>
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
        {/* ===== LEFT PANEL ===== */}
        <div className="lg:w-80 space-y-6">
          {/* Form Penomoran */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Form Penomoran
            </h3>
            <div className="space-y-4">
              {/* Nomor Surat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Surat
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    placeholder="Nomor surat"
                  />
                  <button
                    onClick={generateNumber}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: [nomor]/UN7.5.8/UPA/[tahun]
                </p>
              </div>

              {/* Tanggal Surat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Surat
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Penandatangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penandatangan
                </label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option>Lilik Maryuni, S.E., M.Si (Manajer TU)</option>
                  <option>Dr. Ahmad Budiman, M.Si (Wakil Dekan)</option>
                  <option>Prof. Dr. Siti Aminah (Dekan)</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Perhatian:</span> Nomor surat yang sudah diterbitkan tidak dapat diubah. Pastikan semua data sudah benar.
                </p>
              </div>
            </div>
          </div>

          {/* Detail Surat */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detail Surat
            </h3>
            <div className="space-y-3">
              <DetailItem label="ID Surat" value="SM/2023/08/123" />
              <DetailItem label="Pengaju" value="Ahmad Douglas" />
              <DetailItem label="Jenis Surat" value="Surat Keterangan Mahasiswa" />
              <DetailItem label="Status" value="Menunggu Penomoran" />
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
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileSignature className="w-4 h-4" />
                  <span>Dokumen sudah ditandatangani</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                  <button
                    onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-sm font-medium">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 bg-gray-100 rounded-xl border shadow-sm p-8 overflow-auto">
            <div className="flex justify-center">
              <div
                className="transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* Document Preview Card */}
                <div className="bg-white shadow-lg border border-gray-200 w-[800px] min-h-[900px] rounded-lg relative p-8">
                  {/* Document Header */}
                  <div className="text-center mb-8 border-b pb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">LOGO UNDIP</span>
                      </div>
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">LOGO FSM</span>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      FAKULTAS SAINS DAN MATEMATIKA
                    </h1>
                    <h2 className="text-xl font-semibold text-blue-600 mb-1">
                      UNIVERSITAS DIPONEGORO
                    </h2>
                    <div className="mt-4">
                      <div className="inline-block px-6 py-2 bg-blue-100 rounded-lg">
                        <p className="text-lg font-bold text-blue-700">
                          {number || "NOMOR: -/UN7.5.8/UPA/2023"}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-2">Tanggal: {date || "DD/MM/YYYY"}</p>
                    </div>
                  </div>

                  {/* Document Body */}
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold underline mb-4">
                        SURAT KETERANGAN MAHASISWA
                      </h3>
                    </div>

                    <div className="space-y-4 text-justify">
                      <p>Yang bertanda tangan di bawah ini:</p>
                      
                      <div className="ml-8 space-y-2">
                        <p>Nama: <span className="font-bold">Ahmad Douglas</span></p>
                        <p>NIP: 198201012010121001</p>
                        <p>Jabatan: Manager Tata Usaha</p>
                        <p>Fakultas Sains dan Matematika UNDIP</p>
                      </div>

                      <p>Dengan ini menerangkan bahwa:</p>
                      
                      <div className="ml-8 space-y-2">
                        <p>Nama: <span className="font-bold">Ananda Putri</span></p>
                        <p>NIM: 24060131130063</p>
                        <p>Program Studi: S1 Informatika</p>
                      </div>

                      <p>Adalah benar mahasiswa aktif pada Fakultas Sains dan Matematika Universitas Diponegoro untuk Tahun Akademik 2024/2025.</p>

                      <p>Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-24">
                      <div className="flex justify-between">
                        <div>
                          {stamp && (
                            <div className="relative">
                              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Stamp className="w-16 h-16 text-gray-500" />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Stempel Resmi UPA FSM</p>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="mb-2">Semarang, {date || "DD/MM/YYYY"}</p>
                          <p className="font-bold mb-12">Manager Tata Usaha</p>
                          <div className="border-t border-black mx-auto w-48"></div>
                          <p className="mt-4 font-bold text-lg">Ahmad Douglas</p>
                          <p className="text-sm">NIP. 198201012010121001</p>
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
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Detail
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setNumber("");
                setStamp(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              Terbitkan Surat
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