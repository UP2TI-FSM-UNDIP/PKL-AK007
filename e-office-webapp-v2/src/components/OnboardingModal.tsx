"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type ProgramStudi = {
  id: string;
  name: string;
};

export function OnboardingModal({ isOpen, onSuccess }: { isOpen: boolean; onSuccess: () => void }) {
  const [prodis, setProdis] = useState<ProgramStudi[]>([]);
  const [nim, setNim] = useState("");
  const [tahunMasuk, setTahunMasuk] = useState("");
  const [programStudiId, setProgramStudiId] = useState("");
  const [noHp, setNoHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE}/master/program-studi/all`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setProdis(data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mahasiswa: {
            nim,
            tahunMasuk,
            programStudiId,
            noHp,
          },
        }),
      });

      if (!resp.ok) {
        throw new Error("Gagal menyimpan data profil.");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold text-slate-800">Lengkapi Profil Anda</h2>
        <p className="mb-6 text-sm text-slate-600">
          Selamat datang! Anda diwajibkan untuk melengkapi data mahasiswa sebelum dapat menggunakan sistem.
        </p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">NIM</label>
            <input
              required
              name="nim"
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan NIM Anda"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Program Studi</label>
            <select
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              value={programStudiId}
              onChange={(e) => setProgramStudiId(e.target.value)}
            >
              <option value="" disabled>Pilih Program Studi</option>
              {prodis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tahun Masuk</label>
            <input
              required
              name="tahunMasuk"
              type="text"
              maxLength={4}
              pattern="\d{4}"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Misal: 2021"
              value={tahunMasuk}
              onChange={(e) => setTahunMasuk(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">No. Handphone (WhatsApp)</label>
            <input
              required
              name="noHp"
              type="tel"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Misal: 081234567890"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}
