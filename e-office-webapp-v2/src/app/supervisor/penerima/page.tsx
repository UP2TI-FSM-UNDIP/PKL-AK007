"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SupervisorSidebar } from "@/components/supervisor/SupervisorSidebar";
import { useUiPreferences } from "@/components/common/useUiPreferences";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type LetterStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name: string;
  } | null;
  values?: {
    keperluan?: string;
  } | null;
  createdBy?: {
    name?: string | null;
  } | null;
};

type LetterRow = {
  id: string;
  sumber: string;
  pemohon: string;
  perihal: string;
  keperluan: string;
  tanggal: string;
  status: LetterStatus;
  createdAt: string;
};

const statusBadge: Record<LetterStatus, string> = {
  PENDING: "text-blue-700 dark:text-blue-300",
  IN_PROGRESS: "text-orange-700 dark:text-orange-300",
  COMPLETED: "text-green-700 dark:text-green-300",
  REJECTED: "text-red-700 dark:text-red-300",
};

export default function SupervisorPenerimaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useUiPreferences();

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "PENDING") return t("pendingStatus");
    if (status === "IN_PROGRESS") return t("revisionStatus");
    if (status === "COMPLETED") return t("completedStatus");
    return t("rejectedStatus");
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "COMPLETED") return t("managerRole");
    if (status === "IN_PROGRESS") return t("studentRole");
    return t("supervisorRole");
  };

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const response = await fetch(`${API_BASE}/letters?scope=all`, {
          credentials: "include",
        });
        if (!response.ok) {
          setLetters([]);
          return;
        }
        const data = (await response.json()) as LetterApi[];
        const mapped = data
          .filter((item) => item.status === "PENDING")
          .map((item) => ({
          id: item.id,
          sumber: item.values?.sumber ?? "-",
          pemohon: item.createdBy?.name ?? "-",
          perihal: item.letterType?.name ?? "",
          keperluan: item.values?.keperluan ?? "-",
          createdAt: item.createdAt,
          tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: item.status,
        }));
        setLetters(mapped);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA]">
      <StudentNavbar
        dashboardHref="/supervisor/dashboard"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1">
        {sidebarOpen ? <SupervisorSidebar active="surat-masuk" /> : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <div className="text-sm text-slate-500 dark:text-slate-400">{t("inboxBreadcrumb")}</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("penerimaTitle")}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t("filterSearch")}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
            <FilterCard title={t("applicantInfo")}>
              <Input placeholder={t("applicantNamePlaceholder")} className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
              <Input placeholder={t("departemenPlaceholder")} className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
              <Input placeholder={t("senderOrgPlaceholder")} className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  {t("reset")}
                </Button>
                <Button className="bg-[#0A77C8] hover:bg-[#085ea0]">{t("search")}</Button>
              </div>
            </FilterCard>

            <FilterCard title={t("letterInfo")}>
              <Input placeholder={t("classificationPlaceholder")} className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
              <Input placeholder={t("letterNaturePlaceholder")} className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
            </FilterCard>

            <FilterCard title={t("timePeriod")}>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100" placeholder={t("startDate")} />
                <Input type="date" className="h-9 text-sm dark:bg-slate-900 dark:text-slate-100" placeholder={t("endDate")} />
              </div>
            </FilterCard>
          </div>

          <Card className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("allLetters")}</h2>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex w-56 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input placeholder={t("searchLetters")} className="border-0 p-0 text-sm focus-visible:ring-0 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    {t("dateRange")}
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    {t("filterStatus")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-[1.2fr_0.9fr_1.2fr_1fr_0.9fr_1.1fr_0.9fr_0.4fr] items-center gap-3 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <span>{t("reasonSubmission")}</span>
                <span>{t("source")}</span>
                <span>{t("senderApplicant")}</span>
                <span>{t("subject")}</span>
                <span>{t("receivedDate")}</span>
                <span>{t("currentTarget")}</span>
                <span className="text-right">{t("filterStatus")}</span>
                <span className="text-right">{t("action")}</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <div className="py-6 text-sm text-slate-500 dark:text-slate-400">{t("loadingLetters")}</div>
                ) : letters.length === 0 ? (
                  <div className="py-6 text-sm text-slate-500 dark:text-slate-400">{t("noLetters")}</div>
                ) : (
                  letters.map((letter) => (
                    <div
                      key={letter.id}
                      className="grid grid-cols-[1.2fr_0.9fr_1.2fr_1fr_0.9fr_1.1fr_0.9fr_0.4fr] items-center gap-3 py-3 text-sm text-slate-800 dark:text-slate-100"
                    >
                      <span className="font-semibold truncate">{letter.keperluan || "-"}</span>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 text-center truncate dark:border-slate-700 dark:text-slate-300">
                        {letter.sumber}
                      </span>
                      <span className="text-slate-700 truncate dark:text-slate-100">{letter.pemohon}</span>
                      <span className="truncate">{letter.perihal || t("letter")}</span>
                      <span className="text-slate-600 truncate dark:text-slate-300">{letter.tanggal}</span>
                      <span className="text-slate-700 truncate dark:text-slate-100">{getTargetLabel(letter.status)}</span>
                      <span className={`text-right text-xs font-semibold ${statusBadge[letter.status]}`}>
                        {getStatusLabel(letter.status)}
                      </span>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white" asChild>
                          <Link href={`/supervisor/penerima/detail?letterId=${letter.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{t("showing")} {letters.length} {t("of")} {letters.length}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-7 px-3 text-xs bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" disabled>
                  1
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="rounded-md bg-[#0A77C8] px-3 py-2 text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 space-y-2">{children}</div>
    </Card>
  );
}
