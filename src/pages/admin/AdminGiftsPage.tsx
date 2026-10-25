import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit2, Trash2, CreditCard, MapPin, X } from 'lucide-react';
import { weddingStorage } from '../../services/storage';
import { WeddingGift } from '../../types/wedding';

interface AdminGiftsPageProps {
  onNotify: (msg: string) => void;
}

export const AdminGiftsPage: React.FC<AdminGiftsPageProps> = ({ onNotify }) => {
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<WeddingGift | null>(null);

  // Form fields
  const [bankName, setBankName] = useState('BCA (Bank Central Asia)');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('1');

  const loadData = () => {
    setGifts(weddingStorage.getGifts());
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = (event: Event) => {
      if ((event as CustomEvent<{ key: string }>).detail.key === 'javanese_wedding_gifts_v1') loadData();
    };
    window.addEventListener('wedding-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('wedding-storage-updated', handleStorageUpdate);
  }, []);

  const openAddModal = () => {
    setEditingGift(null);
    setBankName('BCA (Bank Central Asia)');
    setAccountHolder('Muhammad Noval Nur Auliya');
    setAccountNumber('');
    setDescription('Amplop Digital');
    setDeliveryAddress('');
    setIsPublished(true);
    setDisplayOrder(String(gifts.length + 1));
    setIsModalOpen(true);
  };

  const openEditModal = (gift: WeddingGift) => {
    setEditingGift(gift);
    setBankName(gift.bankName);
    setAccountHolder(gift.accountHolder);
    setAccountNumber(gift.accountNumber);
    setDescription(gift.description || '');
    setDeliveryAddress(gift.deliveryAddress || '');
    setIsPublished(gift.isPublished);
    setDisplayOrder(String(gift.displayOrder));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountHolder.trim()) {
      onNotify('Nama bank/metode dan nama pemilik rekening wajib diisi.');
      return;
    }

    weddingStorage.saveGift({
      id: editingGift ? editingGift.id : `gift-${Date.now()}`,
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      description: description.trim(),
      deliveryAddress: deliveryAddress.trim() || undefined,
      displayOrder: Math.max(1, Number.parseInt(displayOrder, 10) || 1),
      isPublished,
    });

    setIsModalOpen(false);
    loadData();
    onNotify(editingGift ? 'Data rekening berhasil diperbarui.' : 'Rekening hadiah baru ditambahkan.');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus rekening/alamat "${name}"?`)) {
      weddingStorage.deleteGift(id);
      loadData();
      onNotify(`Rekening "${name}" dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-royal text-2xl font-bold text-[#173D32]">
            Kelola Rekening & Hadiah Pernikahan
          </h1>
          <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic mt-0.5">
            Atur rekening bank, dompet digital, QRIS, serta alamat pengiriman tanda kasih
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2 px-3.5 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#235244] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Rekening</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((g) => (
          <div
            key={g.id}
            className={`p-5 rounded-2xl bg-white border shadow-sm flex flex-col justify-between ${
              g.isPublished ? 'border-[#C5A15B]/30' : 'border-gray-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-[#173D32] flex items-center gap-1.5">
                  {g.deliveryAddress ? (
                    <MapPin className="w-3.5 h-3.5 text-[#C5A15B]" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5 text-[#C5A15B]" />
                  )}
                  {g.bankName}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-[#FAF6EE] text-[#997838] px-1.5 py-0.5 rounded">
                    Urutan {g.displayOrder}
                  </span>
                  {!g.isPublished && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded">
                      Disembunyikan
                    </span>
                  )}
                </div>
              </div>

              {g.deliveryAddress ? (
                <div className="my-2">
                  <p className="text-xs font-semibold text-gray-800">{g.accountHolder}</p>
                  <p className="text-xs text-gray-500 mt-1 font-serif-jawa">{g.deliveryAddress}</p>
                </div>
              ) : (
                <div className="my-2">
                  <p className="font-mono text-sm font-bold text-[#173D32]">{g.accountNumber}</p>
                  <p className="text-xs text-gray-500">a.n. {g.accountHolder}</p>
                </div>
              )}

              {g.description && (
                <p className="text-[11px] text-[#997838] bg-[#FAF6EE] px-2 py-0.5 rounded-full inline-block mt-2">
                  {g.description}
                </p>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-end gap-1">
              <button
                onClick={() => openEditModal(g)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(g.id, g.bankName)}
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
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#C5A15B]/40 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-royal text-base font-bold text-[#173D32]">
                {editingGift ? 'Edit Rekening / Hadiah' : 'Tambah Rekening Hadiah'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nama Bank / Metode *</label>
                <input
                  type="text"
                  required
                  placeholder="BCA, Mandiri, BSI, QRIS, Hadiah Fisik"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A15B]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Atas Nama (Pemilik) *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama pemilik rekening atau penerima"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Nomor Rekening / No. HP</label>
                <input
                  type="text"
                  placeholder="8691234567"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Keterangan Singkat</label>
                <input
                  type="text"
                  placeholder="Amplop Digital Mempelai Wanita"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Urutan Tampil</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Angka lebih kecil akan ditampilkan lebih dahulu.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Alamat Kirim Hadiah Fisik (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Kosongkan jika rekening digital, atau isi jika hadiah fisik dikirim ke rumah..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pubCheckGift"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-[#173D32] rounded"
                />
                <label htmlFor="pubCheckGift" className="text-gray-700">
                  Tampilkan pada undangan publik
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
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
