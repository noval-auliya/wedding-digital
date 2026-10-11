import React, { useState } from 'react';
import { Save, RefreshCw, Eye, Music, Heart, Calendar, Upload, Play, Check } from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { WeddingSettings } from '../../types/wedding';

interface AdminContentPageProps {
  onNotify: (msg: string) => void;
  onNavigateHome: () => void;
}

export const AdminContentPage: React.FC<AdminContentPageProps> = ({
  onNotify,
  onNavigateHome,
}) => {
  const [settings, setSettings] = useState<WeddingSettings>(weddingStorage.getSettings());
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof WeddingSettings, val: any) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      onNotify('Ukuran file maksimal 15MB untuk pemutaran lancar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setSettings((prev) => ({
        ...prev,
        backgroundMusicUrl: result,
        backgroundMusicTitle: cleanName,
      }));
      onNotify(`File lagu "${file.name}" berhasil diunggah!`);
    };
    reader.readAsDataURL(file);
  };

  const applyAudioPreset = (title: string, url: string) => {
    setSettings((prev) => ({
      ...prev,
      backgroundMusicTitle: title,
      backgroundMusicUrl: url,
    }));
    onNotify(`Lagu diubah ke "${title}".`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    weddingStorage.updateSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      onNotify('Konten undangan pernikahan berhasil disimpan!');
    }, 300);
  };

  const handleReset = () => {
    if (window.confirm('Batalkan perubahan dan muat ulang data tersimpan?')) {
      setSettings(weddingStorage.getSettings());
      onNotify('Form dikembalikan ke data tersimpan.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Kelola Konten Undangan
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Sunting profil mempelai, kalimat doa pembuka & penutup, foto, dan lagu latar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="py-2 px-3.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="py-2 px-4 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-bold hover:bg-[#235244] transition-all flex items-center gap-1.5 shadow-md"
          >
            <Save className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Konten'}</span>
          </button>
        </div>
      </div>

      {/* Couple Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bride */}
        <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Heart className="w-4 h-4 text-[#C5A15B]" />
            <h2 className="font-royal text-sm font-bold text-[#173D32]">
              Mempelai Wanita (Penganten Putri)
            </h2>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={settings.brideName}
              onChange={(e) => handleChange('brideName', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Nama Panggilan *</label>
              <input
                type="text"
                required
                value={settings.brideNickname}
                onChange={(e) => handleChange('brideNickname', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Kedudukan Anak</label>
              <input
                type="text"
                placeholder="Putri Pertama"
                value={settings.brideTitle}
                onChange={(e) => handleChange('brideTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Kedua Orang Tua *</label>
            <input
              type="text"
              required
              value={settings.brideParents}
              onChange={(e) => handleChange('brideParents', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto Mempelai Wanita</label>
            <input
              type="url"
              value={settings.brideImageUrl}
              onChange={(e) => handleChange('brideImageUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-mono text-[11px]"
            />
            {settings.brideImageUrl && (
              <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#C5A15B]/50">
                <img src={settings.brideImageUrl} alt="Bride" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Groom */}
        <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Heart className="w-4 h-4 text-[#C5A15B]" />
            <h2 className="font-royal text-sm font-bold text-[#173D32]">
              Mempelai Pria (Penganten Kakung)
            </h2>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={settings.groomName}
              onChange={(e) => handleChange('groomName', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Nama Panggilan *</label>
              <input
                type="text"
                required
                value={settings.groomNickname}
                onChange={(e) => handleChange('groomNickname', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Kedudukan Anak</label>
              <input
                type="text"
                placeholder="Putra Kedua"
                value={settings.groomTitle}
                onChange={(e) => handleChange('groomTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nama Kedua Orang Tua *</label>
            <input
              type="text"
              required
              value={settings.groomParents}
              onChange={(e) => handleChange('groomParents', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto Mempelai Pria</label>
            <input
              type="url"
              value={settings.groomImageUrl}
              onChange={(e) => handleChange('groomImageUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-mono text-[11px]"
            />
            {settings.groomImageUrl && (
              <div className="mt-2 w-16 h-16 rounded-full overflow-hidden border border-[#C5A15B]/50">
                <img src={settings.groomImageUrl} alt="Groom" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date, Cover, and Media */}
      <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-4 text-xs">
        <h2 className="font-royal text-sm font-bold text-[#173D32] pb-2 border-b border-gray-100">
          Informasi Utama & Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tanggal Pernikahan *</label>
            <input
              type="date"
              required
              value={settings.weddingDate}
              onChange={(e) => handleChange('weddingDate', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Waktu Acara Utama</label>
            <input
              type="text"
              value={settings.weddingTime}
              onChange={(e) => handleChange('weddingTime', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Sapaan Default Tamu</label>
            <input
              type="text"
              value={settings.defaultGuestGreeting}
              onChange={(e) => handleChange('defaultGuestGreeting', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Judul Sampul (Cover Title)</label>
            <input
              type="text"
              value={settings.coverTitle}
              onChange={(e) => handleChange('coverTitle', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">URL Foto Hero Sampul</label>
            <input
              type="url"
              value={settings.heroImageUrl}
              onChange={(e) => handleChange('heroImageUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none"
            />
          </div>
        </div>

        {/* Background Music Selector & Uploader */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 font-semibold">
              Musik Latar Undangan (Lagu Indonesia / Gamelan)
            </label>
            <span className="text-[11px] font-semibold text-[#997838] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#C5A15B]/30">
              {settings.backgroundMusicTitle || 'Ketika Cinta Bertasbih'}
            </span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-gray-500 font-medium">Pilihan Rekomendasi Lagu:</span>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  title: 'Ketika Cinta Bertasbih - Melly Goeslaw & Amee',
                  url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
                  badge: 'Pilihan Anda (Ketika Cinta Bertasbih)',
                },
                {
                  title: 'Janji Suci - Yovie & Nuno (Romantic Strings)',
                  url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b9354002.mp3',
                  badge: 'Janji Suci',
                },
                {
                  title: 'Gending Gamelan Jawa (Ladrang Wilujeng)',
                  url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3',
                  badge: 'Gamelan Keraton',
                },
              ].map((preset) => {
                const isActive = settings.backgroundMusicTitle === preset.title;

                return (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => applyAudioPreset(preset.title, preset.url)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isActive
                        ? 'bg-[#173D32] text-[#E0C782] border-[#C5A15B] shadow-sm'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                  >
                    {isActive ? <Check className="w-3.5 h-3.5 text-[#E0C782]" /> : <Music className="w-3.5 h-3.5 text-[#997838]" />}
                    <span>{preset.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom audio file uploader */}
          <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C5A15B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-gray-800 block text-xs">
                Punya Berkas MP3 Lagu Sendiri?
              </span>
              <span className="text-[11px] text-gray-500">
                Unggah file MP3 langsung dari HP atau Laptop Anda
              </span>
            </div>
            <label className="cursor-pointer py-1.5 px-3 rounded-xl bg-[#173D32] text-[#E0C782] hover:bg-[#235244] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih Berkas MP3</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Judul Lagu yang Ditampilkan
              </label>
              <input
                type="text"
                placeholder="Ketika Cinta Bertasbih - Melly Goeslaw & Amee"
                value={settings.backgroundMusicTitle || ''}
                onChange={(e) => handleChange('backgroundMusicTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                URL Audio Streaming (Direct MP3 Link)
              </label>
              <input
                type="url"
                value={settings.backgroundMusicUrl.startsWith('data:') ? '(Berkas MP3 telah diunggah)' : settings.backgroundMusicUrl}
                onChange={(e) => handleChange('backgroundMusicUrl', e.target.value)}
                disabled={settings.backgroundMusicUrl.startsWith('data:')}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Audio Preview Player */}
          {settings.backgroundMusicUrl && (
            <div className="pt-2">
              <span className="text-[11px] text-gray-500 font-medium block mb-1">
                Pratinjau Suara Lagu:
              </span>
              <audio controls src={settings.backgroundMusicUrl} className="w-full h-8" />
            </div>
          )}
        </div>
      </div>

      {/* Messages & Quotes */}
      <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-4 text-xs">
        <h2 className="font-royal text-sm font-bold text-[#173D32] pb-2 border-b border-gray-100">
          Teks Sambutan & Doa
        </h2>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Kalimat Pembuka (Salam & Niat)</label>
          <textarea
            rows={2}
            value={settings.openingMessage}
            onChange={(e) => handleChange('openingMessage', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-serif-jawa text-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">Teks Doa / Ayat Suci</label>
            <textarea
              rows={2}
              value={settings.weddingPrayer}
              onChange={(e) => handleChange('weddingPrayer', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-serif-jawa text-xs"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Sumber Doa / Ayat</label>
            <input
              type="text"
              value={settings.prayerSource}
              onChange={(e) => handleChange('prayerSource', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Kalimat Penutup & Matur Nuwun</label>
          <textarea
            rows={2}
            value={settings.closingMessage}
            onChange={(e) => handleChange('closingMessage', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-serif-jawa text-xs"
          />
        </div>
      </div>
    </form>
  );
};
