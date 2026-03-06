"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

interface SuratRowProps {
  id: string;
  pengirim: string;
  perihal: string;
  status: string;
  sumber: string;
  tanggal: string;
  tujuan: string;
  statusTone?: "info" | "warning" | "success" | "danger";
  canAct?: boolean;
}

interface SuratTableProps {
  role?: "manajerTU" | "UPA";
  rows?: SuratRowProps[];
}

const defaultRows: SuratRowProps[] = [
    {
      id: "SM/2023/08/123",
      pengirim: "Ahmad Douglas",
      perihal: "Surat Keterangan Mahasiswa",
      status: "Menunggu Penomoran",
      sumber: "Internal",
      tanggal: "15 Agu 2025",
      tujuan: "UPA",
      statusTone: "warning",
    },
    {
      id: "SI/2023/08/045",
      pengirim: "Dr. Budi Santoso",
      perihal: "Permohonan Izin Penelitian",
      status: "Selesai",
      sumber: "Internal",
      tanggal: "15 Agu 2025",
      tujuan: "UPA",
      statusTone: "success",
    },
    {
      id: "SK/2023/08/012",
      pengirim: "Himpunan Mahasiswa",
      perihal: "Peminjaman Ruangan Seminar",
      status: "Dalam Proses",
      sumber: "Internal",
      tanggal: "15 Agu 2025",
      tujuan: "UPA",
      statusTone: "info",
    },
    {
      id: "SI/2023/08/044",
      pengirim: "Ani Wijayanti",
      perihal: "Permohonan Transkrip Nilai",
      status: "Ditolak",
      sumber: "Internal",
      tanggal: "15 Agu 2025",
      tujuan: "UPA",
      statusTone: "danger",
    },
];

const statusToneClasses = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-orange-100 text-orange-700",
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
};

export default function SuratTable({ role = "UPA", rows }: SuratTableProps) {
  const displayRows = rows ? rows : defaultRows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-medium">ID / Agenda</th>
            <th className="px-4 py-3 text-left font-medium">Sumber</th>
            <th className="px-4 py-3 text-left font-medium">Pengirim</th>
            <th className="px-4 py-3 text-left font-medium">Perihal</th>
            <th className="px-4 py-3 text-left font-medium">Tanggal</th>
            <th className="px-4 py-3 text-left font-medium">Tujuan</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {displayRows.map((row, index) => (
            <Row key={index} {...row} role={role} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function resolveTone(status: string): keyof typeof statusToneClasses {
  const normalized = status.toLowerCase();
  if (normalized.includes("tolak") || normalized.includes("reject")) return "danger";
  if (normalized.includes("selesai") || normalized.includes("complete")) return "success";
  if (normalized.includes("proses") || normalized.includes("review") || normalized.includes("revisi")) return "info";
  return "warning";
}

function Row({
  id,
  pengirim,
  perihal,
  status,
  sumber,
  tanggal,
  tujuan,
  statusTone,
  canAct = true,
  role,
}: SuratRowProps & { role: string }) {
  const tone = statusTone ?? resolveTone(status);
  return (
    <tr className="border-b hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
      <td className="px-4 py-3 font-medium">{id}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{sumber}</span>
      </td>
      <td className="px-4 py-3">{pengirim}</td>
      <td className="px-4 py-3 max-w-xs truncate">{perihal}</td>
      <td className="px-4 py-3">{tanggal}</td>
      <td className="px-4 py-3">{tujuan}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs ${statusToneClasses[tone]}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link
            href={role === "UPA" ? `/UPA/identitas-pemohon?letterId=${id}` : `/manajerTU/identitas-pemohon?letterId=${id}`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </td>
    </tr>
  );
}
