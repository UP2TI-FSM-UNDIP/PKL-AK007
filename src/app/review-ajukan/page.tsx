"use client";

import { Breadcrumbs } from "@frontend/components/layout/breadcrumbs";
import { Stepper } from "@frontend/components/layout/stepper";
import { applicant } from "@frontend/data/applicant";
import { CheckCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

const steps = ["Info Pengajuan", "Detail Pengajuan", "Lampiran", "Review & Ajukan"];

const surat = {
  jenis: "AK007 / Surat Keterangan Mahasiswa",
  keperluan: "Sebagai syarat administrasi untuk pencairan tunjangan orang tua.",
};

const attachments = [
  {
    title: "KTM - KTM_24060121120001.pdf",
    previewAlt: "Preview KTM",
  },
  {
    title: "Transkrip - Transkrip_Nilai_Semester_6.pdf",
    previewAlt: "Preview Transkrip",
  },
];

export default function ReviewAjukanPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Form Pengajuan Surat", href: "#" },
          { label: "Review & Ajukan" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Review Surat</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Mohon periksa kembali seluruh data yang telah Anda masukkan sebelum mengajukan surat.
        </p>
      </header>

      <Stepper steps={steps} current={4} />

      <Card title="Identitas Pengaju">
        <SimpleGrid>
          <GridRow label="Nama Lengkap" value={applicant.fullName} />
          <GridRow label="NIM/NIP" value={applicant.nim} />
          <GridRow label="Email" value={applicant.email} />
          <GridRow label="Departemen" value={applicant.department} />
          <GridRow label="Program Studi" value={applicant.studyProgram} />
          <GridRow label="Tempat Lahir" value={applicant.birthPlace} />
          <GridRow label="Tanggal Lahir" value="03/18/2006" />
          <GridRow label="No HP" value="0819214214214212" />
          <GridRow
            label="Alamat"
            value="Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275"
            full
          />
        </SimpleGrid>
      </Card>

      <Card title="Detail Surat Pengajuan">
        <SimpleGrid>
          <GridRow label="Jenis Surat" value={surat.jenis} />
          <GridRow label="Keperluan" value={surat.keperluan} full />
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
        <div className="space-y-6">
          {attachments.map((file) => (
            <div key={file.title} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>{file.title}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-500 sm:h-96">
                  {file.previewAlt} (placeholder)
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <Link
            href="/lampiran"
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
            className="rounded-full border border-[#0A77C8] px-5 py-2 text-sm font-semibold text-[#0A77C8] transition hover:bg-[#0A77C8]/10"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            className="rounded-full bg-[#0A77C8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085ea0]"
          >
            Ajukan Surat
          </button>
        </div>
      </div>
    </main>
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
