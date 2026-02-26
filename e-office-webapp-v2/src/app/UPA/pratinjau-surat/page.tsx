"use client";

import { useState } from "react";
import Link from "next/link";
import { ZoomIn, ZoomOut, ChevronLeft, Download, Printer, Hash, Eye, FileText } from "lucide-react";

export default function PratinjauSuratPage() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/upa/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/upa/identitas-pemohon" className="hover:text-blue-600">
            Detail Surat
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Pratinjau Surat</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Pratinjau Surat UPA
            </h1>
            <p className="text-sm text-gray-600">
              Surat Keterangan Mahasiswa - Siap untuk penomoran
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/upa/penomoran"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Hash className="w-4 h-4" />
              Lakukan Penomoran
            </Link>
          </div>
        </div>
      </header>

      {/* ===== TOOLBAR ===== */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/upa/identitas-pemohon"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Detail Surat
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
              <button
                onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-16 text-center text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DOCUMENT VIEWER ===== */}
      <div className="p-4 md:p-8">
        <div className="bg-gray-100 rounded-xl p-4 md:p-8">
          <div className="flex justify-center">
            <div
              className="transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Document Preview */}
              <div className="bg-white shadow-lg border border-gray-200 w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                      SURAT KETERANGAN MAHASISWA
                    </h1>
                    <div className="inline-block px-8 py-3 bg-blue-100 rounded-lg">
                      <p className="text-xl font-bold text-blue-700">
                        Nomor: 1024/UN7.5.8/UPA/2023
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 text-justify">
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
                      <p>Fakultas: Sains dan Matematika</p>
                      <p>Semester: 5 (Lima)</p>
                      <p>Status: Mahasiswa Aktif</p>
                    </div>

                    <p>Adalah benar mahasiswa aktif pada Fakultas Sains dan Matematika Universitas Diponegoro untuk Tahun Akademik 2024/2025.</p>

                    <p>Surat keterangan ini diberikan untuk keperluan administrasi dan dapat dipergunakan sebagaimana mestinya.</p>
                  </div>

                  {/* Signature Area */}
                  <div className="mt-24">
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="mb-4">
                          <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileText className="w-16 h-16 text-gray-500" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Stempel Resmi</p>
                        <p className="text-sm text-gray-600">Unit Penjaminan Akademik</p>
                      </div>
                      <div className="text-center">
                        <p className="mb-2">Semarang, 27 Oktober 2024</p>
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

      {/* ===== FOOTER ===== */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/upa/dashboard"
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Kembali ke Dashboard
          </Link>
          <div className="flex gap-3">
            <Link
              href="/upa/identitas-pemohon"
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Lihat Detail Surat
            </Link>
            <Link
              href="/upa/penomoran"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Lanjutkan Penomoran
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}