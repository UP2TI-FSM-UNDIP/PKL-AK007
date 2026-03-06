"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { UiControls } from "@/components/common/UiControls";
import { useUiPreferences } from "@/components/common/useUiPreferences";
import { NotificationBell } from "@/components/common/NotificationBell";

export function ManajerNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useUiPreferences();

  return (
    <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-[#0A77C8] px-6 text-white shadow">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-white/10 transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/manajerTU/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo-fsm.png"
            alt="FSM UNDIP"
            width={200}
            height={60}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-5 text-sm font-medium">
        <UiControls />
        <NotificationBell />
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">{t("managerLabel")}</span>
          <Link
            href="/manajerTU/profil-saya"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold hover:bg-white/30 transition"
          >
            TU
          </Link>
        </div>
      </div>
    </header>
  );
}
