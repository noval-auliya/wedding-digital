import React, { useEffect, useState } from 'react';
import { Home, Heart, Calendar, Image, Send, Gift, ChevronDown } from 'lucide-react';
import { WeddingSettings } from '../../types/wedding';

interface BottomNavProps {
  features: WeddingSettings['features'];
}

export const BottomNav: React.FC<BottomNavProps> = ({ features }) => {
  const [isAtTop, setIsAtTop] = useState(() => window.scrollY < 80);

  useEffect(() => {
    const updateScrollState = () => setIsAtTop(window.scrollY < 80);
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: 'Beranda', icon: Home },
    { id: 'couple', label: 'Mempelai', icon: Heart },
    { id: 'events', label: 'Acara', icon: Calendar },
    ...(features.enableGallery ? [{ id: 'gallery', label: 'Galeri', icon: Image }] : []),
    ...(features.enableWeddingGifts ? [{ id: 'gifts', label: 'Hadiah', icon: Gift }] : []),
    ...(features.enableRSVP ? [{ id: 'rsvp', label: 'RSVP', icon: Send }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none pb-2">
      {isAtTop && (
        <div className="flex flex-col items-center text-[#C5A15B] mb-1">
          <span className="text-[10px] tracking-widest uppercase font-serif-jawa italic text-[#E0C782]">
            Gulir ke Bawah
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#C5A15B]" />
        </div>
      )}
      <nav className="pointer-events-auto w-full max-w-[430px] mx-4 py-2 px-3 rounded-2xl bg-[#0e2720]/95 backdrop-blur-md border border-[#C5A15B]/50 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="flex flex-col items-center justify-center p-1.5 text-[#E0C782]/70 hover:text-[#E0C782] active:scale-95 transition-all group"
            >
              <Icon className="w-4 h-4 group-hover:scale-110 transition-transform text-[#C5A15B]" />
              <span className="text-[10px] tracking-tight mt-0.5 group-hover:font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
