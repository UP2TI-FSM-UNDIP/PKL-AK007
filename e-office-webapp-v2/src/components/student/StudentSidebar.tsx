 "use client";

import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Mail,
  NotebookText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProfileData = {
  name?: string;
  email?: string;
};

type SidebarProps = {
  active: "dashboard" | "surat-saya" | "draft-surat" | "ajukan";
};

const primaryItems = [
  { key: "dashboard", label: "Dasbor", icon: LayoutGrid, href: "/mahasiswa/landing-page" },
] as const;

const persuratanItems = [
  { key: "surat-saya", label: "Surat saya", icon: NotebookText, href: "/mahasiswa/surat-saya" },
  { key: "draft-surat", label: "Draft surat", icon: NotebookText, href: "/mahasiswa/draft-surat" },
  { key: "ajukan", label: "Ajukan Surat", icon: Mail, href: "/mahasiswa/student-letter-management" },
] as const;

export function StudentSidebar({ active }: SidebarProps) {
  const [isPersuratanOpen, setIsPersuratanOpen] = useState(true);
  const router = useRouter();
  const { t } = useUiPreferences();
  const [profile, setProfile] = useState<ProfileData | null>(null);

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
    const name = profile?.name ?? "Mahasiswa";
    const parts = name.trim().split(" ");
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "MS";
  }, [profile?.name]);

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white">
      <nav className="flex-1 p-4 text-sm text-gray-700 space-y-1">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          const label = item.key === "dashboard" ? t("dasbor") : item.label;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setIsPersuratanOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <span>{t("persuratan")}</span>
          {isPersuratanOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isPersuratanOpen ? (
          <div className="ml-8 space-y-1">
            {persuratanItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              const label =
                item.key === "surat-saya"
                  ? t("suratSaya")
                  : item.key === "draft-surat"
                  ? t("draftSurat")
                  : item.key === "ajukan"
                  ? t("ajukanSurat")
                  : item.label;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    isActive ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </nav>

      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{profile?.name ?? "Mahasiswa"}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email ?? "mahasiswa@ak007.test"}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          onClick={() => {
            const confirmed = window.confirm(t("logoutConfirm"));
            if (confirmed) {
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
