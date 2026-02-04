import StatCard from "@/components/dashboard/statcard";
import TrendChart from "@/components/dashboard/trendchart";
import StatusChart from "@/components/dashboard/statuschart";
import SuratTable from "@/components/dashboard/surattable";
import Link from "next/link";
import { ArrowRight, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function UPADashboard() {
  const urgentItems = [
    {
      id: "SM/2023/08/123",
      title: "Surat Keterangan Mahasiswa",
      time: "2 jam lalu",
    },
    {
      id: "SI/2023/08/045",
      title: "Permohonan Izin Penelitian",
      time: "4 jam lalu",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/UPA/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">
            Dashboard UPA
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Dashboard Unit Penjaminan Akademik
            </h1>
            <p className="text-gray-600">
              Pusat kendali untuk penomoran dan penerbitan surat Fakultas
              Sains dan Matematika.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/UPA/penerima"
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
        <Link href="/UPA/penerima?filter=needs_action">
          <StatCard
            title="Perlu Penomoran"
            value={15}
            description="surat belum dinomori"
            icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
            trend="+3 dari kemarin"
            color="orange"
          />
        </Link>

        <Link href="/UPA/penerima?filter=completed">
          <StatCard
            title="Sudah Dinomori"
            value={245}
            description="surat telah diterbitkan"
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            trend="+18% dari bulan lalu"
            color="green"
          />
        </Link>

        <StatCard
          title="Total Surat (Bulan Ini)"
          value={1234}
          description="total volume bulan ini"
          trend="Rata-rata 41 surat/hari"
          color="blue"
        />
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
            <h3 className="text-lg font-semibold">
              Surat Menunggu Penomoran
            </h3>
            <Link
              href="/UPA/penerima"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Lihat semua →
            </Link>
          </div>
        </div>

        <SuratTable role="UPA" />
      </div>
    </div>
  );
}
