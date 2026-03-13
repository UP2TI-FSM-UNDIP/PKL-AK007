"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, Calendar, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 5;

type LetterStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UPA_REVIEW"
  | "DONE"
  | "REJECTED"
  | "MANAGER_REJECTED";

type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name?: string;
  } | null;
  values?: {
    sumber?: string;
    nomorSurat?: string;
  } | null;
  createdBy?: {
    name?: string | null;
  } | null;
};

type LetterRow = {
  id: string;
  sumber: string;
  pengirim: string;
  perihal: string;
  tanggal: string;
  tujuan: string;
  status: LetterStatus;
  statusLabel: string;
  createdAt: string;
};

export default function PenerimaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    applicantName: "",
    departemen: "",
    senderOrg: "",
    classification: "",
    letterNature: "",
    startDate: "",
    endDate: "",
  });
  const isAllSurat = searchParams?.get("scope") === "all";

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "Menunggu Penomoran";
    if (status === "DONE") return "Selesai";
    if (status === "COMPLETED" || status === "PENDING") return "Menunggu Verifikasi";
    if (status === "IN_PROGRESS") return "Dalam Proses";
    return "Ditolak";
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW" || status === "DONE") return "UPA";
    if (status === "COMPLETED") return "Manajer TU";
    if (status === "IN_PROGRESS") return "Pemohon";
    if (status === "PENDING") return "Supervisor Akademik";
    return "Manajer TU";
  };

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const search = [
          filters.applicantName,
          filters.departemen,
          filters.senderOrg,
          filters.classification,
          filters.letterNature,
        ]
          .map((value) => value.trim())
          .filter(Boolean)
          .join(" ");
        const query = new URLSearchParams();
        query.set("scope", "all");
        query.set("page", String(page));
        query.set("take", String(PAGE_SIZE));
        if (!isAllSurat) {
          query.set("status", "UPA_REVIEW");
        }
        if (search) {
          query.set("search", search);
        }
        if (filters.startDate) {
          query.set("startDate", filters.startDate);
        }
        if (filters.endDate) {
          query.set("endDate", filters.endDate);
        }
        const response = await fetch(`${API_BASE}/letters?${query.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) {
          setRows([]);
          setTotal(0);
          return;
        }
        const data = (await response.json()) as { items: LetterApi[]; total: number } | LetterApi[];
        const items = Array.isArray(data) ? data : data.items;
        const totalRows = Array.isArray(data) ? data.length : data.total;
        const mapped = items.map((item) => ({
          id: item.id,
          sumber: mapSumber(item.values?.sumber),
          pengirim: item.createdBy?.name ?? "-",
          perihal: item.letterType?.name ?? "-",
          tanggal: new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          tujuan: getTargetLabel(item.status),
          status: item.status,
          statusLabel: getStatusLabel(item.status),
          createdAt: item.createdAt,
        }));
        setRows(mapped);
        setTotal(totalRows);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, [filters, isAllSurat, page]);


  const totalLabel = useMemo(() => {
    if (isLoading) return "Loading...";
    if (total === 0) return "Showing 0–0 of 0";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `Showing ${start}–${end} of ${total}`;
  }, [isLoading, page, total]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageList = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleViewDetail = (id: string) => {
    router.push(`/UPA/identitas-pemohon?letterId=${id}`);
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/UPA/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Surat Masuk UPA</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Surat Masuk UPA
            </h1>
            <p className="text-gray-600">
              Kelola surat yang memerlukan penomoran dan stempel resmi
            </p>
          </div>
          <Link
            href="/UPA/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
        <FilterCard title="Informasi Pemohon">
          <Input
            placeholder="Masukkan nama pemohon"
            className="h-9 text-sm"
            value={filters.applicantName}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, applicantName: event.target.value }))
            }
          />
          <Input
            placeholder="Pilih departemen"
            className="h-9 text-sm"
            value={filters.departemen}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, departemen: event.target.value }))
            }
          />
          <Input
            placeholder="Nama instansi pengirim"
            className="h-9 text-sm"
            value={filters.senderOrg}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, senderOrg: event.target.value }))
            }
          />
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setFilters({
                  applicantName: "",
                  departemen: "",
                  senderOrg: "",
                  classification: "",
                  letterNature: "",
                  startDate: "",
                  endDate: "",
                });
                setPage(1);
              }}
            >
              Reset
            </Button>
            <Button className="bg-[#0A77C8] hover:bg-[#085ea0]" onClick={() => setPage(1)}>
              Cari
            </Button>
          </div>
        </FilterCard>

        <FilterCard title="Informasi Surat">
          <Input
            placeholder="Pilih klasifikasi"
            className="h-9 text-sm"
            value={filters.classification}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, classification: event.target.value }))
            }
          />
          <Input
            placeholder="Sifat Surat"
            className="h-9 text-sm"
            value={filters.letterNature}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, letterNature: event.target.value }))
            }
          />
        </FilterCard>

        <FilterCard title="Periode Waktu">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              className="h-9 text-sm"
              value={filters.startDate}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, startDate: event.target.value }))
              }
            />
            <Input
              type="date"
              className="h-9 text-sm"
              value={filters.endDate}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, endDate: event.target.value }))
              }
            />
          </div>
        </FilterCard>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID/Agenda</Th>
                <Th>Pengirim</Th>
                <Th>Perihal</Th>
                <Th>Tanggal</Th>
                <Th>Tujuan Saat Ini</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-gray-50">
                  <Td>
                    <div className="font-medium">{row.id}</div>
                    <div className="text-xs text-gray-500">{row.sumber}</div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {row.pengirim}
                    </div>
                  </Td>
                  <Td>
                    <div className="max-w-xs truncate">{row.perihal}</div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {row.tanggal}
                    </div>
                  </Td>
                  <Td>{row.tujuan}</Td>
                  <Td>
                    <StatusBadge status={row.status} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(row.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-500 border-t">
          <span>{totalLabel}</span>
          <div className="flex gap-1">
            <PageButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
              {"<"}
            </PageButton>
            {pageList.map((pageNumber) => (
              <PageButton
                key={pageNumber}
                active={pageNumber === page}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PageButton>
            ))}
            <PageButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>
              {">"}
            </PageButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="rounded-md bg-[#0A77C8] px-3 py-2 text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 space-y-2">{children}</div>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

function StatusBadge({ status }: { status: LetterStatus }) {
  const statusMap: Record<LetterStatus, { bg: string; text: string; label: string }> = {
    UPA_REVIEW: { bg: "bg-orange-100", text: "text-orange-700", label: "Menunggu Penomoran" },
    DONE: { bg: "bg-green-100", text: "text-green-700", label: "Selesai" },
    COMPLETED: { bg: "bg-blue-100", text: "text-blue-700", label: "Menunggu Verifikasi" },
    PENDING: { bg: "bg-blue-100", text: "text-blue-700", label: "Menunggu Verifikasi" },
    IN_PROGRESS: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Dalam Proses" },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
    MANAGER_REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Ditolak" },
  };

  const style = statusMap[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

function PageButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center border rounded ${
        active ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
      } ${disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function mapSumber(value?: string) {
  if (!value) return "Internal";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "Internal";
  if (normalized.includes("eksternal") || normalized.includes("external") || normalized.includes("luar")) {
    return "Eksternal";
  }
  return "Internal";
}
