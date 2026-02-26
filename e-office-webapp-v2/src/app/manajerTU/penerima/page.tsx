"use client";

import Link from "next/link";

export default function PenerimaPage() {
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
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-sm font-semibold mb-4">Filter Pencarian</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Pemohon */}
          <FilterSection title="Informasi Pemohon">
            <Input label="Nomor Surat" placeholder="Masukkan nama pemohon" />
            <Select label="Prodi/Departemen" />
            <Input label="NIM Pemohon" placeholder="Nama instansi pengirim" />
          </FilterSection>

          {/* Informasi Surat */}
          <FilterSection title="Informasi Surat">
            <Select label="Klasifikasi / Kategori" />
            <Select label="Sifat Surat" defaultValue="Biasa" />
          </FilterSection>

          {/* Periode Waktu */}
          <FilterSection title="Periode Waktu">
            <label className="text-xs text-gray-600">Tanggal Diterima</label>
            <div className="flex items-center gap-2">
              <input type="date" className="input" />
              <span className="text-gray-400">→</span>
              <input type="date" className="input" />
            </div>
          </FilterSection>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 text-sm border rounded">
            Reset
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded">
            Cari
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <Th>ID/Agenda</Th>
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
            {rows.map((row, i) => (
              <tr key={i} className="border-t">
                <Td>{row.id}</Td>
                <Td>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                    Internal
                  </span>
                </Td>
                <Td>{row.pengirim}</Td>
                <Td>{row.perihal}</Td>
                <Td>{row.tanggal}</Td>
                <Td>{row.tujuan}</Td>
                <Td>
                  <StatusBadge status={row.status} />
                </Td>
                <Td>
                  <button className="text-gray-500 hover:text-gray-700">
                    👁
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 text-sm text-gray-500">
          <span>Showing 1–5 of 100</span>
          <div className="flex gap-1">
            <PageButton>{"<"}</PageButton>
            <PageButton active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
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
        className="input"
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
      <select className="input">
        <option>{defaultValue ?? "Pilih"}</option>
      </select>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-gray-700">{children}</td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Menunggu Verifikasi": "bg-blue-100 text-blue-600",
    Selesai: "bg-green-100 text-green-600",
    "Dalam Proses": "bg-yellow-100 text-yellow-600",
    Ditolak: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${
        map[status]
      }`}
    >
      {status}
    </span>
  );
}

function PageButton({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3 py-1 border rounded ${
        active
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-100"
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
    pengirim: "Ahmad Douglas",
    perihal: "Surat Keterangan Mahasiswa",
    tanggal: "15 Agu 2023",
    tujuan: "Manajer TU",
    status: "Menunggu Verifikasi",
  },
  {
    id: "SI/2023/08/045",
    pengirim: "Dr. Budi Santoso, M.Kom",
    perihal: "Permohonan Izin Penelitian",
    tanggal: "14 Agu 2023",
    tujuan: "WD Akademik",
    status: "Selesai",
  },
  {
    id: "SK/2023/08/012",
    pengirim: "Himpunan Mahasiswa Informatika",
    perihal: "Peminjaman Ruangan Seminar",
    tanggal: "12 Agu 2023",
    tujuan: "WD Sumber Daya",
    status: "Dalam Proses",
  },
  {
    id: "SI/2023/08/044",
    pengirim: "Ani Wijayanti (Mahasiswa)",
    perihal: "Permohonan Transkrip Nilai",
    tanggal: "11 Agu 2023",
    tujuan: "Kasubbag Akademik",
    status: "Ditolak",
  },
  {
    id: "SM/2023/08/122",
    pengirim: "Himpunan Mahasiswa Biologi",
    perihal: "Penawaran Kerjasama Magang",
    tanggal: "10 Agu 2023",
    tujuan: "Admin TU",
    status: "Menunggu Verifikasi",
  },
];
