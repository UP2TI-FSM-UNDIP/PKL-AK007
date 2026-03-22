"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Mail,
  User,
  ChevronDown,
  ChevronRight,
  FolderInput,
  Layers,
  LogOut,
} from "lucide-react";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProfileData = {
  name?: string;
  email?: string;
};

export function ManajerSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSuratMasuk, setOpenSuratMasuk] = useState(true);
  const router = useRouter();
  const { t } = useUiPreferences();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const isActive = (path: string) => pathname === path;
  const isAllSurat = searchParams.get("scope") === "all";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = (await response.json()) as ProfileData;
        setProfile(data);
      } catch (error) {
        console.warn("Failed to load profile", error);
      }
    };
    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const name = profile?.name ?? "Manajer TU";
    const parts = name.trim().split(" ");
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "TU";
  }, [profile?.name]);

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
        flex
        flex-col
      "
    >
      <nav className="flex-1 p-4 space-y-1 text-sm text-gray-700">
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
          {t("dashboard")}
        </Link>

        {/* Surat Masuk (Dropdown) */}
        <button
          onClick={() => setOpenSuratMasuk(!openSuratMasuk)}
          className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            {t("suratMasuk")}
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
                isActive("/manajerTU/penerima") && !isAllSurat
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FolderInput className="w-4 h-4" />
              {t("penerimaTitle")}
            </Link>
            <Link
              href="/manajerTU/penerima?scope=all"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive("/manajerTU/penerima") && isAllSurat
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              {t("semuaSurat")}
            </Link>
          </div>
        )}

        <Link
          href="/manajerTU/profil-saya"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
            isActive("/manajerTU/profil-saya")
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <User className="w-5 h-5" />
          {t("profileTitle")}
        </Link>
      </nav>

      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{profile?.name ?? "Manajer TU"}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email ?? "manajer.tu@ak007.test"}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={async () => {
            const confirmed = window.confirm(t("logoutConfirm"));
            if (confirmed) {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/sign-out`, { method: "POST" });
              router.push("/");
            }
          }}
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
