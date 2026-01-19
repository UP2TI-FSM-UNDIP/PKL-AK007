import { Bell } from "lucide-react";

export function Navbar() {
  return (
    <header className="bg-[#0A77C8] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
            FM
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-wide opacity-80">
              Fakultas
            </p>
            <p className="text-sm font-semibold">Sains dan Matematika</p>
            <p className="text-[11px] opacity-80">Universitas Diponegoro</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
            aria-label="Notifikasi"
          >
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold leading-tight">Ahmad Douglas</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
