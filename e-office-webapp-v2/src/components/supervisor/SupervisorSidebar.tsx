 "use client";

import Link from "next/link";
import { Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUiPreferences } from "@/components/common/useUiPreferences";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProfileData = {
  name?: string;
  email?: string;
};

type Props = {
  active?: "dashboard" | "surat-masuk";
};

export function SupervisorSidebar({ active = "dashboard" }: Props) {
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
    const name = profile?.name ?? "Supervisor";
    const parts = name.trim().split(" ");
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "SA";
  }, [profile?.name]);
  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white">
      <nav className="flex-1 space-y-1 px-4 py-4 text-sm text-gray-700">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label={t("dasbor")}
          href="/supervisor/dashboard"
          active={active === "dashboard"}
        />
        <SidebarItem
          icon={<Inbox className="h-5 w-5" />}
          label={t("suratMasuk")}
          href="/supervisor/penerima"
          active={active === "surat-masuk"}
        />
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{profile?.name ?? "Supervisor Akademik"}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.email ?? "supervisor.akademik@ak007.test"}</p>
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

function SidebarItem({
  icon,
  label,
  href,
  active,
  nested,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        nested ? "ml-3" : ""
      } ${active ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
