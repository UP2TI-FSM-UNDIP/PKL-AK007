# AK007 – E-Office Monorepo

![docs](https://github.com/aisyyaaa/AK007/actions/workflows/docs.yml/badge.svg)

## Ringkas
Repositori monorepo untuk aplikasi e-office (frontend Next.js + shadcn/ui dan backend Prisma) yang dikerjakan selama PKL. Dokumen ini ditujukan untuk pembimbing dan rekan tim sebagai panduan cepat setup dan kontribusi.

## Fitur
- Alur pengajuan surat (identitas, detail, lampiran, review) untuk beberapa role.
- Komponen UI shadcn + Tailwind.
- Typedoc untuk dokumentasi otomatis.
- Prisma schema + seed akun contoh (SQLite dev, siap dialihkan ke Postgres).

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, shadcn/ui, Tailwind.
- Backend/ORM: Prisma.
- Docs: Typedoc (Markdown).
- Package manager: npm/bun (workspaces).

## Struktur Folder (2 level)
- `e-office-webapp-v2/` – Frontend Next.js
  - `src/app/` – Halaman/route
  - `src/components/` – Komponen UI
  - `docs/` – Hasil generate Typedoc (Markdown)
  - `prisma/` – Schema & seed SQLite
- `e-office-api-v2/` – Backend/API (lihat folder ini jika dipakai)
- `.github/workflows/` – Pipeline CI (docs.yml)

## Cara Jalanin
```bash
# dari root monorepo
cd e-office-webapp-v2
npm install        # atau bun/pnpm sesuai preferensi
npm run dev        # jalankan Next.js di localhost:3000
```
Prisma (SQLite dev):
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Skrip Penting
- `npm run dev` – Jalankan dev server.
- `npm run build` – Build produksi.
- `npm run docs` – Generate dokumentasi Typedoc (Markdown ke folder `docs/`).
- `npm run prisma:migrate` / `prisma:seed` – Migrasi & seed Prisma (dev).

## API
- Jika tersedia, lihat spesifikasi di `docs/openapi.yaml` atau folder `api` terkait.
- Untuk backend Prisma, skema ada di `prisma/schema.prisma`.

## Kontribusi
1) Buat branch fitur dari `main`.  
2) Pastikan lint/build jalan: `npm run lint`, `npm run build` (opsional).  
3) Tambahkan/ perbarui dokumentasi (README, docs).  
4) Commit dengan pesan ringkas, buka PR untuk review.

## Lisensi
Belum ditentukan (tentukan lisensi proyek di sini, mis. MIT/Proprietary).***
