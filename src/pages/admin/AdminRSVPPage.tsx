import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { RSVP, RSVPStatus } from '../../types/wedding';
import { ExportActions } from '../../components/admin/ExportActions';
import { ExportFormat, exportRecords } from '../../utils/export';

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
  const [editName, setEditName] = useState('');
  const [editWishes, setEditWishes] = useState('');
  const [editStatus, setEditStatus] = useState<RSVPStatus>('Hadir');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setRsvps(weddingStorage.getRSVPs());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = (event: Event) => {
      const key = (event as CustomEvent<{ key: string }>).detail.key;
      if (key === 'javanese_wedding_rsvps_v1' || key === 'javanese_wedding_guests_v1') loadData();
    };
    window.addEventListener('wedding-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('wedding-storage-updated', handleStorageUpdate);
  }, []);

  const guests = weddingStorage.getGuests();
  const submittedGuestIds = new Set(rsvps.flatMap((rsvp) => rsvp.guestId ? [rsvp.guestId] : []));
  const submittedGuestSlugs = new Set(
    rsvps.flatMap((rsvp) => rsvp.guestSlug ? [rsvp.guestSlug.toLowerCase()] : []),
  );
  const submittedGuestNames = new Set(rsvps.map((rsvp) => rsvp.guestName.trim().toLowerCase()));
  const stats = {
    attendingCount: rsvps.filter((rsvp) => rsvp.attendanceStatus === 'Hadir').length,
    notAttendingCount: rsvps.filter((rsvp) => rsvp.attendanceStatus === 'Tidak Hadir').length,
    unconfirmedCount: guests.filter(
      (guest) =>
        !submittedGuestIds.has(guest.id) &&
        !submittedGuestSlugs.has(guest.slug.toLowerCase()) &&
        !submittedGuestNames.has(guest.fullName.trim().toLowerCase()),
    ).length,
  };

  const handleExport = async (format: ExportFormat) => {
    const headers = ['Nama Tamu', 'Status Kehadiran', 'Doa dan Ucapan', 'Slug Undangan', 'Waktu Submit'];
    const rows = rsvps.map((r) => [
      r.guestName,
      r.attendanceStatus,
      r.wishes || '',
      r.guestSlug || '',
      new Date(r.submittedAt).toLocaleString('id-ID'),
    ]);
    const filename = `rekap_rsvp_${new Date().toISOString().split('T')[0]}`;
    try {
      await exportRecords(format, filename, 'Rekap RSVP & Ucapan', headers, rows);
      onNotify(`Data RSVP berhasil diunduh ke ${format.toUpperCase()}.`);
    } catch {
      onNotify(`Gagal mengekspor data RSVP ke ${format.toUpperCase()}.`);
    }
  };

  const openEditModal = (rsvp: RSVP) => {
    setEditingRsvp(rsvp);
    setEditName(rsvp.guestName);
    setEditWishes(rsvp.wishes);
    setEditStatus(rsvp.attendanceStatus);
  };

  const handleSaveEdit = async () => {
    if (!editingRsvp) return;
    if (!editName.trim()) {
      onNotify('Nama tamu wajib diisi.');
      return;
    }
    setIsSaving(true);
    try {
      await weddingStorage.updateRSVP(editingRsvp.id, {
        guestName: editName.trim(),
        attendanceStatus: editStatus,
        wishes: editWishes.trim(),
      });
      setEditingRsvp(null);
      loadData();
      onNotify(`RSVP ${editName.trim()} berhasil diperbarui.`);
    } catch {
      onNotify('Gagal memperbarui RSVP. Periksa koneksi Firebase lalu coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (rsvp: RSVP) => {
    if (!window.confirm(`Hapus data RSVP dari ${rsvp.guestName}?`)) return;
    try {
      await weddingStorage.deleteRSVP(rsvp.id);
      loadData();
      onNotify(`Data RSVP ${rsvp.guestName} berhasil dihapus.`);
    } catch {
      onNotify('Gagal menghapus RSVP. Periksa koneksi Firebase lalu coba lagi.');
    }
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
            Kelola konfirmasi kehadiran, nama tamu, dan doa restu dari para tamu
          </p>
        </div>

        <ExportActions onExport={handleExport} label="Ekspor RSVP" />
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-royal text-lg font-bold text-emerald-800">{stats.attendingCount} Tamu</span>
            <span className="text-[10px] text-gray-500 block">Pasti Hadir</span>
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
          </select>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm overflow-hidden">
        <div className="px-4 py-3 text-xs text-gray-600 border-b border-gray-100">
          Menampilkan {filtered.length} dari {rsvps.length} data RSVP
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#173D32] text-[#E0C782] font-royal uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-4">Status</th>
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
                            : item.attendanceStatus === 'Tidak Hadir'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.attendanceStatus}
                      </span>
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
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit data RSVP"
                          className="py-1 px-2.5 rounded-lg border border-gray-200 hover:bg-[#FAF6EE] text-[#173D32] font-medium text-[11px] inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-[#C5A15B]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          title="Hapus data RSVP"
                          className="py-1.5 px-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit RSVP */}
      {editingRsvp && (
        <div
          onClick={() => setEditingRsvp(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in"
          >
            <h2 className="font-royal text-base font-bold text-[#173D32] mb-1">
              Edit Data RSVP
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Tamu</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  maxLength={120}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Status Kehadiran</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as RSVPStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                  <option value="Belum Mengonfirmasi">Belum Mengonfirmasi</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Doa & Ucapan</label>
                <textarea
                  value={editWishes}
                  onChange={(event) => setEditWishes(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none resize-y"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRsvp(null)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#173D32] text-[#E0C782] font-semibold hover:bg-[#235244]"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
