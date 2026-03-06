"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useUiPreferences } from "@/components/common/useUiPreferences";

type ProfileData = {
  userRole?: { role?: { name?: string } }[];
};

type LetterApi = {
  id: string;
  status: string;
  createdAt: string;
  letterType?: { name?: string } | null;
};

type NotifItem = {
  id: string;
  status?: string;
  action: string;
  detail: string;
  createdAt: string;
  letterId?: string;
};

const incomingStatusByRole: Record<string, string[]> = {
  supervisor_akademik: ["PENDING"],
  manager_tu: ["COMPLETED"],
  upa: ["UPA_REVIEW"],
};

const DISMISSED_KEY = "roleNotifDismissed";

export function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotif, setIsLoadingNotif] = useState(false);
  const [notifItems, setNotifItems] = useState<NotifItem[]>([]);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string>("");
  const router = useRouter();
  const { t } = useUiPreferences();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = (await response.json()) as ProfileData;
        const role = data.userRole?.[0]?.role?.name ?? "";
        setRoleName(role);
      } catch (error) {
        console.warn("Failed to load profile", error);
      }
    };

    loadProfile();
  }, [API_BASE]);

  useEffect(() => {
    if (!showNotifications) return;

    const loadNotifications = async () => {
      setIsLoadingNotif(true);
      setNotifError(null);
      try {
        const incomingStatuses = incomingStatusByRole[roleName];
        if (!incomingStatuses) {
          setNotifItems([]);
          return;
        }
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
          createdAt: item.createdAt,
          letterId: item.id,
        }));
        const stored = localStorage.getItem(DISMISSED_KEY);
        const dismissed = stored ? (JSON.parse(stored) as string[]) : [];
        const filtered = Array.isArray(dismissed)
          ? mapped.filter((item) => !dismissed.includes(item.id))
          : mapped;
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
  }, [API_BASE, roleName, showNotifications, t]);

  const dismissNotification = (id: string) => {
    setNotifItems((prev) => prev.filter((item) => item.id !== id));
    const stored = localStorage.getItem(DISMISSED_KEY);
    const dismissed = stored ? (JSON.parse(stored) as string[]) : [];
    const next = Array.isArray(dismissed) ? Array.from(new Set([...dismissed, id])) : [id];
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
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
    }
    setShowNotifications(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-full p-2 hover:bg-white/10 transition"
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
                          {new Date(item.createdAt).toLocaleString("id-ID", {
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
    </div>
  );
}
