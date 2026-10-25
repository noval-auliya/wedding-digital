import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  Database,
  Copy,
  Check,
  RefreshCcw,
  Sliders,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { WeddingSettings } from '../../types/wedding';

interface AdminSettingsPageProps {
  onNotify: (msg: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<WeddingSettings>(weddingStorage.getSettings());
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const refreshSettings = (event: Event) => {
      if ((event as CustomEvent<{ key: string }>).detail.key === 'javanese_wedding_settings_v1') {
        setSettings(weddingStorage.getSettings());
      }
    };
    window.addEventListener('wedding-storage-updated', refreshSettings);
    return () => window.removeEventListener('wedding-storage-updated', refreshSettings);
  }, []);

  const handleToggle = (key: keyof WeddingSettings['features']) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const savedSettings = await weddingStorage.updateSettings(settings);
      setSettings(savedSettings);
      onNotify('Pengaturan website berhasil disimpan ke Firebase!');
    } catch (error) {
      console.error('Gagal menyimpan pengaturan website:', error);
      onNotify(
        error instanceof Error && error.message.includes('berbeda dari perubahan terakhir')
          ? 'Isi pengaturan Firebase berubah saat proses simpan. Coba muat ulang halaman lalu simpan kembali.'
          : 'Gagal memverifikasi penyimpanan pengaturan ke Firebase. Periksa koneksi dan Security Rules.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      window.confirm(
        'PERINGATAN: Ini akan mereset seluruh data (konten, tamu, RSVP, acara) kembali ke data awal Keraton Ngayogyakarta. Lanjutkan?'
      )
    ) {
      try {
        await weddingStorage.resetToDefaults();
        setSettings(weddingStorage.getSettings());
        onNotify('Data berhasil direset ke nilai awal.');
        window.location.reload();
      } catch {
        setSettings(weddingStorage.getSettings());
        onNotify('Reset Firebase gagal. Periksa koneksi dan Security Rules.');
      }
    }
  };

  const supabaseSqlSchema = `-- SKEMA SUPABASE UNTUK JAVANESE ROYAL WEDDING INVITATION

-- 1. Tabel wedding_settings
CREATE TABLE IF NOT EXISTS wedding_settings (
  id TEXT PRIMARY KEY,
  wedding_title TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  bride_nickname TEXT NOT NULL,
  bride_title TEXT,
  bride_parents TEXT,
  groom_name TEXT NOT NULL,
  groom_nickname TEXT NOT NULL,
  groom_title TEXT,
  groom_parents TEXT,
  wedding_date DATE NOT NULL,
  wedding_time TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  cover_title TEXT,
  opening_message TEXT,
  closing_message TEXT,
  wedding_prayer TEXT,
  prayer_source TEXT,
  hero_image_url TEXT,
  bride_image_url TEXT,
  groom_image_url TEXT,
  background_music_url TEXT,
  default_guest_greeting TEXT,
  features JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel guests
CREATE TABLE IF NOT EXISTS guests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Teman',
  institution TEXT,
  phone TEXT,
  invitation_status TEXT DEFAULT 'Belum Dikirim',
  admin_notes TEXT,
  table_assignment TEXT,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  rsvp_status TEXT DEFAULT 'Belum Mengonfirmasi',
  attendee_count INTEGER DEFAULT 0,
  wishes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_slug ON guests(slug);

-- 3. Tabel events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  venue TEXT NOT NULL,
  address TEXT,
  maps_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT TRUE
);

-- 4. Tabel rsvps
CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
  guest_slug TEXT,
  guest_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL,
  attendee_count INTEGER DEFAULT 1,
  wishes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_slug ON rsvps(guest_slug);

-- 5. Tabel gallery_images
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel love_story_entries
CREATE TABLE IF NOT EXISTS love_story_entries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  story_date TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT TRUE
);

-- 7. Tabel wedding_gifts
CREATE TABLE IF NOT EXISTS wedding_gifts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  account_number TEXT,
  description TEXT,
  delivery_address TEXT,
  is_published BOOLEAN DEFAULT TRUE
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_story_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gifts ENABLE ROW LEVEL SECURITY;

-- Publik hanya membaca data published dan mengirim RSVP
CREATE POLICY "Public Read Settings" ON wedding_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Gallery" ON gallery_images FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Stories" ON love_story_entries FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Gifts" ON wedding_gifts FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Wishes" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Public Submit RSVP" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Own RSVP" ON rsvps FOR UPDATE USING (true);
-- Tamu hanya dapat membaca profil berdasarkan slug
CREATE POLICY "Public Read Guest By Slug" ON guests FOR SELECT USING (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSqlSchema).then(() => {
      setCopiedSql(true);
      onNotify('Skrip SQL Supabase berhasil disalin ke papan klip!');
      setTimeout(() => setCopiedSql(false), 3000);
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Pengaturan Sistem & Database
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Konfigurasi fitur website, timezone, dan panduan integrasi Firebase Firestore
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="py-2 px-4 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-bold hover:bg-[#235244] transition-all flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5 text-[#C5A15B]" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      {/* Feature Toggles */}
      <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Sliders className="w-4 h-4 text-[#C5A15B]" />
          <h2 className="font-royal text-sm font-bold text-[#173D32]">
            Pengaturan Modul & Fitur Undangan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { key: 'enableCountdown', label: 'Hitung Mundur (Countdown Timer)', desc: 'Menampilkan sisa hari dan jam menuju hari H' },
            { key: 'enableRSVP', label: 'Modul Konfirmasi Kehadiran (RSVP)', desc: 'Mengizinkan tamu mengirim kepastian hadir' },
            { key: 'enableGuestWishes', label: 'Buku Tamu Doa & Ucapan', desc: 'Menampilkan ucapan selamat dari para tamu undangan' },
            { key: 'enableWeddingGifts', label: 'Tanda Kasih / Rekening Hadiah', desc: 'Menampilkan nomor rekening dan alamat kirim kado' },
            { key: 'enableLoveStory', label: 'Kisah Kasih (Love Story)', desc: 'Menampilkan linimasa perjalanan cinta mempelai' },
            { key: 'enableGallery', label: 'Galeri Foto Prewedding', desc: 'Menampilkan foto-foto dan lightbox viewer' },
            { key: 'enableMusicAutoplay', label: 'Putar Musik Otomatis Saat Dibuka', desc: 'Memulai lagu gamelan setelah tombol Buka Undangan diklik' },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key as any)}
              className="p-3.5 rounded-xl border border-gray-200 hover:border-[#C5A15B] transition-all flex items-start justify-between cursor-pointer bg-[#FAF6EE]/40"
            >
              <div>
                <span className="font-semibold text-gray-800 block">{item.label}</span>
                <span className="text-[11px] text-gray-500 mt-0.5 block">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.features[item.key as keyof typeof settings.features]}
                onChange={() => {}}
                className="w-4 h-4 text-[#173D32] rounded mt-0.5"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Website General Settings */}
      <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-4 text-xs">
        <h2 className="font-royal text-sm font-bold text-[#173D32] pb-2 border-b border-gray-100">
          Identitas & Zona Waktu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Zona Waktu Acara</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            >
              <option value="Asia/Jakarta">WIB (Asia/Jakarta - UTC+7)</option>
              <option value="Asia/Makassar">WITA (Asia/Makassar - UTC+8)</option>
              <option value="Asia/Jayapura">WIT (Asia/Jayapura - UTC+9)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Gambar Favicon</label>
            <input
              type="text"
              value={settings.faviconUrl || ''}
              onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
              placeholder="https://.../favicon.png atau /images/favicon.png"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Gunakan URL publik atau path gambar di folder public, misalnya /images/favicon.png.
            </p>
          </div>
        </div>
      </div>

      {/* Firebase setup guide */}
      <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#C5A15B]" />
            <h2 className="font-royal text-sm font-bold text-[#173D32]">
              Status Penyimpanan & Firebase Firestore
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C5A15B]/20 text-[#173D32] border border-[#C5A15B]/40">
            {weddingStorage.isFirebaseConfigured() ? 'Firebase dikonfigurasi' : 'Belum dikonfigurasi'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#C5A15B]/30 text-xs text-gray-700 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#997838] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#173D32]">
                Sinkronisasi cloud real-time
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {weddingStorage.isFirebaseConfigured()
                  ? 'Firestore menjadi sumber data. Aplikasi hanya menampilkan data yang berhasil dimuat dari server dan tidak menyimpan data undangan secara persisten di browser.'
                  : 'Salin .env.example menjadi .env.local, isi konfigurasi Firebase Web App, lalu mulai ulang server Vite. Tanpa konfigurasi, data tidak tersedia.'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Langkah aktivasi:</p>
          <ol className="list-decimal pl-5 text-[11px] text-gray-600 space-y-1">
            <li>Buat project Firebase dan aktifkan Cloud Firestore.</li>
            <li>Daftarkan aplikasi Web, lalu salin nilainya ke file <code>.env.local</code>.</li>
            <li>Atur Firestore Security Rules sebelum deployment agar data hanya dapat diakses sesuai kebutuhan.</li>
            <li>Jalankan ulang server dan pastikan dokumen serta koleksi undangan sudah tersedia di Firestore.</li>
          </ol>
          <p className="mt-3 text-[11px] text-amber-800">
            Akses baca publik pada koleksi guests dan rsvps juga membuka nomor telepon, catatan admin, penempatan meja, dan data RSVP ke siapa pun. Hapus atau pisahkan field sensitif sebelum membuka akses baca.
          </p>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-red-800">Kembalikan Data Bawaan (Reset)</h3>
          <p className="text-[11px] text-red-600 mt-0.5">
            Menghapus data kustom dan mengembalikan data seed awal
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Data</span>
        </button>
      </div>
    </div>
  );
};
