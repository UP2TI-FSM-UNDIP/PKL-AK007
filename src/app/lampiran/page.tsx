"use client";

import { Breadcrumbs } from "@frontend/components/layout/breadcrumbs";
import { Stepper } from "@frontend/components/layout/stepper";
import { ChevronDown, Eye, FileText, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";

const steps = ["Info Pengajuan", "Detail Pengajuan", "Lampiran", "Review & Ajukan"];

type Attachment = {
  name: string;
  size: string;
  typeLabel: string;
  badgeColor: string;
};

const mainAttachments: Attachment[] = [
  { name: "KTM.pdf", size: "2.1 MB", typeLabel: "KTM", badgeColor: "bg-red-100 text-red-600" },
  { name: "Foto.jpg", size: "850 KB", typeLabel: "Foto", badgeColor: "bg-blue-100 text-blue-600" },
];

export default function LampiranPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Form Pengajuan Surat", href: "#" },
          { label: "Lampiran" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Lampiran</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Lampirkan dokumen pendukung yang diperlukan.
        </p>
      </header>

      <Stepper steps={steps} current={3} />

      <AttachmentSection
        title="Lampiran Utama"
        requiredNote="Wajib. Unggah minimal 1 dokumen pendukung utama. Format: PDF, JPG, PNG. Maks: 5MB/file."
        attachments={mainAttachments}
      />

      <AttachmentSection
        title="Lampiran Tambahan"
        requiredNote="Opsional. Tambahkan dokumen pendukung lainnya jika diperlukan."
        attachments={[]}
      />

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/detail-pengajuan"
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Kembali
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-[#0A77C8] px-5 py-2 text-sm font-semibold text-[#0A77C8] transition hover:bg-[#0A77C8]/10"
          >
            Simpan Draft
          </button>
          <Link
            href="/review-ajukan"
            className="rounded-full bg-[#0A77C8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085ea0]"
          >
            Lanjut
          </Link>
        </div>
      </div>
    </main>
  );
}

function AttachmentSection({
  title,
  requiredNote,
  attachments,
}: {
  title: string;
  requiredNote: string;
  attachments: Attachment[];
}) {
  const hasItems = attachments.length > 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-900">
          {title}
          {title === "Lampiran Utama" && <span className="text-red-500">*</span>}
        </h2>
        <p className="text-sm text-gray-600">{requiredNote}</p>
      </div>

      <Dropzone />

      {hasItems && (
        <div className="mt-4 space-y-3">
          {attachments.map((item) => (
            <AttachmentRow key={item.name} attachment={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function Dropzone() {
  return (
    <div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm text-gray-600">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0A77C8]/10 text-[#0A77C8]">
        <UploadCloud size={22} />
      </div>
      <p className="mt-3 text-base font-semibold text-gray-800">
        Seret & lepas atau{" "}
        <button className="text-[#0A77C8] underline underline-offset-4" type="button">
          pilih file
        </button>
      </p>
      <p className="text-xs text-gray-500">untuk diunggah</p>
    </div>
  );
}

function AttachmentRow({ attachment }: { attachment: Attachment }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${attachment.badgeColor}`}>
        <FileText size={18} />
      </div>
      <div className="flex flex-1 flex-col text-sm">
        <span className="font-semibold text-gray-900">{attachment.name}</span>
        <span className="text-xs text-gray-500">{attachment.size}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-800">
          <span>{attachment.typeLabel}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100"
          aria-label="Lihat lampiran"
        >
          <Eye size={18} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100"
          aria-label="Hapus lampiran"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
