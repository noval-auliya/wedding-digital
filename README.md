# Wedding Digital

Aplikasi undangan pernikahan digital dengan halaman undangan publik dan panel admin. Konten undangan, data tamu, RSVP, jadwal acara, galeri, cerita cinta, dan informasi hadiah dapat dikelola melalui panel admin. Data aplikasi disimpan menggunakan Firebase Authentication dan Cloud Firestore.

## Fitur

- Halaman undangan publik yang responsif.
- Halaman undangan tamu dengan tautan personal (`/invitation/:slug`).
- Login admin menggunakan Firebase Authentication (email dan kata sandi).
- Panel admin untuk mengelola konten undangan, tamu, RSVP dan ucapan, jadwal acara, galeri, love story, hadiah, dan pengaturan website.
- Ekspor data ke PDF dan Excel.
- Dukungan RSVP dan ucapan serta fitur like pada ucapan publik.

## Tech stack

- **React 19** — UI.
- **TypeScript 5** — bahasa dan pemeriksaan tipe.
- **Vite 6** — development server dan bundler.
- **Tailwind CSS 4** — styling.
- **Firebase 11** — Authentication dan Cloud Firestore.
- **Lucide React** — ikon.
- **jsPDF** dan **jspdf-autotable** — ekspor PDF.
- **write-excel-file** — ekspor Excel.

## Persyaratan

- Node.js **18 atau lebih baru** (disarankan versi LTS yang masih didukung).
- npm.
- Project Firebase yang sudah dikonfigurasi untuk aplikasi web.

Periksa versi yang tersedia:

```bash
node --version
npm --version
```

## Menjalankan secara lokal

1. Clone repository, lalu masuk ke direktori project:

   ```bash
   git clone <URL-REPOSITORY>
   cd wedding-digital
   ```

2. Pasang dependencies sesuai lockfile:

   ```bash
   npm ci
   ```

3. Buat file `.env.local` di root project dan isi konfigurasi Firebase:

   ```dotenv
   VITE_FIREBASE_API_KEY=isi-api-key-firebase
   VITE_FIREBASE_AUTH_DOMAIN=nama-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nama-project
   VITE_FIREBASE_STORAGE_BUCKET=nama-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=isi-sender-id
   VITE_FIREBASE_APP_ID=isi-app-id
   ```

   Nilai di atas dapat ditemukan pada konfigurasi aplikasi web di Firebase Console. `VITE_FIREBASE_STORAGE_BUCKET` dan `VITE_FIREBASE_MESSAGING_SENDER_ID` dibaca sebagai bagian konfigurasi, tetapi konfigurasi utama aplikasi memerlukan API key, auth domain, project ID, dan app ID.

4. Di Firebase Console:

   - Aktifkan **Authentication > Sign-in method > Email/Password**, lalu buat akun admin.
   - Buat atau aktifkan **Cloud Firestore**.
   - Konfigurasikan aturan keamanan Firestore sesuai kebutuhan aplikasi dan batasi akses data admin. Jangan menggunakan aturan terbuka untuk production.
   - Tambahkan domain website ke daftar **Authorized domains** Firebase Authentication saat deploy.

5. Jalankan development server:

   ```bash
   npm run dev
   ```

   Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`). Jika konfigurasi `.env.local` diubah saat server sedang berjalan, restart development server.

## Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server Vite. |
| `npm run typecheck` | Memeriksa tipe TypeScript tanpa menghasilkan file build. |
| `npm run build` | Membuat build production ke folder `dist`. |
| `npm run preview` | Menyajikan build lokal untuk pemeriksaan sebelum deploy. Jalankan build terlebih dahulu. |

## Build dan deploy

1. Pastikan variabel Firebase production tersedia saat build. Untuk build lokal, gunakan `.env.local`; untuk CI, atur variabel environment pada konfigurasi pipeline.
2. Jalankan:

   ```bash
   npm run typecheck
   npm run build
   ```

3. Upload **isi folder `dist`** ke document root domain hosting. Jangan upload folder source project sebagai pengganti build.
4. Untuk hosting Apache, file `public/.htaccess` disalin oleh Vite menjadi `dist/.htaccess`. Pastikan file tersembunyi ikut di-upload dan `mod_rewrite`/aturan `.htaccess` diizinkan. Aturan tersebut mengarahkan URL aplikasi seperti `/admin` dan `/invitation/nama-tamu` ke `index.html`, sementara file dan direktori yang benar-benar ada tetap dilayani langsung.
5. Pada hosting static yang bukan Apache, atur fallback/rewrite SPA agar URL yang bukan file fisik menyajikan `index.html`.
6. Setelah deploy, periksa domain di Firebase Authentication **Authorized domains**. Firebase API key aplikasi web bukan kata sandi admin; keamanan akses data tetap harus ditegakkan melalui Firebase Authentication dan aturan Firestore yang benar.

Build production berisi variabel `VITE_*` yang digunakan oleh aplikasi. Jangan menaruh kata sandi admin, private key, atau kredensial server di variabel `VITE_*` karena nilai tersebut dapat terlihat oleh pengguna di browser.

## Struktur direktori

```text
public/       Aset statis yang disalin langsung ke hasil build (termasuk .htaccess)
src/
  components/ Komponen UI yang digunakan ulang
  pages/      Halaman publik dan panel admin
  services/   Integrasi Firebase Authentication dan penyimpanan data
  types/      Tipe TypeScript
  utils/      Fungsi utilitas
dist/         Hasil build production (dibuat oleh npm run build)
```

## Troubleshooting

- **`vite: command not found`** — dependencies belum terpasang. Jalankan `npm ci` dari root project.
- **Firebase belum dikonfigurasi atau login gagal** — periksa nilai di `.env.local`, pastikan metode Email/Password aktif dan akun admin sudah dibuat, kemudian restart server atau build ulang.
- **URL `/admin` menampilkan 404 setelah deploy** — pastikan `dist/.htaccess` ikut ter-upload pada Apache atau tambahkan SPA fallback di pengaturan hosting.
- **Build memakai konfigurasi Firebase yang lama** — build ulang setelah memperbarui environment. Vite memasukkan nilai `VITE_*` pada saat build, bukan saat file statis dibuka di browser.
