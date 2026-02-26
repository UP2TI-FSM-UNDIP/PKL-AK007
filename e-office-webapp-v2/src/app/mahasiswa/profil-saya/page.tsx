"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { applicant } from "@/data/applicant";

export default function ProfilSayaPage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar />
      <div className="flex flex-1">
        <StudentSidebar />

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
          <div>
            <p className="text-xs text-slate-500">Profil saya</p>
            <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
          </div>

          <Card className="border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1px_1fr]">
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#0A77C8] text-white">
                  <User className="h-16 w-16" />
                </div>
              </div>

              <div className="hidden h-full w-px bg-slate-200 md:block" />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">{applicant.fullName}</h2>
                <ProfileRow label="Nama" value={applicant.fullName} />
                <ProfileRow label="NIM" value={applicant.nim ?? "-"} />
                <ProfileRow label="Prodi" value={applicant.studyProgram ?? "-"} />
                <ProfileRow label="Email" value={applicant.email ?? "-"} />
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="w-24 text-sm text-slate-600">Role</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Mahasiswa
                  </span>
                </div>
                <Button className="mt-2 bg-red-500 hover:bg-red-600" onClick={() => setShowLogoutConfirm(true)}>
                  Log Out
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Keluar dari akun?</h2>
            <p className="mt-2 text-sm text-slate-600">Apakah Anda yakin ingin keluar?</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
                Batal
              </Button>
              <Button className="bg-red-500 hover:bg-red-600" onClick={handleLogout}>
                Keluar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <span className="w-24 text-sm text-slate-600">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
}
