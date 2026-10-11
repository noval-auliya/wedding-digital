import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Edit2, Trash2, MapPin, Clock, X, ExternalLink } from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { WeddingEvent } from '../../types/wedding';

interface AdminEventsPageProps {
  onNotify: (msg: string) => void;
}

export const AdminEventsPage: React.FC<AdminEventsPageProps> = ({ onNotify }) => {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-28');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:00');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const loadData = () => {
    setEvents(weddingStorage.getEvents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setEventDate('2026-11-28');
    setStartTime('08:00');
    setEndTime('11:00');
    setVenue('');
    setAddress('');
    setMapsUrl('https://maps.google.com');
    setDescription('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (evt: WeddingEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setEventDate(evt.eventDate);
    setStartTime(evt.startTime);
    setEndTime(evt.endTime);
    setVenue(evt.venue);
    setAddress(evt.address);
    setMapsUrl(evt.mapsUrl);
    setDescription(evt.description || '');
    setIsPublished(evt.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      onNotify('Judul acara dan nama lokasi wajib diisi.');
      return;
    }

    weddingStorage.saveEvent({
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: title.trim(),
      eventDate,
      startTime,
      endTime,
      venue: venue.trim(),
      address: address.trim(),
      mapsUrl: mapsUrl.trim(),
      description: description.trim(),
      displayOrder: editingEvent ? editingEvent.displayOrder : events.length + 1,
      isPublished,
    });

    setIsModalOpen(false);
    loadData();
    onNotify(editingEvent ? 'Acara berhasil diperbarui.' : 'Acara baru berhasil ditambahkan.');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus acara "${name}"?`)) {
      weddingStorage.deleteEvent(id);
      loadData();
      onNotify(`Acara "${name}" dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Kelola Rangkaian Jadwal Acara
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Atur prosesi adat (Siraman, Midodareni, Akad Nikah, Panggih, Resepsi)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Acara</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className={`p-5 rounded-2xl bg-white border shadow-sm flex flex-col justify-between transition-all ${
              evt.isPublished ? 'border-[#C5A15B]/30' : 'border-gray-200 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    evt.isPublished
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {evt.isPublished ? 'Dipublikasikan' : 'Draft / Disembunyikan'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Urutan #{evt.displayOrder}</span>
              </div>

              <h2 className="font-royal text-base font-bold text-[#173D32] mb-1">{evt.title}</h2>
              {evt.description && (
                <p className="text-xs text-gray-600 font-serif-jawa italic mb-3">
                  {evt.description}
                </p>
              )}

              <div className="space-y-1.5 text-xs text-gray-700 my-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#C5A15B]" />
                  <span>
                    {new Date(evt.eventDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C5A15B]" />
                  <span>
                    {evt.startTime} - {evt.endTime} WIB
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A15B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{evt.venue}</span>
                    <span className="text-[11px] text-gray-500">{evt.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <a
                href={evt.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#997838] hover:underline flex items-center gap-1"
              >
                <span>Lihat Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(evt)}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(evt.id, evt.title)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingEvent ? 'Edit Rangkaian Acara' : 'Tambah Acara Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Acara *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akad Nikah & Panggih Adat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mulai</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Selesai</label>
                  <input
                    type="text"
                    required
                    placeholder="11:00 / Selesai"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Gedung / Tempat *</label>
                <input
                  type="text"
                  required
                  placeholder="Pendopo Agung Royal Ambarrukmo"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="Jl. Laksda Adisucipto No. 81, Yogyakarta"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tautan Google Maps</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Keterangan / Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi tata cara atau jamuan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none resize-none font-serif-jawa"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-[#173D32] rounded focus:ring-0"
                />
                <label htmlFor="pubCheck" className="text-gray-700 font-medium">
                  Tampilkan acara ini pada undangan publik
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173D32] text-[#E0C782] font-semibold hover:bg-[#235244]"
                >
                  Simpan Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
