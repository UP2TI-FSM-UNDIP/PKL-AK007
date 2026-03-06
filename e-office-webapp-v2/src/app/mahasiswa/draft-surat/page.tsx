"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { Eye, Pencil, Send, Trash2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type DraftData = {
  namaLengkap?: string;
  role?: string;
  nim?: string;
  email?: string;
  departemen?: string;
  programStudi?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  noHp?: string;
  alamat?: string;
  keperluan?: string;
};

type Draft = {
  id: string;
  title?: string | null;
  data: DraftData;
  updatedAt: string;
};

export default function DraftSuratPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const response = await fetch(`${API_BASE}/drafts`, {
          credentials: "include",
        });
        if (!response.ok) {
          setDrafts([]);
          return;
        }
        const data = (await response.json()) as Draft[];
        setDrafts(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, []);

  const handleEditDraft = (draft: Draft) => {
    router.push(`/mahasiswa/identitas-pemohon?draftId=${draft.id}`);
  };

  const handleDeleteDraft = async (draft: Draft) => {
    await fetch(`${API_BASE}/drafts/${draft.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDrafts((prev) => prev.filter((item) => item.id !== draft.id));
  };

  const handleSubmitDraft = async (draft: Draft) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(draft.id);
    try {
      const response = await fetch(`${API_BASE}/letters`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id }),
      });
      if (!response.ok) {
        alert("Gagal mengajukan surat.");
        return;
      }
      router.push("/mahasiswa/surat-saya");
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="draft-surat" /> : null}
        <div className="relative flex-1">
          <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-6 py-8 pb-20">
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">Draft surat</p>
                  <h1 className="text-2xl font-bold text-slate-900">Draft Surat Keterangan Mahasiswa</h1>
                </div>
                <Button className="bg-[#0A77C8] hover:bg-[#085ea0]">Ajukan Surat</Button>
              </div>

              <Card className="border border-slate-200 bg-white p-4 shadow-sm">
                <Input placeholder="Cari surat..." className="mb-4" />
                <p className="mb-6 text-sm text-slate-600">
                  Menampilkan daftar semua surat draft keterangan mahasiswa yang belum diajukan
                </p>

                <div className="grid grid-cols-[minmax(220px,2fr)_minmax(220px,2fr)_160px_120px] items-center gap-6 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600">
                  <span>Keperluan Surat</span>
                  <span>Perihal</span>
                  <span className="whitespace-nowrap">Terakhir Diedit</span>
                  <span className="text-right">Aksi</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {isLoading ? (
                    <div className="py-6 text-sm text-slate-500">Memuat draft...</div>
                  ) : drafts.length === 0 ? (
                    <div className="py-6 text-sm text-slate-500">Belum ada draft.</div>
                  ) : (
                    drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="grid grid-cols-[minmax(220px,2fr)_minmax(220px,2fr)_160px_120px] items-center gap-6 py-3 text-sm text-slate-800"
                      >
                        <span className="truncate font-semibold">{draft.data?.keperluan ?? "-"}</span>
                        <span className="truncate">{draft.title ?? "Surat Keterangan Mahasiswa"}</span>
                        <span className="whitespace-nowrap text-slate-600">
                          {new Date(draft.updatedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            asChild
                          >
                            <Link href={`/mahasiswa/pratinjau-surat?draftId=${draft.id}`} aria-label="Lihat surat">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            onClick={() => handleSubmitDraft(draft)}
                            aria-label="Ajukan surat"
                            disabled={isSubmitting === draft.id}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-[#0A77C8] text-[#0A77C8] hover:bg-[#0A77C8]/5"
                            onClick={() => handleEditDraft(draft)}
                            aria-label="Edit surat"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => handleDeleteDraft(draft)}
                            aria-label="Hapus surat"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 text-xs text-slate-600">
                  Showing {drafts.length} of {drafts.length}
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 text-xs text-slate-700">
                  <Button variant="outline" className="h-7 px-2 text-xs">{"<"}</Button>
                  <Button variant="outline" className="h-7 px-2 text-xs bg-slate-100 text-slate-900">1</Button>
                  <Button variant="outline" className="h-7 px-2 text-xs">2</Button>
                  <Button variant="outline" className="h-7 px-2 text-xs">3</Button>
                  <Button variant="outline" className="h-7 px-2 text-xs">{">"}</Button>
                </div>
              </Card>
            </div>
          </main>

          <footer className="absolute bottom-4 left-6 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>© 2025 UPTI FSM UNDIP. All Rights Reserved.</span>
              <a className="font-semibold text-[#0A77C8]" href="#">
                Support
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="text-lg" aria-hidden>
        •
      </span>
      {label}
    </Link>
  );
}
