import React from 'react';
import { QrCode, CheckCircle, MapPin, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { GununganIcon, RoyalCornerOrnament, RoyalDivider } from './GununganIcon';
import { Guest, WeddingSettings } from '../../types/wedding';

interface RoyalGuestPassProps {
  guest: Guest;
  settings: WeddingSettings;
}

export const RoyalGuestPass: React.FC<RoyalGuestPassProps> = ({ guest, settings }) => {
  const isCheckedIn = Boolean(guest.checkedInAt);

  // Construct QR data URL representation
  const qrData = `ROYAL-WEDDING-${guest.slug}-${guest.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    qrData
  )}&color=17-61-50&bgcolor=248-243-232`;

  return (
    <div className="relative p-6 rounded-3xl bg-[#FAF6EE] border-2 border-[#C5A15B] shadow-2xl text-[#173D32] my-8 overflow-hidden">
      <RoyalCornerOrnament position="top-left" className="top-2 left-2" />
      <RoyalCornerOrnament position="top-right" className="top-2 right-2" />
      <RoyalCornerOrnament position="bottom-left" className="bottom-2 left-2" />
      <RoyalCornerOrnament position="bottom-right" className="bottom-2 right-2" />

      {/* Watermark Gunungan in background */}
      <div className="absolute right-2 -bottom-6 opacity-10 pointer-events-none">
        <GununganIcon size={160} color="#173D32" />
      </div>

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-1.5 text-[#997838] text-[10px] uppercase font-bold tracking-[0.25em]">
          <Sparkles className="w-3 h-3 text-[#C5A15B]" />
          <span>Tanda Rawuh Resmi</span>
          <Sparkles className="w-3 h-3 text-[#C5A15B]" />
        </div>

        <h3 className="font-royal text-base font-bold text-[#173D32] tracking-wider mt-1">
          Kartu Presensi Tamu Pawiwahan
        </h3>
        <p className="text-[11px] font-serif-jawa italic text-gray-600">
          {settings.brideNickname} & {settings.groomNickname}
        </p>

        <RoyalDivider className="my-3" />

        {/* QR Code Container */}
        <div className="my-3 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-[#C5A15B]/50 shadow-md relative">
            <img
              src={qrImageUrl}
              alt={`QR Presensi ${guest.fullName}`}
              className="w-36 h-36 object-contain rounded-lg"
              loading="lazy"
            />
            {/* Center Royal Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-[#173D32] border-2 border-[#E0C782] shadow flex items-center justify-center">
                <span className="font-royal text-[9px] font-bold text-[#E0C782]">S&D</span>
              </div>
            </div>
          </div>

          <div className="mt-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            KODE: <span className="font-bold text-[#173D32]">{guest.slug}</span>
          </div>
        </div>

        {/* Guest Details */}
        <div className="mt-3 text-center space-y-1">
          <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold bg-[#173D32]/10 text-[#173D32] border border-[#C5A15B]/40 inline-block">
            Tamu Khusus • {guest.category}
          </span>
          <h4 className="font-royal text-base font-bold text-[#173D32] leading-snug">
            {guest.fullName}
          </h4>
          {guest.institution && (
            <p className="text-[11px] font-serif-jawa italic text-gray-600">
              {guest.institution}
            </p>
          )}

          {guest.tableAssignment && (
            <div className="mt-2 py-1 px-3 bg-[#173D32] text-[#E0C782] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3 h-3 text-[#C5A15B]" />
              <span>{guest.tableAssignment}</span>
            </div>
          )}
        </div>

        {/* Check-in status notification */}
        <div className="mt-4 pt-3 border-t border-[#C5A15B]/20">
          {isCheckedIn ? (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100/80 py-1.5 px-3 rounded-full border border-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Sampun Rawuh ing Resepsi (Telah Check-In)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-600 font-serif-jawa italic">
              <ShieldCheck className="w-3.5 h-3.5 text-[#997838]" />
              <span>Tuduhaken QR punika dhateng among tamu ing pahargyan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
