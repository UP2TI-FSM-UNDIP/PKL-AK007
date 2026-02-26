import { Bell, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StudentNavbarProps = {
  userLabel?: string;
  initials?: string;
  userName?: string;
  email?: string;
  idLabel?: string;
  idValue?: string;
  prodi?: string;
  profileHref?: string;
};

export function StudentNavbar({
  userLabel = "Mahasiswa",
  initials = "MS",
  userName = "Ahmad Douglas",
  email = "mahasiswa@ak007.test",
  idLabel = "NIM",
  idValue = "24060121130063",
  prodi = "Informatika",
}: StudentNavbarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const displayName = userName;
  const displayEmail = email;
  const displayInitials = getInitials(displayName) ?? initials;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#0A77C8] px-4 text-white shadow">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-fsm.png"
            alt="FSM UNDIP"
            width={200}
            height={60}
            className="h-8 w-auto"
            priority
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <button className="rounded-full p-1 hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10"
            onClick={() => setShowProfile(true)}
          >
            <span className="hidden text-sm sm:block">{userLabel}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {displayInitials}
            </div>
          </button>
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
                    <span className="text-3xl font-bold">{displayInitials}</span>
                  </div>
                </div>
                <div className="hidden h-full w-px bg-slate-300 md:block" />
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-slate-900">{displayName}</div>
                  <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-slate-700">
                    <span className="text-slate-500">Nama</span>
                    <span className="font-medium">{displayName}</span>
                    <span className="text-slate-500">{idLabel}</span>
                    <span className="font-medium">{idValue}</span>
                    <span className="text-slate-500">Prodi</span>
                    <span className="font-medium">{prodi}</span>
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium">{displayEmail}</span>
                    <span className="text-slate-500">Role</span>
                    <span>
                      <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        {userLabel}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 self-end rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    onClick={() => {
                      setShowProfile(false);
                      router.push("/");
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getInitials(name?: string) {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
