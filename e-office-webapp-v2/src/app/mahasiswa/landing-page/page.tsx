"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentNavbar } from "@/components/student/StudentNavbar";

type AppTile = {
  title: string;
  description: string;
  badge?: number;
  href?: string;
  icon: string;
};

const apps: AppTile[] = [
  {
    title: "Academic Portal",
    description: "Manage student grades, course registrations, and academic progress.",
    badge: 5,
    icon: "🎓",
  },
  {
    title: "E-Learning",
    description: "Access course materials, submit assignments, and participate in online classes.",
    badge: 12,
    icon: "📘",
  },
  {
    title: "Research Repository",
    description: "Submit and browse research papers, journals, and thesis documents.",
    badge: 3,
    icon: "🧪",
  },
  {
    title: "Event Management",
    description: "Organize and manage faculty events, seminars, and workshops.",
    icon: "📅",
  },
  {
    title: "Alumni Connect",
    description: "Network with fellow alumni and stay updated with faculty news.",
    badge: 1,
    icon: "👥",
  },
  {
    title: "Asset Management",
    description: "Track and manage faculty assets and inventory.",
    icon: "📦",
  },
  {
    title: "Student Letter Management System",
    description: "Track and manage faculty assets and inventory.",
    icon: "📄",
    href: "/mahasiswa/student-letter-management",
  },
];

export default function LandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="dashboard" /> : null}
        <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Application Catalogue</h1>
            <p className="text-sm text-slate-600">
              Access and manage all available FSM UNDIP applications from this central dashboard.
            </p>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.title} className="border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                    <span aria-hidden>{app.icon}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {app.title}
                    </CardTitle>
                    <p className="text-xs text-slate-600">{app.description}</p>
                  </div>
                  {app.badge ? (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-[11px] font-semibold text-white">
                      {app.badge}
                    </span>
                  ) : null}
                </CardHeader>
                <CardContent>
                  {app.href ? (
                    <Button variant="link" asChild className="px-0 text-[#0A77C8]">
                      <Link href={app.href}>Open Application</Link>
                    </Button>
                  ) : (
                    <Button variant="link" disabled className="px-0 text-slate-400">
                      Open Application
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <footer className="mt-12 flex items-center justify-between text-xs text-slate-500">
            <span>© 2025 UPTI FSM UNDIP. All Rights Reserved.</span>
            <a className="font-semibold text-[#0A77C8]" href="#">
              Support
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
