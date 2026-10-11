import React, { useState, useEffect } from 'react';
import { HeartHandshake, Plus, Edit2, Trash2, Calendar, X } from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { LoveStoryEntry } from '../../types/wedding';

interface AdminLoveStoryPageProps {
  onNotify: (msg: string) => void;
}

export const AdminLoveStoryPage: React.FC<AdminLoveStoryPageProps> = ({ onNotify }) => {
  const [stories, setStories] = useState<LoveStoryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<LoveStoryEntry | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [storyDate, setStoryDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const loadData = () => {
    setStories(weddingStorage.getLoveStories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingStory(null);
    setTitle('');
    setStoryDate('');
    setDescription('');
    setImageUrl('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: LoveStoryEntry) => {
    setEditingStory(s);
    setTitle(s.title);
    setStoryDate(s.storyDate);
    setDescription(s.description);
    setImageUrl(s.imageUrl || '');
    setIsPublished(s.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      onNotify('Judul dan cerita wajib diisi.');
      return;
    }

    weddingStorage.saveLoveStory({
      id: editingStory ? editingStory.id : `st-${Date.now()}`,
      title: title.trim(),
      storyDate: storyDate.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      displayOrder: editingStory ? editingStory.displayOrder : stories.length + 1,
      isPublished,
    });

    setIsModalOpen(false);
    loadData();
    onNotify(editingStory ? 'Kisah cinta diperbarui.' : 'Milestone cinta baru ditambahkan.');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus milestone "${name}"?`)) {
      weddingStorage.deleteLoveStory(id);
      loadData();
      onNotify(`Milestone "${name}" dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Kelola Love Story (Lelakon Tresna)
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Susun perjalanan pertemuan, proses lamaran hingga ikatan suci
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Momen</span>
        </button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {stories.map((story) => (
          <div
            key={story.id}
            className={`p-5 rounded-2xl bg-white border shadow-sm flex flex-col sm:flex-row gap-4 items-start justify-between ${
              story.isPublished ? 'border-[#C5A15B]/30' : 'border-gray-200 opacity-60'
            }`}
          >
            {story.imageUrl && (
              <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-[#997838] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#C5A15B]/20">
                  {story.storyDate}
                </span>
                {!story.isPublished && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded">
                    Draft
                  </span>
                )}
              </div>
              <h2 className="font-royal text-base font-bold text-[#173D32] mb-1">{story.title}</h2>
              <p className="text-xs text-gray-600 font-serif-jawa leading-relaxed">
                {story.description}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
              <button
                onClick={() => openEditModal(story)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(story.id, story.title)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingStory ? 'Edit Momen Cinta' : 'Tambah Momen Kisah Kasih'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Judul Momen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pepanggihan Kapisan (Pertemuan Pertama)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Waktu / Periode</label>
                <input
                  type="text"
                  placeholder="Contoh: Oktober 2021 / Dinten Minggu Pon"
                  value={storyDate}
                  onChange={(e) => setStoryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Cerita / Kisah *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ceritakan bagaimana momen indah tersebut terjadi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none resize-none font-serif-jawa"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">URL Foto Kenangan (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pubCheckStory"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-[#173D32] rounded"
                />
                <label htmlFor="pubCheckStory" className="text-gray-700">
                  Tampilkan momen ini pada undangan publik
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
                  Simpan Momen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
