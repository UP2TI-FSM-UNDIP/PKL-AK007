"use client";
export const dynamic = "force-dynamic";

import { CheckCircle, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { StudentNavbar } from "@/components/student/StudentNavbar";
import { PageHeader } from "@/components/PageHeader";
import { FormStepper } from "@/components/FormStepper";

const steps = [
  { label: "Info Pengajuan" },
  { label: "Detail Pengajuan" },
  { label: "Lampiran" },
  { label: "Review & Ajukan" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type DraftData = {
  namaLengkap?: string;
  nim?: string;
  email?: string;
  departemen?: string;
  programStudi?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  noHp?: string;
  alamat?: string;
  jenisSurat?: string;
  keperluan?: string;
  attachments?: AttachmentItem[];
};

type AttachmentItem = {
  id: string;
  name: string;
  url: string;
  type?: string;
  typeLabel?: string;
  isMain?: boolean;
  size?: string;
  fileSize?: number;
};

const formatValue = (value?: string) => (value && value.trim().length > 0 ? value : "-");

export default function ReviewAjukanPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [originalLetter, setOriginalLetter] = useState<DraftData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRevision = searchParams?.get("revision") === "1";
  const isResubmit = searchParams?.get("resubmit") === "1";
  const letterId = searchParams?.get("letterId");

  useEffect(() => {
    const revision = searchParams?.get("revision");
    const letterParam = searchParams?.get("letterId");
    if (letterParam) {
      sessionStorage.setItem("revisionLetterId", letterParam);
      return;
    }
    if (!revision) {
      return;
    }
    const stored = sessionStorage.getItem("revisionLetterId");
    if (!stored) {
      return;
    }
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("letterId", stored);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const draftId = searchParams?.get("draftId");
    if (!draftId) {
      return;
    }

    const loadDraft = async () => {
      try {
        const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { data?: DraftData };
        setDraft(data.data ?? null);
      } catch (error) {
        console.warn("Failed to load draft", error);
      }
    };

    loadDraft();
  }, [searchParams]);

  const draftId = searchParams?.get("draftId");
  useEffect(() => {
    if ((!isRevision && !isResubmit) || !letterId) {
      return;
    }

    const loadLetter = async () => {
      try {
        const response = await fetch(`${API_BASE}/letters/${letterId}`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { values?: DraftData };
        setOriginalLetter(data.values ?? null);
      } catch (error) {
        console.warn("Failed to load letter", error);
      }
    };

    loadLetter();
  }, [isRevision, isResubmit, letterId]);

  useEffect(() => {
    if (!isResubmit || letterId) {
      return;
    }
    const stored = sessionStorage.getItem("resubmitOriginalValues");
    if (!stored) {
      return;
    }
    try {
      setOriginalLetter(JSON.parse(stored) as DraftData);
    } catch (error) {
      console.warn("Failed to parse resubmit values", error);
    }
  }, [isResubmit, letterId]);

  const normalize = (value?: string) => (value ?? "").trim();
  type StringDraftKey =
    | "namaLengkap"
    | "nim"
    | "email"
    | "departemen"
    | "programStudi"
    | "tempatLahir"
    | "tanggalLahir"
    | "noHp"
    | "alamat"
    | "jenisSurat"
    | "keperluan";
  const normalizeAttachments = (items?: AttachmentItem[]) => {
    const normalized = (items ?? []).map((item) => ({
      name: item.name ?? "",
      url: item.url ?? "",
      type: item.type ?? "",
      typeLabel: item.typeLabel ?? "",
      isMain: Boolean(item.isMain),
    }));
    return normalized.sort((a, b) => `${a.name}${a.url}`.localeCompare(`${b.name}${b.url}`));
  };
  const hasChanges = (() => {
    if (!isRevision && !isResubmit) return true;
    if (!draft || !originalLetter) return false;
    const keys: StringDraftKey[] = [
      "namaLengkap",
      "nim",
      "email",
      "departemen",
      "programStudi",
      "tempatLahir",
      "tanggalLahir",
      "noHp",
      "alamat",
      "jenisSurat",
      "keperluan",
    ];
    const fieldChanged = keys.some((key) => normalize(draft[key]) !== normalize(originalLetter[key]));
    if (fieldChanged) return true;
    const draftAttachments = normalizeAttachments(draft.attachments);
    const originalAttachments = normalizeAttachments(originalLetter.attachments);
    return JSON.stringify(draftAttachments) !== JSON.stringify(originalAttachments);
  })();
  const queryParts = [
    ...(isRevision ? ["revision=1"] : []),
    ...(isResubmit ? ["resubmit=1"] : []),
    ...(letterId ? [`letterId=${letterId}`] : []),
  ];
  const query = queryParts.length ? `?${queryParts.join("&")}` : "";
  const backHref = draftId
    ? `/mahasiswa/lampiran?draftId=${draftId}${query ? `&${query.slice(1)}` : ""}`
    : `/mahasiswa/lampiran${query}`;
  const handleSaveDraft = async () => {
    if (!draftId || isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/drafts/${draftId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: draft ?? {} }),
      });
      alert("Draft tersimpan.");
      router.push("/mahasiswa/draft-surat");
    } catch (error) {
      console.warn("Gagal menyimpan draft", error);
      alert("Gagal menyimpan draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitLetter = async () => {
    if (!draftId || isSubmitting) {
      return;
    }
    if ((isRevision || isResubmit) && !hasChanges) {
      alert(isRevision ? "Ubah data terlebih dahulu sebelum mengajukan revisi." : "Ubah data terlebih dahulu sebelum mengajukan ulang.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isRevision && letterId) {
        const mergedValues = {
          ...(originalLetter ?? {}),
          ...(draft ?? {}),
        };
        const response = await fetch(`${API_BASE}/letters/${letterId}/history?scope=all`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "PENDING",
            note: "Proses Revisi",
            values: mergedValues,
          }),
        });
        if (!response.ok) {
          alert("Gagal mengajukan revisi.");
          return;
        }
        await fetch(`${API_BASE}/drafts/${draftId}`, {
          method: "DELETE",
          credentials: "include",
        });
        router.push("/mahasiswa/surat-saya");
        return;
      }

      if (isResubmit) {
        const resubmitId = letterId ?? sessionStorage.getItem("resubmitLetterId");
        if (!resubmitId) {
          alert("Gagal mengajukan ulang surat.");
          return;
        }
        const mergedValues = {
          ...(originalLetter ?? {}),
          ...(draft ?? {}),
        };
        const response = await fetch(`${API_BASE}/letters/${resubmitId}/history?scope=all`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "PENDING",
            note: "Diajukan ulang",
            values: mergedValues,
          }),
        });
        if (!response.ok) {
          alert("Gagal mengajukan ulang surat.");
          return;
        }
        await fetch(`${API_BASE}/drafts/${draftId}`, {
          method: "DELETE",
          credentials: "include",
        });
        sessionStorage.removeItem("resubmitOriginalValues");
        sessionStorage.removeItem("resubmitLetterId");
        router.push(`/mahasiswa/surat-saya/detail?letterId=${resubmitId}`);
        return;
      }

      const response = await fetch(`${API_BASE}/letters`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });
      if (!response.ok) {
        alert("Gagal mengajukan surat.");
        return;
      }
      router.push("/mahasiswa/surat-saya");
    } catch (error) {
      console.warn("Gagal mengajukan surat", error);
      alert(isRevision ? "Gagal mengajukan revisi." : "Gagal mengajukan surat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const attachments = draft?.attachments ?? [];

  const renderAttachmentPreview = (attachment: AttachmentItem) => {
    const url = attachment.url;
    if (!url) {
      return (
        <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-500 sm:h-96">
          Preview tidak tersedia
        </div>
      );
    }

    const isImage = attachment.type?.includes("image") || /\.(png|jpe?g)$/i.test(url);
    const isPdf = attachment.type?.includes("pdf") || /\.pdf$/i.test(url);

    if (isImage) {
      return (
        <div className="flex h-64 items-center justify-center bg-gray-100 sm:h-96">
          <img src={url} alt={attachment.name} className="max-h-full max-w-full object-contain" />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="h-64 bg-gray-100 sm:h-96">
          <iframe title={attachment.name} src={url} className="h-full w-full" />
        </div>
      );
    }

    return (
      <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-500 sm:h-96">
        <a href={url} target="_blank" rel="noreferrer" className="text-[#0A77C8] underline">
          Buka lampiran
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
        <PageHeader
          title="Review Surat"
          description="Mohon periksa kembali seluruh data yang telah Anda masukkan sebelum mengajukan surat."
          breadcrumbItems={[
            { label: "Form Pengajuan Surat", href: "/mahasiswa/identitas-pemohon" },
            { label: "Review & Ajukan" },
          ]}
        />

        <FormStepper currentStep={4} steps={steps} />

        <Card title="Identitas Pengaju">
          <SimpleGrid>
            <GridRow label="Nama Lengkap" value={formatValue(draft?.namaLengkap)} />
            <GridRow label="NIM/NIP" value={formatValue(draft?.nim)} />
            <GridRow label="Email" value={formatValue(draft?.email)} />
            <GridRow label="Departemen" value={formatValue(draft?.departemen)} />
            <GridRow label="Program Studi" value={formatValue(draft?.programStudi)} />
            <GridRow label="Tempat Lahir" value={formatValue(draft?.tempatLahir)} />
            <GridRow label="Tanggal Lahir" value={formatValue(draft?.tanggalLahir)} />
            <GridRow label="No HP" value={formatValue(draft?.noHp)} />
            <GridRow
              label="Alamat"
              value={formatValue(draft?.alamat)}
              full
            />
          </SimpleGrid>
        </Card>

        <Card title="Detail Surat Pengajuan">
          <SimpleGrid>
            <GridRow label="Jenis Surat" value={formatValue(draft?.jenisSurat)} full />
            <GridRow label="Keperluan" value={formatValue(draft?.keperluan)} full />
          </SimpleGrid>
        </Card>

        <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700 ring-1 ring-green-100">
          <p className="flex items-start gap-2">
            <CheckCircle size={18} className="mt-0.5 text-green-600" />
            <span>Data diri lengkap</span>
          </p>
          <p className="mt-2 flex items-start gap-2">
            <CheckCircle size={18} className="mt-0.5 text-green-600" />
            <span>Lampiran utama ada</span>
          </p>
        </div>

        <Card title="Lampiran">
          {attachments.length === 0 ? (
            <div className="text-sm text-gray-500">Belum ada lampiran.</div>
          ) : (
            <div className="space-y-6">
              {attachments.map((file) => (
                <div key={file.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                    <span>{file.name}</span>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {renderAttachmentPreview(file)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <Link
              href={backHref}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Kembali
            </Link>
            <button
              type="button"
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Preview Surat
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!draftId || isSaving}
              className="rounded-full border border-[#0A77C8] px-5 py-2 text-sm font-semibold text-[#0A77C8] transition hover:bg-[#0A77C8]/10"
              onClick={handleSaveDraft}
            >
              Simpan Draft
            </button>
            <button
              type="button"
              onClick={handleSubmitLetter}
              disabled={!draftId || isSubmitting || ((isRevision || isResubmit) && !hasChanges)}
              className="rounded-full bg-[#0A77C8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085ea0] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isRevision ? "Ajukan Revisi" : "Ajukan Surat"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SimpleGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 text-sm text-gray-800 sm:grid-cols-2">{children}</div>;
}

function GridRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <span className="text-gray-600">{label}</span>
        <span className="text-right font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
