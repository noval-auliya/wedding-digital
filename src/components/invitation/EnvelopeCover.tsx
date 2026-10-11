import React from 'react';
import { MailOpen, Sparkles, Heart } from 'lucide-react';
import { GununganIcon, RoyalCornerOrnament, RoyalDivider } from '../common/GununganIcon';
import { WeddingSettings, Guest } from '../../types/wedding';

interface EnvelopeCoverProps {
  settings: WeddingSettings;
  guest: Guest | null;
  onOpen: () => void;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({ settings, guest, onOpen }) => {
  const recipientName = guest ? guest.fullName : settings.defaultGuestGreeting;
  const recipientNote = guest?.institution || (guest ? `Keluarga / Tamu ${guest.category}` : 'Keluarga & Sahabat Terkasih');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1c17] p-4 overflow-y-auto">
      {/* Container constrained to max 430px */}
      <div className="relative w-full max-w-[430px] min-h-[92vh] max-h-[94vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C5A15B]/60 bg-batik-dark flex flex-col justify-between text-center p-6 text-[#F8F3E8]">
        {/* Corner Ornaments */}
        <RoyalCornerOrnament position="top-left" className="top-3 left-3" />
        <RoyalCornerOrnament position="top-right" className="top-3 right-3" />
        <RoyalCornerOrnament position="bottom-left" className="bottom-3 left-3" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-3 right-3" />

        {/* Top Header */}
        <div className="pt-4 flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A15B] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#E0C782]" />
            Serat Ulem Pawiwahan Ageng
            <Sparkles className="w-3 h-3 text-[#E0C782]" />
          </p>
          <div className="mt-4 mb-2">
            <GununganIcon size={68} />
          </div>
          <h1 className="font-royal text-2xl font-bold tracking-wider gold-shimmer mt-1">
            {settings.brideNickname} & {settings.groomNickname}
          </h1>
          <p className="text-xs text-[#E0C782]/80 font-serif-jawa italic mt-0.5">
            {new Date(settings.weddingDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Middle Recipient Card */}
        <div className="my-6 px-4 py-5 rounded-2xl bg-[#0e2720]/80 border border-[#C5A15B]/40 shadow-inner backdrop-blur-sm">
          <p className="text-xs text-[#E0C782] tracking-wider uppercase font-medium">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>

          <div className="my-3">
            <h2 className="font-royal text-xl md:text-2xl font-semibold text-[#F8F3E8] tracking-wide break-words">
              {recipientName}
            </h2>
            {recipientNote && (
              <p className="text-xs text-[#C5A15B] mt-1 font-serif-jawa italic">
                {recipientNote}
              </p>
            )}
          </div>

          {guest?.category && (
            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#C5A15B]/20 text-[#E0C782] border border-[#C5A15B]/40">
              Tamu Khusus • {guest.category}
            </span>
          )}

          <div className="mt-3 text-[11px] text-[#F8F3E8]/70 leading-relaxed font-serif-jawa">
            *Nyuwun pangapunten menawi wonten kalepatan seratan asma utawi gelar
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pb-4 flex flex-col items-center gap-3">
          <button
            onClick={onOpen}
            className="group relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#997838] via-[#C5A15B] to-[#E0C782] text-[#173D32] font-semibold text-sm tracking-wider shadow-lg hover:shadow-[#C5A15B]/40 active:scale-95 transition-all flex items-center justify-center gap-2.5 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <MailOpen className="w-4 h-4 text-[#173D32]" />
            <span>BUKA UNDANGAN</span>
          </button>
          <p className="text-[11px] text-[#E0C782]/70 font-serif-jawa italic">
            Klik tombol kagem mbikak serat ulem
          </p>
        </div>
      </div>
    </div>
  );
};
