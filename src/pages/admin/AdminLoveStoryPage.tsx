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
  const [imageFit, setImageFit] = useState<'contain' | 'cover'>('cover');
  const [imagePositionX, setImagePositionX] = useState(50);
  const [imagePositionY, setImagePositionY] = useState(50);
  const [isPublished, setIsPublished] = useState(true);

  const loadData = () => {
    setStories(weddingStorage.getLoveStories());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = (event: Event) => {
      if ((event as CustomEvent<{ key: string }>).detail.key === 'javanese_wedding_story_v1') loadData();
    };
    window.addEventListener('wedding-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('wedding-storage-updated', handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setEditingStory(null);
    setTitle('');
    setStoryDate('');
    setDescription('');
    setImageUrl('');
    setImageFit('cover');
    setImagePositionX(50);
    setImagePositionY(50);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (s: LoveStoryEntry) => {
    setEditingStory(s);
    setTitle(s.title);
    setStoryDate(s.storyDate);
    setDescription(s.description);
    setImageUrl(s.imageUrl || '');
    setImageFit(s.imageFit ?? 'cover');
    setImagePositionX(s.imagePositionX ?? 50);
    setImagePositionY(s.imagePositionY ?? 50);
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
      imageFit,
      imagePositionX,
      imagePositionY,
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
            Kelola Kisah Cinta
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

      <div className="space-y-4 w-full">
        {stories.map((story) => (
          <div
            key={story.id}
            className={`p-5 rounded-2xl bg-white border shadow-sm flex flex-col sm:flex-row gap-4 items-start justify-between ${
              story.isPublished ? 'border-[#C5A15B]/30' : 'border-gray-200 opacity-60'
            }`}
          >
            {story.imageUrl && (
              <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className={`w-full h-full ${story.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  style={{ objectPosition: `${story.imagePositionX ?? 50}% ${story.imagePositionY ?? 50}%` }}
                />
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
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[calc(100vh-2rem)] max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#C5A15B]/40 bg-white p-6 shadow-2xl animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingStory ? 'Edit Momen Cinta' : 'Tambah Momen Kisah Kasih'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-3.5 mt-4 text-xs">
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
                <label className="block text-gray-700 font-semibold mb-1">Path / URL Foto Kenangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="/images/foto-kenangan.jpg atau https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none"
                />
                {imageUrl && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-gray-200 bg-[#0e2720]">
                    <img
                      src={imageUrl}
                      alt="Preview foto kisah cinta"
                      className={`w-full h-full ${imageFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                      style={{ objectPosition: `${imagePositionX}% ${imagePositionY}%` }}
                    />
                  </div>
                )}
              </div>

              <fieldset>
                <legend className="block text-gray-700 font-semibold mb-1">Tampilan Foto</legend>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`rounded-xl border p-2 cursor-pointer ${imageFit === 'contain' ? 'border-[#173D32] bg-[#173D32]/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="storyImageFit"
                      value="contain"
                      checked={imageFit === 'contain'}
                      onChange={() => setImageFit('contain')}
                      className="sr-only"
                    />
                    <span className="block font-semibold text-gray-700">Foto utuh</span>
                    <span className="block text-[10px] text-gray-500">Tidak terpotong</span>
                  </label>
                  <label className={`rounded-xl border p-2 cursor-pointer ${imageFit === 'cover' ? 'border-[#173D32] bg-[#173D32]/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="storyImageFit"
                      value="cover"
                      checked={imageFit === 'cover'}
                      onChange={() => setImageFit('cover')}
                      className="sr-only"
                    />
                    <span className="block font-semibold text-gray-700">Penuhi bingkai</span>
                    <span className="block text-[10px] text-gray-500">Sebagian foto bisa terpotong</span>
                  </label>
                </div>
              </fieldset>

              {imageFit === 'cover' && (
                <fieldset className="space-y-2">
                  <legend className="block text-gray-700 font-semibold mb-1">Atur Bagian Foto yang Tampil</legend>
                  <p className="text-[10px] text-gray-500">
                    Geser pengatur dan lihat preview untuk memilih bagian yang terlihat pada kisah cinta.
                  </p>
                  <label className="block text-gray-700">
                    Kiri - kanan: <span className="font-semibold">{imagePositionX}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePositionX}
                      onChange={(event) => setImagePositionX(Number(event.target.value))}
                      className="block w-full accent-[#173D32]"
                    />
                  </label>
                  <label className="block text-gray-700">
                    Atas - bawah: <span className="font-semibold">{imagePositionY}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={imagePositionY}
                      onChange={(event) => setImagePositionY(Number(event.target.value))}
                      className="block w-full accent-[#173D32]"
                    />
                  </label>
                </fieldset>
              )}

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

              <div className="sticky bottom-0 flex justify-end gap-2 border-t border-gray-100 bg-white pt-3 pb-1">
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
