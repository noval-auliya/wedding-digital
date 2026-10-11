import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit2, Star, Check, X, Upload } from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { GalleryImage } from '../../types/wedding';

interface AdminGalleryPageProps {
  onNotify: (msg: string) => void;
}

export const AdminGalleryPage: React.FC<AdminGalleryPageProps> = ({ onNotify }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Form fields
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const loadData = () => {
    setImages(weddingStorage.getGallery());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingImage(null);
    setImageUrl('');
    setCaption('');
    setIsFeatured(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setImageUrl(img.imageUrl);
    setCaption(img.caption);
    setIsFeatured(img.isFeatured);
    setIsPublished(img.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      onNotify('URL Foto wajib diisi.');
      return;
    }

    weddingStorage.saveGalleryImage({
      id: editingImage ? editingImage.id : `gal-${Date.now()}`,
      imageUrl: imageUrl.trim(),
      caption: caption.trim(),
      displayOrder: editingImage ? editingImage.displayOrder : images.length + 1,
      isFeatured,
      isPublished,
      createdAt: editingImage ? editingImage.createdAt : new Date().toISOString(),
    });

    setIsModalOpen(false);
    loadData();
    onNotify(editingImage ? 'Foto galeri diperbarui.' : 'Foto baru berhasil ditambahkan.');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus foto ini dari galeri?')) {
      weddingStorage.deleteGalleryImage(id);
      loadData();
      onNotify('Foto berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Kelola Galeri Foto Prewedding
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Tambah, urutkan, serta atur keterangan foto kenangan mempelai
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Foto</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-2xl overflow-hidden border border-[#C5A15B]/30 shadow-sm bg-white flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                {img.isFeatured && (
                  <span className="p-1 rounded-full bg-[#173D32] text-[#E0C782] shadow">
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                )}
                {!img.isPublished && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-medium">
                    Draft
                  </span>
                )}
              </div>
            </div>

            <div className="p-3">
              <p className="text-xs font-serif-jawa text-gray-800 line-clamp-1 italic">
                {img.caption || 'Tanpa keterangan'}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-[10px] text-gray-400 font-mono">#{img.displayOrder}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(img)}
                    className="p-1 text-gray-500 hover:text-[#173D32]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingImage ? 'Edit Foto Galeri' : 'Tambah Foto Prewedding'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">URL Foto (HTTPS) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-[11px] focus:outline-none focus:border-[#C5A15B]"
                />
                {imageUrl && (
                  <div className="mt-2 h-28 rounded-xl overflow-hidden border border-gray-200">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Keterangan Foto (Caption)</label>
                <input
                  type="text"
                  placeholder="Contoh: Busana Basahan Ageng Ngayogyakarta"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none font-serif-jawa text-xs"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#173D32] rounded"
                  />
                  <span className="text-gray-700">Tandai sebagai Foto Utama (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#173D32] rounded"
                  />
                  <span className="text-gray-700">Tampilkan di galeri publik</span>
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
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
