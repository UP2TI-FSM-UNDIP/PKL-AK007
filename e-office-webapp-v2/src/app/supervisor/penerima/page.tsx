"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";

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
  tujuan: string;
  status: "Surat diajukan ke Supervisor Akademik" | "Surat diajukan ke Manajer TU" | "Surat perlu revisi" | "Surat ditolak oleh Supervisor";
  createdAt: string;
};

const statusBadge: Record<string, string> = {
  "Surat diajukan ke Supervisor Akademik": "text-blue-700",
  "Surat diajukan ke Manajer TU": "text-green-700",
  "Surat perlu revisi": "text-orange-700",
  "Surat ditolak oleh Supervisor": "text-red-700",
};

export default function SupervisorPenerimaPage() {
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          keperluan: item.values?.keperluan ?? "-",
          createdAt: item.createdAt,
          tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          tujuan: "Supervisor Akademik",
          status:
            item.status === "PENDING"
              ? "Surat diajukan ke Supervisor Akademik"
              : item.status === "IN_PROGRESS"
              ? "Surat perlu revisi"
              : item.status === "COMPLETED"
              ? "Surat diajukan ke Manajer TU"
              : "Surat ditolak oleh Supervisor",
        }));
        const latestActive = new Map<string, number>();
        mapped.forEach((row) => {
          if (
            row.status === "Surat diajukan ke Supervisor Akademik" ||
            row.status === "Surat diajukan ke Manajer TU"
          ) {
            const key = `${row.pemohon}::${row.perihal}`;
            const createdTime = new Date(row.createdAt).getTime();
            const current = latestActive.get(key) ?? 0;
            if (createdTime > current) {
              latestActive.set(key, createdTime);
            }
          }
        });
        const filtered = mapped.filter((row) => {
          const key = `${row.pemohon}::${row.perihal}`;
          if (row.status === "Surat perlu revisi") {
            const activeTime = latestActive.get(key);
            if (activeTime && new Date(row.createdAt).getTime() < activeTime) {
              return false;
            }
            return true;
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
        <SupervisorSidebar active="penerima" />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="text-sm text-slate-500">Surat masuk / Penerima</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Penerima</h1>
            <p className="text-sm text-slate-600">Filter Pencarian</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
            <FilterCard title="Informasi Pemohon">
              <Input placeholder="Masukkan nama pemohon" className="h-9 text-sm" />
              <Input placeholder="Pilih departemen" className="h-9 text-sm" />
              <Input placeholder="Nama instansi pengirim" className="h-9 text-sm" />
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Reset
                </Button>
                <Button className="bg-[#0A77C8] hover:bg-[#085ea0]">Cari</Button>
              </div>
            </FilterCard>

            <FilterCard title="Informasi Surat">
              <Input placeholder="Pilih klasifikasi" className="h-9 text-sm" />
              <Input placeholder="Sifat Surat" className="h-9 text-sm" />
            </FilterCard>

            <FilterCard title="Periode Waktu">
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" className="h-9 text-sm" placeholder="Start date" />
                <Input type="date" className="h-9 text-sm" placeholder="End date" />
              </div>
            </FilterCard>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Semua Surat</h2>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex w-56 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <Search className="h-4 w-4 text-slate-400" />
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

            <div className="mt-4">
              <div className="grid grid-cols-[1.4fr_0.9fr_1.4fr_1.1fr_0.9fr_1.2fr_0.9fr_0.4fr] items-center gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600">
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
                ) : letters.length === 0 ? (
                  <div className="py-6 text-sm text-slate-500">Belum ada surat.</div>
                ) : (
                  letters.map((letter) => (
                    <div
                      key={letter.id}
                      className="grid grid-cols-[1.4fr_0.9fr_1.4fr_1.1fr_0.9fr_1.2fr_0.9fr_0.4fr] items-center gap-3 py-3 text-sm text-slate-800"
                    >
                      <span className="font-semibold truncate">{letter.id}</span>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 text-center">
                        {letter.sumber}
                      </span>
                      <span className="text-slate-700 truncate">{letter.pemohon}</span>
                      <span className="truncate">{letter.perihal}</span>
                      <span className="text-slate-600 truncate">{letter.tanggal}</span>
                      <span className="text-slate-700 truncate">{letter.tujuan}</span>
                      <span className={`text-right text-xs font-semibold ${statusBadge[letter.status]}`}>
                        {letter.status}
                      </span>
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
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
              <span>Showing {letters.length} of 100</span>
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

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="rounded-md bg-[#0A77C8] px-3 py-2 text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 space-y-2">{children}</div>
    </Card>
  );
}
