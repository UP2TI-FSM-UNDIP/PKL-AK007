"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Hash,
  Calendar,
  Image,
  Mail,
  Save,
  Edit,
  Upload,
  Check,
  X,
  Building,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type SettingsPayload = {
  penomoranOtomatis: boolean;
  formatNomor: string;
  tahunAkademik: string;
  namaAplikasi: string;
  alamatPengirim: string;
  notifikasiEmail: boolean;
  logoUrl?: string;
  fakultasName?: string;
  universitasName?: string;
};

export default function PengaturanSistemPage() {
  const router = useRouter();
  const [penomoranOtomatis, setPenomoranOtomatis] = useState(true);
  const [formatNomor, setFormatNomor] = useState("012/XX/FSM/UNDIP/IV/2024");
  const [tahunAkademik, setTahunAkademik] = useState("2023/2024");
  const [namaAplikasi, setNamaAplikasi] = useState("Sistem Persuratan FSM UNDIP");
  const [alamatPengirim, setAlamatPengirim] = useState("noreply@undip.ac.id");
  const [notifikasiEmail, setNotifikasiEmail] = useState(true);
  const [logoUrl, setLogoUrl] = useState("");
  const [fakultasName, setFakultasName] = useState("Fakultas Sains dan Matematika");
  const [universitasName, setUniversitasName] = useState("Universitas Diponegoro");
  const [isEditingFormat, setIsEditingFormat] = useState(false);
  const [tempFormatNomor, setTempFormatNomor] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch(`${API_BASE}/superadmin/settings`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as SettingsPayload;
      setPenomoranOtomatis(data.penomoranOtomatis);
      setFormatNomor(data.formatNomor);
      setTahunAkademik(data.tahunAkademik);
      setNamaAplikasi(data.namaAplikasi);
      setAlamatPengirim(data.alamatPengirim);
      setNotifikasiEmail(data.notifikasiEmail);
      setLogoUrl(data.logoUrl ?? "");
      setFakultasName(data.fakultasName ?? "Fakultas Sains dan Matematika");
      setUniversitasName(data.universitasName ?? "Universitas Diponegoro");
    };
    loadSettings();
  }, []);

  const handleEditFormat = () => {
    setTempFormatNomor(formatNomor);
    setIsEditingFormat(true);
  };

  const handleSaveFormat = () => {
    setFormatNomor(tempFormatNomor);
    setIsEditingFormat(false);
  };

  const handleCancelFormat = () => {
    setIsEditingFormat(false);
  };

  const handleKelolaTemplate = () => {
    router.push("/superadmin/template-surat");
  };

  const handleSaveSettings = async () => {
    const response = await fetch(`${API_BASE}/superadmin/settings`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        penomoranOtomatis,
        formatNomor,
        tahunAkademik,
        namaAplikasi,
        alamatPengirim,
        notifikasiEmail,
        logoUrl,
        fakultasName,
        universitasName,
      }),
    });
    if (!response.ok) {
      alert("Gagal menyimpan pengaturan.");
      return;
    }
    alert("Pengaturan tersimpan.");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atur berbagai pengaturan sistem seperti template surat, penomoran surat otomatis, dan notifikasi email.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Template Surat</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-800">Template Surat</h3>
              <p className="text-sm text-gray-500 mt-1">Kelola template surat untuk berbagai keperluan</p>
            </div>
            <button
              onClick={handleKelolaTemplate}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Kelola Template
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Nomor Surat Otomatis</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {penomoranOtomatis ? (
                  <ToggleRight className="w-5 h-5 text-green-600" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Penomoran Otomatis</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Aktifkan atau nonaktifkan penomoran surat otomatis.
                </p>
              </div>
            </div>
            <button
              onClick={() => setPenomoranOtomatis(!penomoranOtomatis)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                penomoranOtomatis ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  penomoranOtomatis ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">Format Nomor Surat</h3>
                {!isEditingFormat ? (
                  <div className="mt-2 flex items-center gap-3">
                    <code className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800">
                      {formatNomor}
                    </code>
                    <button
                      onClick={handleEditFormat}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempFormatNomor}
                      onChange={(e) => setTempFormatNomor(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Format nomor surat"
                    />
                    <button
                      onClick={handleSaveFormat}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelFormat}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">Tahun Akademik Aktif</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tahun akademik yang sedang berjalan</p>
                <div className="mt-2">
                  <select
                    value={tahunAkademik}
                    onChange={(e) => setTahunAkademik(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>2022/2023</option>
                    <option>2023/2024</option>
                    <option>2024/2025</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Logo Fakultas</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo fakultas" className="h-full w-full object-cover" />
                ) : (
                  <Building className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-800">{fakultasName}</h3>
              <p className="text-sm text-gray-500">{universitasName}</p>

              <div className="mt-4">
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Unggah Logo Baru</p>
                    <p className="text-xs text-gray-500 mt-1">File PNG atau JPG, maks.: 2 MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".png,.jpg,.jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setLogoUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Pengaturan Email Notifikasi</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Nama Aplikasi</label>
            <div className="col-span-2">
              <input
                type="text"
                value={namaAplikasi}
                onChange={(e) => setNamaAplikasi(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama Aplikasi"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Alamat Pengirim</label>
            <div className="col-span-2">
              <input
                type="email"
                value={alamatPengirim}
                onChange={(e) => setAlamatPengirim(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="noreply@domain.ac.id"
              />
              <p className="text-xs text-gray-500 mt-1">Email yang akan digunakan sebagai pengirim notifikasi</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Nama Fakultas</label>
            <div className="col-span-2">
              <input
                type="text"
                value={fakultasName}
                onChange={(e) => setFakultasName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Fakultas"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-start">
            <label className="text-sm font-medium text-gray-700 pt-2">Nama Universitas</label>
            <div className="col-span-2">
              <input
                type="text"
                value={universitasName}
                onChange={(e) => setUniversitasName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Universitas"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Notifikasi Email</p>
              <p className="text-xs text-gray-500">Aktifkan pengiriman notifikasi email</p>
            </div>
            <button
              onClick={() => setNotifikasiEmail(!notifikasiEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifikasiEmail ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifikasiEmail ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
