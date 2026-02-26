"use client";

<<<<<<< HEAD
import Link from "next/link";
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export default function ProfilSayaPage() {
  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Profil Saya</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Profil Saya
            </h1>
            <p className="text-gray-600">
              Kelola informasi profil dan akun Anda
            </p>
          </div>
          <Link
            href="/manajerTU/dashboard"
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ahmad Douglas</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      Manager TU
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      Aktif
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Fakultas Sains dan Matematika</p>
                  <p className="text-sm text-gray-500">Bergabung sejak 2018</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                <Edit className="w-4 h-4" />
                Edit Profil
              </button>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem icon={<User />} label="Nama Lengkap" value="Ahmad Douglas" />
              <DetailItem icon={<Calendar />} label="NIP" value="198012102005011001" />
              <DetailItem icon={<MapPin />} label="Jabatan" value="Manager Tata Usaha" />
              <DetailItem icon={<Mail />} label="Email" value="ahmaddouglas@fsm.undip.ac.id" />
              <DetailItem icon={<Phone />} label="Telepon" value="+62 812 3456 7890" />
              <DetailItem icon={<User />} label="Departemen" value="Tata Usaha" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Surat Diproses" value="1,234" description="Total bulan ini" />
            <StatCard title="Tertanda Tangan" value="987" description="Sudah ditandatangani" />
            <StatCard title="Rata-rata Waktu" value="2.5 hari" description="Per surat" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Link
                href="/manajerTU/dashboard"
                className="block p-3 border rounded-lg hover:bg-gray-50 text-sm transition"
              >
                ← Kembali ke Dashboard
              </Link>
              <Link
                href="/manajerTU/penerima"
                className="block p-3 border rounded-lg hover:bg-gray-50 text-sm transition"
              >
                📥 Lihat Surat Masuk
              </Link>
              <Link
                href="/manajerTU/beri-ttd"
                className="block p-3 border rounded-lg hover:bg-gray-50 text-sm transition"
              >
                ✍️ Tandatangani Surat
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              <ActivityItem 
                time="1 jam lalu"
                action="Menandatangani surat"
                detail="SM/2023/08/123"
              />
              <ActivityItem 
                time="3 jam lalu"
                action="Merevisi surat"
                detail="SI/2023/08/045"
              />
              <ActivityItem 
                time="5 jam lalu"
                action="Memproses pengajuan"
                detail="Mahasiswa baru"
              />
=======
export default function ProfilSayaPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb / Title kecil */}
      <p className="text-sm text-gray-500 mb-4">Profil saya</p>

      {/* Card utama */}
      <div className="bg-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Profil Saya</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 flex gap-8">
          {/* ===== AVATAR ===== */}
          <div className="flex flex-col items-center justify-center w-1/4">
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center">
              {/* Icon user */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-300" />

          {/* ===== DATA PROFIL ===== */}
          <div className="flex-1 space-y-3 text-sm">
            <h2 className="font-semibold text-lg mb-4">Ahmad Douglas</h2>

            <ProfileRow label="Nama" value="Ahmad Douglas" />
            <ProfileRow label="NIP" value="198012102005011001" />
            <ProfileRow label="Prodi" value="Informatika" />
            <ProfileRow label="Email" value="ahmaddouglas12345@gmail.com" />

            <div className="flex gap-6 items-center">
              <span className="text-gray-500 w-24">Role</span>
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                Manager TU
              </span>
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }: any) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

function ActivityItem({ time, action, detail }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
      <div>
        <p className="font-medium text-sm">{action}</p>
        <p className="text-xs text-gray-500">{detail}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
=======
/* ===== Helper Component ===== */

interface ProfileRowProps {
  label: string;
  value: string;
}

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className="flex gap-6">
      <span className="text-gray-500 w-24">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
>>>>>>> fb9ea7590093811c2202f03867ab476793c7afea
