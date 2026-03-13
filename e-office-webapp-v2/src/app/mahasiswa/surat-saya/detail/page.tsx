"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { StudentSidebar } from "@/components/student/StudentSidebar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type HistoryApi = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  note?: string | null;
  createdAt: string;
  actor?: {
    name?: string | null;
  } | null;
};

type HistoryItem = {
  role: string;
  status: string;
  date: string;
  note: string;
  dotClass: string;
  pillClass: string;
};

type LetterApi = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  createdAt: string;
  values?: Record<string, unknown> | null;
  letterType?: {
    name: string;
    description?: string | null;
  } | null;
  createdBy?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

const statusLabel: Record<HistoryApi["status"], string> = {
  PENDING: "Surat diajukan ke Supervisor Akademik",
  IN_PROGRESS: "Surat perlu revisi",
  COMPLETED: "Surat diajukan ke Manajer TU",
  REJECTED: "Surat ditolak oleh Supervisor",
};

const statusDot: Record<HistoryApi["status"], string> = {
  PENDING: "bg-blue-400",
  IN_PROGRESS: "bg-orange-400",
  COMPLETED: "bg-green-500",
  REJECTED: "bg-red-500",
};

const statusPill: Record<HistoryApi["status"], string> = {
  PENDING: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-orange-50 text-orange-700",
  COMPLETED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

const getStatusText = (status: HistoryApi["status"], note?: string | null) => {
  return statusLabel[status];
};

const getRoleLabel = (status: HistoryApi["status"]) => {
  if (status === "PENDING") {
    return "Mahasiswa";
  }
  if (status === "IN_PROGRESS" || status === "COMPLETED" || status === "REJECTED") {
    return "Supervisor Akademik";
  }
  return "Mahasiswa";
};

const splitStatusText = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= 20) return [trimmed];
  const words = trimmed.split(/\s+/);
  if (words.length <= 2) return [trimmed];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};

const readValue = (values: Record<string, unknown> | null | undefined, key: string) => {
  const value = values?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
};

export default function SuratSayaDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const letterId = searchParams?.get("letterId");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!letterId) {
      setIsLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const [letterResponse, historyResponse] = await Promise.all([
          fetch(`${API_BASE}/letters/${letterId}`, { credentials: "include" }),
          fetch(`${API_BASE}/letters/${letterId}/history`, { credentials: "include" }),
        ]);

        if (letterResponse.ok) {
          const letterData = (await letterResponse.json()) as LetterApi;
          setLetter(letterData);
        }

        if (historyResponse.ok) {
          const data = (await historyResponse.json()) as HistoryApi[];
          const mapped = data.map((item) => ({
            role: getRoleLabel(item.status),
            status: getStatusText(item.status, item.note),
            date: new Date(item.createdAt).toLocaleString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            note: item.note ?? "Tidak ada catatan",
            dotClass: statusDot[item.status],
            pillClass: statusPill[item.status],
          }));
          setHistory(mapped.reverse());
        } else {
          setHistory([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [searchParams]);

  const showRevision = letter?.status === "IN_PROGRESS";
  const showResubmit = letter?.status === "REJECTED";
  const handleRevision = () => {
    if (!letterId) return;
    sessionStorage.setItem("revisionLetterId", letterId);
    router.push(`/mahasiswa/identitas-pemohon?letterId=${letterId}&revision=1`);
  };
  const handleResubmit = () => {
    if (!letterId) return;
    sessionStorage.setItem("resubmitLetterId", letterId);
    router.push(`/mahasiswa/identitas-pemohon?letterId=${letterId}&resubmit=1`);
  };

  const values = letter?.values ?? null;
  const namaLengkap = readValue(values, "nama");
  const nim = readValue(values, "nim");
  const programStudi = readValue(values, "programStudi");
  const alamat = readValue(values, "alamat");
  const semester = readValue(values, "semester");
  const keperluan = readValue(values, "keperluan");
  const tahunMulai = readValue(values, "tahunMulai");
  const tahunSelesai = readValue(values, "tahunSelesai");
  const tanggalLahir = readValue(values, "tanggalLahir");

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="surat-saya" /> : null}

        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-4 px-6 py-6">
          <h1 className="text-lg font-semibold text-slate-900">Detail Surat</h1>

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Identitas Pengaju</h2>
                  <InfoRow label="Nama Lengkap" value={namaLengkap ?? letter?.createdBy?.name ?? "Ahmad Douglas"} />
                  <InfoRow label="Role" value="Mahasiswa" />
                  <InfoRow label="NIM" value={nim ?? "24060131130063"} />
                  <InfoRow label="Program Studi" value={programStudi ?? "S1 - Informatika"} />
                  <InfoRow label="Email" value={letter?.createdBy?.email ?? "ahmaddouglas@students.undip.ac.id"} />
                  <InfoRow label="No. HP" value="091239102390123" />
                  <InfoRow label="Tanggal Lahir" value={tanggalLahir ?? "-"} />
                </div>

                <div className="mt-6 space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Detail Surat</h2>
                  <InfoRow
                    label="Jenis & Kategori"
                    value={`Surat Keterangan / ${letter?.letterType?.name ?? "Surat Keterangan Mahasiswa"}`}
                  />
                  <InfoRow label="Tujuan" value="Mahasiswa" />
                  <InfoRow label="No Surat" value="INV/2024/X/102" />
                  <InfoRow label="Perihal" value={letter?.letterType?.name ?? "Surat Keterangan Mahasiswa"} />
                  <InfoRow
                    label="Diterima"
                    value={
                      letter
                        ? new Date(letter.createdAt).toISOString().slice(0, 10)
                        : "2024-10-26"
                    }
                  />
                  <InfoRow label="Tahun Akademik" value={`${tahunMulai ?? "2024"} / ${tahunSelesai ?? "2025"}`} />
                  <InfoRow label="Semester" value={semester ?? "4 (Empat)"} />
                  <InfoRow label="Alamat" value={alamat ?? "Semarang, Jawa Tengah"} />
                  <InfoRow
                    label="Keperluan"
                    value={keperluan ?? "Sebagai syarat administratif untuk pencairan tunjangan orang tua."}
                    multiline
                  />
                </div>
              </section>

              <SectionCard title="Lampiran">
                <div className="text-sm font-semibold text-slate-900">KTM - KTM_24060121120001.pdf</div>
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=1000&q=80"
                    alt="Lampiran"
                    width={1000}
                    height={800}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </SectionCard>
            </section>

            <section className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">Aksi</h3>
                <div className="mt-3 space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link href={letterId ? `/mahasiswa/pratinjau-surat?letterId=${letterId}` : "/mahasiswa/pratinjau-surat"}>
                      Preview
                    </Link>
                  </Button>
                  <Button className="w-full bg-[#0A77C8] hover:bg-[#085ea0]">Download</Button>
                  {showRevision ? (
                    <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleRevision}>
                      Revisi
                    </Button>
                  ) : null}
                  {showResubmit ? (
                    <Button className="w-full bg-[#0A77C8] hover:bg-[#085ea0]" onClick={handleResubmit}>
                      Ajukan Lagi
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600">📅</div>
                  <h3 className="text-sm font-semibold text-slate-900">Riwayat Surat ({history.length})</h3>
                </div>
                <Separator className="bg-slate-200" />
                <div className="mt-4 space-y-6">
                  {isLoading ? (
                    <div className="text-sm text-slate-500">Memuat riwayat...</div>
                  ) : history.length === 0 ? (
                    <div className="text-sm text-slate-500">Belum ada riwayat.</div>
                  ) : (
                    history.map((item, idx) => (
                      <div key={`${item.role}-${item.date}`} className="relative pl-6 text-sm text-slate-800">
                        {idx < history.length - 1 ? (
                          <span className="absolute left-2 top-5 h-[calc(100%-20px)] w-px -translate-x-1/2 bg-slate-200" aria-hidden />
                        ) : null}
                        <span
                          className={`absolute left-2 top-2 inline-block h-3 w-3 -translate-x-1/2 rounded-full ${item.dotClass}`}
                          aria-hidden
                        />

                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-slate-500">👤</span>
                          {item.role}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                          <span className="text-slate-500">⏱</span>
                          <span>{item.date}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-700">
                          Status:
                          <div className="mt-1 flex flex-col items-start gap-1">
                            {splitStatusText(item.status).map((part, partIndex) => (
                              <span
                                key={partIndex}
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${item.pillClass}`}
                              >
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-600">Catatan:</div>
                        <div className="mt-1 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          {item.note}
                        </div>

                        {idx !== history.length - 1 && <div className="mt-4" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <button className="text-xs text-slate-500">▼</button>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 text-sm text-gray-800 sm:grid-cols-2">{children}</div>;
}

function Row({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <span className="text-gray-600">{label}</span>
        <span className="text-right font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}

function InfoRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="border-b border-gray-200 pb-3 last:border-b-0">
      <div className="flex items-start justify-between gap-4 text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`text-right font-semibold text-gray-900 ${multiline ? "max-w-xl" : ""}`}>{value}</span>
      </div>
    </div>
  );
}
