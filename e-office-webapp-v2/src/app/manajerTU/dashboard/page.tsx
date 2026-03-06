"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  FileText,
  AlertCircle,
  CheckCircle,
  LineChart,
  BarChart2,
  Users,
} from "lucide-react";

import StatCard from "@/components/dashboard/statcard";
import SuratTable from "@/components/dashboard/surattable";
import { Card } from "@/components/ui/card";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UPA_REVIEW"
  | "DONE"
  | "MANAGER_REJECTED"
  | "REJECTED";

type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name: string;
  } | null;
  values?: {
    keperluan?: string;
    sumber?: string;
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

type StatusGroup = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

const normalizeStatus = (status: LetterStatus): StatusGroup => {
  if (status === "REJECTED" || status === "MANAGER_REJECTED") return "REJECTED";
  if (status === "DONE") return "COMPLETED";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  return "PENDING";
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

export default function DashboardPersuratan() {
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LetterStatus | "ALL">("ALL");
  const tableRef = useRef<HTMLDivElement | null>(null);
  const { t } = useUiPreferences();

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

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const pendingCount = letters.filter((letter) => normalizeStatus(letter.status) === "PENDING").length;
    const revisionCount = letters.filter((letter) => normalizeStatus(letter.status) === "IN_PROGRESS").length;
    const completedThisMonth = letters.filter((letter) => {
      if (normalizeStatus(letter.status) !== "COMPLETED") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    const completedLastMonth = letters.filter((letter) => {
      if (normalizeStatus(letter.status) !== "COMPLETED") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === lastMonth && createdDate.getFullYear() === lastMonthYear;
    }).length;
    const totalThisMonth = letters.filter((letter) => {
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const pendingToday = letters.filter((letter) => {
      if (normalizeStatus(letter.status) !== "PENDING") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.toDateString() === today.toDateString();
    }).length;
    const pendingYesterday = letters.filter((letter) => {
      if (normalizeStatus(letter.status) !== "PENDING") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.toDateString() === yesterday.toDateString();
    }).length;
    const pendingDelta = pendingToday - pendingYesterday;

    const dayOfMonth = today.getDate();
    const averagePerDay = dayOfMonth ? Math.round((totalThisMonth / dayOfMonth) * 10) / 10 : 0;

    return {
      pendingCount,
      revisionCount,
      completedThisMonth,
      completedDelta: completedThisMonth - completedLastMonth,
      totalThisMonth,
      pendingDelta,
      averagePerDay,
    };
  }, [letters]);

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
      counts[normalizeStatus(letter.status)] += 1;
    });
    return [
      { label: t("statusPendingShort"), value: counts.PENDING, color: "bg-blue-500" },
      { label: t("statusRevisionShort"), value: counts.IN_PROGRESS, color: "bg-orange-500" },
      { label: t("statusCompletedShort"), value: counts.COMPLETED, color: "bg-green-500" },
      { label: t("statusRejectedShort"), value: counts.REJECTED, color: "bg-red-500" },
    ];
  }, [letters, t]);

  const urgentItems = useMemo(() => {
    return letters
      .filter((letter) => normalizeStatus(letter.status) === "PENDING")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.perihal || "Surat",
        time: getRelativeTime(item.createdAt),
      }));
  }, [letters]);

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "Menunggu Penomoran UPA";
    if (status === "COMPLETED") return "Menunggu TTD Manajer TU";
    if (status === "IN_PROGRESS") return t("revisionStatus");
    if (status === "PENDING") return t("pendingStatus");
    if (status === "REJECTED" || status === "MANAGER_REJECTED") return t("rejectedStatus");
    if (status === "DONE") return t("completedStatus");
    return t("pendingStatus");
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return t("upaRole");
    if (status === "COMPLETED") return t("managerRole");
    if (status === "IN_PROGRESS") return t("studentRole");
    if (status === "PENDING") return t("supervisorRole");
    return t("managerRole");
  };

  const filteredLetters = useMemo(() => {
    if (statusFilter === "ALL") return letters;
    return letters.filter((letter) => letter.status === statusFilter);
  }, [letters, statusFilter]);

  const tableRows = useMemo(() => {
    return filteredLetters
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((letter) => ({
        id: letter.id,
        pengirim: letter.pemohon,
        perihal: letter.perihal || t("letter"),
        status: getStatusLabel(letter.status),
        sumber: letter.sumber,
        tanggal: letter.tanggal,
        tujuan: getTargetLabel(letter.status),
        statusTone: normalizeStatus(letter.status) === "REJECTED"
          ? "danger"
          : normalizeStatus(letter.status) === "COMPLETED"
          ? "success"
          : normalizeStatus(letter.status) === "IN_PROGRESS"
          ? "info"
          : "warning",
        canAct: letter.status === "COMPLETED" || letter.status === "IN_PROGRESS",
      }));
  }, [filteredLetters, t]);

  const handleSummaryFilter = (nextFilter: LetterStatus | "ALL") => {
    setStatusFilter(nextFilter);
    requestAnimationFrame(() => {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Dashboard Persuratan</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Dashboard Persuratan
            </h1>
            <p className="text-gray-600">
              Pusat kendali untuk mengelola semua surat Fakultas Sains dan Matematika.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/manajerTU/penerima"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FileText className="w-4 h-4" />
              Lihat Surat Masuk
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button
          type="button"
          className="text-left"
          onClick={() => handleSummaryFilter("PENDING")}
        >
          <StatCard
            title="Perlu Tindakan"
            value={summary.pendingCount}
            description={`${summary.pendingCount} surat menunggu`}
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            trend={`${summary.pendingDelta >= 0 ? "+" : ""}${summary.pendingDelta} dari kemarin`}
            color="orange"
          />
        </button>
        <button
          type="button"
          className="text-left"
          onClick={() => handleSummaryFilter("IN_PROGRESS")}
        >
          <StatCard
            title="Dalam Proses Revisi"
            value={summary.revisionCount}
            description={`${summary.revisionCount} surat`}
            icon={<Users className="w-6 h-6 text-blue-500" />}
            color="blue"
          />
        </button>
        <button
          type="button"
          className="text-left"
          onClick={() => handleSummaryFilter("DONE")}
        >
          <StatCard
            title="Selesai (Bulan Ini)"
            value={summary.completedThisMonth}
            description={`${summary.completedThisMonth} surat selesai`}
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            trend={`${summary.completedDelta >= 0 ? "+" : ""}${summary.completedDelta} dari bulan lalu`}
            color="green"
          />
        </button>
        <button
          type="button"
          className="text-left"
          onClick={() => handleSummaryFilter("ALL")}
        >
          <StatCard
            title="Total Surat (Bulan Ini)"
            value={summary.totalThisMonth}
            description={`${summary.totalThisMonth} surat bulan ini`}
            trend={`Rata-rata ${summary.averagePerDay} surat/hari`}
            color="blue"
          />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 dark:border-slate-700/60 dark:bg-slate-900/70">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Perlu Tindakan Segera
          </h3>
          <Link
            href="/manajerTU/penerima"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="text-sm text-gray-500 dark:text-slate-400">Memuat data...</div>
        ) : urgentItems.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-slate-400">Tidak ada surat yang perlu ditindak.</div>
        ) : (
          <div className="space-y-3">
            {urgentItems.map((item) => (
              <Link
                key={item.id}
                href={`/manajerTU/identitas-pemohon?letterId=${item.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-200 transition dark:border-slate-700 dark:hover:border-orange-600/60 dark:hover:bg-orange-900/20"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">ID: {item.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 dark:text-slate-400">{item.time}</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full dark:bg-orange-900/40 dark:text-orange-200">
                    Proses
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span>{t("trendTitle")}</span>
            <LineChart className="h-4 w-4 text-slate-400 dark:text-slate-300" />
          </div>
          <div className="h-48 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 p-4 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full items-end justify-between gap-2">
              {trendData.map((item) => {
                const height = trendData.length
                  ? (item.count / Math.max(1, ...trendData.map((d) => d.count))) * 100
                  : 0;
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

      <div ref={tableRef} className="bg-white rounded-xl shadow-sm border dark:border-slate-700/60 dark:bg-slate-900/70">
        <div className="p-6 border-b dark:border-slate-800">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Surat Terbaru</h3>
            <Link
              href="/manajerTU/penerima"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Lihat semua →
            </Link>
          </div>
        </div>
        <div className="p-6 pt-4">
          <SuratTable role="manajerTU" rows={tableRows} />
        </div>
      </div>
    </div>
  );
}
