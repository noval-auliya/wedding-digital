import React from 'react';
import { GununganIcon, RoyalDivider, RoyalCornerOrnament } from '../common/GununganIcon';
import { WeddingSettings } from '../../types/wedding';

interface ClosingSectionProps {
  settings: WeddingSettings;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ settings }) => {
  return (
    <footer className="relative py-14 px-6 bg-batik-subtle text-[#173D32] text-center border-t border-[#C5A15B]/30 pb-28">
      <div className="max-w-md mx-auto relative p-6 rounded-3xl bg-white/60 border border-[#C5A15B]/40 shadow-xl backdrop-blur-sm">
        <RoyalCornerOrnament position="top-left" className="top-2 left-2" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-2 right-2" />

        <div className="flex justify-center mb-3">
          <GununganIcon size={56} />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#997838] font-bold">
          Matur Nuwun
        </p>

        <p className="text-xs text-[#2c3e35]/85 font-serif-jawa leading-relaxed my-4">
          {settings.closingMessage}
        </p>

        <RoyalDivider className="my-4" />

        <p className="text-xs font-serif-jawa italic text-[#4b5563]">
          Kula ingkang nyenyuwun berkahing puji:
        </p>

        <h3 className="font-royal text-lg font-bold text-[#173D32] mt-2">
          {settings.brideNickname} & {settings.groomNickname}
        </h3>

        <div className="mt-3 text-[11px] text-[#4b5563] space-y-0.5 font-serif-jawa">
          <p>Kulawarga K.P.H. Tedjokusumo</p>
          <p>Kulawarga K.P.H. Suryodiningrat</p>
        </div>

        <div className="mt-8 pt-4 border-t border-[#C5A15B]/20">
          <p className="text-[10px] text-[#997838] font-medium tracking-wider uppercase">
            Javanese Royal Wedding Invitation
          </p>
          <p className="text-[10px] text-[#6b7280] mt-0.5">
            Ngayogyakarta Hadiningrat • 2026
          </p>
        </div>
      </div>
    </footer>
  );
};
