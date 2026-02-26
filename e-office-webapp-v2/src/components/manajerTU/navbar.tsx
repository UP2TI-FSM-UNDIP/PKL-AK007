"use client";

<<<<<<< HEAD
import { Menu, Bell, User } from "lucide-react";

export function ManajerNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        w-full
        h-16
        bg-blue-600
        text-white
        flex
        items-center
        justify-between
        px-4
        z-50
      "
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold">
          Fakultas Sains dan Matematika
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5" />
        <User className="w-5 h-5" />
=======
import Link from "next/link";
import { Bell } from "lucide-react";
import Image from "next/image";

export function ManajerNavbar() {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-[#0A77C8] px-6 text-white shadow">
      {/* ===== LEFT ===== */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo-fsm.png"
          alt="FSM UNDIP"
          width={200}
          height={60}
          className="h-8 w-auto"
          priority
        />
        <div className="hidden sm:block text-xs leading-tight">
          <p className="font-semibold uppercase">Fakultas Sains dan Matematika</p>
          <p className="text-[10px] opacity-90">
            Universitas Diponegoro
          </p>
        </div>
      </div>

      {/* ===== RIGHT ===== */}
      <div className="flex items-center gap-5 text-sm font-medium">
        {/* Notifikasi */}
        <button className="rounded-full p-2 hover:bg-white/10 transition">
          <Bell className="h-5 w-5" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">Manager TU</span>
          <Link href="/manajerTU/profil-saya" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold hover:bg-white/30 transition">
            TU
        </Link>
        </div>
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
      </div>
    </header>
  );
}
