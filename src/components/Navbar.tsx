import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0078C9] text-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div className="flex items-center gap-2 font-bold text-lg">
          {/* Placeholder Logo */}
          <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
            <span className="text-xs">LOGO</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-normal opacity-90">Fakultas</span>
            <span>SAINS DAN MATEMATIKA</span>
            <span className="text-[10px] font-normal opacity-80">UNIVERSITAS DIPONEGORO</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white hidden sm:block">Mahasiswa</span>
            <Avatar className="h-9 w-9 border-2 border-white/20">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback className="bg-sky-200 text-sky-900 font-bold">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
