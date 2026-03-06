"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  FileSignature,
  User,
  FileText,
} from "lucide-react";

import RevisiModal from "@/components/manajerTU/revisi";
import TolakModal from "@/components/manajerTU/tolak";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterValues = {
  nama?: string;
  namaLengkap?: string;
  nim?: string;
  programStudi?: string;
  alamat?: string;
  semester?: string;
  tahunMulai?: string;
  tahunSelesai?: string;
  role?: string;
  roleName?: string;
  lampiran?: unknown;
  lampirans?: unknown;
  attachments?: unknown;
  email?: string;
  noHp?: string;
  nomorHp?: string;
  noHP?: string;
  nomorHP?: string;
  keperluan?: string;
  nomorSurat?: string;
  nomor?: string;
  sumber?: string;
};

type LetterApi = {
  id: string;
  status: string;
  createdAt: string;
  letterType?: {
    name?: string;
    description?: string;
  } | null;
  values?: LetterValues | null;
  createdBy?: {
    name?: string | null;
    email?: string | null;
    role?: { name?: string } | null;
    roleName?: string | null;
    userRole?: { role?: { name?: string } }[];
  } | null;
  lampirans?: unknown;
  attachments?: unknown;
};

type HistoryApi = {
  status: string;
  createdAt: string;
  note?: string | null;
};

type HistoryItem = {
  role: string;
  status: string;
  date: string;
  note: string;
  dotClass: string;
  pillClass: string;
};

/* ================= SMALL UI COMPONENTS ================= */

function CardSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>;
}

function InfoField({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function SideCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

const splitStatusText = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= 20) return [trimmed];
  const words = trimmed.split(/\s+/);
  if (words.length <= 2) return [trimmed];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};

/* ================= PAGE ================= */

export default function IdentitasPemohonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const letterId = searchParams.get("letterId");

  const loadLetter = useCallback(async () => {
    if (!letterId) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/letters/${letterId}?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) {
        setLetter(null);
        return;
      }
      const data = (await response.json()) as LetterApi;
      setLetter(data);
    } catch (error) {
      console.warn("Failed to load letter data", error);
    }
  }, [letterId]);

  const loadHistory = useCallback(async () => {
    if (!letterId) {
      setIsLoadingHistory(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
        credentials: "include",
      });
      if (!response.ok) {
        setHistory([]);
        return;
      }
      const data = (await response.json()) as HistoryApi[];
      const statusDot: Record<string, string> = {
        PENDING: "bg-blue-500",
        IN_PROGRESS: "bg-orange-500",
        COMPLETED: "bg-green-500",
        REJECTED: "bg-red-500",
        MANAGER_REJECTED: "bg-red-500",
      };
      const statusPill: Record<string, string> = {
        PENDING: "bg-blue-50 text-blue-700",
        IN_PROGRESS: "bg-orange-50 text-orange-700",
        COMPLETED: "bg-green-50 text-green-700",
        REJECTED: "bg-red-50 text-red-700",
        MANAGER_REJECTED: "bg-red-50 text-red-700",
      };
      const toLabel = (status: string) => {
        if (status === "PENDING") return "Menunggu";
        if (status === "IN_PROGRESS") return "Revisi";
        if (status === "COMPLETED") return "Selesai";
        if (status === "REJECTED" || status === "MANAGER_REJECTED") return "Ditolak";
        return status;
      };
      const toRole = (status: string) => {
        if (status === "PENDING") return "Mahasiswa";
        if (status === "IN_PROGRESS") return "Mahasiswa";
        if (status === "COMPLETED") return "Manajer TU";
        if (status === "REJECTED" || status === "MANAGER_REJECTED") return "Manajer TU";
        return "Manajer TU";
      };
      const mapped = data.map((item) => ({
        role: toRole(item.status),
        status: toLabel(item.status),
        date: new Date(item.createdAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        note: item.note ?? "-",
        dotClass: statusDot[item.status] ?? "bg-slate-400",
        pillClass: statusPill[item.status] ?? "bg-slate-100 text-slate-700",
      }));
      setHistory(mapped.reverse());
    } finally {
      setIsLoadingHistory(false);
    }
  }, [letterId]);

  useEffect(() => {
    loadLetter();
  }, [loadLetter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSubmitRevisi = async (target: string, note: string) => {
    if (!letterId) {
      alert("ID surat tidak ditemukan.");
      return;
    }
    const trimmed = note.trim();
    const notePayload = trimmed
      ? `${trimmed} (Target: ${target})`
      : `Revisi ke ${target}`;
    const response = await fetch(`${API_BASE}/letters/${letterId}/actions/manager`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REVISE",
        note: notePayload,
      }),
    });
    if (!response.ok) {
      alert("Gagal mengirim revisi. Silakan coba lagi.");
      return;
    }
    alert("Revisi berhasil dikirim.");
    setShowRevisiModal(false);
    loadLetter();
    loadHistory();
  };

  const handleSubmitTolak = async (note: string) => {
    if (!letterId) {
      alert("ID surat tidak ditemukan.");
      return;
    }
    const trimmed = note.trim();
    const response = await fetch(`${API_BASE}/letters/${letterId}/actions/manager`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REJECT",
        note: trimmed || "Ditolak oleh Manajer TU",
      }),
    });
    if (!response.ok) {
      alert("Gagal menolak surat. Silakan coba lagi.");
      return;
    }
    alert("Surat berhasil ditolak.");
    setShowTolakModal(false);
    loadLetter();
    loadHistory();
  };

  const values = letter?.values ?? null;
  const nomorSurat = values?.nomorSurat ?? values?.nomor ?? "-";
  const jenisKategori =
    [letter?.letterType?.name, letter?.letterType?.description].filter(Boolean).join(" / ") || "-";
  const createdAtLabel = letter?.createdAt
    ? new Date(letter.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
  const roleLabel = useMemo(() => {
    const role =
      letter?.createdBy?.userRole?.[0]?.role?.name ??
      letter?.createdBy?.role?.name ??
      letter?.createdBy?.roleName ??
      values?.roleName ??
      values?.role ??
      null;
    if (!role) {
      return "-";
    }
    if (role === "mahasiswa") return "Mahasiswa";
    if (role === "supervisor_akademik") return "Supervisor Akademik";
    if (role === "manager_tu") return "Manajer TU";
    if (role === "upa") return "UPA";
    return role.replace(/_/g, " ");
  }, [
    letter?.createdBy?.role?.name,
    letter?.createdBy?.roleName,
    letter?.createdBy?.userRole,
    values?.role,
    values?.roleName,
  ]);
  const noHp =
    values?.noHp ??
    values?.noHP ??
    values?.nomorHp ??
    values?.nomorHP ??
    "-";
  const headerSubtitle = `${letter?.letterType?.name ?? "Surat"} — ${nomorSurat}`;
  const letterIdParam = letterId;
  const tujuanSaatIni =
    letter?.status === "UPA_REVIEW"
      ? "UPA"
      : letter?.status === "COMPLETED"
      ? "Manajer TU"
      : letter?.status === "IN_PROGRESS"
      ? "Pemohon"
      : letter?.status === "PENDING"
      ? "Supervisor Akademik"
      : letter?.status === "REJECTED" || letter?.status === "MANAGER_REJECTED"
      ? "Manajer TU"
      : "Manajer TU";
  const tahunAkademik =
    values?.tahunMulai && values?.tahunSelesai
      ? `${values.tahunMulai} / ${values.tahunSelesai}`
      : values?.tahunMulai ?? values?.tahunSelesai ?? "-";
  const canAct = letter?.status === "COMPLETED";

  const lampiranList = useMemo(() => {
    const raw =
      letter?.lampirans ??
      letter?.attachments ??
      values?.lampirans ??
      values?.lampiran ??
      values?.attachments ??
      null;
    const output: { label: string; url?: string }[] = [];
    const pushItem = (item: unknown) => {
      if (!item) return;
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (!trimmed) return;
        const label = trimmed.split("/").pop() ?? trimmed;
        output.push({ label, url: trimmed });
        return;
      }
      if (typeof item === "object") {
        const anyItem = item as Record<string, unknown>;
        const url =
          (anyItem.url as string | undefined) ??
          (anyItem.link as string | undefined) ??
          (anyItem.link_lampiran as string | undefined) ??
          (anyItem.fileUrl as string | undefined);
        const label =
          (anyItem.name as string | undefined) ??
          (anyItem.filename as string | undefined) ??
          (anyItem.fileName as string | undefined) ??
          (url ? url.split("/").pop() : "Lampiran");
        output.push({ label: label ?? "Lampiran", url: url ?? undefined });
      }
    };
    if (Array.isArray(raw)) {
      raw.forEach(pushItem);
    } else if (typeof raw === "string") {
      raw.split(",").forEach((entry) => pushItem(entry));
    }
    return output;
  }, [letter?.attachments, letter?.lampirans, values?.attachments, values?.lampiran, values?.lampirans]);

  const isImageUrl = (url?: string) =>
    !!url && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url.split("?")[0] ?? "");

  return (
    <div className="space-y-6">
      {/* ===== BREADCRUMB ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/manajerTU/penerima" className="hover:text-blue-600">
            Surat Masuk
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">
            Identitas Pemohon
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Surat
            </h1>
            <p className="text-gray-600">
              {headerSubtitle}
            </p>
          </div>

          <Link
            href="/manajerTU/penerima"
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* LEFT */}
        <div className="space-y-6">
          <CardSection title="Identitas Pengaju" icon={<User className="w-5 h-5" />}>
            <InfoGrid>
              <InfoField label="Nama Lengkap" value={letter?.createdBy?.name ?? "-"} />
              <InfoField label="Role" value={roleLabel} />
              <InfoField label="NIM" value={values?.nim ?? "-"} />
              <InfoField label="Prodi" value={values?.programStudi ?? "-"} />
              <InfoField label="Email" value={letter?.createdBy?.email ?? values?.email ?? "-"} />
              <InfoField label="No. HP" value={noHp} />
            </InfoGrid>
          </CardSection>

          <CardSection title="Detail Surat" icon={<FileText className="w-5 h-5" />}>
            <InfoGrid>
              <InfoField label="Jenis & Kategori" value={jenisKategori} />
              <InfoField label="Tujuan" value={tujuanSaatIni} />
              <InfoField label="No Surat" value={nomorSurat} />
              <InfoField label="Perihal" value={letter?.letterType?.name ?? "-"} />
              <InfoField label="Diterima" value={createdAtLabel} />
              <InfoField label="Tahun Akademik" value={tahunAkademik} />
              <InfoField label="Semester" value={values?.semester ?? "-"} />
              <InfoField label="Alamat" value={values?.alamat ?? "-"} full />
              <InfoField label="Keperluan" value={values?.keperluan ?? "-"} full />
            </InfoGrid>
          </CardSection>

          <CardSection title="Lampiran">
            {lampiranList.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada lampiran.</div>
            ) : (
              <div className="space-y-4">
                {lampiranList.map((lampiran, index) => (
                  <div key={`${lampiran.label}-${index}`} className="space-y-2 text-sm">
                    <div className="text-slate-700">{lampiran.label}</div>
                    {lampiran.url && isImageUrl(lampiran.url) ? (
                      <div className="overflow-hidden rounded-lg border border-slate-200">
                        <img
                          src={lampiran.url}
                          alt={lampiran.label}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardSection>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <SideCard title="Pratinjau Surat" icon={<Eye className="w-5 h-5" />}>
            <button
              onClick={() =>
                router.push(
                  letterIdParam
                    ? `/manajerTU/pratinjau-surat?letterId=${letterIdParam}`
                    : "/manajerTU/pratinjau-surat"
                )
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm"
            >
              Buka Pratinjau
            </button>
          </SideCard>

          {canAct ? (
            <SideCard title="Aksi" icon={<FileSignature className="w-5 h-5" />}>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    router.push(
                      letterIdParam
                        ? `/manajerTU/beri-ttd?letterId=${letterIdParam}`
                        : "/manajerTU/beri-ttd"
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm"
                >
                  Beri Tanda Tangan
                </button>

                <button
                  onClick={() => setShowRevisiModal(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-sm"
                >
                  Ajukan Revisi
                </button>

                <button
                  onClick={() => setShowTolakModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm"
                >
                  Tolak Surat
                </button>
              </div>
            </SideCard>
          ) : null}

          <SideCard title={`Riwayat Surat (${history.length})`}>
            <div className="space-y-4 text-sm">
              {isLoadingHistory ? (
                <div className="text-slate-500">Memuat riwayat...</div>
              ) : history.length === 0 ? (
                <div className="text-slate-500">Belum ada riwayat.</div>
              ) : (
                history.map((item, idx) => (
                  <div key={`${item.role}-${item.date}-${idx}`} className="relative pl-5">
                    {idx < history.length - 1 ? (
                      <span className="absolute left-2 top-5 h-[calc(100%-16px)] w-px -translate-x-1/2 bg-slate-200" />
                    ) : null}
                    <span className={`absolute left-2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ${item.dotClass}`} />
                    <div className="font-semibold text-slate-900">{item.role}</div>
                    <div className="mt-1 text-xs text-slate-600">{item.date}</div>
                    <div className="mt-2 text-xs">
                      Status:
                      <div className="mt-1 flex flex-col items-start gap-1">
                        {splitStatusText(item.status).map((part, partIndex) => (
                          <span
                            key={partIndex}
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.pillClass}`}
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
                  </div>
                ))
              )}
            </div>
          </SideCard>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <RevisiModal
        open={showRevisiModal}
        onClose={() => setShowRevisiModal(false)}
        onSubmit={handleSubmitRevisi}
      />

      <TolakModal
        open={showTolakModal}
        onClose={() => setShowTolakModal(false)}
        onSubmit={handleSubmitTolak}
      />
    </div>
  );
}
