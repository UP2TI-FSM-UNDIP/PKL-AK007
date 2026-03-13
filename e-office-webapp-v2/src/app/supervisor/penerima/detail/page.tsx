"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { useUiPreferences } from "@/components/common/useUiPreferences";

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
    userRole?: { role?: { name?: string } }[];
    mahasiswa?: {
      tahunMasuk?: string | number | null;
      angkatan?: string | number | null;
    } | null;
  } | null;
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

const readValue = (values: Record<string, unknown> | null | undefined, key: string) => {
  const value = values?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
};

const readValueFrom = (values: Record<string, unknown> | null | undefined, keys: string[]) => {
  for (const key of keys) {
    const value = readValue(values, key);
    if (value) return value;
  }
  return undefined;
};

const formatRoleName = (role?: string) => {
  if (!role) return "";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getAcademicYearStart = (date: Date) => {
  const month = date.getMonth() + 1;
  return month <= 6 ? date.getFullYear() - 1 : date.getFullYear();
};

const parseEntryYear = (value?: string | number | null) => {
  if (value === null || typeof value === "undefined") return null;
  const trimmed = String(value).trim();
  if (/^\d{4}$/.test(trimmed)) {
    return Number(trimmed);
  }
  return null;
};


const getSemesterNumber = (entryYear: number | null, date: Date) => {
  if (!entryYear) return null;
  const currentYear = date.getFullYear();
  const diffYears = currentYear - entryYear;
  if (diffYears < 0) return null;
  const month = date.getMonth() + 1;
  const base = diffYears * 2;
  const raw = month <= 6 ? base + 2 : base + 1;
  if (raw < 1) return null;
  return Math.min(raw, 14);
};

const spellNumberId = (value: number) => {
  const mapping: Record<number, string> = {
    1: "Satu",
    2: "Dua",
    3: "Tiga",
    4: "Empat",
    5: "Lima",
    6: "Enam",
    7: "Tujuh",
    8: "Delapan",
    9: "Sembilan",
    10: "Sepuluh",
    11: "Sebelas",
    12: "Dua Belas",
    13: "Tiga Belas",
    14: "Empat Belas",
  };
  return mapping[value] ?? `${value}`;
};

export default function SupervisorDetailSurat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showRevision, setShowRevision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [showApprove, setShowApprove] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [letter, setLetter] = useState<LetterApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useUiPreferences();

  const getStatusText = (status: HistoryApi["status"]) => {
    if (status === "PENDING") return t("pendingStatus");
    if (status === "IN_PROGRESS") return t("revisionStatus");
    if (status === "COMPLETED") return t("completedStatus");
    return t("rejectedStatus");
  };

  const getRoleLabel = (status: HistoryApi["status"]) => {
    if (status === "PENDING") {
      return t("studentRole");
    }
    return t("supervisorRole");
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

  const loadHistory = async () => {
    const letterId = searchParams?.get("letterId");
    if (!letterId) {
      setIsLoading(false);
      return;
    }

    try {
      const [letterResponse, historyResponse] = await Promise.all([
        fetch(`${API_BASE}/letters/${letterId}?scope=all`, { credentials: "include" }),
        fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
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
          note: item.note ?? t("noNotes"),
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
  const namaLengkap = readValueFrom(values, ["namaLengkap", "nama"]);
  const nim = readValue(values, "nim");
  const programStudi = readValue(values, "programStudi");
  const alamat = readValue(values, "alamat");
  const semester = readValue(values, "semester");
  const keperluan = readValue(values, "keperluan");
  const tahunMulai = readValue(values, "tahunMulai");
  const tahunSelesai = readValue(values, "tahunSelesai");
  const nomorSurat = readValueFrom(values, ["nomorSurat", "nomor"]);
  const jenisKategori = [letter?.letterType?.name, letter?.letterType?.description].filter(Boolean).join(" / ") || "-";
  const createdByRoleRaw = letter?.createdBy?.userRole?.[0]?.role?.name;
  const createdByRoleValue = readValueFrom(values, ["role", "peran"]);
  const createdByRole =
    createdByRoleRaw === "mahasiswa"
      ? t("studentRole")
    : createdByRoleRaw === "supervisor_akademik"
      ? t("supervisorRole")
      : createdByRoleRaw === "manager_tu"
      ? t("managerRole")
      : createdByRoleRaw === "upa"
      ? t("upaRole")
      : createdByRoleRaw
      ? formatRoleName(createdByRoleRaw)
      : createdByRoleValue
      ? formatRoleName(createdByRoleValue)
      : t("studentRole");
  const noHp =
    readValueFrom(values, ["noHp", "noHP", "nomorHp", "nomorHP", "phone", "telepon", "telp"]) ?? "-";
  const tujuanSaatIni =
    letter?.status === "COMPLETED"
      ? t("managerRole")
      : letter?.status === "IN_PROGRESS"
      ? t("studentRole")
      : letter?.status === "REJECTED"
      ? t("supervisorRole")
      : letter?.status === "PENDING"
      ? t("supervisorRole")
      : "-";
  const tanggalDiterima = letter
    ? new Date(letter.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  const referenceDate = letter?.createdAt ? new Date(letter.createdAt) : new Date();
  const academicYearStart = getAcademicYearStart(referenceDate);
  const defaultAcademicYear = `${academicYearStart} / ${academicYearStart + 1}`;
  const tahunAkademik =
    tahunMulai && tahunSelesai
      ? `${tahunMulai} / ${tahunSelesai}`
      : tahunMulai ?? tahunSelesai ?? defaultAcademicYear;
  const entryYear =
    parseEntryYear(readValue(values, "tahunMasuk")) ??
    parseEntryYear(readValue(values, "angkatan")) ??
    parseEntryYear(letter?.createdBy?.mahasiswa?.tahunMasuk) ??
    parseEntryYear(letter?.createdBy?.mahasiswa?.angkatan);
  const computedSemester = getSemesterNumber(entryYear, referenceDate);
  const semesterLabel = semester
    ? semester
    : computedSemester
    ? `${computedSemester} (${spellNumberId(computedSemester)})`
    : "-";

  const handleHistorySubmit = async (status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED", note?: string) => {
    const letterId = searchParams?.get("letterId");
    if (!letterId) return;

    const response = await fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        note,
      }),
    });
    if (!response.ok) {
      alert("Gagal memperbarui surat. Silakan coba lagi.");
      return;
    }

    setLetter((prev) => (prev ? { ...prev, status } : prev));
    await loadHistory();
    if (status === "COMPLETED") {
      alert("Surat berhasil disetujui.");
    } else if (status === "IN_PROGRESS") {
      alert("Revisi berhasil dikirim.");
    } else if (status === "REJECTED") {
      alert("Surat berhasil ditolak.");
    }
  };

  const canAct = letter?.status === "PENDING";
  const isActionLocked = !canAct;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        dashboardHref="/supervisor/dashboard"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        {sidebarOpen ? <SupervisorSidebar active="surat-masuk" /> : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="text-sm text-slate-500">{t("detailBreadcrumb")}</div>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <section className="space-y-4">
              <CardSection title={t("identitasPengaju")}>
                <Grid>
                  <Row label={t("fullName")} value={namaLengkap ?? letter?.createdBy?.name ?? "-"} />
                  <Row label={t("role")} value={createdByRole} />
                  <Row label={t("studentId")} value={nim ?? "-"} />
                  <Row label={t("program")} value={programStudi ?? "-"} />
                  <Row label={t("email")} value={letter?.createdBy?.email ?? "-"} />
                  <Row label={t("phone")} value={noHp} />
                </Grid>
              </CardSection>

              <CardSection title={t("detailSurat")}>
                <Grid>
                  <Row label={t("typeCategory")} value={jenisKategori} />
                  <Row label={t("destination")} value={tujuanSaatIni} />
                  <Row label={t("letterNumber")} value={nomorSurat ?? "-"} />
                  <Row label={t("subject")} value={letter?.letterType?.name ?? "-"} />
                  <Row label={t("received")} value={tanggalDiterima} />
                  <Row label={t("academicYear")} value={tahunAkademik} />
                  <Row label={t("semester")} value={semesterLabel} />
                  <Row label={t("address")} value={alamat ?? "-"} full />
                  <Row label={t("purpose")} value={keperluan ?? "-"} full />
                </Grid>
              </CardSection>

              <CardSection title={t("attachment")}>
                <div className="text-sm text-slate-500">{t("noAttachment")}</div>
              </CardSection>
            </section>

            <section className="space-y-4">
              <CardSection title={t("previewLetter")}>
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href={letter ? `/supervisor/pratinjau-surat?letterId=${letter.id}` : "/supervisor/pratinjau-surat"}>
                    {t("openPreview")}
                  </Link>
                </Button>
              </CardSection>

              {canAct ? (
                <CardSection title={t("actions")}>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => setShowApprove(true)}
                      disabled={isActionLocked}
                    >
                      {t("approve")}
                    </Button>
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => setShowRevision(true)}
                      disabled={isActionLocked}
                    >
                      {t("revise")}
                    </Button>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => {
                        if (letter?.id) {
                          window.location.href = `/supervisor/revisi-surat?letterId=${letter.id}`;
                        }
                      }}
                      disabled={isActionLocked}
                    >
                      Revisi Supervisor
                    </Button>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => setShowReject(true)}
                      disabled={isActionLocked}
                    >
                      {t("reject")}
                    </Button>
                  </div>
                </CardSection>
              ) : null}

              <CardSection>
                <div className="flex items-center gap-2 pb-3">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600">📅</div>
                  <h3 className="text-sm font-semibold text-slate-900">{t("history")} ({history.length})</h3>
                </div>
                <Separator className="bg-slate-200" />
                <div className="mt-4 space-y-4">
                  {isLoading ? (
                    <div className="text-sm text-slate-500">{t("loadingHistory")}</div>
                  ) : history.length === 0 ? (
                    <div className="text-sm text-slate-500">{t("noHistory")}</div>
                  ) : (
                    history.map((item) => (
                      <div key={`${item.role}-${item.date}`} className="flex items-start gap-3 text-sm">
                        <div className={`mt-1 h-2 w-2 rounded-full ${item.dotClass}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-slate-700">{item.role}</div>
                            <div className="text-xs text-slate-400">{item.date}</div>
                          </div>
                          <div className="mt-1 flex flex-col items-start gap-1">
                            {splitStatusText(item.status).map((part, partIndex) => (
                              <span
                                key={partIndex}
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${item.pillClass}`}
                              >
                                {part}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">{t("note")}: {item.note}</div>
                        </div>
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
              <h2 className="text-xl font-bold text-slate-900">{t("verify")}</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">{t("letterName")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.name ?? "-"}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t("letterType")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.description ?? "-"}</div>
                </div>
              </div>
              <div className="text-sm text-slate-700">{t("confirmVerify")}</div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowApprove(false)}
              >
                {t("back")}
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("COMPLETED");
                  setShowApprove(false);
                }}
              >
                {t("approve")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">{t("reject")}</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">{t("letterName")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.name ?? "-"}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t("letterType")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.description ?? "-"}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">{t("rejectionNoteLabel")}</div>
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]"
                  rows={3}
                  placeholder={t("rejectionNotePlaceholder")}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => setShowReject(false)}>
                {t("back")}
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("REJECTED", rejectNote);
                  setShowReject(false);
                  setRejectNote("");
                }}
              >
                {t("sendRejection")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">{t("revise")}</h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">{t("letterName")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.name ?? "-"}</div>
                </div>
                <div>
                  <div className="text-slate-500">{t("letterType")}</div>
                  <div className="font-semibold text-slate-900">{letter?.letterType?.description ?? "-"}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">{t("revisionTarget")}</div>
                <select
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
                  defaultValue="Mahasiswa"
                >
                  <option value="Mahasiswa">{t("studentRole")}</option>
                </select>
                <div className="text-slate-500 text-xs">{t("revisionTargetDesc")}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-slate-500">{t("revisionNoteLabel")}</div>
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A77C8]"
                  rows={3}
                  placeholder={t("revisionNotePlaceholder")}
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
                {t("back")}
              </Button>
              <Button
                className="bg-[#0A77C8] hover:bg-[#085ea0]"
                onClick={async () => {
                  await handleHistorySubmit("IN_PROGRESS", revisionNote);
                  setShowRevision(false);
                  setRevisionNote("");
                }}
              >
                {t("sendRevision")}
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
