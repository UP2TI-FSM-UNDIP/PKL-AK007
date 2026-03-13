"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useMemo, useState } from "react";
import {
  Filter,
  Plus,
  Calendar,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 10;

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
  letterType?: { name?: string } | null;
  values?: { nomorSurat?: string } | null;
  createdBy?: { name?: string | null } | null;
};

type LetterRow = {
  id: string;
  tanggal: string;
  nomorSurat: string;
  pemohon: string;
  roleTerakhir: string;
  tanggalDibuat: string;
  status: string;
  statusRaw: LetterStatus;
};

const statusFilterMap: Record<string, LetterStatus | ""> = {
  Semua: "",
  Pending: "PENDING",
  Disetujui: "DONE",
  Ditolak: "REJECTED",
  Draft: "",
};

const getStatusLabel = (status: LetterStatus) => {
  if (status === "PENDING" || status === "COMPLETED") return "Menunggu Verifikasi";
  if (status === "UPA_REVIEW") return "Menunggu Penomoran";
  if (status === "IN_PROGRESS") return "Revisi";
  if (status === "DONE") return "Selesai";
  return "Ditolak";
};

const getRoleLabel = (status: LetterStatus) => {
  if (status === "PENDING") return "Supervisor Akademik";
  if (status === "COMPLETED") return "Manajer TU";
  if (status === "UPA_REVIEW" || status === "DONE") return "UPA";
  if (status === "IN_PROGRESS") return "Mahasiswa";
  return "Manajer TU";
};

export default function MonitoringSuratPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState(searchParams?.get("status") || "Semua");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<LetterRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const status = searchParams?.get("status");
    if (status) {
      setSelectedStatus(status);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadLetters = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("scope", "all");
        params.set("page", String(page));
        params.set("take", String(PAGE_SIZE));
        const status = statusFilterMap[selectedStatus] ?? "";
        if (status) params.set("status", status);
        if (startDate) params.set("startDate", startDate);
        const response = await fetch(`${API_BASE}/letters?${params.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setRows([]);
          setTotal(0);
          return;
        }
        const data = (await response.json()) as { items: LetterApi[]; total: number } | LetterApi[];
        const items = Array.isArray(data) ? data : data.items;
        const totalItems = Array.isArray(data) ? data.length : data.total;
        const mapped = items.map((letter) => ({
          id: letter.id,
          tanggal: new Date(letter.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          nomorSurat: letter.values?.nomorSurat ?? "-",
          pemohon: letter.createdBy?.name ?? "-",
          roleTerakhir: getRoleLabel(letter.status),
          tanggalDibuat: new Date(letter.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          status: getStatusLabel(letter.status),
          statusRaw: letter.status,
        }));
        const filtered =
          selectedRole === "Semua"
            ? mapped
            : mapped.filter((item) => item.roleTerakhir === selectedRole);
        setRows(filtered);
        setTotal(totalItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, [page, selectedStatus, selectedRole, startDate]);

  const totalLabel = useMemo(() => {
    if (isLoading) return "Memuat data surat...";
    if (total === 0) return "Menampilkan 0 dari 0 surat";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Menampilkan ${start} - ${end} dari ${total} surat`;
  }, [isLoading, page, total]);

  const getStatusStyle = (status: LetterStatus) => {
    switch (status) {
      case "PENDING":
      case "COMPLETED":
      case "UPA_REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DONE":
        return "bg-green-100 text-green-800 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REJECTED":
      case "MANAGER_REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: LetterStatus) => {
    switch (status) {
      case "PENDING":
      case "COMPLETED":
      case "UPA_REVIEW":
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "DONE":
        return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      case "IN_PROGRESS":
        return <FileText className="w-3.5 h-3.5 mr-1" />;
      case "REJECTED":
      case "MANAGER_REJECTED":
        return <XCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard / Monitoring Surat</h1>
          <p className="text-sm text-gray-500 mt-1">
            Lihat dan pantau semua surat yang diajukan di sistem tanpa batasan role.
          </p>
        </div>
        <button
          onClick={() => router.push("/superadmin/monitoring-surat")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Surat
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter Pencarian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Status Surat</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Semua</option>
              <option>Pending</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
              <option>Draft</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Role Terakhir</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Semua</option>
              <option>Mahasiswa</option>
              <option>Supervisor Akademik</option>
              <option>Manajer TU</option>
              <option>UPA</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Tanggal Dibuat</label>
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
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            onClick={() => {
              setSelectedStatus("Semua");
              setSelectedRole("Semua");
              setStartDate("");
              setPage(1);
            }}
          >
            Reset
          </button>
          <button
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
            onClick={() => setPage(1)}
          >
            Cari
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Surat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Terakhir</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">
                    Memuat data surat...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">
                    Belum ada surat.
                  </td>
                </tr>
              ) : (
                rows.map((letter) => (
                  <tr key={letter.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">{letter.tanggal}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{letter.nomorSurat}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {letter.pemohon ? (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {letter.pemohon}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {letter.roleTerakhir || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {letter.tanggalDibuat || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                          letter.statusRaw
                        )}`}
                      >
                        {getStatusIcon(letter.statusRaw)}
                        {letter.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-600">{totalLabel}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={page * PAGE_SIZE >= total}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
