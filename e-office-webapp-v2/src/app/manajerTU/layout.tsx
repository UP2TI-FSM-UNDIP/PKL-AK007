"use client";

import { useState } from "react";
<<<<<<< HEAD
import { ManajerNavbar } from "@/components/manajerTU/navbar";
import { ManajerSidebar } from "@/components/manajerTU/sidebar";
=======
import Link from "next/link";
import { ManajerNavbar } from "@/components/manajerTU/navbar";
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea

export default function ManajerTULayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== NAVBAR ===== */}
      <ManajerNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* ===== SIDEBAR ===== */}
      {sidebarOpen && <ManajerSidebar />}

      {/* ===== PAGE WRAPPER ===== */}
      <div
        className={`
          pt-16
          transition-all duration-300
          ${sidebarOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        {/* ===== MAIN CONTENT ===== */}
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
=======
  const [openSuratMasuk, setOpenSuratMasuk] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== NAVBAR (ATAS) ===== */}
      <ManajerNavbar />

      {/* ===== BODY ===== */}
      <div className="flex">
        {/* ===== SIDEBAR ===== */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-56px)]">
          <nav className="p-4 text-sm text-gray-700 space-y-1">
            <Link
              href="/manajerTU/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 font-medium"
            >
              ⬛ Dasbor
            </Link>

            <button
              onClick={() => setOpenSuratMasuk(!openSuratMasuk)}
              className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                ✉️ Surat Masuk
              </span>
              <span
                className={`transition-transform ${
                  openSuratMasuk ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openSuratMasuk && (
              <div className="ml-8">
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

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-6">{children}</main>
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
      </div>
    </div>
  );
}
