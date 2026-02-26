"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, Eye, FileText, Clock, User, Hash, Calendar, Download } from "lucide-react";
import { useState } from "react";

export default function PenerimaPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const handleViewDetail = (id: string) => {
    router.push(`/upa/identitas-pemohon?surat=${id}`);
  };

  const handleNumbering = (id: string) => {
    router.push(`/upa/penomoran?surat=${id}`);
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/upa/dashboard" className="hover:text-blue-600">
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
            href="/upa/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-sm font-semibold mb-4">Filter Pencarian</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Pemohon */}
          <FilterSection title="Informasi Pemohon">
            <Input label="Nomor Surat" placeholder="Masukkan nomor surat" />
            <Select label="Prodi/Departemen" />
            <Input label="NIM/NIP Pemohon" placeholder="Masukkan NIM/NIP" />
          </FilterSection>

          {/* Informasi Surat */}
          <FilterSection title="Informasi Surat">
            <Select label="Jenis Surat" />
            <Select label="Status Penomoran" defaultValue="Semua" />
          </FilterSection>

          {/* Periode Waktu */}
          <FilterSection title="Periode Waktu">
            <label className="text-xs text-gray-600">Tanggal Diterima</label>
            <div className="flex items-center gap-2">
              <input type="date" className="w-full border rounded px-3 py-2 text-sm" />
              <span className="text-gray-400">→</span>
              <input type="date" className="w-full border rounded px-3 py-2 text-sm" />
            </div>
          </FilterSection>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
            Reset
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Cari
          </button>
        </div>
      </div>

      {/* ===== QUICK FILTERS ===== */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Semua", count: 100 },
          { id: "needs_numbering", label: "Perlu Penomoran", count: 15 },
          { id: "needs_stamp", label: "Perlu Stempel", count: 8 },
          { id: "completed", label: "Selesai", count: 77 },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === item.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.label}
            <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
              {item.count}
            </span>
          </button>
        ))}
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
                      {row.status === "Menunggu Penomoran" && (
                        <button
                          onClick={() => handleNumbering(row.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Lakukan Penomoran"
                        >
                          <Hash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-500 border-t">
          <span>Menampilkan 1–5 dari 100 surat</span>
          <div className="flex gap-1">
            <PageButton>{"<"}</PageButton>
            <PageButton active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>4</PageButton>
            <PageButton>5</PageButton>
            <PageButton>{">"}</PageButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white text-xs px-4 py-2">
        {title}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function Input({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-600">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

function Select({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-600">{label}</label>
      <select className="w-full border rounded px-3 py-2 text-sm">
        <option>{defaultValue ?? "Pilih"}</option>
      </select>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { bg: string; text: string }> = {
    "Menunggu Penomoran": { bg: "bg-orange-100", text: "text-orange-700" },
    "Menunggu Stempel": { bg: "bg-yellow-100", text: "text-yellow-700" },
    "Selesai": { bg: "bg-green-100", text: "text-green-700" },
    "Dalam Proses": { bg: "bg-blue-100", text: "text-blue-700" },
    "Ditolak": { bg: "bg-red-100", text: "text-red-700" },
  };

  const style = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {status}
    </span>
  );
}

function PageButton({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center border rounded ${
        active ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/* ===== DUMMY DATA ===== */
const rows = [
  {
    id: "SM/2023/08/123",
    sumber: "Internal",
    pengirim: "Ahmad Douglas",
    perihal: "Surat Keterangan Mahasiswa",
    tanggal: "15 Agu 2023",
    tujuan: "UPA",
    status: "Menunggu Penomoran",
  },
  {
    id: "SI/2023/08/045",
    sumber: "Internal",
    pengirim: "Dr. Budi Santoso, M.Kom",
    perihal: "Permohonan Izin Penelitian",
    tanggal: "14 Agu 2023",
    tujuan: "UPA",
    status: "Menunggu Stempel",
  },
  {
    id: "SK/2023/08/012",
    sumber: "Internal",
    pengirim: "Himpunan Mahasiswa Informatika",
    perihal: "Peminjaman Ruangan Seminar",
    tanggal: "12 Agu 2023",
    tujuan: "UPA",
    status: "Selesai",
  },
  {
    id: "SI/2023/08/044",
    sumber: "Internal",
    pengirim: "Ani Wijayanti (Mahasiswa)",
    perihal: "Permohonan Transkrip Nilai",
    tanggal: "11 Agu 2023",
    tujuan: "UPA",
    status: "Dalam Proses",
  },
  {
    id: "SM/2023/08/122",
    sumber: "Internal",
    pengirim: "Himpunan Mahasiswa Biologi",
    perihal: "Penawaran Kerjasama Magang",
    tanggal: "10 Agu 2023",
    tujuan: "UPA",
    status: "Ditolak",
  },
];