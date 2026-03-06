"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, BarChart2, CheckCircle, FileText, LineChart } from "lucide-react";

import { Card } from "@/components/ui/card";
import StatCard from "@/components/dashboard/statcard";
import SuratTable from "@/components/dashboard/surattable";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UPA_REVIEW"
  | "DONE"
  | "REJECTED"
  | "MANAGER_REJECTED";

type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name?: string;
  } | null;
  values?: {
    sumber?: string;
    keperluan?: string;
  } | null;
  createdBy?: {
    name?: string | null;
  } | null;
};

export default function UPADashboard() {
  const [letters, setLetters] = useState<LetterApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPA_REVIEW" | "DONE">("ALL");
  const tableRef = useRef<HTMLDivElement | null>(null);

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
        const data = (await response.json()) as { items: LetterApi[] } | LetterApi[];
        const items = Array.isArray(data) ? data : data.items ?? [];
        setLetters(items);
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
    const needsNumbering = letters.filter((letter) => letter.status === "UPA_REVIEW").length;
    const completed = letters.filter((letter) => letter.status === "DONE").length;
    const totalThisMonth = letters.filter((letter) => {
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    return { needsNumbering, completed, totalThisMonth };
  }, [letters]);

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "Menunggu Penomoran";
    if (status === "DONE") return "Selesai";
    if (status === "IN_PROGRESS") return "Dalam Proses";
    if (status === "PENDING" || status === "COMPLETED") return "Menunggu Verifikasi";
    return "Ditolak";
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "UPA";
    if (status === "DONE") return "UPA";
    if (status === "COMPLETED") return "Manajer TU";
    if (status === "PENDING") return "Supervisor Akademik";
    if (status === "IN_PROGRESS") return "Pemohon";
    return "Manajer TU";
  };

  const resolveTone = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "warning";
    if (status === "DONE") return "success";
    if (status === "IN_PROGRESS") return "info";
    if (status === "PENDING" || status === "COMPLETED") return "info";
    return "danger";
  };

  const filteredLetters = useMemo(() => {
    if (statusFilter === "ALL") return letters;
    return letters.filter((letter) => letter.status === statusFilter);
  }, [letters, statusFilter]);

  const tableRows = useMemo(() => {
    return filteredLetters.slice(0, 5).map((letter) => ({
      id: letter.id,
      pengirim: letter.createdBy?.name ?? "-",
      perihal: letter.letterType?.name ?? "-",
      status: getStatusLabel(letter.status),
      sumber: mapSumber(letter.values?.sumber),
      tanggal: new Date(letter.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      tujuan: getTargetLabel(letter.status),
      statusTone: resolveTone(letter.status) as "info" | "warning" | "success" | "danger",
      canAct: letter.status === "UPA_REVIEW",
    }));
  }, [filteredLetters]);

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
    return buckets.map(({ label, count }) => ({ label, count }));
  }, [letters]);

  const statusDistribution = useMemo(() => {
    const counts = {
      pending: 0,
      completed: 0,
    };
    letters.forEach((letter) => {
      if (letter.status === "UPA_REVIEW") counts.pending += 1;
      else if (letter.status === "DONE") counts.completed += 1;
    });
    return [
      { label: "Menunggu Penomoran", value: counts.pending, color: "bg-orange-500" },
      { label: "Selesai", value: counts.completed, color: "bg-green-500" },
    ];
  }, [letters]);

  const tableTitle = useMemo(() => {
    if (statusFilter === "DONE") return "Surat Selesai";
    if (statusFilter === "UPA_REVIEW") return "Surat Menunggu Penomoran";
    return "Surat Terbaru";
  }, [statusFilter]);

  const maxTrendValue = useMemo(() => {
    if (!trendData.length) return 1;
    return Math.max(1, ...trendData.map((item) => item.count));
  }, [trendData]);

  const maxStatusValue = useMemo(() => {
    if (!statusDistribution.length) return 1;
    return Math.max(1, ...statusDistribution.map((item) => item.value));
  }, [statusDistribution]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/UPA/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Dashboard UPA</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Dashboard Unit Penjaminan Akademik
            </h1>
            <p className="text-gray-600">
              Pusat kendali untuk penomoran dan penerbitan surat Fakultas Sains dan Matematika.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/UPA/penerima"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FileText className="w-4 h-4" />
              Lihat Surat Masuk
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          type="button"
          onClick={() => {
            setStatusFilter("UPA_REVIEW");
            requestAnimationFrame(() => {
              tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          }}
          className="text-left"
        >
          <StatCard
            title="Perlu Penomoran"
            value={summary.needsNumbering}
            description={`${summary.needsNumbering} surat belum dinomori`}
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            color="orange"
          />
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter("DONE");
            requestAnimationFrame(() => {
              tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          }}
          className="text-left"
        >
          <StatCard
            title="Sudah Dinomori"
            value={summary.completed}
            description={`${summary.completed} surat telah diterbitkan`}
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
            title="Total Surat (Bulan Ini)"
            value={summary.totalThisMonth}
            description={`${summary.totalThisMonth} surat bulan ini`}
            color="blue"
          />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span>Tren Volume 30 Hari</span>
            <LineChart className="h-4 w-4 text-slate-400 dark:text-slate-300" />
          </div>
          <div className="h-48 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 p-4 dark:from-slate-900 dark:to-slate-800">
            <div className="flex h-full items-end justify-between gap-2">
              {trendData.map((item) => {
                const height = (item.count / maxTrendValue) * 100;
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
            <span>Distribusi Status</span>
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
                        width: `${Math.max(5, (item.value / maxStatusValue) * 100)}%`,
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

      <div ref={tableRef} className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{tableTitle}</h3>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setStatusFilter("ALL")}
            >
              Lihat semua →
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Memuat data surat...</div>
        ) : tableRows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">Belum ada surat menunggu penomoran.</div>
        ) : (
          <SuratTable role="UPA" rows={tableRows} />
        )}
      </div>
    </div>
  );
}

function mapSumber(value?: string) {
  if (!value) return "Internal";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "Internal";
  if (normalized.includes("eksternal") || normalized.includes("external") || normalized.includes("luar")) {
    return "Eksternal";
  }
  return "Internal";
}
