"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye } from "lucide-react";

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
  | "MANAGER_REJECTED"
  | "REJECTED";

type LetterApi = {
  id: string;
  status: LetterStatus;
  createdAt: string;
  letterType?: {
    name?: string;
  } | null;
  values?: {
    sumber?: string;
    keperluan?: string;
  } | null;
  createdBy?: {
    name?: string | null;
  } | null;
};

type LetterRow = {
  id: string;
  sumber: string;
  alasan: string;
  pengirim: string;
  perihal: string;
  tanggal: string;
  tujuan: string;
  status: LetterStatus;
  statusLabel: string;
  createdAt: string;
};

export default function PenerimaPage() {
  const [rows, setRows] = useState<LetterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    pemohon: "",
    departemen: "",
    instansi: "",
    klasifikasi: "",
    sifat: "",
    startDate: "",
    endDate: "",
  });
  const searchParams = useSearchParams();
  const isAllSurat = searchParams.get("scope") === "all";

  const getStatusLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "Menunggu Penomoran UPA";
    if (status === "COMPLETED") return "Menunggu Verifikasi";
    if (status === "PENDING") return "Menunggu Verifikasi";
    if (status === "IN_PROGRESS") return "Dalam Proses";
    if (status === "DONE") return "Selesai";
    return "Ditolak";
  };

  const getTargetLabel = (status: LetterStatus) => {
    if (status === "UPA_REVIEW") return "UPA";
    if (status === "COMPLETED" || status === "DONE") return "Manajer TU";
    if (status === "IN_PROGRESS") return "Pemohon";
    if (status === "PENDING") return "Supervisor Akademik";
    return "Manajer TU";
  };

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const search = [
          filters.pemohon,
          filters.departemen,
          filters.instansi,
          filters.klasifikasi,
          filters.sifat,
        ]
          .map((value) => value.trim())
          .filter(Boolean)
          .join(" ");
        const query = new URLSearchParams();
        query.set("scope", "all");
        query.set("page", String(page));
        query.set("take", String(PAGE_SIZE));
        if (!isAllSurat) {
          query.set("status", "COMPLETED");
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
        const mapped = items
          .map((item) => ({
            id: item.id,
            sumber: mapSumber(item.values?.sumber),
            alasan: item.values?.keperluan ?? "-",
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

  return (
    <div className="space-y-6">
      {/* ===== BREADCRUMB ===== */}
      <p className="text-sm text-gray-500">
        Surat masuk / <span className="text-gray-700">Penerima</span>
      </p>

      {/* ===== TITLE ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Penerima</h1>
        <p className="text-sm text-gray-500">Penerima</p>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-[1.1fr_1.1fr_0.9fr]">
        <FilterCard title="Informasi Pemohon">
          <Input
            placeholder="Masukkan nama pemohon"
            className="h-9 text-sm"
            value={filters.pemohon}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, pemohon: event.target.value }))
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
            value={filters.instansi}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, instansi: event.target.value }))
            }
          />
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setFilters({
                  pemohon: "",
                  departemen: "",
                  instansi: "",
                  klasifikasi: "",
                  sifat: "",
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
            value={filters.klasifikasi}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, klasifikasi: event.target.value }))
            }
          />
          <Input
            placeholder="Sifat Surat"
            className="h-9 text-sm"
            value={filters.sifat}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, sifat: event.target.value }))
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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <Th>Alasan Pengajuan</Th>
              <Th>Sumber</Th>
              <Th>Pengirim/Pemohon</Th>
              <Th>Perihal</Th>
              <Th>Tanggal Diterima</Th>
              <Th>Tujuan Saat Ini</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <Td colSpan={8}>Memuat data surat...</Td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <Td colSpan={8}>Belum ada surat masuk.</Td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <Td>{row.alasan}</Td>
                  <Td>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                      {row.sumber}
                    </span>
                  </Td>
                  <Td>{row.pengirim}</Td>
                  <Td>{row.perihal}</Td>
                  <Td>{row.tanggal}</Td>
                  <Td>{row.tujuan}</Td>
                  <Td>
                    <StatusBadge status={row.status} label={row.statusLabel} />
                  </Td>
                  <Td>
                    <Link
                      href={`/manajerTU/identitas-pemohon?letterId=${row.id}`}
                      className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label="Lihat detail surat"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-500">
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
  return (
    <th className="px-4 py-3 text-left text-xs font-medium">
      {children}
    </th>
  );
}

function Td({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className="px-4 py-3 text-gray-700">
      {children}
    </td>
  );
}

function StatusBadge({ status, label }: { status: LetterStatus; label: string }) {
  const map: Record<LetterStatus, string> = {
    PENDING: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-purple-100 text-purple-600",
    UPA_REVIEW: "bg-emerald-100 text-emerald-600",
    DONE: "bg-green-100 text-green-600",
    IN_PROGRESS: "bg-yellow-100 text-yellow-600",
    REJECTED: "bg-red-100 text-red-600",
    MANAGER_REJECTED: "bg-red-100 text-red-600",
  };

  return (
    <span className="flex flex-col items-start gap-1">
      {label.split(" ").filter(Boolean).map((word, index) => (
        <span key={`${word}-${index}`} className={`px-2 py-1 rounded-full text-xs ${map[status]}`}>
          {word}
        </span>
      ))}
    </span>
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
      className={`px-3 py-1 border rounded ${
        active
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100"
      } ${disabled ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
