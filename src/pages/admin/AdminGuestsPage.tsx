import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Copy,
  ExternalLink,
  Edit2,
  Trash2,
  Upload,
  Check,
  Phone,
  MessageCircle,
  X,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
} from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { Guest, GuestCategory, RSVPStatus, DeliveryStatus } from '../../types/wedding';
import { ExportActions } from '../../components/admin/ExportActions';
import { ExportFormat, exportRecords } from '../../utils/export';

interface AdminGuestsPageProps {
  onNotify: (msg: string) => void;
  onOpenInvitation: (slug: string) => void;
}

export const AdminGuestsPage: React.FC<AdminGuestsPageProps> = ({
  onNotify,
  onOpenInvitation,
}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [rsvpFilter, setRsvpFilter] = useState<string>('ALL');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<GuestCategory>('Teman');
  const [formInstitution, setFormInstitution] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDelivery, setFormDelivery] = useState<DeliveryStatus>('Belum Dikirim');
  const [formNotes, setFormNotes] = useState('');
  const [formTable, setFormTable] = useState('');

  // CSV Import State
  const [importCsvText, setImportCsvText] = useState('');
  const [parsedImportRows, setParsedImportRows] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const loadData = () => {
    setGuests(weddingStorage.getGuests());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = (event: Event) => {
      if ((event as CustomEvent<{ key: string }>).detail.key === 'javanese_wedding_guests_v1') loadData();
    };
    window.addEventListener('wedding-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('wedding-storage-updated', handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormName('');
    setFormSlug('');
    setFormCategory('Teman');
    setFormInstitution('');
    setFormPhone('');
    setFormTable('');
    setFormDelivery('Belum Dikirim');
    setFormNotes('');
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setFormName(guest.fullName);
    setFormSlug(guest.slug);
    setFormCategory(guest.category);
    setFormInstitution(guest.institution || '');
    setFormPhone(guest.phone || '');
    setFormTable(guest.tableAssignment || '');
    setFormDelivery(guest.invitationStatus);
    setFormNotes(guest.adminNotes || '');
    setIsAddEditModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingGuest) {
      setFormSlug(weddingStorage.slugify(val));
    }
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onNotify('Nama tamu wajib diisi.');
      return;
    }

    try {
      weddingStorage.saveGuest({
        id: editingGuest ? editingGuest.id : undefined,
        fullName: formName.trim(),
        slug: formSlug.trim() || weddingStorage.slugify(formName),
        category: formCategory,
        institution: formInstitution.trim(),
        phone: formPhone.trim(),
        tableAssignment: formTable.trim() || undefined,
        invitationStatus: formDelivery,
        adminNotes: formNotes.trim(),
        rsvpStatus: editingGuest ? editingGuest.rsvpStatus : 'Belum Mengonfirmasi',
      });

      setIsAddEditModalOpen(false);
      loadData();
      onNotify(editingGuest ? 'Data tamu berhasil diperbarui.' : 'Tamu baru berhasil ditambahkan.');
    } catch (err) {
      onNotify('Terjadi kesalahan saat menyimpan data tamu.');
    }
  };

  const handleDeleteGuest = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data tamu "${name}"?`)) {
      weddingStorage.deleteGuest(id);
      loadData();
      onNotify(`Tamu "${name}" telah dihapus.`);
    }
  };

  const getPersonalizedUrl = (slug: string) => {
    const origin = window.location.origin;
    return `${origin}/invitation/${slug}`;
  };

  const copyInvitationLink = (slug: string) => {
    const link = getPersonalizedUrl(slug);
    navigator.clipboard.writeText(link).then(() => {
      setCopiedSlug(slug);
      onNotify('Tautan undangan personal berhasil disalin!');
      setTimeout(() => setCopiedSlug(null), 2500);
    });
  };

  const copyWhatsAppMessage = (guest: Guest) => {
    const settings = weddingStorage.getSettings();
    const link = getPersonalizedUrl(guest.slug);
    const message = `Yth. ${guest.fullName}${guest.institution ? ` (${guest.institution})` : ''},

Dengan memohon rahmat Tuhan, kami sekeluarga mengundang Anda untuk menghadiri pernikahan putra-putri kami:

${settings.brideNickname} & ${settings.groomNickname}

Acara akan diselenggarakan pada ${new Date(settings.weddingDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}.

Untuk informasi lengkap dan konfirmasi kehadiran, silakan buka tautan undangan berikut:
${link}

Terima kasih atas perhatian dan doa Anda.`;

    navigator.clipboard.writeText(message).then(() => {
      let phoneClean = (guest.phone || '').replace(/\D/g, '');
      if (phoneClean.startsWith('0')) phoneClean = '62' + phoneClean.slice(1);

      if (phoneClean) {
        window.open(`https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(message)}`, '_blank');
        onNotify(`Membuka WhatsApp untuk ${guest.fullName}... Pesan juga tersalin!`);
      } else {
        onNotify(`Pesan WhatsApp untuk ${guest.fullName} berhasil disalin ke papan klip!`);
      }
    });
  };

  const handleExport = async (format: ExportFormat) => {
    const headers = ['Nama Lengkap', 'Slug Undangan', 'Kategori', 'Instansi', 'No Telepon', 'Status Kirim', 'Status RSVP', 'Tautan Undangan'];
    const rows = guests.map((g) => [
      g.fullName,
      g.slug,
      g.category,
      g.institution || '',
      g.phone || '',
      g.invitationStatus,
      g.rsvpStatus,
      getPersonalizedUrl(g.slug),
    ]);
    const filename = `daftar_tamu_undangan_${new Date().toISOString().split('T')[0]}`;
    try {
      await exportRecords(format, filename, 'Daftar Tamu Undangan', headers, rows);
      onNotify(`Daftar tamu berhasil diunduh ke ${format.toUpperCase()}.`);
    } catch {
      onNotify(`Gagal mengekspor daftar tamu ke ${format.toUpperCase()}.`);
    }
  };

  // Parse CSV text for Import
  const handleParseCsv = (text: string) => {
    setImportCsvText(text);
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setParsedImportRows([]);
      setImportErrors(['CSV harus memiliki header dan minimal 1 baris data.']);
      return;
    }

    const rows: any[] = [];
    const errors: string[] = [];

    // format expectation: Nama Lengkap, Kategori, Instansi, No Telepon
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 1 || !cols[0]) {
        errors.push(`Baris ${i + 1}: Nama tamu kosong.`);
        continue;
      }
      const fullName = cols[0];
      const category = (['Keluarga', 'Teman', 'Rekan Kerja', 'VIP', 'Lainnya'].includes(cols[1])
        ? cols[1]
        : 'Teman') as GuestCategory;
      const institution = cols[2] || '';
      const phone = cols[3] || '';
      const slugCandidate = weddingStorage.slugify(fullName);

      rows.push({
        fullName,
        category,
        institution,
        phone,
        slug: slugCandidate,
        invitationStatus: 'Belum Dikirim',
        rsvpStatus: 'Belum Mengonfirmasi',
      });
    }

    setParsedImportRows(rows);
    setImportErrors(errors);
  };

  const handleConfirmImport = () => {
    if (parsedImportRows.length === 0) return;
    const res = weddingStorage.importGuests(parsedImportRows);
    loadData();
    setIsImportModalOpen(false);
    setImportCsvText('');
    setParsedImportRows([]);
    onNotify(`Import selesai: ${res.imported} tamu ditambahkan, ${res.duplicates} duplikat dilewati.`);
  };

  // Filtering & Search
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.institution && g.institution.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || g.category === categoryFilter;
    const matchesRsvp = rsvpFilter === 'ALL' || g.rsvpStatus === rsvpFilter;
    const matchesDelivery = deliveryFilter === 'ALL' || g.invitationStatus === deliveryFilter;

    return matchesSearch && matchesCategory && matchesRsvp && matchesDelivery;
  });

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    if (sortBy === 'name') {
      return a.fullName.localeCompare(b.fullName);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedGuests.length / pageSize) || 1;
  const paginatedGuests = sortedGuests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleGuest = filteredGuests.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisibleGuest = Math.min(currentPage * pageSize, filteredGuests.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Data Tamu Undangan
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Kelola tautan personal, kategori tamu, dan status penyampaian undangan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAddModal}
            className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Tamu</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-white border border-[#C5A15B] text-[#173D32] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#FAF6EE] shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span>Import CSV</span>
          </button>

          <ExportActions onExport={handleExport} label="Ekspor Tamu" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama tamu, instansi, atau slug undangan..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none focus:border-[#C5A15B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Teman">Teman</option>
              <option value="Rekan Kerja">Rekan Kerja</option>
              <option value="VIP">VIP</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <select
              value={rsvpFilter}
              onChange={(e) => {
                setRsvpFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none"
            >
              <option value="ALL">Semua Status RSVP</option>
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Belum Mengonfirmasi">Belum Mengonfirmasi</option>
            </select>

            <select
              value={deliveryFilter}
              onChange={(e) => {
                setDeliveryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none"
            >
              <option value="ALL">Status Kirim</option>
              <option value="Belum Dikirim">Belum Dikirim</option>
              <option value="Terkirim">Terkirim</option>
              <option value="Dibuka">Dibuka</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs bg-[#FAF6EE] border border-[#C5A15B]/40 focus:outline-none"
            >
              <option value="date">Terbaru Ditambahkan</option>
              <option value="name">Urutkan Abjad Nama</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>Menampilkan {filteredGuests.length} tamu</span>
          {categoryFilter !== 'ALL' || rsvpFilter !== 'ALL' || searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setRsvpFilter('ALL');
                setDeliveryFilter('ALL');
              }}
              className="text-[#997838] hover:underline"
            >
              Reset Filter
            </button>
          ) : null}
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-2xl bg-white border border-[#C5A15B]/30 shadow-sm overflow-hidden">
        <div className="px-4 py-3 text-xs text-gray-600 border-b border-gray-100">
          Menampilkan {firstVisibleGuest}–{lastVisibleGuest} dari {filteredGuests.length} data tamu
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#173D32] text-[#E0C782] font-royal uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama & Instansi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Slug & Link</th>
                <th className="py-3 px-4">Status Kirim</th>
                <th className="py-3 px-4">RSVP Kehadiran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada tamu yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                paginatedGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#173D32]">{guest.fullName}</div>
                      {guest.institution && (
                        <div className="text-[11px] text-gray-500 font-serif-jawa">{guest.institution}</div>
                      )}
                      {guest.phone && (
                        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                      {guest.tableAssignment && (
                        <div className="text-[10px] text-[#997838] font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-[#C5A15B]" />
                          <span>{guest.tableAssignment}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A15B]/20 text-[#997838] border border-[#C5A15B]/40">
                        {guest.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-[#173D32] bg-[#FAF6EE] px-2 py-0.5 rounded border border-[#C5A15B]/20 inline-block">
                        /{guest.slug}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => copyInvitationLink(guest.slug)}
                          title="Salin Link Undangan"
                          className="text-[10px] text-[#997838] hover:text-[#173D32] font-medium flex items-center gap-1"
                        >
                          {copiedSlug === guest.slug ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => copyWhatsAppMessage(guest)}
                          title="Salin Pesan WhatsApp"
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Pesan WA</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          guest.invitationStatus === 'Dibuka'
                            ? 'bg-purple-100 text-purple-800'
                            : guest.invitationStatus === 'Terkirim'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {guest.invitationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                          guest.rsvpStatus === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : guest.rsvpStatus === 'Tidak Hadir'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {guest.rsvpStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenInvitation(guest.slug)}
                          title="Preview Undangan Personal"
                          className="p-1.5 rounded-lg text-[#173D32] hover:bg-[#FAF6EE]"
                        >
                          <ExternalLink className="w-4 h-4 text-[#C5A15B]" />
                        </button>
                        <button
                          onClick={() => openEditModal(guest)}
                          title="Edit Tamu"
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-[#FAF6EE]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id, guest.fullName)}
                          title="Hapus Tamu"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-2.5 py-1 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-[#173D32] text-[#E0C782]'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2.5 py-1 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      {isAddEditModalOpen && (
        <div
          onClick={() => setIsAddEditModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingGuest ? 'Perbarui Data Tamu' : 'Tambah Tamu Undangan Baru'}
              </h2>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Lengkap Tamu *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Mas Danu & Keluarga"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Slug Undangan Unik (URL)*
                </label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-500 font-mono text-[11px]">
                    /invitation/
                  </span>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(weddingStorage.slugify(e.target.value))}
                    className="w-full px-3 py-2 rounded-r-xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#C5A15B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kategori Tamu</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GuestCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  >
                    <option value="Keluarga">Keluarga</option>
                    <option value="Teman">Teman</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="VIP">VIP</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Status Pengiriman</label>
                  <select
                    value={formDelivery}
                    onChange={(e) => setFormDelivery(e.target.value as DeliveryStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  >
                    <option value="Belum Dikirim">Belum Dikirim</option>
                    <option value="Terkirim">Terkirim</option>
                    <option value="Dibuka">Dibuka</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Instansi / Keluarga (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Trah Keraton / UGM"
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">No. WhatsApp (Opsional)</label>
                  <input
                    type="tel"
                    placeholder="Contoh: +62812345678"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Alokasi Meja / Tempat Duduk Resepsi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Meja Melati VIP 1 / Trah Utama"
                  value={formTable}
                  onChange={(e) => setFormTable(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Catatan Admin (Privat)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Meja VIP Baris A..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173D32] text-[#E0C782] font-semibold hover:bg-[#235244]"
                >
                  {editingGuest ? 'Simpan Perubahan' : 'Tambahkan Tamu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div
          onClick={() => setIsImportModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#C5A15B]" />
                <h2 className="font-royal text-base font-bold text-[#173D32]">
                  Import Tamu dari Data CSV
                </h2>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C5A15B]/30 text-gray-700">
                <p className="font-semibold text-[#173D32]">Format Kolom CSV:</p>
                <code className="text-[11px] text-[#997838] block mt-1 font-mono">
                  Nama Lengkap, Kategori, Instansi, No Telepon
                </code>
                <p className="text-[11px] text-gray-500 mt-1">
                  Kategori valid: Keluarga, Teman, Rekan Kerja, VIP, Lainnya. Baris pertama dianggap sebagai header.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Tempelkan Isi CSV atau Tulis di Bawah Ini:
                </label>
                <textarea
                  rows={5}
                  value={importCsvText}
                  onChange={(e) => handleParseCsv(e.target.value)}
                  placeholder={`Nama Lengkap, Kategori, Instansi, No Telepon\nRaden Ayu Kartika, VIP, Keraton Ngayogyakarta, +62812334455\nDr. Supriyadi, Rekan Kerja, RSUP Sardjito, +6285778899`}
                  className="w-full p-3 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none focus:border-[#C5A15B]"
                />
              </div>

              {/* Validation errors */}
              {importErrors.length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Peringatan Format:</span>
                  </div>
                  {importErrors.map((err, i) => (
                    <p key={i} className="text-[11px]">{err}</p>
                  ))}
                </div>
              )}

              {/* Preview table */}
              {parsedImportRows.length > 0 && (
                <div>
                  <p className="font-semibold text-[#173D32] mb-1.5">
                    Pratinjau Data ({parsedImportRows.length} baris siap diimpor):
                  </p>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="p-2">Nama</th>
                          <th className="p-2">Kategori</th>
                          <th className="p-2">Instansi</th>
                          <th className="p-2">Slug Terbuat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedImportRows.map((r, i) => (
                          <tr key={i}>
                            <td className="p-2 font-medium">{r.fullName}</td>
                            <td className="p-2">{r.category}</td>
                            <td className="p-2 text-gray-500">{r.institution || '-'}</td>
                            <td className="p-2 font-mono text-[#997838]">/{r.slug}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={parsedImportRows.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 rounded-xl bg-[#173D32] text-[#E0C782] font-semibold hover:bg-[#235244] disabled:opacity-40"
                >
                  Konfirmasi & Simpan {parsedImportRows.length} Tamu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
