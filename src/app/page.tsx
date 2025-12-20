"use client";

import { Breadcrumbs } from "@frontend/components/layout/breadcrumbs";
import { Stepper } from "@frontend/components/layout/stepper";
import { applicant } from "@frontend/data/applicant";
import { clsx } from "clsx";
import Link from "next/link";
import { useState } from "react";

const steps = ["Info Pengajuan", "Detail Pengajuan", "Lampiran", "Review & Ajukan"];

export default function Home() {
  const [phone, setPhone] = useState(applicant.phone ?? "");
  const [address, setAddress] = useState(applicant.address ?? "");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Form Pengajuan Surat", href: "#" },
          { label: "Identitas Pemohon" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Identitas Pemohon</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Data berikut diisi secara otomatis berdasarkan data Anda. Mohon periksa kembali dan
          lengkapi data yang diperlukan.
        </p>
      </header>

      <Stepper steps={steps} current={1} />

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nama Lengkap" value={applicant.fullName} />
          <FormField label="Role" value={applicant.role} />

          <FormField label="NIM" value={applicant.nim} />
          <FormField label="Email" value={applicant.email} />

          <FormField label="Departemen" value={applicant.department} />
          <FormField label="Program Studi" value={applicant.studyProgram} />

          <FormField label="Tempat Lahir" value={applicant.birthPlace} />
          <FormField
            label="Tanggal Lahir"
            value={formatDate(applicant.birthDate)}
            inputProps={{ type: "date" }}
          />

          <FormField
            label="No. HP"
            value={phone}
            placeholder="Contoh: 081234567890"
            inputProps={{
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              onChange: (e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setPhone(digitsOnly);
              },
            }}
          />
          <FormField
            label="Alamat"
            value={address}
            placeholder="Masukkan Alamat"
            inputProps={{ onChange: (e) => setAddress(e.target.value) }}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Kembali
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-[#0A77C8] px-5 py-2 text-sm font-semibold text-[#0A77C8] transition hover:bg-[#0A77C8]/10"
            >
              Simpan Draft
            </button>
            <Link
              href="/detail-pengajuan"
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
  const hasValue = value && value.length > 0;

  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      <span className="font-semibold text-gray-800">{label}</span>
      <input
        readOnly={!inputProps?.onChange}
        value={value}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-800 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] focus:border-[#0A77C8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A77C8]/20",
          !hasValue && "bg-white"
        )}
        {...inputProps}
      />
    </label>
  );
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
