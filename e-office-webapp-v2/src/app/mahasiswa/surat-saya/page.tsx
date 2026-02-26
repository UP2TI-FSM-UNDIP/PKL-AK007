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
  tujuan: string;
  status: "Surat diajukan ke Supervisor Akademik" | "Surat diajukan ke Manajer TU" | "Surat perlu revisi" | "Surat ditolak oleh Supervisor";
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
  values?: {
    keperluan?: string;
  } | null;
};

const statusStyle: Record<LetterRow["status"], { dot: string; text: string }> = {
  "Surat diajukan ke Supervisor Akademik": { dot: "bg-blue-500", text: "text-blue-700" },
  "Surat diajukan ke Manajer TU": { dot: "bg-green-500", text: "text-green-700" },
  "Surat perlu revisi": { dot: "bg-orange-500", text: "text-orange-700" },
  "Surat ditolak oleh Supervisor": { dot: "bg-red-500", text: "text-red-700" },
};

export default function SuratSayaPage() {
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar />
      <div className="flex flex-1">
        <StudentSidebar active="surat-saya" />

        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Surat Saya</p>
              <h1 className="text-2xl font-bold text-slate-900">Surat Keterangan Mahasiswa</h1>
            </div>
            <Button className="bg-[#0A77C8] hover:bg-[#085ea0]" asChild>
              <Link href="/mahasiswa/student-letter-management">Ajukan Surat</Link>
            </Button>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <Input placeholder="Cari surat..." className="h-8 border-0 p-0 text-sm focus-visible:ring-0" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50">
                  Cari
                </Button>
                <Button variant="outline" className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50">
                  + Ajukan Surat
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Rentang Tanggal</label>
                <Input type="date" className="w-full" defaultValue="2023-08-05" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Tanggal Selesai</label>
                <Input type="date" className="w-full" defaultValue="2023-08-25" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                <select className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]">
                  <option>Semua Status</option>
                  <option>Surat diajukan ke Supervisor Akademik</option>
                  <option>Surat diajukan ke Manajer TU</option>
                  <option>Surat perlu revisi</option>
                  <option>Surat ditolak oleh Supervisor</option>
                </select>
              </div>
              <div className="flex items-end justify-end">
                <Button className="bg-[#0A77C8] text-white hover:bg-[#085ea0]">
                  Cari
                </Button>
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
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="grid grid-cols-[1.4fr_1.7fr_1fr_1.2fr_1fr_0.6fr] items-center gap-3 py-3 text-sm text-slate-800"
                  >
                    <span className="font-semibold">{letter.keperluan}</span>
                    <span>{letter.perihal}</span>
                    <span className="text-slate-600">{letter.tanggalDiajukan}</span>
                    <span className="text-slate-700">{letter.tujuan}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusStyle[letter.status].dot}`} />
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
      <footer className="flex items-center justify-between px-6 pb-6 text-xs text-slate-500">
        <span>© 2025 UPTI FSM UNDIP. All Rights Reserved.</span>
        <a className="font-semibold text-[#0A77C8]" href="#">
          Support
        </a>
      </footer>
    </div>
  );
}
