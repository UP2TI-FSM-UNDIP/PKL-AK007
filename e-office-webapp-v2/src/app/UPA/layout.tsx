"use client";

import { useState } from "react";
import { UPANavbar } from "@/components/UPA/navbar";
import { UPASidebar } from "@/components/UPA/sidebar";

export default function UPALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== NAVBAR ===== */}
      <UPANavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* ===== BODY ===== */}
      <div className="flex pt-16">
        {/* ===== SIDEBAR ===== */}
        {sidebarOpen && (
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 bg-white border-r shadow-sm">
            <UPASidebar />
          </div>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'
          }`}
        >
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}