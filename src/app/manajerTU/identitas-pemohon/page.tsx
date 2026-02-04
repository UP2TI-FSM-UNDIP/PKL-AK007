"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  FileSignature,
  User,
  FileText,
} from "lucide-react";

import RevisiModal from "@/components/manajerTU/revisi";
import TolakModal from "@/components/manajerTU/tolak";

/* ================= SMALL UI COMPONENTS ================= */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
      {children}
    </div>
  );
}

function CardTitle({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
      {icon}
      {title}
    </h3>
  );
}

function KeyValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between text-sm py-2 border-b last:border-b-0">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

/* ================= PAGE ================= */

export default function IdentitasPemohonPage() {
  const router = useRouter();
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* ===== BREADCRUMB ===== */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/manajerTU/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <Link href="/manajerTU/penerima" className="hover:text-blue-600">
            Surat Masuk
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">
            Identitas Pemohon
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Surat
            </h1>
            <p className="text-gray-600">
              Surat Keterangan Mahasiswa — SM/2023/08/123
            </p>
          </div>

          <Link
            href="/manajerTU/penerima"
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle
              title="Identitas Pengaju"
              icon={<User className="w-5 h-5" />}
            />
            <KeyValue label="Nama Lengkap" value="Ananda Putri" />
            <KeyValue label="Role" value="Mahasiswa" />
            <KeyValue label="NIM" value="24060131130063" />
            <KeyValue label="Program Studi" value="S1 - Informatika" />
            <KeyValue
              label="Email"
              value="anandap@students.undip.ac.id"
            />
            <KeyValue label="No. HP" value="081234567890" />
          </Card>

          <Card>
            <CardTitle
              title="Detail Surat"
              icon={<FileText className="w-5 h-5" />}
            />
            <KeyValue
              label="Jenis & Kategori"
              value="Surat Keterangan / Aktif Kuliah"
            />
            <KeyValue label="Tujuan" value="Manajer TU" />
            <KeyValue label="No Surat" value="INV/2024/X/102" />
            <KeyValue
              label="Perihal"
              value="Pengajuan Surat Keterangan Aktif Kuliah"
            />
            <KeyValue label="Diterima" value="26 Oktober 2024" />
            <KeyValue label="Keperluan" value="Beasiswa" />
          </Card>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          <Card>
            <CardTitle
              title="Aksi"
              icon={<FileSignature className="w-5 h-5" />}
            />

            <div className="space-y-3">
              <button
                onClick={() =>
                  router.push(
                    "/manajerTU/beri-ttd?surat=SM/2023/08/123"
                  )
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm"
              >
                Beri Tanda Tangan
              </button>

              <button
                onClick={() => setShowRevisiModal(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-sm"
              >
                Ajukan Revisi
              </button>

              <button
                onClick={() => setShowTolakModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm"
              >
                Tolak Surat
              </button>
            </div>
          </Card>

          <Card>
            <CardTitle
              title="Pratinjau Surat"
              icon={<Eye className="w-5 h-5" />}
            />

            <button
              onClick={() =>
                router.push(
                  "/manajerTU/pratinjau-surat?surat=SM/2023/08/123"
                )
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm"
            >
              Buka Pratinjau
            </button>
          </Card>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <RevisiModal
        open={showRevisiModal}
        onClose={() => setShowRevisiModal(false)}
        onSubmit={() => setShowRevisiModal(false)}
      />

      <TolakModal
        open={showTolakModal}
        onClose={() => setShowTolakModal(false)}
        onSubmit={() => setShowTolakModal(false)}
      />
    </div>
  );
}
