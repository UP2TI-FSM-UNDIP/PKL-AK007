import { Bell, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-[#0078C9] text-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 w-full">
          <Link href="/mahasiswa/surat-saya" className="flex items-center gap-2 font-bold text-lg">
            {/* Placeholder Logo */}
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-full p-1 hover:bg-white/10"
              onClick={() => setShowProfile(true)}
            >
              <span className="text-sm font-semibold text-white hidden sm:block">Mahasiswa</span>
              <Avatar className="h-9 w-9 border-2 border-white/20">
                <AvatarImage src="/persuratan-keterangan-mhs/avatars/01.png" alt="@shadcn" />
                <AvatarFallback className="bg-sky-200 text-sky-900 font-bold">AD</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </header>

      {showProfile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-4xl rounded-2xl bg-[#F1F1F1] p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Profil Saya</h2>
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setShowProfile(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1px_1fr]">
                <div className="flex items-center justify-center">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#0A77C8] text-white">
                    <span className="text-3xl font-bold">AD</span>
                  </div>
                </div>
                <div className="hidden h-full w-px bg-slate-300 md:block" />
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-slate-900">Ahmad Douglas</div>
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-slate-700">
                    <span className="text-slate-500">Nama</span>
                    <span className="font-medium">Ahmad Douglas</span>
                    <span className="text-slate-500">NIM</span>
                    <span className="font-medium">24060121130063</span>
                    <span className="text-slate-500">Prodi</span>
                    <span className="font-medium">Informatika</span>
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium">mahasiswa@ak007.test</span>
                    <span className="text-slate-500">Role</span>
                    <span>
                      <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        Mahasiswa
                      </span>
                    </span>
                  </div>
                  <div className="mt-4 flex w-full justify-center md:-ml-[140px]">
                    <button
                      type="button"
                      className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      onClick={async () => {
                        setShowProfile(false)
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/sign-out`, { method: "POST" });
                        router.push("/")
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
