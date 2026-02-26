"use client";

import Link from "next/link";
import { Bell, Menu, User, Home } from "lucide-react";
import Image from "next/image";

interface UPANavbarProps {
  onMenuClick?: () => void;
}

export function UPANavbar({ onMenuClick }: UPANavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-r from-[#0A77C8] to-[#1E90FF] px-4 md:px-6 text-white shadow-lg">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-fsm.png"
            alt="FSM UNDIP"
            width={180}
            height={50}
            className="h-10 w-auto"
            priority
          />
          <div className="hidden sm:block text-xs leading-tight">
            <p className="font-bold uppercase tracking-wide">Fakultas Sains dan Matematika</p>
            <p className="text-[10px] opacity-90">Universitas Diponegoro</p>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-4">
        {/* Quick Links */}
        <Link
          href="/UPA/dashboard"
          className="hidden md:flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Dashboard</span>
        </Link>

        {/* Notifications */}
        <button className="relative rounded-full p-2 hover:bg-white/10 transition">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">Unit Penjaminan Akademik</p>
            <p className="text-xs opacity-80">Staff UPA</p>
          </div>
          <Link 
            href="/UPA/profil-saya" 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold hover:bg-white/30 transition shadow"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}