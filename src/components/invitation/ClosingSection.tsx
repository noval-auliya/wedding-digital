import React from 'react';
import { GununganIcon, RoyalDivider, RoyalCornerOrnament } from '../common/GununganIcon';
import { WeddingSettings } from '../../types/wedding';

interface ClosingSectionProps {
  settings: WeddingSettings;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ settings }) => {
  return (
    <footer className="relative py-14 px-6 bg-batik-subtle text-[#173D32] text-center border-t border-[#C5A15B]/30 pb-28">
      <div className="max-w-md mx-auto relative p-6 rounded-3xl bg-[#FFFEFA] border border-[#C5A15B]/50 shadow-xl">
        <RoyalCornerOrnament position="top-left" className="top-2 left-2" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-2 right-2" />

        <div className="flex justify-center mb-3">
          <GununganIcon size={56} />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#765719] font-bold">
          Terima Kasih
        </p>

        <p className="text-xs text-[#24352E] font-medium font-serif-jawa leading-relaxed my-4">
          {settings.closingMessage}
        </p>

        <RoyalDivider className="my-4" />

        <p className="text-xs font-serif-jawa italic text-[#374151]">
          Dengan penuh rasa syukur,
        </p>

        <h3 className="font-royal text-lg font-bold text-[#173D32] mt-2">
          {settings.brideNickname} & {settings.groomNickname}
        </h3>
      </div>
    </footer>
  );
};
