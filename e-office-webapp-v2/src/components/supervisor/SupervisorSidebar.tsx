import Link from "next/link";
import { Inbox, LayoutDashboard, FolderKanban } from "lucide-react";

type Props = {
  active?: "dashboard" | "penerima" | "manajemen";
};

export function SupervisorSidebar({ active = "dashboard" }: Props) {
  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-56 flex-col border-r border-slate-200 bg-white">
      <nav className="flex-1 space-y-2 px-4 py-6 text-sm font-semibold text-slate-700">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dasbor"
          href="/supervisor/dashboard"
          active={active === "dashboard"}
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 text-slate-500">
            <Inbox className="h-5 w-5" />
            <span>Surat Masuk</span>
          </div>
          <SidebarItem
            icon={<span className="h-2 w-2 rounded-full bg-slate-400" />}
            label="Penerima"
            href="/supervisor/penerima"
            active={active === "penerima"}
            nested
          />
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active,
  nested,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        nested ? "ml-3" : ""
      } ${active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"}`}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
