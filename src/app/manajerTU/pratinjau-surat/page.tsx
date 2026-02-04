"use client";

import { useState } from "react";
import Link from "next/link";

export default function PratinjauSuratPage() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2)); // max 200%
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5)); // min 50%
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 flex flex-col">
        {/* ===== TOP BAR ===== */}
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

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-gray-200 flex justify-center py-10">
            {/* Preview Wrapper */}
            <div
              className="origin-top transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Preview Dokumen */}
              <div className="bg-white shadow-lg w-[700px] h-[900px] flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  Preview Surat (PDF/Image)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ACTION ===== */}
        <div className="bg-white border-t px-6 py-4 flex justify-end">
          <Link
            href="/manajerTU/identitas-pemohon"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Kembali
          </Link>
        </div>
      </main>
    </div>
  );
}
