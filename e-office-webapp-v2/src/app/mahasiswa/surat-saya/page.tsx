"use client";

import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { StudentSidebar } from "@/components/student/StudentSidebar";

type LetterRow = {
  id: string;
  perihal: string;
  keperluan: string;
  tanggalDiajukan: string;
  createdAt: string;
  tujuan: string;
  status:
    | "Surat diajukan ke Supervisor Akademik"
    | "Surat diajukan ke Manajer TU"
    | "Surat diajukan ke UPA"
    | "Surat perlu revisi"
    | "Surat sudah selesai"
    | "Surat ditolak oleh Supervisor"
    | "Surat ditolak oleh Manajer TU";
};

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
  } | null;
};

const statusStyle: Record<LetterRow["status"], { dot: string; text: string }> = {
  "Surat diajukan ke Supervisor Akademik": { dot: "bg-blue-500", text: "text-blue-700" },
  "Surat diajukan ke Manajer TU": { dot: "bg-green-500", text: "text-green-700" },
  "Surat diajukan ke UPA": { dot: "bg-indigo-500", text: "text-indigo-700" },
  "Surat perlu revisi": { dot: "bg-orange-500", text: "text-orange-700" },
  "Surat sudah selesai": { dot: "bg-emerald-500", text: "text-emerald-700" },
  "Surat ditolak oleh Supervisor": { dot: "bg-red-500", text: "text-red-700" },
  "Surat ditolak oleh Manajer TU": { dot: "bg-rose-500", text: "text-rose-700" },
};

export default function SuratSayaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const response = await fetch(`${API_BASE}/letters`, {
          credentials: "include",
        });
        if (!response.ok) {
          setLetters([]);
          return;
        }
        const data = (await response.json()) as LetterApi[];
        const mapped = data.map((item) => ({
          id: item.id,
          perihal: item.letterType?.name ?? "Surat Keterangan Mahasiswa",
          keperluan: item.values?.keperluan ?? "-",
          tanggalDiajukan: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          createdAt: item.createdAt,
          tujuan:
            item.status === "PENDING"
              ? "Supervisor Akademik"
              : item.status === "COMPLETED"
              ? "Manajer TU"
              : item.status === "IN_PROGRESS"
              ? "Mahasiswa"
              : item.status === "UPA_REVIEW"
              ? "UPA"
              : item.status === "DONE"
              ? "Mahasiswa"
              : "Supervisor Akademik",
          status:
            item.status === "PENDING"
              ? "Surat diajukan ke Supervisor Akademik"
              : item.status === "IN_PROGRESS"
              ? "Surat perlu revisi"
              : item.status === "COMPLETED"
              ? "Surat diajukan ke Manajer TU"
              : item.status === "UPA_REVIEW"
              ? "Surat diajukan ke UPA"
              : item.status === "DONE"
              ? "Surat sudah selesai"
              : item.status === "MANAGER_REJECTED"
              ? "Surat ditolak oleh Manajer TU"
              : "Surat ditolak oleh Supervisor",
        }));
        const hasActive = new Map<string, boolean>();
        mapped.forEach((row) => {
          if (
            row.status === "Surat diajukan ke Supervisor Akademik" ||
            row.status === "Surat diajukan ke Manajer TU"
          ) {
            hasActive.set(`${row.perihal}::${row.keperluan}`, true);
          }
        });
        const filtered = mapped.filter((row) => {
          const key = `${row.perihal}::${row.keperluan}`;
          if (row.status === "Surat perlu revisi" && hasActive.get(key)) {
            return false;
          }
          return true;
        });
        setLetters(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, []);

  const filteredLetters = letters.filter((letter) => {
    const combined = `${letter.keperluan} ${letter.perihal}`.toLowerCase();
    if (searchText.trim() && !combined.includes(searchText.trim().toLowerCase())) {
      return false;
    }
    if (statusFilter !== "Semua Status" && letter.status !== statusFilter) {
      return false;
    }
    if (dateFrom) {
      const createdDate = letter.createdAt.slice(0, 10);
      if (createdDate < dateFrom) return false;
    }
    if (dateTo) {
      const createdDate = letter.createdAt.slice(0, 10);
      if (createdDate > dateTo) return false;
    }
    return true;
  });
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLetters.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const pagedLetters = filteredLetters.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, dateFrom, dateTo, statusFilter, letters.length]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="surat-saya" /> : null}

        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Surat Saya</p>
              <h1 className="text-2xl font-bold text-slate-900">Surat Keterangan Mahasiswa</h1>
            </div>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari surat..."
                  className="h-8 border-0 p-0 text-sm focus-visible:ring-0"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50">
                  Cari
                </Button>
                <Button variant="outline" className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50" asChild>
                  <Link href="/mahasiswa/identitas-pemohon">+ Ajukan Surat</Link>
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Rentang Tanggal</label>
                <Input type="date" className="w-full" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Tanggal Selesai</label>
                <Input type="date" className="w-full" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                <select
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option>Semua Status</option>
                  <option>Surat diajukan ke Supervisor Akademik</option>
                  <option>Surat diajukan ke Manajer TU</option>
                  <option>Surat diajukan ke UPA</option>
                  <option>Surat perlu revisi</option>
                  <option>Surat sudah selesai</option>
                  <option>Surat ditolak oleh Supervisor</option>
                  <option>Surat ditolak oleh Manajer TU</option>
                </select>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-[1.4fr_1.7fr_1fr_1.2fr_1fr_0.6fr] items-center gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600">
              <span>Keperluan Surat</span>
              <span>Perihal</span>
              <span>Tanggal Diajukan</span>
              <span>Tujuan Saat Ini</span>
              <span>Status</span>
              <span className="text-right">Aksi</span>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="py-6 text-sm text-slate-500">Memuat surat...</div>
              ) : letters.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">Belum ada surat.</div>
              ) : filteredLetters.length === 0 ? (
                <div className="py-6 text-sm text-slate-500">Tidak ada surat yang sesuai filter.</div>
              ) : (
                pagedLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid grid-cols-[1.4fr_1.7fr_1fr_1.2fr_1fr_0.6fr] items-center gap-3 py-3 text-sm text-slate-800"
                  >
                    <span className="font-semibold">{letter.keperluan}</span>
                    <span>{letter.perihal}</span>
                    <span className="text-slate-600">{letter.tanggalDiajukan}</span>
                    <span className="text-slate-700">{letter.tujuan}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${statusStyle[letter.status].dot}`}
                      />
                      <span className={`text-xs font-semibold ${statusStyle[letter.status].text}`}>{letter.status}</span>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900" asChild>
                        <Link href={`/mahasiswa/surat-saya/detail?letterId=${letter.id}`}>
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
                <Button
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  {"<"}
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Button
                    key={page}
                    variant="outline"
                    className={`h-7 px-3 text-xs ${page === currentPage ? "bg-slate-100 text-slate-900" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  {">"}
                </Button>
              </div>
            </div>
          </Card>

          <footer className="mt-6 flex items-center justify-between text-xs text-slate-500">
            <span>© 2025 UPTI FSM UNDIP. All Rights Reserved.</span>
            <a className="font-semibold text-[#0A77C8]" href="#">
              Support
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
