"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentNavbar } from "@/components/student/StudentNavbar";

type LetterItem = {
  code: string;
  title: string;
  description: string;
  badge?: "new" | "count";
  count?: number;
  comingSoon?: boolean;
};

const letters: LetterItem[] = [
  {
    code: "AK-001",
    title: "Late Consultation & IRS Submission",
    description: "Letter of Late Consultation and IRS Submission.",
    comingSoon: true,
  },
  {
    code: "AK-002",
    title: "Temporary Suspension of Study",
    description: "Request for Temporary Suspension of Study (Academic Leave).",
    comingSoon: true,
  },
  {
    code: "AK-003",
    title: "Re-enrolment After Absence",
    description: "Application for Re-enrolment After Absence.",
    comingSoon: true,
  },
  {
    code: "AK-004",
    title: "Student Resignation",
    description: "Application for Student Resignation.",
    comingSoon: true,
  },
  {
    code: "AK-005",
    title: "Community Service Program",
    description: "Letter of Community Service Program Participation.",
    comingSoon: true,
  },
  {
    code: "AK-006",
    title: "Active Student Status",
    description: "Statement of Active Student Status.",
    comingSoon: true,
  },
  {
    code: "AK-007",
    title: "Student Verification",
    description: "Letter of Student Verification.",
  },
  {
    code: "AK-008",
    title: "Graduation Confirmation",
    description: "Letter of Graduation Confirmation.",
    comingSoon: true,
  },
  {
    code: "AK-009",
    title: "Graduation Ceremony",
    description: "Application for Graduation Ceremony Requirements.",
    comingSoon: true,
  },
];

export default function StudentLetterManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1">
        {sidebarOpen ? <StudentSidebar active="ajukan" /> : null}
        <main className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Application Catalogue / Student Letter Management System</p>
            <h1 className="text-3xl font-bold text-slate-900">Student Letter Management System</h1>
            <p className="text-sm text-slate-600">
              Manage incoming and outgoing letters for students of FSM UNDIP.
            </p>
          </div>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Ajukan Surat</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {letters.map((item) => (
                <div key={item.code} className="relative">
                  {(item.badge === "new" || item.badge === "count" || item.comingSoon) && (
                    <span className="absolute right-3 top-3 rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600">
                      {item.badge === "new" ? "New" : item.badge === "count" && item.count ? item.count : "Coming Soon"}
                    </span>
                  )}
                  <Card className={item.comingSoon ? "border-slate-200 bg-slate-50" : "border-slate-200"}>
                    <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                        <span aria-hidden>📄</span>
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-semibold text-slate-900">{item.code}</CardTitle>
                        <p className="text-xs text-slate-600">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="link"
                        className={item.comingSoon ? "px-0 text-slate-400" : "px-0 text-[#0A77C8]"}
                        disabled={item.comingSoon}
                        asChild={item.code === "AK-007"}
                      >
                        {item.code === "AK-007" ? (
                          <Link href="/mahasiswa/identitas-pemohon">Manage Letter</Link>
                        ) : (
                          <span>Manage Letter</span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
