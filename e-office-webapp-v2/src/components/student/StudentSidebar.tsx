import { ClipboardList, LayoutGrid, Mail, NotebookText } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  active: "dashboard" | "surat-saya" | "draft-surat" | "ajukan";
};

const items = [
  { key: "dashboard", label: "Dasbor", icon: LayoutGrid, href: "/mahasiswa/landing-page" },
  { key: "surat-saya", label: "Surat saya", icon: NotebookText, href: "/mahasiswa/surat-saya" },
  { key: "draft-surat", label: "Draft surat", icon: NotebookText, href: "/mahasiswa/draft-surat" },
  { key: "ajukan", label: "Ajukan Surat", icon: Mail, href: "/mahasiswa/student-letter-management" },
] as const;

export function StudentSidebar({ active }: SidebarProps) {
  const baseColor = "#4B5563";
  const highlightColor = "#476682";

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-slate-200 bg-white px-6 py-8">
      <div className="space-y-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          const textColor = isActive && item.key === "ajukan" ? highlightColor : "#303030";
          const iconColor = isActive && item.key === "ajukan" ? highlightColor : baseColor;

          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-1 py-1 text-lg font-semibold"
              style={{ color: textColor }}
            >
              <Icon className="h-6 w-6" stroke={iconColor} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
