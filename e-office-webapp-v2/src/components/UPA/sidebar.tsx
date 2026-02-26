"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Eye,
  Hash,
  FileText,
  ChevronDown,
  ChevronRight,
  FolderInput,
} from "lucide-react";

/* ================= TYPES ================= */

interface LinkItem {
  type: "link";
  href: string;
  label: string;
  icon: ReactNode;
}

interface DropdownItem {
  type: "dropdown";
  label: string;
  icon: ReactNode;
  items: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
}

type MenuItem = LinkItem | DropdownItem;

/* ================= COMPONENT ================= */

export function UPASidebar() {
  const pathname = usePathname();
  const [openSuratMasuk, setOpenSuratMasuk] = useState(true);

  const isActive = (path: string) => pathname === path;

  const menuItems: MenuItem[] = [
    {
      type: "link",
      href: "/UPA/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      type: "dropdown",
      label: "Surat Masuk",
      icon: <FolderInput className="w-5 h-5" />,
      items: [
        {
          href: "/UPA/penerima",
          label: "Penerima",
          icon: <FileText className="w-4 h-4" />,
        },
      ],
    },
    {
      type: "link",
      href: "/UPA/penomoran-surat",
      label: "Penomoran Surat",
      icon: <Hash className="w-5 h-5" />,
    },
    {
      type: "link",
      href: "/UPA/identitas-pemohon",
      label: "Detail Surat",
      icon: <Users className="w-5 h-5" />,
    },
    {
      type: "link",
      href: "/UPA/pratinjau-surat",
      label: "Pratinjau Surat",
      icon: <Eye className="w-5 h-5" />,
    },
    {
      type: "link",
      href: "/UPA/profil-saya",
      label: "Profil Saya",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r">
      <nav className="p-4 text-sm text-gray-700 space-y-1">
        {menuItems.map((item, index) => {
          if (item.type === "link") {
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-600 font-medium border-l-4 border-blue-600"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }

          // ===== DROPDOWN =====
          return (
            <div key={index}>
              <button
                onClick={() => setOpenSuratMasuk(!openSuratMasuk)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {openSuratMasuk ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {openSuratMasuk && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                        isActive(subItem.href)
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
