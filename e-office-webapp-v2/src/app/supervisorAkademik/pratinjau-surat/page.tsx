"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StudentLetterPreview } from "@/components/letter/StudentLetterPreview";
import { applicant } from "@/data/applicant";

export default function SupervisorPreviewPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="flex items-center justify-between bg-[#0A77C8] px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            FSM
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-wide opacity-80">Fakultas</p>
            <p className="text-sm font-semibold">Sains dan Matematika</p>
            <p className="text-[11px] opacity-80">Universitas Diponegoro</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="text-right leading-tight">
            <div>Supervisor Akademik</div>
            <div className="text-xs opacity-80">Supervisor Akademik</div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
            SA
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-6 px-6 py-6">
        <aside className="hidden w-56 flex-col gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 md:flex">
          <NavItem label="Surat Masuk" href="/supervisorAkademik/penerima" />
          <NavItem label="Manajemen Surat" href="#" />
        </aside>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Form Pengajuan Surat / Pratinjau Surat</p>
              <h1 className="text-2xl font-bold text-slate-900">Pratinjau Surat</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <button className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50">−</button>
              <span className="px-2">100%</span>
              <button className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50">+</button>
              <span className="text-xs text-slate-500">Halaman 1 dari 1</span>
            </div>
          </div>

          <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
            <StudentLetterPreview
              nomor=".../UN7.F8.4/AK/2025/..."
              applicant={{
                name: applicant.fullName,
                nim: applicant.nim ?? "240000000000",
                program: `${applicant.studyProgram}`,
                birthPlace: applicant.birthPlace ?? "Semarang",
                birthDate: "17 Agustus 2000",
                address: applicant.address ?? "Semarang, Jawa Tengah",
                semester: "4 (Empat)",
              }}
              academicYear={{ start: "2024", end: "2025" }}
              keperluan="Sebagai syarat administrasi untuk pencairan tunjangan orang tua."
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
              <Link href="/supervisorAkademik/penerima/identitas-pemohon">Kembali</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, href, active }: { label: string; href: string; active?: boolean }) {
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
