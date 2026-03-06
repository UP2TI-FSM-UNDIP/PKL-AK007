"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import { UiControls } from "@/components/common/UiControls";
import { useUiPreferences } from "@/components/common/useUiPreferences";
import { NotificationBell } from "@/components/common/NotificationBell";

interface UPANavbarProps {
  onMenuClick?: () => void;
}

export function UPANavbar({ onMenuClick }: UPANavbarProps) {
  const { t } = useUiPreferences();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-r from-[#0A77C8] to-[#1E90FF] px-4 md:px-6 text-white shadow-lg">
      {/* ===== LEFT SECTION ===== */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/10 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo & Brand */}
        <Link href="/UPA/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo-fsm.png"
            alt="FSM UNDIP"
            width={180}
            height={50}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div className="flex items-center gap-4">
        <UiControls />
        {/* Notifications */}
        <NotificationBell />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{t("upaName")}</p>
            <p className="text-xs opacity-80">{t("upaStaff")}</p>
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
