"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
  User,
  Globe,
  Clock,
  RefreshCw,
  Download,
  Activity,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 10;

type AuditLogApi = {
  id: string;
  status: string;
  note: string;
  actorName: string;
  actorRole: string;
  ipAddress: string;
  letterType: string;
  createdAt: string;
};

export default function AuditLogPage() {
  const [selectedAktivitas, setSelectedAktivitas] = useState("Semua Aktivitas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchNama, setSearchNama] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<AuditLogApi[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const statusFilter = useMemo(() => {
    if (selectedAktivitas === "Approve") return ["COMPLETED", "DONE"];
    if (selectedAktivitas === "Revisi") return ["IN_PROGRESS"];
    if (selectedAktivitas === "Publish") return ["DONE"];
    if (selectedAktivitas === "Tolak") return ["REJECTED", "MANAGER_REJECTED"];
    return [];
  }, [selectedAktivitas]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("take", String(PAGE_SIZE));
      if (searchNama.trim()) params.set("search", searchNama.trim());
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (ipAddress.trim()) params.set("ip", ipAddress.trim());
      if (statusFilter.length) params.set("status", statusFilter.join(","));
      const response = await fetch(`${API_BASE}/superadmin/audit-log?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) {
        setLogs([]);
        setTotal(0);
        return;
      }
      const data = (await response.json()) as { items: AuditLogApi[]; total: number } | AuditLogApi[];
      const items = Array.isArray(data) ? data : data.items;
      const totalItems = Array.isArray(data) ? data.length : data.total;
      setLogs(items);
      setTotal(totalItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, searchNama, startDate, endDate, ipAddress, statusFilter]);

  const getAktivitasIcon = (status: string) => {
    if (status === "REJECTED" || status === "MANAGER_REJECTED") {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    if (status === "IN_PROGRESS") {
      return <Edit className="w-4 h-4 text-amber-600" />;
    }
    if (status === "COMPLETED" || status === "DONE") {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (status === "UPA_REVIEW" || status === "PENDING") {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getAktivitasStyle = (status: string) => {
    if (status === "REJECTED" || status === "MANAGER_REJECTED") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (status === "IN_PROGRESS") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    if (status === "COMPLETED" || status === "DONE") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (status === "UPA_REVIEW" || status === "PENDING") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusLabel = (status: string) => {
    if (status === "PENDING") return "Menunggu Verifikasi";
    if (status === "UPA_REVIEW") return "Menunggu Penomoran";
    if (status === "IN_PROGRESS") return "Revisi";
    if (status === "COMPLETED" || status === "DONE") return "Selesai";
    if (status === "REJECTED" || status === "MANAGER_REJECTED") return "Ditolak";
    return status;
  };

  const totalLabel = useMemo(() => {
    if (isLoading) return "Memuat aktivitas...";
    if (total === 0) return "Menampilkan 0 dari 0 aktivitas";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Menampilkan ${start} - ${end} dari ${total} aktivitas`;
  }, [isLoading, page, total]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Lihat semua aktivitas sistem untuk tracking perubahan status dan mengelola keamanan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
            onClick={() => loadLogs()}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Semua Aktivitas
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{total} aktivitas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Jenis Aktivitas</label>
            <select
              value={selectedAktivitas}
              onChange={(e) => setSelectedAktivitas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Semua Aktivitas</option>
              <option>Approve</option>
              <option>Revisi</option>
              <option>Publish</option>
              <option>Tolak</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Dari Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Sampai Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Nama / NIM / NIP</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">IP Address</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="xxx.xxx.xxx.xxx"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            onClick={() => {
              setSelectedAktivitas("Semua Aktivitas");
              setStartDate("");
              setEndDate("");
              setSearchNama("");
              setIpAddress("");
              setPage(1);
            }}
          >
            Reset
          </button>
          <button
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            onClick={() => setPage(1)}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perubahan</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diganti Oleh</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-sm text-gray-500">
                    Memuat aktivitas...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-sm text-gray-500">
                    Belum ada aktivitas.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(log.createdAt).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border ${getAktivitasStyle(
                          log.status
                        )}`}
                      >
                        {getAktivitasIcon(log.status)}
                        <span className="ml-1.5">{getStatusLabel(log.status)}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 max-w-md">
                      <div className="line-clamp-2">{log.note || log.letterType}</div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {log.actorName
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .substring(0, 2)}
                          </span>
                        </div>
                        <span className="text-gray-700">{log.actorName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-xs text-gray-700">{log.ipAddress}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-600">{totalLabel}</span>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
              {page}
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page * PAGE_SIZE >= total}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
