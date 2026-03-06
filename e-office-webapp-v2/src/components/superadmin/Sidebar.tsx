"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Layout,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProfileData = {
  name?: string;
  email?: string;
  userRole?: { role?: { name?: string } }[];
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
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
    const name = profile?.name ?? "Superadmin";
    const parts = name.trim().split(" ");
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "SA";
  }, [profile?.name]);

  const displayEmail = profile?.email ?? "admin@fsm.undip.ac.id";

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <button
              onClick={() => router.push("/superadmin/dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive("/superadmin/dashboard")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t("dashboard")} Superadmin</span>
            </button>
          </li>

          <li className="pt-3 mt-2 border-t border-gray-100"></li>

          <li>
            <button
              onClick={() => router.push("/superadmin/manajemen-user")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive("/superadmin/manajemen-user")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t("manajemenUser")}</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => router.push("/superadmin/monitoring-surat")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive("/superadmin/monitoring-surat")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t("monitoringSurat")}</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => router.push("/superadmin/template-surat")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive("/superadmin/template-surat")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>{t("templateSurat")}</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => router.push("/superadmin/pengaturan-sistem")}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive("/superadmin/pengaturan-sistem")
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t("pengaturanSistem")}</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">Superadmin</p>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={() => {
            const confirmed = window.confirm(t("logoutConfirm"));
            if (confirmed) {
              router.push("/");
            }
          }}
          className="w-full mt-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
