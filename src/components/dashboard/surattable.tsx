interface SuratRowProps {
  id: string;
  pengirim: string;
  perihal: string;
  status: "Menunggu Verifikasi" | "Selesai" | "Dalam Proses" | "Ditolak";
}

export default function SuratTable(){
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Semua Surat</h3>

        <div className="flex gap-2">
          <input
            placeholder="Cari surat..."
            className="border rounded px-3 py-1 text-sm"
          />
          <button className="border rounded px-3 py-1 text-sm">
            Rentang Tanggal
          </button>
          <button className="border rounded px-3 py-1 text-sm">
            Status
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2 text-left">ID / Agenda</th>
            <th>Sumber</th>
            <th>Pengirim</th>
            <th>Perihal</th>
            <th>Tanggal</th>
            <th>Tujuan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          <Row
            id="SM/2023/08/123"
            pengirim="Ahmad Douglas"
            perihal="Surat Keterangan Mahasiswa"
            status="Menunggu Verifikasi"
          />
          <Row
            id="SI/2023/08/045"
            pengirim="Dr. Budi Santoso"
            perihal="Permohonan Izin Penelitian"
            status="Selesai"
          />
        </tbody>
      </table>
    </div>
  );
}

function Row({
  id,
  pengirim,
  perihal,
  status,
}: SuratRowProps) {
  return (
    <tr className="border-b">
      <td className="py-3">{id}</td>
      <td>Internal</td>
      <td>{pengirim}</td>
      <td>{perihal}</td>
      <td>15 Agu 2025</td>
      <td>Supervisor Akademik</td>
      <td>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {status}
        </span>
      </td>
      <td>👁</td>
    </tr>
  );
}
