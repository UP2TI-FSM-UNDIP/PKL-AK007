"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Mail,
  Users,
  FileSignature,
  Eye,
  User,
  ChevronDown,
  ChevronRight,
  FolderInput,
} from "lucide-react";

export function ManajerSidebar() {
  const pathname = usePathname();
  const [openSuratMasuk, setOpenSuratMasuk] = useState(true);

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className="
        fixed
        left-0
        top-16
        h-[calc(100vh-4rem)]
        w-64
        bg-white
        border-r
        shadow-sm
        z-40
      "
    >
      <nav className="p-4 space-y-1 text-sm text-gray-700">
        {/* Dashboard */}
        <Link
          href="/manajerTU/dashboard"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/dashboard")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Home className="w-5 h-5" />
          Dashboard
        </Link>

        {/* Surat Masuk (Dropdown) */}
        <button
          onClick={() => setOpenSuratMasuk(!openSuratMasuk)}
          className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            Surat Masuk
          </div>
          {openSuratMasuk ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {openSuratMasuk && (
          <div className="ml-8 space-y-1">
            <Link
              href="/manajerTU/penerima"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive("/manajerTU/penerima")
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FolderInput className="w-4 h-4" />
              Penerima
            </Link>
          </div>
        )}

        {/* Other menu */}
        <Link
          href="/manajerTU/beri-ttd"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/beri-ttd")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FileSignature className="w-5 h-5" />
          Penandatanganan
        </Link>

        <Link
          href="/manajerTU/identitas-pemohon"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/identitas-pemohon")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Users className="w-5 h-5" />
          Identitas Pemohon
        </Link>

        <Link
          href="/manajerTU/pratinjau-surat"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/pratinjau-surat")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Eye className="w-5 h-5" />
          Pratinjau Surat
        </Link>

        <Link
          href="/manajerTU/profil-saya"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/profil-saya")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <User className="w-5 h-5" />
          Profil Saya
        </Link>
      </nav>
    </aside>
  );
}
