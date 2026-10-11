import React from 'react';
import { SearchX, Home, ArrowLeft } from 'lucide-react';
import { GununganIcon, RoyalDivider } from '../components/common/GununganIcon';

interface NotFoundProps {
  slug?: string;
  onNavigateHome: () => void;
}

export const NotFoundInvitationPage: React.FC<NotFoundProps> = ({ slug, onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-[#0a1c17] flex items-center justify-center p-4">
      <div className="w-full max-w-[430px] p-8 rounded-3xl bg-batik-dark border-2 border-[#C5A15B]/50 shadow-2xl text-center text-[#F8F3E8] relative">
        <div className="flex justify-center mb-4">
          <GununganIcon size={70} color="#C5A15B" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#C5A15B]/20 text-[#E0C782] border border-[#C5A15B]/40 mb-3">
          Serat Ulem Mboten Kepanggih
        </span>

        <h1 className="font-royal text-2xl font-bold gold-shimmer tracking-wider mb-2">
          Undangan Tidak Ditemukan
        </h1>

        <RoyalDivider className="my-4" />

        <p className="text-xs text-[#F8F3E8]/80 font-serif-jawa leading-relaxed mb-4">
          Nyuwun pangapunten, tautan undangan kanthi kode{' '}
          <span className="font-mono text-[#E0C782] font-bold">"{slug}"</span> mboten saged kapanggih wonten ing basis data serat ulem pawiwahan.
        </p>

        <p className="text-xs text-[#E0C782]/70 font-serif-jawa italic mb-6">
          Mangga priksa malih seratan tautan ingkang sampun katampi, utawi saged mbikak undangan umum.
        </p>

        <button
          onClick={onNavigateHome}
          className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#997838] via-[#C5A15B] to-[#E0C782] text-[#173D32] font-semibold text-xs tracking-wider shadow-lg hover:shadow-[#C5A15B]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>BUKA UNDANGAN UTAMA</span>
        </button>
      </div>
    </div>
  );
};
