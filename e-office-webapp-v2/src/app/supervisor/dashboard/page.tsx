"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BarChart2, Eye, LineChart, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";

const summaryDescription: Record<string, string> = {
  "Perlu Tindakan": "surat belum diproses",
  "Dalam Proses Revisi": "menunggu revisi mahasiswa",
  "Selesai (Bulan Ini)": "surat telah diproses",
  "Total Surat (Bulan Ini)": "total volume bulan ini",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name: string;
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
  tanggal: string;
  tujuan: string;
  status: "Surat diajukan ke Supervisor Akademik" | "Surat diajukan ke Manajer TU" | "Surat perlu revisi" | "Surat ditolak oleh Supervisor";
  rawStatus: LetterStatus;
  createdAt: string;
};

const statusBadge: Record<string, string> = {
  "Surat diajukan ke Supervisor Akademik": "text-blue-700",
  "Surat diajukan ke Manajer TU": "text-green-700",
  "Surat perlu revisi": "text-orange-700",
  "Surat ditolak oleh Supervisor": "text-red-700",
};

export default function SupervisorDashboardPage() {
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LetterStatus | "ALL" | "ACTED_MONTH">("ALL");

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
          sumber: "Internal",
          pemohon: item.createdBy?.name ?? "Mahasiswa",
          perihal: item.letterType?.name ?? "Surat",
          createdAt: item.createdAt,
          tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          tujuan: "Supervisor Akademik",
          rawStatus: item.status,
          status:
            item.status === "PENDING"
              ? "Surat diajukan ke Supervisor Akademik"
              : item.status === "IN_PROGRESS"
              ? "Surat perlu revisi"
              : item.status === "COMPLETED"
              ? "Surat diajukan ke Manajer TU"
              : "Surat ditolak oleh Supervisor",
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
        if (letter.rawStatus === "PENDING" || letter.rawStatus === "IN_PROGRESS") return false;
        const createdDate = new Date(letter.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      });
    }
    return letters.filter((letter) => letter.rawStatus === statusFilter);
  }, [letters, statusFilter]);

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const pendingCount = letters.filter((letter) => letter.rawStatus === "PENDING").length;
    const revisionCount = letters.filter((letter) => letter.rawStatus === "IN_PROGRESS").length;
    const actedThisMonth = letters.filter((letter) => {
      if (letter.rawStatus === "PENDING" || letter.rawStatus === "IN_PROGRESS") return false;
      const createdDate = new Date(letter.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    return [
      { title: "Perlu Tindakan", value: String(pendingCount) },
      { title: "Dalam Proses Revisi", value: String(revisionCount) },
      { title: "Selesai (Bulan Ini)", value: String(actedThisMonth) },
      { title: "Total Surat (Bulan Ini)", value: String(letters.length) },
    ];
  }, [letters]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        userLabel="Supervisor Akademik"
        initials="SA"
        userName="Ahmad Douglas"
        email="ahmaddouglas12345@gmail.com"
        idLabel="NIP"
        idValue="198012102005011001"
        prodi="Informatika"
      />
      <div className="flex flex-1">
        <SupervisorSidebar active="dashboard" />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="text-sm text-slate-500">Dashboard / Dashboard Persuratan</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Persuratan</h1>
            <p className="text-sm text-slate-600">
              Pusat kendali untuk mengelola semua surat Fakultas Sains dan Matematika.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {summary.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  if (item.title === "Perlu Tindakan") {
                    setStatusFilter("PENDING");
                    return;
                  } else if (item.title === "Dalam Proses Revisi") {
                    setStatusFilter("IN_PROGRESS");
                    return;
                  } else {
                    setStatusFilter(item.title === "Selesai (Bulan Ini)" ? "ACTED_MONTH" : "ALL");
                  }
                }}
                className="text-left"
                aria-label={`Filter ${item.title.toLowerCase()}`}
              >
                <Card className="border border-slate-200 bg-white p-4 shadow-sm hover:border-[#0A77C8]/60">
                  <div className="text-sm font-semibold text-slate-700">{item.title}</div>
                  <div className="mt-4 text-3xl font-bold text-slate-900">{item.value}</div>
                  <div className="text-xs text-slate-600">{summaryDescription[item.title]}</div>
                </Card>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <Card className="border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Tren Volume 30 Hari</span>
                <LineChart className="h-4 w-4 text-slate-400" />
              </div>
              <div className="h-48 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 p-4">
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">Grafik placeholder</div>
              </div>
            </Card>
            <Card className="border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Distribusi Status</span>
                <BarChart2 className="h-4 w-4 text-slate-400" />
              </div>
              <div className="h-48 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-4">
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">Bar chart placeholder</div>
              </div>
            </Card>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Semua Surat</h2>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex w-56 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <Input placeholder="Cari surat..." className="border-0 p-0 text-sm focus-visible:ring-0" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    Rentang Tanggal
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                    Status
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[1.2fr_1fr_1.6fr_1.6fr_1fr_1fr_0.8fr_0.5fr] items-center gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600">
              <span>ID/Agenda</span>
              <span>Sumber</span>
              <span>Pengirim/Pemohon</span>
              <span>Perihal</span>
              <span>Tanggal Diterima</span>
              <span>Tujuan Saat Ini</span>
              <span className="text-right">Status</span>
              <span className="text-right">Aksi</span>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="py-6 text-sm text-slate-500">Memuat surat...</div>
              ) : filteredLetters.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">Belum ada surat.</div>
              ) : (
                filteredLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid grid-cols-[1.2fr_1fr_1.6fr_1.6fr_1fr_1fr_0.8fr_0.5fr] items-center gap-3 py-3 text-sm text-slate-800"
                  >
                    <span className="font-semibold">{letter.id}</span>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600">{letter.sumber}</span>
                    <span className="text-slate-700">{letter.pemohon}</span>
                    <span>{letter.perihal}</span>
                    <span className="text-slate-600">{letter.tanggal}</span>
                    <span className="text-slate-700">{letter.tujuan}</span>
                    <span className={`text-right text-xs font-semibold ${statusBadge[letter.status]}`}>{letter.status}</span>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900" asChild>
                        <Link href={`/supervisor/penerima/detail?letterId=${letter.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <span>Showing {filteredLetters.length} of {letters.length}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-7 px-2 text-xs">
                  {"<"}
                </Button>
                <Button variant="outline" className="h-7 px-3 text-xs bg-slate-100 text-slate-900">
                  1
                </Button>
                <Button variant="outline" className="h-7 px-3 text-xs">
                  2
                </Button>
                <Button variant="outline" className="h-7 px-3 text-xs">
                  3
                </Button>
                <Button variant="outline" className="h-7 px-2 text-xs">
                  {">"}
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
