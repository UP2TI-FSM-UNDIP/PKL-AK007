"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Eye, 
  Download, 
  Hash, 
  Stamp, 
  User,
  Mail,
  Calendar,
  FileText,
  ChevronRight,
  FileSignature,
  Printer
} from "lucide-react";

export default function IdentitasPemohonPage() {
  const router = useRouter();

  const handleNumbering = () => {
    router.push("/upa/penomoran?surat=SM/2023/08/123");
  };

  const handlePreview = () => {
    router.push("/upa/pratinjau-surat?surat=SM/2023/08/123");
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/upa/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <Link href="/upa/penerima" className="hover:text-blue-600">
            Surat Masuk
          </Link>
          <ChevronRight className="w-3 h-3 mx-1" />
          <span className="text-gray-700 font-medium">Detail Surat</span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Detail Surat - UPA
            </h1>
            <p className="text-gray-600">
              Surat Keterangan Mahasiswa - ID: SM/2023/08/123
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4" />
              Cetak
            </button>
            <Link
              href="/upa/penerima"
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* ===== CONTENT GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identitas Pengaju */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Identitas Pengaju
            </h3>
            <div className="space-y-3">
              <DetailRow label="Nama Lengkap" value="Ahmad Douglas" />
              <DetailRow label="Role" value="Mahasiswa" />
              <DetailRow label="NIM" value="24060131130063" />
              <DetailRow label="Program Studi" value="S1 - Informatika" />
              <DetailRow label="Email" value="ahmaddouglas@students.undip.ac.id" />
              <DetailRow label="No. HP" value="081234567890" />
            </div>
          </div>

          {/* Detail Surat */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detail Surat
            </h3>
            <div className="space-y-3">
              <DetailRow 
                label="Jenis & Kategori" 
                value="Surat Keterangan / Surat Keterangan Mahasiswa" 
              />
              <DetailRow label="Tujuan" value="Unit Penjaminan Akademik" />
              <DetailRow label="No Surat (Sementara)" value="INV/2024/X/102" />
              <DetailRow 
                label="Perihal" 
                value="Surat Keterangan Mahasiswa untuk Keperluan Administrasi" 
              />
              <DetailRow label="Diterima" value="26 Oktober 2024" />
              <DetailRow 
                label="Keperluan" 
                value="Sebagai syarat administrasi untuk pencairan tunjangan orang tua." 
              />
            </div>
          </div>

          {/* Lampiran */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Lampiran</h3>
            <div className="space-y-6">
              <Attachment 
                filename="KTM - KTM_24060121120001.pdf"
                size="2.4 MB"
              />
              <Attachment 
                filename="Transkrip - Transkrip_Nilai_Semester_6.pdf"
                size="1.8 MB"
              />
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Aksi UPA
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleNumbering}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Hash className="w-4 h-4" />
                Lakukan Penomoran
              </button>
              <button
                onClick={handlePreview}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                <Eye className="w-4 h-4" />
                Buka Pratinjau
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition">
                <Download className="w-4 h-4" />
                Download Dokumen
              </button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Riwayat Proses</h3>
            <div className="space-y-4">
              <TimelineItem 
                step="1"
                title="Mahasiswa"
                description="Mengajukan Surat"
                date="25 Okt 2024, 14:30"
                status="completed"
              />
              <TimelineItem 
                step="2"
                title="Supervisor Akademik"
                description="Verifikasi Akademik"
                date="25 Okt 2024, 16:45"
                status="completed"
              />
              <TimelineItem 
                step="3"
                title="Admin Surat"
                description="Verifikasi Administrasi"
                date="26 Okt 2024, 09:15"
                status="completed"
              />
              <TimelineItem 
                step="4"
                title="Manajer TU"
                description="Penandatanganan"
                date="26 Okt 2024, 11:30"
                status="completed"
              />
              <TimelineItem 
                step="5"
                title="UPA"
                description="Penomoran & Stempel"
                date="Saat ini"
                status="current"
              />
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Informasi Penting</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <p className="text-gray-600">Surat telah ditandatangani oleh Manajer TU</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <p className="text-gray-600">Siap untuk penomoran dan stempel resmi</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <p className="text-gray-600">Nomor surat akan menjadi permanen setelah diterbitkan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-800 font-medium text-right max-w-[65%]">
        {value}
      </span>
    </div>
  );
}

function Attachment({ filename, size }: { filename: string; size: string }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium text-gray-800">{filename}</p>
            <p className="text-xs text-gray-500">{size}</p>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Unduh
        </button>
      </div>
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src="/dummy-surat.jpg"
          alt="Lampiran"
          fill
          className="object-contain p-4"
        />
      </div>
    </div>
  );
}

function TimelineItem({ step, title, description, date, status }: any) {
  const statusColors = {
    completed: "bg-green-500",
    current: "bg-blue-500",
    pending: "bg-gray-300",
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${statusColors[status]}`}>
          {step}
        </div>
        {step < 5 && <div className="flex-1 w-px bg-gray-200 my-2"></div>}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>
    </div>
  );
}