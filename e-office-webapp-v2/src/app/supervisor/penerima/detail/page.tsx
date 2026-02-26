"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { applicant } from "@/data/applicant";

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

const getStatusText = (status: HistoryApi["status"]) => statusLabel[status];

const getRoleLabel = (status: HistoryApi["status"]) => {
  if (status === "PENDING") {
    return "Mahasiswa";
  }
  if (status === "IN_PROGRESS" || status === "COMPLETED" || status === "REJECTED") {
    return "Supervisor Akademik";
  }
  return "Mahasiswa";
};

const readValue = (values: Record<string, unknown> | null | undefined, key: string) => {
  const value = values?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
};

export default function SupervisorDetailSurat() {
  const searchParams = useSearchParams();
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [showApprove, setShowApprove] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    const letterId = searchParams.get("letterId");
    if (!letterId) {
      setIsLoading(false);
      return;
    }

    try {
      const [letterResponse, historyResponse] = await Promise.all([
        fetch(`${API_BASE}/letters/${letterId}?scope=all`, { credentials: "include" }),
        fetch(`${API_BASE}/letters/${letterId}/history?scope=all&merge=1`, {
          credentials: "include",
        }),
      ]);

      if (letterResponse.ok) {
        const letterData = (await letterResponse.json()) as LetterApi;
        setLetter(letterData);
      }

      if (historyResponse.ok) {
        const data = (await historyResponse.json()) as HistoryApi[];
          const mapped = data.map((item) => ({
            role: getRoleLabel(item.status),
            status: getStatusText(item.status),
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

  useEffect(() => {
    loadHistory();
  }, [searchParams]);

  const values = letter?.values ?? null;
  const namaLengkap = readValue(values, "nama");
  const nim = readValue(values, "nim");
  const programStudi = readValue(values, "programStudi");
  const alamat = readValue(values, "alamat");
  const semester = readValue(values, "semester");
  const keperluan = readValue(values, "keperluan");
  const tahunMulai = readValue(values, "tahunMulai");
  const tahunSelesai = readValue(values, "tahunSelesai");

  const handleHistorySubmit = async (status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED", note?: string) => {
    const letterId = searchParams.get("letterId");
    if (!letterId) return;

    await fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        note,
      }),
    });

    setLetter((prev) => (prev ? { ...prev, status } : prev));
    await loadHistory();
  };

  const isActionLocked = letter?.status ? letter.status !== "PENDING" : false;

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
          <div className="text-sm text-slate-500">Surat Masuk / Penerima / Identitas Pemohon</div>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              <CardSection title="Identitas Pengaju">
                <Grid>
                  <Row label="Nama Lengkap" value={applicant.fullName ?? "Ahmad Douglas"} />
                  <Row label="Role" value="Mahasiswa" />
                  <Row label="NIM" value={nim ?? applicant.nim ?? "24060131130063"} />
                  <Row label="Program Studi" value={programStudi ?? applicant.studyProgram ?? "S1 - Informatika"} />
                  <Row label="Email" value={letter?.createdBy?.email ?? applicant.email ?? "ahmaddouglas@students.undip.ac.id"} />
                  <Row label="No. HP" value="091239102390123" />
                </Grid>
              </CardSection>

              <CardSection title="Detail Surat">
                <Grid>
                  <Row label="Jenis & Kategori" value="Surat Keterangan / Surat Keterangan Mahasiswa" />
                  <Row label="Tujuan" value="Manager TU" />
                  <Row label="No Surat" value="INV/2024/X/102" />
                  <Row label="Perihal" value={letter?.letterType?.name ?? "Surat Keterangan Mahasiswa"} />
                  <Row
                    label="Diterima"
                    value={letter ? new Date(letter.createdAt).toISOString().slice(0, 10) : "2024-10-26"}
                  />
                  <Row label="Tahun Akademik" value={`${tahunMulai ?? "2024"} / ${tahunSelesai ?? "2025"}`} />
                  <Row label="Semester" value={semester ?? "4 (Empat)"} />
                  <Row label="Alamat" value={alamat ?? "Semarang, Jawa Tengah"} full />
                  <Row label="Keperluan" value={keperluan ?? "Sebagai syarat administratif untuk pencairan tunjangan orang tua."} full />
                </Grid>
              </CardSection>

              <CardSection title="Lampiran">
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
              </CardSection>
            </section>

            <section className="space-y-4">
              <CardSection title="Pratinjau Surat">
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href={letter ? `/supervisor/pratinjau-surat?letterId=${letter.id}` : "/supervisor/pratinjau-surat"}>
                    Buka Pratinjau
                  </Link>
                </Button>
              </CardSection>

              <CardSection title="Aksi">
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setShowApprove(true)}
                    disabled={isActionLocked}
                  >
                    Setujui
                  </Button>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setShowRevision(true)}
                    disabled={isActionLocked}
                  >
                    Revisi
                  </Button>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setShowReject(true)}
                    disabled={isActionLocked}
                  >
                    Tolak
                  </Button>
                </div>
              </CardSection>

              <CardSection>
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
                          className={`absolute left-2 top-2 h-3 w-3 -translate-x-1/2 rounded-full ${item.dotClass}`}
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
                          Status:{" "}
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${item.pillClass}`}>
                            {item.status}
                          </span>
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
              </CardSection>
            </section>
          </div>
        </main>
      </div>

      {showApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Verifikasi</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Nama Surat</div>
                  <div className="font-semibold text-slate-900">Pengajuan Surat Keterangan Mahasiswa</div>
                </div>
                <div>
                  <div className="text-slate-500">Jenis Surat</div>
                  <div className="font-semibold text-slate-900">Internal</div>
                </div>
              </div>
              <div className="text-sm text-slate-700">Yakin ingin memverifikasi surat ini?</div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowApprove(false)}
              >
                Kembali
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("COMPLETED");
                  setShowApprove(false);
                }}
              >
                Setujui Surat
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Tolak</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Nama Surat</div>
                  <div className="font-semibold text-slate-900">Pengajuan Surat Keterangan Mahasiswa</div>
                </div>
                <div>
                  <div className="text-slate-500">Jenis Surat</div>
                  <div className="font-semibold text-slate-900">Surat Keterangan</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">Berikan catatan penolakan...</div>
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]"
                  rows={3}
                  placeholder="Tambahkan catatan..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setShowReject(false)}>
                Kembali
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("REJECTED", rejectNote);
                  setShowReject(false);
                  setRejectNote("");
                }}
              >
                Kirim Penolakan
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Revisi</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Nama Surat</div>
                  <div className="font-semibold text-slate-900">Pengajuan Surat Keterangan Mahasiswa</div>
                </div>
                <div>
                  <div className="text-slate-500">Jenis Surat</div>
                  <div className="font-semibold text-slate-900">Surat Keterangan</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">Pilih Target Revisi</div>
                <select
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
                  defaultValue="Mahasiswa"
                >
                  <option value="Mahasiswa">Mahasiswa</option>
                </select>
                <div className="text-slate-500 text-xs">
                  Ketika surat direvisi, surat akan dikirim kembali ke target tersebut.
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">Berikan catatan revisi...</div>
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]"
                  rows={3}
                  placeholder="Tambahkan catatan..."
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowRevision(false)}
              >
                Kembali
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("IN_PROGRESS", revisionNote);
                  setShowRevision(false);
                  setRevisionNote("");
                }}
              >
                Kirim Revisi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      {title ? (
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
      ) : null}
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
