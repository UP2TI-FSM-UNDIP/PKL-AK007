import StatCard from "@/components/dashboard/statcard";
import TrendChart from "@/components/dashboard/trendchart";
import StatusChart from "@/components/dashboard/statuschart";
import SuratTable from "@/components/dashboard/surattable";

export default function DashboardPersuratan() {
  return (
    <>
      <p className="text-sm text-gray-500 mb-2">
        Dashboard / Dashboard Persuratan
      </p>

      <h1 className="text-2xl font-semibold mb-1">
        Dashboard Persuratan
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Pusat kendali untuk mengelola semua surat Fakultas Sains dan Matematika.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Perlu Tindakan" value={20} description="surat belum diproses" />
        <StatCard title="Selesai (Bulan Ini)" value={1100} description="surat telah diarsipkan" />
        <StatCard title="Total Surat (Bulan Ini)" value={1234} description="total volume bulan ini" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <StatusChart />
      </div>

      <SuratTable />
    </>
  );
}
