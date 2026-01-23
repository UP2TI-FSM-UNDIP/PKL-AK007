import { Bell } from "lucide-react";
import Image from "next/image";

export function StudentNavbar() {
  return (
    <header className="flex h-14 w-full items-center justify-between bg-[#0A77C8] px-4 text-white shadow">
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
        <div className="flex items-center gap-2">
          <span className="hidden text-sm sm:block">Mahasiswa</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            MS
          </div>
        </div>
      </div>
    </header>
  );
}
