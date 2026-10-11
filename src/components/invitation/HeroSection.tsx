import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronDown } from 'lucide-react';
import { GununganIcon, RoyalDivider } from '../common/GununganIcon';
import { WeddingSettings } from '../../types/wedding';

interface HeroSectionProps {
  settings: WeddingSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(`${settings.weddingDate}T08:00:00+07:00`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.weddingDate]);

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-between items-center text-center p-6 bg-batik-dark text-[#F8F3E8] overflow-hidden">
      {/* Background Hero Image with dark royal overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl}
          alt="Royal Wedding Hero"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e2720]/90 via-[#173D32]/85 to-[#0e2720]" />
      </div>

      <div className="relative z-10 pt-6 flex flex-col items-center max-w-sm">
        <div className="mb-2 animate-pulse">
          <GununganIcon size={72} />
        </div>

        <p className="text-xs uppercase tracking-[0.35em] text-[#C5A15B] font-semibold mt-2">
          {settings.coverTitle}
        </p>

        <h1 className="font-royal text-3xl md:text-4xl font-bold tracking-wider gold-shimmer my-3 leading-tight">
          {settings.brideNickname} <span className="font-serif text-2xl text-[#E0C782]">&</span> {settings.groomNickname}
        </h1>

        <p className="text-sm font-serif-jawa italic text-[#F8F3E8]/90 max-w-xs leading-relaxed">
          Pahargyan Ageng Dhaup Palakrama
        </p>

        <RoyalDivider className="my-4" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#173D32]/90 border border-[#C5A15B]/50 text-xs text-[#E0C782] shadow-md">
          <Calendar className="w-3.5 h-3.5 text-[#C5A15B]" />
          <span>
            {new Date(settings.weddingDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      {settings.features.enableCountdown && (
        <div className="relative z-10 my-6 w-full max-w-xs">
          <p className="text-xs uppercase tracking-widest text-[#C5A15B] mb-3 font-semibold">
            Menghitung Hari Bahagia
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Hari', val: timeLeft.days },
              { label: 'Jam', val: timeLeft.hours },
              { label: 'Menit', val: timeLeft.minutes },
              { label: 'Detik', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#0e2720]/80 border border-[#C5A15B]/40 shadow-lg backdrop-blur-sm flex flex-col items-center"
              >
                <span className="font-royal text-lg font-bold text-[#E0C782]">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F8F3E8]/70 mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div className="relative z-10 pb-2 flex flex-col items-center text-[#C5A15B]">
        <span className="text-[10px] tracking-widest uppercase font-serif-jawa italic text-[#E0C782]/80">
          Gulir ke Bawah
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce mt-1 text-[#C5A15B]" />
      </div>
    </section>
  );
};
