# Kemenhaj Pare — Portal Layanan & Dashboard

Portal informasi publik Kantor Kementerian Haji dan Umrah Kota Parepare, lengkap dengan dashboard internal untuk mengelola layanan, berita, pejabat, dan galeri.

- `PRD.md` — ruang lingkup produk (sumber kebenaran fitur).
- `DESIGN.md` — sistem desain portal publik dan pemetaan tema dashboard.
- `AGENTS.md` — catatan teknis untuk agen/kontributor.

## Teknologi

- Next.js 16 (App Router, React 19, Server Actions, `cacheComponents`)
- Tailwind CSS v4 (token tema di `app/globals.css`)
- PostgreSQL + Drizzle ORM
- iron-session + Argon2id untuk autentikasi
- shadcn/ui (Base UI) khusus area dashboard; portal publik memakai primitif sendiri di `components/ui.tsx`

## Prasyarat

- Node.js 20+
- PostgreSQL 16+ (lokal, atau lewat Docker Compose)
- npm

## Menjalankan secara lokal

1. Pasang dependensi.

   ```bash
   npm install
   ```

2. Siapkan database. Cara termudah:

   ```bash
   docker compose up -d db
   ```

   Atau pakai PostgreSQL lokal dan buat database `kemenhaj`.

3. Salin env contoh lalu isi nilainya.

   ```bash
   cp .env.example .env
   ```

   | Variabel | Keterangan |
   | --- | --- |
   | `DATABASE_URL` | Koneksi PostgreSQL. Contoh TCP: `postgresql://kemenhaj:kemenhaj@localhost:5432/kemenhaj`. Bisa juga memakai unix socket: `postgresql://damaru@localhost/kemenhaj?host=/var/run/postgresql`. |
   | `SESSION_PASSWORD` | Kunci enkripsi cookie iron-session, **minimal 32 karakter**. Buat dengan `openssl rand -hex 32`. |
   | `SEED_PASSWORD` | Password awal untuk akun seed. Ganti sebelum produksi. |

4. Jalankan migrasi dan seed.

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   Seed bersifat idempoten: aman dijalankan berulang. Seed membuat 1 akun, 3 layanan, 8 berita, 7 pejabat, dan 6 album contoh. Formulir PDF dan gambar disalin dari `public/` ke `storage/uploads/`.

5. Jalankan server pengembangan.

   ```bash
   npm run dev
   ```

   Portal publik: <http://localhost:3000> — Dashboard: <http://localhost:3000/admin>

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan di port 3000 |
| `npm run build` / `npm start` | Build dan jalankan produksi |
| `npm run lint` | ESLint seluruh repo |
| `npx tsc --noEmit` | Typecheck (belum ada script khusus) |
| `npm run db:generate` | Buat migrasi Drizzle dari perubahan skema |
| `npm run db:migrate` | Terapkan migrasi ke database |
| `npm run db:seed` | Seed akun, layanan, berita, pejabat, galeri, dan media |
| `npm run db:studio` | Buka Drizzle Studio |

## Akun dan peran

Aplikasi ini hanya memakai satu peran, `superadmin`, dan seed membuat satu akun. Password akun mengikuti `SEED_PASSWORD`.

| Email | Peran | Hak akses |
| --- | --- | --- |
| `superadmin@kemenhajpare.go.id` | `superadmin` | Semua: layanan, berita, pejabat, galeri, audit log, dan profil akun sendiri. |

Nama, email, dan password akun diubah sendiri lewat halaman `/admin/profil`. Tidak ada CRUD pengguna.

Otorisasi tidak hanya di UI: setiap fungsi di `lib/data` memanggil `requirePermission()` sehingga Server Action yang dipalsukan tetap ditolak.

## Alur data

```
app/(public)/*  ─┐
app/api/files/* ─┼─> lib/data/* ─> lib/db (Drizzle) ─> PostgreSQL
app/admin/*     ─┘        │
                          └─> storage/uploads (PDF dan gambar)
```

- `lib/data/{services,articles,officials,galleries}.ts` adalah satu-satunya pintu baca/tulis tiap modul.
- Data publik dibungkus `'use cache'` + tag `services`, `articles`, `officials`, atau `galleries`. Setiap mutasi memanggil `updateTag(tag)` sehingga perubahan langsung terlihat di portal.
- Berkas disajikan lewat `app/api/files/[id]`. PDF diunduh sebagai lampiran; gambar ditampilkan inline. Media milik konten draf hanya bisa diakses pengguna yang sudah masuk.

## Penyimpanan berkas

- Upload disimpan di `storage/uploads/` (di luar `public/`, di-gitignore kecuali `.gitkeep`).
- PDF maksimal 5 MB dengan tanda tangan `%PDF-`; gambar JPG/PNG/WebP maksimal 2 MB.
- Saat media diganti, konten dihapus, atau foto dikeluarkan dari album, berkas lama dibersihkan otomatis bila tidak dipakai di tempat lain.
- Di produksi, pasang volume persisten untuk `storage/uploads/`.

## Catatan produksi

- Jalankan di belakang HTTPS. Cookie sesi memakai atribut `Secure` saat `NODE_ENV=production`, sehingga login lewat HTTP biasa tidak akan menyimpan sesi.
- Rate limit login (5 percobaan / 15 menit) masih disimpan di memori proses. Untuk deployment multi-instance, pindahkan ke Redis.
- `SESSION_PASSWORD` dan `SEED_PASSWORD` wajib diganti; jangan commit `.env`.
- Penyimpanan media masih lokal di `storage/uploads/`; untuk lebih dari satu instance, pindahkan ke object storage bersama.

## Struktur direktori

```
app/
  (public)/          portal publik: beranda, berita, layanan, profil, galeri, pencarian
  admin/login/       halaman masuk
  admin/(panel)/     dashboard: ringkasan, layanan, berita, pejabat, galeri, aktivitas
  api/files/[id]/    streaming PDF dan gambar
components/          komponen publik + components/admin/* (shadcn)
lib/
  auth/              sesi, password, izin, rate limit
  data/              lapisan data (services, articles, officials, galleries, media, audit)
  db/                koneksi dan skema Drizzle
  uploads/           penyimpanan PDF dan gambar
  validation/        skema Zod
drizzle/             migrasi SQL hasil generate
scripts/seed.ts      seed database (sumber konten awal: scripts/seed-content.ts)
proxy.ts             redirect optimistis /admin berdasarkan cookie
```
