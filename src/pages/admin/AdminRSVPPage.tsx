import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Edit3,
  ExternalLink,
  Users,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { RSVP, RSVPStatus } from '../../types/wedding';

interface AdminRSVPPageProps {
  onNotify: (msg: string) => void;
  onOpenInvitation: (slug: string) => void;
}

export const AdminRSVPPage: React.FC<AdminRSVPPageProps> = ({
  onNotify,
  onOpenInvitation,
}) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingRsvp, setEditingRsvp] = useState<RSVP | null>(null);
  const [editStatus, setEditStatus] = useState<RSVPStatus>('Hadir');
  const [editCount, setEditCount] = useState<number>(2);

  const loadData = () => {
    setRsvps(weddingStorage.getRSVPs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = weddingStorage.getStats();

  const handleExportCSV = () => {
    const headers = ['Nama Tamu', 'Status Kehadiran', 'Jumlah Pax', 'Doa dan Ucapan', 'Slug Undangan', 'Waktu Submit'];
    const rows = rsvps.map((r) => [
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.attendanceStatus}"`,
      r.attendeeCount,
      `"${(r.wishes || '').replace(/"/g, '""')}"`,
      `"${r.guestSlug || ''}"`,
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
    onNotify('Data RSVP berhasil diekspor.');
  };

  const openEditModal = (rsvp: RSVP) => {
    setEditingRsvp(rsvp);
    setEditStatus(rsvp.attendanceStatus);
    setEditCount(rsvp.attendeeCount || 1);
  };

  const handleSaveEdit = () => {
    if (!editingRsvp) return;
    weddingStorage.submitRSVP({
      guestSlug: editingRsvp.guestSlug,
      guestName: editingRsvp.guestName,
      attendanceStatus: editStatus,
      attendeeCount: editStatus === 'Hadir' ? editCount : 0,
      wishes: editingRsvp.wishes,
    });
    setEditingRsvp(null);
    loadData();
    onNotify(`Status RSVP ${editingRsvp.guestName} berhasil diperbarui.`);
  };

  const filtered = rsvps.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.wishes && r.wishes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || r.attendanceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            RSVP & Buku Tamu Ucapan
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Daftar respon kehadiran, jumlah undangan, serta doa restu saking para tamu
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="py-2 px-3.5 rounded-xl bg-white border border-[#C5A15B] text-[#173D32] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FAF6EE] shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#C5A15B]" />
          <span>Ekspor Hasil RSVP (CSV)</span>
        </button>
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-royal text-lg font-bold text-emerald-800">{stats.attendingCount} Tamu</span>
            <span className="text-[10px] text-gray-500 block">Total ~{stats.totalAttendingPax} Kursi Pax</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-royal text-lg font-bold text-red-700">{stats.notAttendingCount} Tamu</span>
            <span className="text-[10px] text-gray-500 block">Tidak Dapat Hadir</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-royal text-lg font-bold text-amber-700">{stats.undecidedCount} Tamu</span>
            <span className="text-[10px] text-gray-500 block">Masih Ragu / Menimbang</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-royal text-lg font-bold text-gray-700">{stats.unconfirmedCount} Tamu</span>
            <span className="text-[10px] text-gray-500 block">Belum Konfirmasi</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama tamu atau kata dalam ucapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none focus:border-[#C5A15B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none w-full md:w-auto"
          >
            <option value="ALL">Semua Respon RSVP</option>
            <option value="Hadir">Hanya Hadir</option>
            <option value="Tidak Hadir">Hanya Tidak Hadir</option>
            <option value="Masih Ragu">Hanya Masih Ragu</option>
          </select>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#173D32] text-[#E0C782] font-royal uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-4">Status & Pax</th>
                <th className="py-3 px-4">Doa & Ucapan Restu</th>
                <th className="py-3 px-4">Waktu Konfirmasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Belum ada data RSVP yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#173D32]">{item.guestName}</div>
                      {item.guestSlug && (
                        <button
                          onClick={() => onOpenInvitation(item.guestSlug!)}
                          className="text-[10px] font-mono text-[#997838] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>/{item.guestSlug}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                          item.attendanceStatus === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.attendanceStatus === 'Masih Ragu'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.attendanceStatus}
                      </span>
                      {item.attendanceStatus === 'Hadir' && item.attendeeCount > 0 && (
                        <span className="text-[10px] text-gray-600 block mt-0.5">
                          {item.attendeeCount} Orang
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {item.wishes ? (
                        <p className="text-gray-700 font-serif-jawa italic line-clamp-2">
                          "{item.wishes}"
                        </p>
                      ) : (
                        <span className="text-gray-300 italic">- Tidak ada pesan -</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {new Date(item.submittedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        title="Perbarui Status RSVP Manual"
                        className="py-1 px-2.5 rounded-lg border border-gray-200 hover:bg-[#FAF6EE] text-[#173D32] font-medium text-[11px] inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-[#C5A15B]" />
                        <span>Edit Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual RSVP Status Override Modal */}
      {editingRsvp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in">
            <h2 className="font-royal text-base font-bold text-[#173D32] mb-1">
              Perbarui Status RSVP
            </h2>
            <p className="text-xs text-gray-500 mb-4">Tamu: {editingRsvp.guestName}</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Status Kehadiran</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as RSVPStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                  <option value="Masih Ragu">Masih Ragu</option>
                  <option value="Belum Mengonfirmasi">Belum Mengonfirmasi</option>
                </select>
              </div>

              {editStatus === 'Hadir' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Jumlah Hadir (Pax)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editCount}
                    onChange={(e) => setEditCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRsvp(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-[#173D32] text-[#E0C782] font-semibold hover:bg-[#235244]"
                >
                  Simpan Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
