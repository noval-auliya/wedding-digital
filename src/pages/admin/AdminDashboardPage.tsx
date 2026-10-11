import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  UserPlus,
  FileEdit,
  ExternalLink,
  Download,
  ArrowUpRight,
  QrCode,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { Guest, RSVP } from '../../types/wedding';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: any) => void;
  onNavigateHome: () => void;
  onNotify: (msg: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onNavigateHome,
  onNotify,
}) => {
  const [stats, setStats] = useState(weddingStorage.getStats());
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [recentRSVPs, setRecentRSVPs] = useState<RSVP[]>([]);

  useEffect(() => {
    setStats(weddingStorage.getStats());
    const allGuests = weddingStorage.getGuests();
    setRecentGuests(allGuests.slice(0, 5));
    const allRSVPs = weddingStorage.getRSVPs();
    setRecentRSVPs(allRSVPs.slice(0, 5));
  }, []);

  const handleExportRSVP = () => {
    const rsvps = weddingStorage.getRSVPs();
    const headers = ['Nama Tamu', 'Status Kehadiran', 'Jumlah Tamu', 'Doa dan Ucapan', 'Tanggal Submit'];
    const rows = rsvps.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.attendanceStatus}"`,
      r.attendeeCount,
      `"${(r.wishes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.submittedAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_rsvp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Data RSVP berhasil diekspor ke CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Dashboard Ringkasan Undangan
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Pawiwahan Ageng Raden Ajeng Sekar & Raden Mas Dimas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('guests')}
            className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Tamu</span>
          </button>

          <button
            onClick={handleExportRSVP}
            className="py-2 px-3.5 rounded-xl bg-white border border-[#C5A15B] text-[#173D32] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FAF6EE] shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span>Ekspor RSVP</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#997838] to-[#C5A15B] text-[#173D32] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#173D32]" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Tamu</span>
            <Users className="w-4 h-4 text-[#173D32]" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-[#173D32]">{stats.totalGuests}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Terdaftar di sistem</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Undangan Dibagi</span>
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-blue-700">{stats.deliveredCount}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Terkirim / dibuka</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pasti Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-emerald-700">{stats.attendingCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              ~{stats.totalAttendingPax} Perkiraan Pax
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Tidak Hadir</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-red-600">{stats.notAttendingCount}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Berhalangan hadir</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Masih Ragu</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-amber-600">{stats.undecidedCount}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Menunggu kepastian</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Belum Konfirmasi</span>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-gray-700">{stats.unconfirmedCount}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Belum mengisi RSVP</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('checkin')}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#173D32] to-[#0e2720] text-[#F8F3E8] border border-[#C5A15B] shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-[#E0C782] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Hadir di Lokasi</span>
            <QrCode className="w-4 h-4 text-[#C5A15B]" />
          </div>
          <div>
            <span className="font-royal text-2xl font-bold text-[#E0C782]">{stats.checkedInCount || 0}</span>
            <span className="text-[10px] text-emerald-300 font-medium block mt-0.5">Presensi QR Meja</span>
          </div>
        </div>
      </div>

      {/* Two columns: Recent RSVPs & Recent Guests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent RSVPs */}
        <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="font-royal text-sm font-bold text-[#173D32]">
              Konfirmasi RSVP Terbaru
            </h2>
            <button
              onClick={() => onNavigateTab('rsvp')}
              className="text-xs text-[#997838] hover:text-[#173D32] font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRSVPs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada respon RSVP.</p>
            ) : (
              recentRSVPs.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C5A15B]/20 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#173D32]">{r.guestName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          r.attendanceStatus === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.attendanceStatus === 'Masih Ragu'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.attendanceStatus} {r.attendanceStatus === 'Hadir' && `(${r.attendeeCount} pax)`}
                      </span>
                    </div>
                    {r.wishes && (
                      <p className="text-[11px] text-gray-600 font-serif-jawa italic line-clamp-1 mt-1">
                        "{r.wishes}"
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(r.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Guests */}
        <div className="p-5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="font-royal text-sm font-bold text-[#173D32]">
              Daftar Tamu Terbaru
            </h2>
            <button
              onClick={() => onNavigateTab('guests')}
              className="text-xs text-[#997838] hover:text-[#173D32] font-semibold flex items-center gap-1"
            >
              <span>Kelola Tamu</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentGuests.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada data tamu.</p>
            ) : (
              recentGuests.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C5A15B]/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#173D32] block">{g.fullName}</span>
                    <span className="text-[10px] text-gray-500">
                      {g.category} {g.institution ? `• ${g.institution}` : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#997838] block">/invitation/{g.slug}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        g.invitationStatus === 'Dibuka'
                          ? 'bg-purple-100 text-purple-700'
                          : g.invitationStatus === 'Terkirim'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {g.invitationStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
