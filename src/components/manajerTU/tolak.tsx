interface TolakModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

import { useState } from "react";

export default function TolakModal({
  open,
  onClose,
  onSubmit,
}: TolakModalProps) {
  const [note, setNote] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Tolak</h2>

        {/* Info Surat */}
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

        {/* Catatan */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">
            Berikan catatan penolakan
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan..."
            className="mt-1 w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        {/* Action */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Kembali
          </button>
          <button
            onClick={() => onSubmit(note)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
          >
            Kirim Penolakan
          </button>
        </div>
      </div>
    </div>
  );
}
