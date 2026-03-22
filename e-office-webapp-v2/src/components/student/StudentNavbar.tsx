import { Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UiControls } from "@/components/common/UiControls";
import { useUiPreferences } from "@/components/common/useUiPreferences";
import { OnboardingModal } from "@/components/OnboardingModal";

type StudentNavbarProps = {
  userLabel?: string;
  initials?: string;
  userName?: string;
  email?: string;
  idLabel?: string;
  idValue?: string;
  prodi?: string;
  profileHref?: string;
  dashboardHref?: string;
  onMenuClick?: () => void;
};

type ProfileData = {
  name?: string;
  email?: string;
  mahasiswa?: {
    nim?: string;
    programStudi?: { name?: string };
  };
  pegawai?: {
    nip?: string;
    programStudi?: { name?: string };
  };
  userRole?: { role?: { name?: string } }[];
};

const incomingStatusByRole: Record<string, string[]> = {
  supervisor_akademik: ["PENDING"],
  manager_tu: ["COMPLETED"],
  upa: ["UPA_REVIEW"],
};

const formatRoleName = (role?: string) => {
  if (!role) return "";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const roleLabels: Record<string, { id: string; en: string }> = {
  mahasiswa: { id: "Mahasiswa", en: "Student" },
  supervisor_akademik: { id: "Supervisor Akademik", en: "Academic Supervisor" },
  manager_tu: { id: "Manajer TU", en: "TU Manager" },
  upa: { id: "UPA", en: "UPA" },
  superadmin: { id: "Superadmin", en: "Superadmin" },
};

const getRoleLabel = (role?: string, lang?: string, fallback?: string) => {
  if (!role) return fallback ?? "";
  const mapped = roleLabels[role];
  if (mapped) {
    return lang === "en" ? mapped.en : mapped.id;
  }
  return formatRoleName(role);
};

const translateIdLabel = (label: string, lang: string) => {
  if (lang !== "en") return label;
  if (label.toUpperCase() === "NIM") return "Student ID";
  if (label.toUpperCase() === "NIP") return "Employee ID";
  return label;
};

type LetterApi = {
  id: string;
  status: string;
  createdAt: string;
  letterType?: { name?: string } | null;
};

export function StudentNavbar({
  userLabel = "Mahasiswa",
  initials = "MS",
  userName = "Ahmad Douglas",
  email = "mahasiswa@ak007.test",
  idLabel = "NIM",
  idValue = "24060121130063",
  prodi = "Informatika",
  dashboardHref = "/mahasiswa/surat-saya",
  onMenuClick,
}: StudentNavbarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false);
  const [notifItems, setNotifItems] = useState<NotifItem[]>([]);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const router = useRouter();
  const { lang, t } = useUiPreferences();
  const displayName = profile?.name ?? userName;
  const displayEmail = profile?.email ?? email;
  const roleName = profile?.userRole?.[0]?.role?.name ?? "";
  const displayLabel = getRoleLabel(roleName, lang, userLabel);
  const mahasiswa = profile?.mahasiswa;
  const pegawai = profile?.pegawai;
  const defaultIdLabel = pegawai?.nip ? "NIP" : idLabel;
  const displayIdValue = mahasiswa?.nim ?? pegawai?.nip ?? idValue;
  const displayProdi = mahasiswa?.programStudi?.name ?? pegawai?.programStudi?.name ?? prodi;
  const displayInitials = getInitials(displayName) ?? initials;
  const displayIdLabel = translateIdLabel(defaultIdLabel, lang);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
  const needsOnboarding = roleName === "mahasiswa" && profile?.mahasiswa && profile.mahasiswa.nim === "";

  useEffect(() => {
    const stored = localStorage.getItem("studentNotifDismissed");
    if (!stored) return;
    try {
      const ids = JSON.parse(stored) as string[];
      if (Array.isArray(ids)) {
        setNotifItems((prev) => prev.filter((item) => !ids.includes(item.id)));
      }
    } catch (error) {
      console.warn("Failed to parse dismissed notifications", error);
    }
  }, []);

  useEffect(() => {
    if (!showNotifications) return;

    const loadNotifications = async () => {
      setIsLoadingNotif(true);
      setNotifError(null);
      try {
        const incomingStatuses = incomingStatusByRole[roleName];
        if (incomingStatuses) {
          const response = await fetch(`${API_BASE}/letters?scope=all`, {
            credentials: "include",
          });
          if (!response.ok) {
            setNotifItems([]);
            setNotifError(t("notificationsError"));
            return;
          }
          const data = (await response.json()) as LetterApi[];
          const incoming = data.filter((item) => incomingStatuses.includes(item.status));
          const mapped = incoming.slice(0, 5).map((item) => ({
            id: `${item.id}-${item.status}`,
            status: item.status,
            action: t("incomingLetter"),
            detail: item.letterType?.name ?? "-",
            note: "",
            createdAt: item.createdAt,
            letterId: item.id,
          }));
          const stored = localStorage.getItem("studentNotifDismissed");
          const dismissed = stored ? (JSON.parse(stored) as string[]) : [];
          const filtered = Array.isArray(dismissed)
            ? mapped.filter((item) => !dismissed.includes(item.id))
            : mapped;
          setNotifItems(filtered);
          return;
        }

        const response = await fetch(`${API_BASE}/profile/activity?take=5`, {
          credentials: "include",
        });
        if (!response.ok) {
          setNotifItems([]);
          setNotifError(t("notificationsError"));
          return;
        }
        const data = (await response.json()) as NotifItem[];
        const stored = localStorage.getItem("studentNotifDismissed");
        const dismissed = stored ? (JSON.parse(stored) as string[]) : [];
        const filtered = Array.isArray(dismissed)
          ? data.filter((item) => !dismissed.includes(item.id))
          : data;
        setNotifItems(filtered);
      } catch (error) {
        console.warn("Failed to load notifications", error);
        setNotifItems([]);
        setNotifError(t("notificationsError"));
      } finally {
        setIsLoadingNotif(false);
      }
    };

    loadNotifications();
  }, [API_BASE, showNotifications, roleName, lang]);

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

  const dismissNotification = (id: string) => {
    setNotifItems((prev) => prev.filter((item) => item.id !== id));
    const stored = localStorage.getItem("studentNotifDismissed");
    const dismissed = stored ? (JSON.parse(stored) as string[]) : [];
    const next = Array.isArray(dismissed) ? Array.from(new Set([...dismissed, id])) : [id];
    localStorage.setItem("studentNotifDismissed", JSON.stringify(next));
  };

  const handleNotificationClick = (item: NotifItem) => {
    dismissNotification(item.id);
    if (!item.letterId) return;
    if (roleName === "supervisor_akademik") {
      router.push(`/supervisor/penerima/detail?letterId=${item.letterId}`);
    } else if (roleName === "manager_tu") {
      router.push(`/manajerTU/penerima?letterId=${item.letterId}`);
    } else if (roleName === "upa") {
      router.push(`/UPA/penerima?letterId=${item.letterId}`);
    } else {
      router.push(`/mahasiswa/surat-saya/detail?letterId=${item.letterId}`);
    }
    setShowNotifications(false);
  };

  return (
    <>
      <OnboardingModal isOpen={Boolean(needsOnboarding)} onSuccess={() => window.location.reload()} />
      <header className="app-header sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-gradient-to-r from-[#0A77C8] to-[#1E90FF] px-4 md:px-6 text-white shadow-lg">
        <div className="flex items-center gap-2">
          {onMenuClick ? (
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-lg p-2 hover:bg-white/10 transition"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : null}
          <Link href={dashboardHref} className="flex items-center">
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
        <div className="relative flex items-center gap-4 text-sm font-semibold">
          <UiControls />
          <button
            type="button"
            className="relative rounded-full p-1 hover:bg-white/10"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <Bell className="h-5 w-5" />
            {notifItems.length > 0 ? (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-400" />
            ) : null}
          </button>
          {showNotifications ? (
            <div className="absolute right-0 top-12 w-80 rounded-xl bg-white text-slate-700 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-sm font-semibold text-slate-900">{t("notifications")}</span>
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => setShowNotifications(false)}
                >
                  {t("close")}
                </button>
              </div>
              <div className="max-h-80 overflow-auto px-4 py-3">
                {isLoadingNotif ? (
                  <div className="py-4 text-sm text-slate-500">{t("loadingNotifications")}</div>
                ) : notifError ? (
                  <div className="py-4 text-sm text-red-600">{notifError}</div>
                ) : notifItems.length === 0 ? (
                  <div className="py-4 text-sm text-slate-500">{t("notificationsEmpty")}</div>
                ) : (
                  <div className="space-y-3 text-sm">
                    {notifItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item)}
                        className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-left hover:bg-slate-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-900">{item.action}</div>
                            <div className="text-xs text-slate-600">{item.detail}</div>
                            <div className="mt-1 text-[11px] text-slate-400">
                              {new Date(item.createdAt).toLocaleString(lang === "en" ? "en-US" : "id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              dismissNotification(item.id);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                dismissNotification(item.id);
                              }
                            }}
                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                          >
                            {t("remove")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10"
            onClick={() => setShowProfile(true)}
          >
            <span className="hidden text-sm sm:block">{displayLabel}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {displayInitials}
            </div>
          </button>
        </div>
      </header>

      {showProfile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-4xl rounded-2xl bg-[#F1F1F1] p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{t("profileTitle")}</h2>
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setShowProfile(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1px_1fr]">
                <div className="flex items-center justify-center">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#0A77C8] text-white">
                    <span className="text-3xl font-bold">{displayInitials}</span>
                  </div>
                </div>
                <div className="hidden h-full w-px bg-slate-300 md:block" />
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-slate-900">{displayName}</div>
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-slate-700">
                    <span className="text-slate-500">{t("name")}</span>
                    <span className="font-medium">{displayName}</span>
                    <span className="text-slate-500">{displayIdLabel}</span>
                    <span className="font-medium">{displayIdValue}</span>
                    <span className="text-slate-500">{t("program")}</span>
                    <span className="font-medium">{displayProdi}</span>
                    <span className="text-slate-500">{t("email")}</span>
                    <span className="font-medium">{displayEmail}</span>
                    <span className="text-slate-500">{t("role")}</span>
                    <span>
                      <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        {displayLabel}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 self-end rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  onClick={async () => {
                      setShowProfile(false);
                      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/sign-out`, { method: "POST" });
                      router.push("/");
                    }}
                  >
                    {t("logout")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

type NotifItem = {
  id: string;
  status?: string;
  action: string;
  detail: string;
  note?: string;
  createdAt: string;
  letterId?: string;
};

function getInitials(name?: string) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
