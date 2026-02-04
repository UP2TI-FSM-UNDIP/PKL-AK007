"use client";

import { Menu, Bell, User } from "lucide-react";

export function ManajerNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        w-full
        h-16
        bg-blue-600
        text-white
        flex
        items-center
        justify-between
        px-4
        z-50
      "
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold">
          Fakultas Sains dan Matematika
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5" />
        <User className="w-5 h-5" />
      </div>
    </header>
  );
}
