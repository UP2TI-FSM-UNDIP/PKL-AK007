"use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useUiPreferences } from "@/components/common/useUiPreferences";

type ProfileData = {
  name?: string;
  email?: string;
  mahasiswa?: { nim?: string };
  pegawai?: { nip?: string; jabatan?: string; noHp?: string };
  userRole?: { role?: { name?: string } }[];
};

const formatRoleName = (role?: string) => {
  if (!role) return "";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function UpaProfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const { t } = useUiPreferences();

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
  }, [API_BASE]);

  const displayName = profile?.name ?? "-";
  const displayEmail = profile?.email ?? "-";
  const displayRole = formatRoleName(profile?.userRole?.[0]?.role?.name) || "-";
  const displayNip = profile?.pegawai?.nip ?? profile?.mahasiswa?.nim ?? "-";
  const displayJabatan = profile?.pegawai?.jabatan ?? "-";
  const displayPhone = profile?.pegawai?.noHp ?? "-";
  const displayInitials = useMemo(() => getInitials(displayName), [displayName]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-slate-500">{t("profileTitle")}</p>
        <h1 className="text-3xl font-bold text-slate-900">{t("profileTitle")}</h1>
      </div>

      <Card className="border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#0A77C8] text-white">
              {displayInitials ? (
                <span className="text-3xl font-semibold">{displayInitials}</span>
              ) : (
                <User className="h-16 w-16" />
              )}
            </div>
          </div>

          <div className="hidden h-full w-px bg-slate-200 md:block" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">{displayName}</h2>
            <ProfileRow label={t("name")} value={displayName} />
            <ProfileRow label={t("email")} value={displayEmail} />
            <ProfileRow label={t("employeeId")} value={displayNip} />
            <ProfileRow label={t("position")} value={displayJabatan} />
            <ProfileRow label={t("phone")} value={displayPhone} />
            <div className="flex items-center gap-3 text-slate-700">
              <span className="w-24 text-sm text-slate-600">{t("role")}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {displayRole}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <span className="w-24 text-sm text-slate-600">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
}

function getInitials(name?: string) {
  if (!name || name === "-") return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
