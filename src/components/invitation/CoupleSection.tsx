import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { GununganIcon, RoyalCornerOrnament, RoyalDivider } from '../common/GununganIcon';
import { WeddingSettings } from '../../types/wedding';

interface CoupleSectionProps {
  settings: WeddingSettings;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ settings }) => {
  return (
    <section id="couple" className="relative py-12 px-6 bg-batik-subtle text-[#173D32]">
      {/* Quranic Prayer / Blessing Quote */}
      <div className="max-w-md mx-auto text-center mb-10 p-6 rounded-2xl bg-[#FAF6EE] border border-[#C5A15B]/30 shadow-md relative">
        <RoyalCornerOrnament position="top-left" className="top-2 left-2" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-2 right-2" />

        <div className="flex justify-center mb-2">
          <Sparkles className="w-5 h-5 text-[#C5A15B]" />
        </div>

        <p className="font-serif-jawa text-sm md:text-base italic text-[#2c3e35] leading-relaxed">
          "{settings.weddingPrayer}"
        </p>
        <p className="text-xs uppercase tracking-wider text-[#997838] font-semibold mt-3">
          — {settings.prayerSource} —
        </p>

        <div className="mt-4 pt-3 border-t border-[#C5A15B]/20">
          <p className="text-xs text-[#173D32]/80 font-serif-jawa italic">
            "Mugi Gusti Allah tansah paring berkah karaharjan, nyawijekaken ing roso tresna sejati dumugi kaken-kaken ninen-ninen."
          </p>
        </div>
      </div>

      {/* Opening Greeting */}
      <div className="text-center max-w-sm mx-auto mb-8">
        <p className="text-xs uppercase tracking-widest text-[#997838] font-bold">
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </p>
        <p className="text-xs text-[#2c3e35]/85 mt-2 font-serif-jawa leading-relaxed">
          {settings.openingMessage}
        </p>
        <RoyalDivider className="my-5" />
      </div>

      {/* Couple Profiles */}
      <div className="space-y-10 max-w-sm mx-auto">
        {/* Mempelai Wanita */}
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/70 border border-[#C5A15B]/40 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#997838] via-[#C5A15B] to-[#FAF6EE] shadow-lg mb-4">
            <img
              src={settings.brideImageUrl}
              alt={settings.brideName}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#173D32] border border-[#C5A15B] flex items-center justify-center text-[#E0C782]">
              <Heart className="w-4 h-4 fill-current text-[#C5A15B]" />
            </div>
          </div>

          <h3 className="font-royal text-xl font-bold text-[#173D32] tracking-wide">
            {settings.brideName}
          </h3>
          <p className="text-xs text-[#997838] font-semibold uppercase tracking-wider mt-1">
            {settings.brideTitle}
          </p>
          <p className="text-xs text-[#4b5563] mt-2 font-serif-jawa leading-snug">
            Putri kinasih saking:<br />
            <span className="font-semibold text-[#173D32]">{settings.brideParents}</span>
          </p>
        </div>

        {/* Ampersand Connector */}
        <div className="flex items-center justify-center -my-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#173D32] text-[#E0C782] border-2 border-[#C5A15B] flex items-center justify-center shadow-lg font-royal text-lg font-bold">
            &
          </div>
        </div>

        {/* Mempelai Pria */}
        <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/70 border border-[#C5A15B]/40 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#997838] via-[#C5A15B] to-[#FAF6EE] shadow-lg mb-4">
            <img
              src={settings.groomImageUrl}
              alt={settings.groomName}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#173D32] border border-[#C5A15B] flex items-center justify-center text-[#E0C782]">
              <Heart className="w-4 h-4 fill-current text-[#C5A15B]" />
            </div>
          </div>

          <h3 className="font-royal text-xl font-bold text-[#173D32] tracking-wide">
            {settings.groomName}
          </h3>
          <p className="text-xs text-[#997838] font-semibold uppercase tracking-wider mt-1">
            {settings.groomTitle}
          </p>
          <p className="text-xs text-[#4b5563] mt-2 font-serif-jawa leading-snug">
            Putra kakung saking:<br />
            <span className="font-semibold text-[#173D32]">{settings.groomParents}</span>
          </p>
        </div>
      </div>
    </section>
  );
};
