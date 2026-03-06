"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import Sidebar from "@/components/superadmin/Sidebar";
import { UiControls } from "@/components/common/UiControls";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string } | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const noSidebarPages = ["/login", "/register", "/forgot-password"];
  const showSidebar = !noSidebarPages.includes(pathname || "");
  const displayName = profile?.name ?? "Superadmin";
  const displayEmail = profile?.email ?? "admin@fsm.undip.ac.id";
  const initials = useMemo(() => {
    const parts = displayName.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "S";
    const second = parts[1]?.[0] ?? "A";
    return `${first}${second}`.toUpperCase();
  }, [displayName]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, { credentials: "include" });
        if (!response.ok) return;
        const data = (await response.json()) as { name?: string; email?: string };
        setProfile(data);
      } catch (error) {
        console.warn("Failed to load profile", error);
      }
    };
    loadProfile();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar ? (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-r from-[#0A77C8] to-[#1E90FF] px-4 md:px-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="rounded-lg p-2 hover:bg-white/10 transition"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/superadmin/dashboard" className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-xs text-white/90 md:block">
                <div className="font-semibold">{displayName}</div>
                <div className="text-[11px] text-white/70">{displayEmail}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
                {initials}
              </div>
              <UiControls />
            </div>
          </header>

          <div className="flex pt-16">
            {sidebarOpen ? (
              <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 bg-white border-r shadow-sm">
                <Sidebar />
              </div>
            ) : null}

            <main
              className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
                sidebarOpen ? "ml-0 md:ml-64" : "ml-0"
              }`}
            >
              <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </>
      ) : (
        <main className="min-h-screen">{children}</main>
      )}
    </div>
  );
}
