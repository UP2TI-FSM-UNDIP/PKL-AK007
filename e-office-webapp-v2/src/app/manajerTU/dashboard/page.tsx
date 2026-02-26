import StatCard from "@/components/dashboard/statcard";
import TrendChart from "@/components/dashboard/trendchart";
import StatusChart from "@/components/dashboard/statuschart";
import SuratTable from "@/components/dashboard/surattable";
import Link from "next/link";
import { ArrowRight, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function DashboardPersuratan() {
  const urgentItems = [
    { id: "SM/2023/08/123", title: "Surat Keterangan Mahasiswa", time: "2 jam lalu" },
    { id: "SI/2023/08/045", title: "Permohonan Izin Penelitian", time: "4 jam lalu" },
  ];

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Dashboard Persuratan</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Dashboard Persuratan
            </h1>
            <p className="text-gray-600">
              Pusat kendali untuk mengelola semua surat Fakultas Sains dan Matematika.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/manajerTU/penerima"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FileText className="w-4 h-4" />
              Lihat Surat Masuk
            </Link>
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/manajerTU/penerima?filter=needs_action">
          <StatCard 
            title="Perlu Tindakan" 
            value={20} 
            description="surat belum diproses"
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            trend="+2 dari kemarin"
            color="orange"
          />
        </Link>
        <Link href="/manajerTU/penerima?filter=completed">
          <StatCard 
            title="Selesai (Bulan Ini)" 
            value={1100} 
            description="surat telah diarsipkan"
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            trend="+15% dari bulan lalu"
            color="green"
          />
        </Link>
        <StatCard 
          title="Total Surat (Bulan Ini)" 
          value={1234} 
          description="total volume bulan ini"
          trend="Rata-rata 45 surat/hari"
          color="blue"
        />
      </div>

      {/* ===== URGENT ACTION ===== */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Perlu Tindakan Segera
          </h3>
          <Link 
            href="/manajerTU/penerima" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {urgentItems.map((item) => (
            <Link
              key={item.id}
              href={`/manajerTU/identitas-pemohon?surat=${item.id}`}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-200 transition"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">ID: {item.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{item.time}</span>
                <button className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                  Proses
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <StatusChart />
      </div>

      {/* ===== RECENT SURAT ===== */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Surat Terbaru</h3>
            <Link 
              href="/manajerTU/penerima" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Lihat semua →
            </Link>
          </div>
        </div>
        <SuratTable />
      </div>
    </div>
  );
}