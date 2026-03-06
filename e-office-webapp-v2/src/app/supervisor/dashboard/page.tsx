"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, BarChart2, CheckCircle, Eye, LineChart, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { useUiPreferences } from "@/components/common/useUiPreferences";
import StatCard from "@/components/dashboard/statcard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name: string;
  } | null;
  values?: {
    keperluan?: string;
  } | null;
  createdBy?: {
    name?: string | null;
  } | null;
};

type LetterRow = {
  id: string;
  sumber: string;
  pemohon: string;
  perihal: string;
  keperluan: string;
  tanggal: string;
  status: LetterStatus;
  createdAt: string;
};

const statusBadge: Record<LetterStatus, string> = {
  PENDING: "text-blue-700 dark:text-blue-300",
  IN_PROGRESS: "text-orange-700 dark:text-orange-300",
  COMPLETED: "text-green-700 dark:text-green-300",
  REJECTED: "text-red-700 dark:text-red-300",
};

const getRelativeTime = (isoDate: string) => {
  const timestamp = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - timestamp) / 60000));
  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
};

export default function SupervisorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LetterStatus | "ALL" | "ACTED_MONTH">("ALL");
  const tableRef = useRef<HTMLDivElement | null>(null);
  const { t } = useUiPreferences();

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "PENDING") return t("pendingStatus");
    if (status === "IN_PROGRESS") return t("revisionStatus");
    if (status === "COMPLETED") return t("completedStatus");
    return t("rejectedStatus");
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "COMPLETED") return t("managerRole");
    if (status === "IN_PROGRESS") return t("studentRole");
    return t("supervisorRole");
  };

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const response = await fetch(`${API_BASE}/letters?scope=all`, {
          credentials: "include",
        });
        if (!response.ok) {
          setLetters([]);
          return;
        }
        const data = (await response.json()) as LetterApi[];
        const mapped = data.map((item) => ({
          id: item.id,
          sumber: item.values?.sumber ?? "-",
          pemohon: item.createdBy?.name ?? "-",
          perihal: item.letterType?.name ?? "",
          keperluan: item.values?.keperluan ?? "-",
          createdAt: item.createdAt,
          tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: item.status,
        }));
        setLetters(mapped);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, []);

  const filteredLetters = useMemo(() => {
    if (statusFilter === "ALL") return letters;
    if (statusFilter === "ACTED_MONTH") {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return letters.filter((letter) => {
        if (letter.status === "PENDING" || letter.status === "IN_PROGRESS") return false;
        const createdDate = new Date(letter.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      });
    }
    return letters.filter((letter) => letter.status === statusFilter);
  }, [letters, statusFilter]);

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const pendingCount = letters.filter((letter) => letter.status === "PENDING").length;
    const revisionCount = letters.filter((letter) => letter.status === "IN_PROGRESS").length;
    const actedThisMonth = letters.filter((letter) => {
      if (letter.status === "PENDING" || letter.status === "IN_PROGRESS") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    const totalThisMonth = letters.filter((letter) => {
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    return [
      { key: "needsAction", title: t("summaryNeedsAction"), value: pendingCount, description: `${pendingCount} ${t("letters")}` },
      { key: "inRevision", title: t("summaryInRevision"), value: revisionCount, description: `${revisionCount} ${t("letters")}` },
      { key: "completedMonth", title: t("summaryCompletedMonth"), value: actedThisMonth, description: `${actedThisMonth} ${t("letters")}` },
      { key: "totalMonth", title: t("summaryTotalMonth"), value: totalThisMonth, description: `${totalThisMonth} ${t("letters")}` },
    ];
  }, [letters, t]);

  const urgentItems = useMemo(() => {
    return letters
      .filter((letter) => letter.status === "PENDING")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.perihal || t("letter"),
        time: getRelativeTime(item.createdAt),
      }));
  }, [letters, t]);

  const trendData = useMemo(() => {
    const days = 7;
    const today = new Date();
    const buckets = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      const label = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      return { label, date, count: 0 };
    });
    letters.forEach((letter) => {
      const created = new Date(letter.createdAt);
      buckets.forEach((bucket) => {
        if (
          created.getFullYear() === bucket.date.getFullYear() &&
          created.getMonth() === bucket.date.getMonth() &&
          created.getDate() === bucket.date.getDate()
        ) {
          bucket.count += 1;
        }
      });
    });
    return buckets;
  }, [letters]);

  const statusDistribution = useMemo(() => {
    const counts = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      REJECTED: 0,
    };
    letters.forEach((letter) => {
      counts[letter.status] += 1;
    });
    return [
      { label: t("statusPendingShort"), value: counts.PENDING, color: "bg-blue-500" },
      { label: t("statusRevisionShort"), value: counts.IN_PROGRESS, color: "bg-orange-500" },
      { label: t("statusCompletedShort"), value: counts.COMPLETED, color: "bg-green-500" },
      { label: t("statusRejectedShort"), value: counts.REJECTED, color: "bg-red-500" },
    ];
  }, [letters, t]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        dashboardHref="/supervisor/dashboard"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        {sidebarOpen ? <SupervisorSidebar active="dashboard" /> : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="text-sm text-slate-500">{t("dashboard") + " / " + t("dashboardPersuratan")}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("dashboardPersuratan")}</h1>
            <p className="text-sm text-slate-600">{t("dashboardPersuratanDesc")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("PENDING");
                requestAnimationFrame(() => {
                  tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="text-left"
            >
              <StatCard
                title={t("summaryNeedsAction")}
                value={summary[0].value}
                description={summary[0].description}
                icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
                color="orange"
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("IN_PROGRESS");
                requestAnimationFrame(() => {
                  tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="text-left"
            >
              <StatCard
                title={t("summaryInRevision")}
                value={summary[1].value}
                description={summary[1].description}
                icon={<Users className="w-6 h-6 text-blue-500" />}
                color="blue"
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ACTED_MONTH");
                requestAnimationFrame(() => {
                  tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="text-left"
            >
              <StatCard
                title={t("summaryCompletedMonth")}
                value={summary[2].value}
                description={summary[2].description}
                icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                color="green"
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                requestAnimationFrame(() => {
                  tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="text-left"
            >
              <StatCard
                title={t("summaryTotalMonth")}
                value={summary[3].value}
                description={summary[3].description}
                color="blue"
              />
            </button>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("summaryNeedsAction")} Segera
              </h3>
              <Link
                href="/supervisor/penerima"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {isLoading ? (
                <div className="text-xs text-slate-500">{t("loadingLetters")}</div>
              ) : urgentItems.length === 0 ? (
                <div className="text-xs text-slate-500">{t("noLetters")}</div>
              ) : (
                urgentItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/supervisor/penerima/detail?letterId=${item.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-slate-500">ID: {item.id}</div>
                    </div>
                    <span className="text-slate-500">{item.time}</span>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                <span>{t("trendTitle")}</span>
                <LineChart className="h-4 w-4 text-slate-400 dark:text-slate-300" />
              </div>
              <div className="h-48 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 p-4 dark:from-slate-900 dark:to-slate-800">
                <div className="flex h-full items-end justify-between gap-2">
                  {trendData.map((item) => {
                    const height = trendData.length ? (item.count / Math.max(1, ...trendData.map((d) => d.count))) * 100 : 0;
                    return (
                      <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-md bg-blue-500/80" style={{ height: `${Math.max(8, height)}%` }} />
                        <span className="text-[10px] text-slate-500 dark:text-slate-300">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
            <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                <span>{t("statusDistribution")}</span>
                <BarChart2 className="h-4 w-4 text-slate-400 dark:text-slate-300" />
              </div>
              <div className="h-48 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800">
                <div className="flex h-full flex-col justify-between gap-3">
                  {statusDistribution.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="w-16">{item.label}</span>
                      <div className="flex-1 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{
                            width: `${Math.max(
                              5,
                              (item.value / Math.max(1, ...statusDistribution.map((d) => d.value))) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-semibold text-slate-700 dark:text-slate-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div ref={tableRef}>
            <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("allLetters")}</h2>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex w-56 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <Input placeholder={t("searchLetters")} className="border-0 p-0 text-sm focus-visible:ring-0 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    {t("dateRange")}
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    {t("filterStatus")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[1.2fr_1fr_1.4fr_1.2fr_1fr_1fr_0.8fr_0.5fr] items-center gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <span>{t("reasonSubmission")}</span>
              <span>{t("source")}</span>
              <span>{t("senderApplicant")}</span>
              <span>{t("subject")}</span>
              <span>{t("receivedDate")}</span>
              <span>{t("currentTarget")}</span>
              <span className="text-right">{t("filterStatus")}</span>
              <span className="text-right">{t("action")}</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <div className="py-6 text-sm text-slate-500 dark:text-slate-400">{t("loadingLetters")}</div>
              ) : filteredLetters.length === 0 ? (
                <div className="py-6 text-sm text-slate-500 dark:text-slate-400">{t("noLetters")}</div>
              ) : (
                filteredLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid grid-cols-[1.2fr_1fr_1.4fr_1.2fr_1fr_1fr_0.8fr_0.5fr] items-center gap-3 py-3 text-sm text-slate-800 dark:text-slate-100"
                  >
                    <span className="font-semibold truncate">{letter.keperluan || "-"}</span>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 truncate dark:border-slate-700 dark:text-slate-300">
                      {letter.sumber}
                    </span>
                    <span className="text-slate-700 truncate dark:text-slate-100">{letter.pemohon}</span>
                    <span className="truncate">{letter.perihal || t("letter")}</span>
                    <span className="text-slate-600 truncate dark:text-slate-300">{letter.tanggal}</span>
                    <span className="text-slate-700 truncate dark:text-slate-100">{getTargetLabel(letter.status)}</span>
                    <span className={`text-right text-xs font-semibold ${statusBadge[letter.status]}`}>{getStatusLabel(letter.status)}</span>
                    <div className="flex justify-end">
                      {letter.status === "PENDING" ? (
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" asChild>
                          <Link href={`/supervisor/penerima/detail?letterId=${letter.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{t("showing")} {filteredLetters.length} {t("of")} {letters.length}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-7 px-3 text-xs bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" disabled>
                  1
                </Button>
              </div>
            </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
