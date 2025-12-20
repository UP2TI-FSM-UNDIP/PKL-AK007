"use client";

import { Breadcrumbs } from "@frontend/components/layout/breadcrumbs";
import { Stepper } from "@frontend/components/layout/stepper";
import { clsx } from "clsx";
import Link from "next/link";
import { useState } from "react";

const steps = ["Info Pengajuan", "Detail Pengajuan", "Lampiran", "Review & Ajukan"];

export default function DetailPengajuanPage() {
  const [keperluan, setKeperluan] = useState("");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Form Pengajuan Surat", href: "#" },
          { label: "Detail Pengajuan" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Detail Pengajuan</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Lengkapi detail utama dari surat yang akan diajukan.
        </p>
      </header>

      <Stepper steps={steps} current={2} />

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
        <div className="flex flex-col gap-4">
          <FormField label="Jenis Surat" value="AK 007" />
          <FormField
            label="Keperluan Surat"
            placeholder="Tulis perihal singkat yang mewakili isi surat."
            value={keperluan}
            inputProps={{ onChange: (e) => setKeperluan(e.target.value) }}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
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
              href="/lampiran"
              className="rounded-full bg-[#0A77C8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#085ea0]"
            >
              Lanjut
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FormField({
  label,
  value,
  placeholder,
  inputProps,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const editable = Boolean(inputProps?.onChange);

  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="font-semibold text-gray-800">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        readOnly={!editable}
        className={clsx(
          "w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] focus:border-[#0A77C8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A77C8]/20",
          editable ? "bg-white" : "bg-gray-100"
        )}
        {...inputProps}
      />
    </label>
  );
}
