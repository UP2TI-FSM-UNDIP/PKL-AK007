"use client";

import { useState } from "react";
import { ManajerNavbar } from "@/components/manajerTU/navbar";
import { ManajerSidebar } from "@/components/manajerTU/sidebar";

export default function ManajerTULayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== NAVBAR ===== */}
      <ManajerNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* ===== SIDEBAR ===== */}
      {sidebarOpen && <ManajerSidebar />}

      {/* ===== PAGE WRAPPER ===== */}
      <div
        className={`
          pt-16
          transition-all duration-300
          ${sidebarOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        {/* ===== MAIN CONTENT ===== */}
        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
