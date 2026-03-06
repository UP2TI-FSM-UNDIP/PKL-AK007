"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Clock, XCircle, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type DashboardResponse = {
  stats: {
    totalSurat: number;
    totalUser: number;
    suratPending: number;
    suratDitolak: number;
    roleCounts: Record<string, number>;
  };
  statusSummary: { status: string; label: string; count: number }[];
  activityLogs: {
    id: string;
    status: string;
    note: string;
    actorName: string;
    actorRole: string;
    createdAt: string;
  }[];
};

const StatCard = ({ title, value, icon: Icon, children, trend, onClick }: any) => (
  <Card
    className="border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="w-5 h-5 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend ? <p className="text-xs text-green-600 mt-1">{trend} hari ini</p> : null}
      {children}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE}/superadmin/dashboard`, {
          credentials: "include",
        });
        if (!response.ok) {
          setData(null);
          return;
        }
        const result = (await response.json()) as DashboardResponse;
        setData(result);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const roleBreakdown = useMemo(() => {
    const raw = data?.stats.roleCounts ?? {};
    const normalizedCounts = Object.entries(raw).reduce<Record<string, number>>((acc, [key, value]) => {
      const normalized = key
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      const resolved =
        normalized === "manajer_tu" ? "manager_tu" :
        normalized === "supervisor" ? "supervisor_akademik" :
        normalized;
      acc[resolved] = (acc[resolved] ?? 0) + value;
      return acc;
    }, {});

    const roles = [
      { key: "mahasiswa", label: "Mahasiswa" },
      { key: "supervisor_akademik", label: "Supervisor Akademik" },
      { key: "manager_tu", label: "Manajer TU" },
      { key: "upa", label: "UPA" },
      { key: "superadmin", label: "Superadmin" },
    ];

    return roles.map((role) => ({
      label: role.label,
      value: normalizedCounts[role.key] ?? 0,
    }));
  }, [data]);

  const chartData = useMemo(() => {
    const summary = data?.statusSummary ?? [];
    return summary.length ? summary : [];
  }, [data]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard / Dashboard Superadmin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring seluruh aktivitas sistem persuratan Fakultas Sains dan Matematika.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Surat"
          value={data?.stats.totalSurat?.toLocaleString() ?? (isLoading ? "..." : "0")}
          icon={FileText}
          onClick={() => router.push("/superadmin/monitoring-surat")}
        />

        <Card
          className="border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
          onClick={() => router.push("/superadmin/manajemen-user")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">Total User</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data?.stats.totalUser ?? (isLoading ? "..." : "0")}</div>
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              {roleBreakdown.map((role) => (
                <li key={role.label} className="flex justify-between">
                  <span>{role.label}</span>
                  <span className="font-medium">{role.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <StatCard
          title="Surat Pending"
          value={data?.stats.suratPending ?? (isLoading ? "..." : "0")}
          icon={Clock}
          onClick={() => router.push("/superadmin/monitoring-surat?status=Pending")}
        />
        <StatCard
          title="Surat Ditolak"
          value={data?.stats.suratDitolak ?? (isLoading ? "..." : "0")}
          icon={XCircle}
          onClick={() => router.push("/superadmin/monitoring-surat?status=Ditolak")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Grafik Penggunaan Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around px-2 border-b border-l border-gray-200 relative">
              <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-gray-500 -mb-6">
                {chartData.map((item) => (
                  <span key={item.status}>{item.label}</span>
                ))}
              </div>
              {chartData.map((item) => {
                const maxValue = Math.max(1, ...chartData.map((entry) => entry.count));
                const height = (item.count / maxValue) * 100;
                return (
                  <div key={item.status} className="flex flex-col items-center">
                    <div
                      style={{ height: `${Math.max(10, height)}%` }}
                      className="w-8 bg-blue-500 rounded-t-md"
                    ></div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ringkasan Status Surat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status.label}</span>
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data?.activityLogs?.length ? (
              data.activityLogs.map((log) => (
                <li key={log.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{log.actorName}</p>
                    <p className="text-gray-500">{log.actorRole}</p>
                  </div>
                  <span className="text-gray-500">
                    {new Date(log.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">Belum ada aktivitas.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
