"use client";

import { useState } from "react";

interface RevisiModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (target: string, note: string) => void;
}

export default function RevisiModal({
  open,
  onClose,
  onSubmit,
}: RevisiModalProps) {
  const [target, setTarget] = useState("Mahasiswa");
  const [note, setNote] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Revisi</h2>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">Nama Surat</p>
            <p className="font-medium">
              Pengajuan Surat Keterangan Aktif Kuliah
            </p>
          </div>
          <div>
            <p className="text-gray-500">Jenis Surat</p>
            <p className="font-medium">Surat Keterangan</p>
          </div>
        </div>

        {/* Target */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Pilih Target Revisi
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Ketika surat direvisi maka surat akan kembali ke target yang dipilih
          </p>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option>Supervisor Akademik</option>
            <option>Mahasiswa</option>
          </select>
        </div>

        {/* Catatan */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Berikan catatan revisi
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan..."
            className="w-full border rounded px-3 py-2 text-sm min-h-[80px]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Kembali
          </button>
          <button
            onClick={() => onSubmit(target, note)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Kirim Revisi
          </button>
        </div>
      </div>
    </div>
  );
}
