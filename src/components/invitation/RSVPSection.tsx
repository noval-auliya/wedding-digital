import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';
import { RoyalDivider, RoyalCornerOrnament } from '../common/GununganIcon';
import { Guest, RSVP, WeddingSettings } from '../../types/wedding';
import { weddingStorage } from '../../services/storage';

interface RSVPSectionProps {
  guest: Guest | null;
  settings: WeddingSettings;
  onRSVPSubmitted: () => void;
  onNotify: (msg: string) => void;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ guest, settings, onRSVPSubmitted, onNotify }) => {
  const [name, setName] = useState(guest ? guest.fullName : '');
  const [status, setStatus] = useState<'Hadir' | 'Tidak Hadir' | ''>(
    guest?.rsvpStatus === 'Tidak Hadir' ? 'Tidak Hadir' : 'Hadir'
  );
  const [wishes, setWishes] = useState(guest?.wishes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [wishesList, setWishesList] = useState<RSVP[]>([]);
  const [likingWishIds, setLikingWishIds] = useState<Set<string>>(() => new Set());
  const [likedWishIds, setLikedWishIds] = useState<Set<string>>(() => new Set());
  const submissionInProgress = useRef(false);

  const loadWishes = () => {
    setWishesList(weddingStorage.getPublicWishes());
  };

  useEffect(() => {
    loadWishes();
    const handleStorageUpdate = (event: Event) => {
      const key = (event as CustomEvent<{ key: string }>).detail.key;
      if (key === 'javanese_wedding_public_wishes_v1') loadWishes();
    };
    window.addEventListener('wedding-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('wedding-storage-updated', handleStorageUpdate);
  }, []);

  useEffect(() => {
    if (guest) {
      setName(guest.fullName);
      if (guest.rsvpStatus === 'Hadir' || guest.rsvpStatus === 'Tidak Hadir') setStatus(guest.rsvpStatus);
      if (guest.wishes) {
        setWishes(guest.wishes);
      }
    }
  }, [guest?.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionInProgress.current) return;
    if (!name.trim()) {
      onNotify('Silakan lengkapi nama Anda.');
      return;
    }
    if (!status) {
      onNotify('Silakan pilih konfirmasi kehadiran Anda.');
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);

    try {
      await weddingStorage.submitRSVP({
        guestSlug: guest?.slug,
        guestName: name.trim(),
        attendanceStatus: status,
        wishes: settings.features.enableGuestWishes ? wishes.trim() : '',
      });

      setIsSubmitting(false);
      setName(guest?.fullName || '');
      setStatus('');
      setWishes('');
      setIsSubmittedSuccess(true);
      onRSVPSubmitted();
      onNotify('Terima kasih! Konfirmasi kehadiran dan doa Anda telah kami terima.');
      setTimeout(() => setIsSubmittedSuccess(false), 5000);
    } catch {
      onNotify('Gagal menyimpan konfirmasi. Silakan coba kembali.');
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLikeWish = async (id: string) => {
    if (likingWishIds.has(id)) return;
    setLikingWishIds((current) => new Set(current).add(id));
    try {
      const liked = await weddingStorage.likeWish(id);
      if (!liked) return;
      setLikedWishIds((current) => new Set(current).add(id));
      onNotify(
        liked.alreadyLiked
          ? 'Alamat IP ini sudah memberikan Aamiin pada doa tersebut.'
          : 'Doa telah diaminkan.',
      );
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : '';
      const message = error instanceof Error ? error.message : '';
      console.error('Gagal mengirim Aamiin melalui Firebase Functions:', error);

      if (code === 'auth/operation-not-allowed') {
        onNotify('Login anonim belum diaktifkan. Aktifkan Anonymous pada Firebase Authentication.');
      } else if (code === 'permission-denied' || code === 'firestore/permission-denied') {
        onNotify('Firestore menolak Aamiin. Periksa Rules publikWishes dan subkoleksi likes.');
      } else {
        onNotify(`Gagal mengirim Aamiin${message ? `: ${message}` : '. Periksa koneksi Firebase.'}`);
      }
    } finally {
      setLikingWishIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <section id="rsvp" className="py-12 px-6 bg-batik-dark text-[#F8F3E8]">
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C5A15B] font-semibold">
          Doa & Ucapan Restu
        </p>
        <h2 className="font-royal text-2xl font-bold tracking-wider gold-shimmer mt-1">
          Konfirmasi Kehadiran (RSVP)
        </h2>
        <RoyalDivider className="my-4" />
        <p className="text-xs text-[#E0C782]/80 font-serif-jawa italic max-w-xs mx-auto leading-relaxed">
          Di hari bahagia ini, doa restu dan harapan baik dari Anda merupakan hadiah yang begitu berarti bagi kami.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-sm mx-auto p-6 rounded-3xl bg-[#0e2720]/90 border border-[#C5A15B]/50 shadow-2xl backdrop-blur-sm relative">
        <RoyalCornerOrnament position="top-left" className="top-2 left-2 opacity-50" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-2 right-2 opacity-50" />

        {guest && (
          <div className="mb-4 p-3 rounded-xl bg-[#173D32]/80 border border-[#C5A15B]/30 flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-[#C5A15B] shrink-0" />
            <div className="text-left text-xs">
              <span className="text-[#E0C782] font-semibold block">Tautan Undangan Personal:</span>
              <span className="text-[#F8F3E8]/90 font-medium">{guest.fullName}</span>
              {guest.rsvpStatus !== 'Belum Mengonfirmasi' && (
                <span className="text-[10px] text-[#C5A15B] block mt-0.5">
                  Status saat ini: {guest.rsvpStatus}
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E0C782] font-medium mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda..."
              required
              readOnly={Boolean(guest)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#173D32] border border-[#C5A15B]/40 text-[#F8F3E8] placeholder-[#F8F3E8]/40 focus:outline-none focus:border-[#C5A15B] transition-all ${
                guest ? 'opacity-90 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Attendance Radio */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E0C782] font-medium mb-1.5">
              Konfirmasi Kehadiran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Hadir', 'Tidak Hadir'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                    status === st
                      ? 'bg-gradient-to-r from-[#997838] to-[#C5A15B] text-[#173D32] border-[#E0C782] shadow-md font-bold'
                      : 'bg-[#173D32] text-[#F8F3E8]/80 border-[#C5A15B]/30 hover:border-[#C5A15B]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Wishes TextArea */}
          {settings.features.enableGuestWishes && <div>
            <label className="block text-xs uppercase tracking-wider text-[#E0C782] font-medium mb-1.5">
              Doa & Ucapan Restu
            </label>
            <textarea
              rows={3}
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Tuliskan ucapan selamat dan doa untuk kedua mempelai..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[#173D32] border border-[#C5A15B]/40 text-[#F8F3E8] placeholder-[#F8F3E8]/40 focus:outline-none focus:border-[#C5A15B] transition-all resize-none font-serif-jawa"
            />
          </div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#997838] via-[#C5A15B] to-[#E0C782] text-[#173D32] font-bold text-xs tracking-wider shadow-lg hover:shadow-[#C5A15B]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin mr-1">⌛</span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim'}</span>
          </button>
        </form>

        {isSubmittedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#173D32] border border-[#C5A15B] text-center text-xs text-[#E0C782] flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#C5A15B]" />
            <span>Konfirmasi berhasil disimpan! Terima kasih.</span>
          </div>
        )}
      </div>

      {/* Guest Wishes Board (Buku Tamu Doa Restu) */}
      {settings.features.enableGuestWishes && (
      <div className="max-w-sm mx-auto mt-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#C5A15B]" />
            <h3 className="font-royal text-sm font-bold text-[#E0C782] tracking-wider uppercase">
              Buku Tamu & Doa Restu
            </h3>
          </div>
          <span className="text-[11px] text-[#C5A15B] font-semibold bg-[#173D32] px-2.5 py-0.5 rounded-full border border-[#C5A15B]/40">
            {wishesList.length} Ucapan
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {wishesList.length === 0 ? (
            <p className="text-xs text-center text-[#E0C782]/60 font-serif-jawa italic py-4">
              Belum ada ucapan. Jadilah yang pertama menyampaikan doa dan ucapan.
            </p>
          ) : (
            wishesList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#0e2720]/80 border border-[#C5A15B]/30 text-left shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-[#F8F3E8] font-royal">
                    {item.guestName}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                      item.attendanceStatus === 'Hadir'
                        ? 'bg-[#173D32] text-[#E0C782] border border-[#C5A15B]/40'
                        : 'bg-[#2b1717] text-[#fca5a5] border border-[#fca5a5]/30'
                    }`}
                  >
                    {item.attendanceStatus}
                  </span>
                </div>
                <p className="text-xs text-[#F8F3E8]/85 font-serif-jawa leading-relaxed">
                  "{item.wishes}"
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#C5A15B]/15">
                  <span className="text-[9px] text-[#E0C782]/50">
                    {new Date(item.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLikeWish(item.id)}
                    disabled={likingWishIds.has(item.id) || likedWishIds.has(item.id)}
                    className="flex items-center gap-1 text-[10px] text-[#E0C782] hover:text-white px-2 py-0.5 rounded-full bg-[#173D32] border border-[#C5A15B]/30 active:scale-90 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span aria-hidden="true" className="text-xs leading-none">🤲🏻</span>
                    <span>Aamiin ({item.likesCount || 0})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      )}
    </section>
  );
};
