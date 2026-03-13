"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          credentials: "include",
        });

        if (profileResponse.ok) {
          const profile = (await profileResponse.json()) as {
            userRole?: { role?: { name?: string } }[] | null;
          };

          const roleName =
            profile?.userRole?.map((entry) => entry.role?.name?.toLowerCase()).find(Boolean) ?? "";
          
          if (roleName.includes("supervisor")) {
            router.push("/supervisor/dashboard");
            return;
          }
          if (roleName.includes("manajer") || roleName.includes("manager")) {
            router.push("/manajerTU/dashboard");
            return;
          }
          if (roleName.includes("upa")) {
            router.push("/UPA/dashboard");
            return;
          }
          if (roleName.includes("superadmin")) {
            router.push("/superadmin/dashboard");
            return;
          }

          router.push("/mahasiswa/surat-saya");
          return;
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0A77C8] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in/email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      setError("Login gagal. Periksa email dan password.");
      return;
    }

    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      credentials: "include",
    });

    if (!profileResponse.ok) {
      setError("Login berhasil, tapi gagal mengambil data role.");
      return;
    }

    const profile = (await profileResponse.json()) as {
      userRole?: { role?: { name?: string } }[] | null;
    };

    const roleName =
      profile?.userRole?.map((entry) => entry.role?.name?.toLowerCase()).find(Boolean) ?? "";
    if (roleName.includes("supervisor")) {
      router.push("/supervisor/dashboard");
      return;
    }
    if (roleName.includes("manajer") || roleName.includes("manager")) {
      router.push("/manajerTU/dashboard");
      return;
    }
    if (roleName.includes("upa")) {
      router.push("/UPA/dashboard");
      return;
    }
    if (roleName.includes("superadmin")) {
      router.push("/superadmin/dashboard");
      return;
    }

    router.push("/mahasiswa/surat-saya");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] bg-[url('/gedung%20AP.png')] bg-cover bg-[center_60%] bg-no-repeat">
      <header className="flex h-14 items-center justify-between bg-[#0A77C8] px-6 text-white">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-fsm.png"
            alt="FSM UNDIP"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10">
        <Card className="w-full max-w-5xl border-none shadow-lg">
          <CardContent className="grid gap-0 p-0 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-l-2xl bg-white px-10 py-12">
              <div className="mt-6">
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
                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span>or</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => window.location.href = "https://apps-fsm.undip.ac.id/sso?clientId=7beae702-9c0c-42b3-922d-ba406429641b"}
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
