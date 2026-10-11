import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { Guest } from '../../types/wedding';

interface AdminCheckInPageProps {
  onNotify: (msg: string) => void;
}

export const AdminCheckInPage: React.FC<AdminCheckInPageProps> = ({ onNotify }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [recentCheckedIn, setRecentCheckedIn] = useState<Guest | null>(null);

  const loadData = () => {
    setGuests(weddingStorage.getGuests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = weddingStorage.getStats();

  const handleManualCheckIn = (guest: Guest) => {
    const res = weddingStorage.checkInGuest(guest.id);
    if (res.success && res.guest) {
      setRecentCheckedIn(res.guest);
      loadData();
      onNotify(`Sugeng rawuh! ${res.guest.fullName} sampun presensi hadir di lokasi.`);
    }
  };

  const handleUndoCheckIn = (guest: Guest) => {
    weddingStorage.undoCheckIn(guest.id);
    if (recentCheckedIn?.id === guest.id) {
      setRecentCheckedIn(null);
    }
    loadData();
    onNotify(`Presensi ${guest.fullName} dibatalkan.`);
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    // QR input can be full string "ROYAL-WEDDING-noval-auliya-gst-1" or just slug "noval-auliya" or name
    let clean = qrInput.trim();
    if (clean.startsWith('ROYAL-WEDDING-')) {
      const parts = clean.split('-');
      if (parts.length >= 3) {
        clean = parts[2]; // slug
      }
    }

    const res = weddingStorage.checkInGuest(clean);
    if (res.success && res.guest) {
      setRecentCheckedIn(res.guest);
      setQrInput('');
      loadData();
      onNotify(`Sukses! ${res.guest.fullName} terverifikasi hadir di lokasi.`);
    } else {
      onNotify('Kode QR atau nama tamu tidak ditemukan di sistem.');
    }
  };

  const filteredGuests = guests.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.fullName.toLowerCase().includes(q) ||
      g.slug.toLowerCase().includes(q) ||
      (g.tableAssignment && g.tableAssignment.toLowerCase().includes(q)) ||
      (g.institution && g.institution.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Buku Tamu Presensi Lokasi (Check-In Meja Resepsi)
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Verifikasi kehadiran tamu secara langsung di gedung acara, alokasi meja & pencatatan suvenir
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>
              {stats.checkedInCount} dari {stats.totalGuests} Tamu Telah Hadir
            </span>
          </div>
        </div>
      </div>

      {/* QR Code / Barcode Quick Input Card */}
      <div className="p-5 rounded-3xl bg-[#173D32] text-[#F8F3E8] border-2 border-[#C5A15B] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-widest text-[#E0C782] font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A15B]" />
              Scanner Presensi Cepat
            </span>
            <h2 className="font-royal text-lg font-bold gold-shimmer">
              Pindai QR Code atau Masukkan Kode Undangan
            </h2>
            <p className="text-xs text-[#F8F3E8]/75 font-serif-jawa italic">
              Arahkan scanner barcode atau ketik slug tamu untuk verifikasi instan
            </p>
          </div>

          <form onSubmit={handleScanSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <QrCode className="w-4 h-4 text-[#C5A15B] absolute left-3 top-2.5" />
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Contoh: noval-auliya atau scan barcode..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-[#0e2720] border border-[#C5A15B]/50 text-[#F8F3E8] placeholder-[#F8F3E8]/40 focus:outline-none focus:border-[#C5A15B]"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#997838] to-[#C5A15B] text-[#173D32] font-bold text-xs tracking-wider shadow-md hover:brightness-110 transition-all shrink-0"
            >
              Check-In
            </button>
          </form>
        </div>

        {/* Recently Checked-In Spotlight Banner */}
        {recentCheckedIn && (
          <div className="mt-4 pt-4 border-t border-[#C5A15B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0e2720]/80 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                  Check-In Terakhir Berhasil
                </span>
                <span className="font-royal text-sm font-bold text-[#F8F3E8]">
                  {recentCheckedIn.fullName}
                </span>
                <span className="text-xs text-[#E0C782] ml-2">
                  ({recentCheckedIn.category})
                </span>
                {recentCheckedIn.tableAssignment && (
                  <span className="text-xs text-amber-300 ml-2 font-medium">
                    • {recentCheckedIn.tableAssignment}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleUndoCheckIn(recentCheckedIn)}
              className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 self-end sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Batal Check-In</span>
            </button>
          </div>
        )}
      </div>

      {/* Guest Check-in List & Table */}
      <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama tamu, meja, atau instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none focus:border-[#C5A15B]"
            />
          </div>

          <div className="text-xs text-gray-500">
            Menampilkan {filteredGuests.length} tamu
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#173D32] text-[#E0C782] font-royal uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Alokasi Meja</th>
                <th className="py-3 px-4">Perkiraan Pax</th>
                <th className="py-3 px-4">Waktu Presensi</th>
                <th className="py-3 px-4 text-right">Aksi Meja Resepsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada tamu yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const isChecked = Boolean(guest.checkedInAt);

                  return (
                    <tr
                      key={guest.id}
                      className={`hover:bg-[#FAF6EE]/50 transition-colors ${
                        isChecked ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#173D32]">{guest.fullName}</div>
                        {guest.institution && (
                          <div className="text-[11px] text-gray-500 font-serif-jawa">
                            {guest.institution}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono">/{guest.slug}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A15B]/20 text-[#997838] border border-[#C5A15B]/40">
                          {guest.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {guest.tableAssignment ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#173D32] text-[#E0C782]">
                            <MapPin className="w-2.5 h-2.5 text-[#C5A15B]" />
                            <span>{guest.tableAssignment}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Meja Bebas / Antrean</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#173D32]">
                        {guest.attendeeCount > 0 ? `${guest.attendeeCount} Orang` : '1 Orang'}
                      </td>

                      <td className="py-3.5 px-4">
                        {isChecked ? (
                          <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(guest.checkedInAt!).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              WIB
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Belum Hadir</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isChecked ? (
                          <button
                            onClick={() => handleUndoCheckIn(guest)}
                            className="py-1 px-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-medium"
                          >
                            Batal Check-In
                          </button>
                        ) : (
                          <button
                            onClick={() => handleManualCheckIn(guest)}
                            className="py-1 px-3 rounded-lg bg-[#173D32] text-[#E0C782] hover:bg-[#235244] text-[11px] font-bold shadow-sm transition-all"
                          >
                            Tandai Hadir
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
