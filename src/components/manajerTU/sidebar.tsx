"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [openSuratMasuk, setOpenSuratMasuk] = useState(true);

  return (
    <aside className="w-64 min-h-screen bg-white border-r">
      <nav className="p-4 text-sm text-gray-700">
        {/* Dashboard */}
        <Link
          href="/manajerTU/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        >
          <span>⬛</span>
          <span>Dasbor</span>
        </Link>

        {/* Surat Masuk (Dropdown) */}
        <button
          onClick={() => setOpenSuratMasuk(!openSuratMasuk)}
          className="w-full flex items-center justify-between px-3 py-2 mt-2 rounded hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span>Surat Masuk</span>
          </div>
          <span
            className={`transition-transform ${
              openSuratMasuk ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Dropdown Item */}
        {openSuratMasuk && (
          <div className="ml-8 mt-1">
            <Link
              href="/manajerTU/penerima"
              className="block px-3 py-2 rounded text-gray-600 hover:bg-gray-100"
            >
              Penerima
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
