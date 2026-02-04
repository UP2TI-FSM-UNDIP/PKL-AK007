"use client";

import Link from "next/link";
import { Eye, Hash, FileText } from "lucide-react";

interface SuratRowProps {
  id: string;
  pengirim: string;
  perihal: string;
  status: "Menunggu Penomoran" | "Selesai" | "Dalam Proses" | "Ditolak";
}

interface SuratTableProps {
  role?: "manajerTU" | "UPA";
}

export default function SuratTable({ role = "UPA" }: SuratTableProps) {
  const rows: SuratRowProps[] = [
    {
      id: "SM/2023/08/123",
      pengirim: "Ahmad Douglas",
      perihal: "Surat Keterangan Mahasiswa",
      status: "Menunggu Penomoran",
    },
    {
      id: "SI/2023/08/045",
      pengirim: "Dr. Budi Santoso",
      perihal: "Permohonan Izin Penelitian",
      status: "Selesai",
    },
    {
      id: "SK/2023/08/012",
      pengirim: "Himpunan Mahasiswa",
      perihal: "Peminjaman Ruangan Seminar",
      status: "Dalam Proses",
    },
    {
      id: "SI/2023/08/044",
      pengirim: "Ani Wijayanti",
      perihal: "Permohonan Transkrip Nilai",
      status: "Ditolak",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-3 text-left font-medium">ID / Agenda</th>
            <th className="py-3 text-left font-medium">Sumber</th>
            <th className="py-3 text-left font-medium">Pengirim</th>
            <th className="py-3 text-left font-medium">Perihal</th>
            <th className="py-3 text-left font-medium">Tanggal</th>
            <th className="py-3 text-left font-medium">Tujuan</th>
            <th className="py-3 text-left font-medium">Status</th>
            <th className="py-3 text-left font-medium">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <Row key={index} {...row} role={role} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ id, pengirim, perihal, status, role }: SuratRowProps & { role: string }) {
  const statusColors = {
    "Menunggu Penomoran": "bg-orange-100 text-orange-700",
    "Selesai": "bg-green-100 text-green-700",
    "Dalam Proses": "bg-blue-100 text-blue-700",
    "Ditolak": "bg-red-100 text-red-700",
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 font-medium">{id}</td>
      <td>
        <span className="px-2 py-1 text-xs bg-gray-100 rounded">Internal</span>
      </td>
      <td>{pengirim}</td>
      <td className="max-w-xs truncate">{perihal}</td>
      <td>15 Agu 2025</td>
      <td>{role === "UPA" ? "UPA" : "Manajer TU"}</td>
      <td>
        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td>
        <div className="flex gap-2">
          <Link
            href={role === "UPA" ? `/UPA/identitas-pemohon?surat=${id}` : `/manajerTU/identitas-pemohon?surat=${id}`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {role === "UPA" && status === "Menunggu Penomoran" && (
            <Link
              href={`/UPA/penomoran?surat=${id}`}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Lakukan Penomoran"
            >
              <Hash className="w-4 h-4" />
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}