"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const domainMap: Record<string, string> = {
    "mahasiswa.com": "/mahasiswa/identitas-pemohon",
    "spvak.com": "/supervisorAkademik",
    "mantu.com": "/manajerTU",
    "upa.com": "/UPA",
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = (email.split("@")[1] || "").toLowerCase();
    const dest = domainMap[domain] || "/mahasiswa/identitas-pemohon";
    router.push(dest);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="flex h-14 items-center justify-between bg-[#0A77C8] px-6 text-white">
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
        <div className="h-8 w-8 rounded-full bg-white/20" />
      </header>

      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10">
        <Card className="w-full max-w-5xl border-none shadow-lg">
          <CardContent className="grid gap-0 p-0 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-l-2xl bg-white px-10 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A77C8]/10 text-[#0A77C8]">
                <span className="text-xl font-bold" aria-hidden>
                  🔒
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">FSM UNDIP SSO</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Welcome to FSM UNDIP Application Portal. Please sign in to access your dashboard.
                </p>
              </div>
              <p className="mt-auto text-xs text-slate-500">
                © 2025 UPTI FSM UNDIP. All Rights Reserved.
              </p>
            </div>

            <div className="rounded-r-2xl bg-white px-10 py-12">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">Sign In</h3>
                  <p className="text-sm text-slate-600">Enter your credentials to access your account.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Username or Email</label>
                    <Input
                      placeholder="Enter your username or email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800">Password</label>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <a className="text-xs font-semibold text-[#0A77C8]" href="#">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[#0F304A] text-white hover:bg-[#0F304A]/90">
                  Login
                </Button>

                <div className="flex items-center gap-2">
                  <Separator />
                  <span className="text-xs text-slate-500">or</span>
                  <Separator />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Login with UNDIP SSO
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
