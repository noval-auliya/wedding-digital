import React from 'react';

interface GununganProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

export const GununganIcon: React.FC<GununganProps> = ({
  className = '',
  size = 64,
  color = '#C5A15B',
  accentColor = '#E0C782',
}) => {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 100 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gununganGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#997838" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C5A15B" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Gunungan Outer Silhouette */}
      <path
        d="M50 4 
           C52 14, 57 24, 66 34 
           C75 44, 82 54, 85 68 
           C88 80, 84 94, 82 104 
           C81 110, 77 114, 73 116 
           C67 118, 59 119, 50 119 
           C41 119, 33 118, 27 116 
           C23 114, 19 110, 18 104 
           C16 94, 12 80, 15 68 
           C18 54, 25 44, 34 34 
           C43 24, 48 14, 50 4 Z"
        stroke="url(#gununganGold)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#goldGlow)"
      />

      {/* Gunungan Base Stem (Gagang Kayon) */}
      <path
        d="M47 119 L47 132 Q50 135 53 132 L53 119 Z"
        fill="url(#gununganGold)"
      />

      {/* Inner Decorative Tree of Life (Pohon Hayat) & Gates */}
      {/* Central Spire */}
      <line x1="50" y1="12" x2="50" y2="114" stroke="url(#gununganGold)" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Temple / Gateway Gate Arch */}
      <path
        d="M38 114 L38 92 C38 84, 62 84, 62 92 L62 114"
        stroke="url(#gununganGold)"
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="50" cy="85" r="4" stroke="url(#gununganGold)" strokeWidth="1.2" fill="none" />

      {/* Foliage Branches */}
      <path
        d="M50 35 C42 40, 32 46, 32 56 C38 54, 44 50, 50 50"
        stroke="url(#gununganGold)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M50 35 C58 40, 68 46, 68 56 C62 54, 56 50, 50 50"
        stroke="url(#gununganGold)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M50 52 C38 58, 26 66, 26 78 C36 74, 44 70, 50 68"
        stroke="url(#gununganGold)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M50 52 C62 58, 74 66, 74 78 C64 74, 56 70, 50 68"
        stroke="url(#gununganGold)"
        strokeWidth="1.4"
        fill="none"
      />

      {/* Royal Crown Finial */}
      <circle cx="50" cy="5" r="3" fill="url(#gununganGold)" />
    </svg>
  );
};

export const RoyalDivider: React.FC<{ className?: string }> = ({ className = 'my-6' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C5A15B] to-transparent" />
      <div className="w-2 h-2 rotate-45 border border-[#C5A15B] bg-[#F8F3E8]" />
      <div className="w-3 h-3 rotate-45 bg-[#C5A15B]/30 border border-[#C5A15B]" />
      <div className="w-2 h-2 rotate-45 border border-[#C5A15B] bg-[#F8F3E8]" />
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-[#C5A15B] to-transparent" />
    </div>
  );
};

export const RoyalCornerOrnament: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div className={`absolute pointer-events-none ${rotation} ${className}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M2 38 V12 C2 6.5 6.5 2 12 2 H38"
          stroke="#C5A15B"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M7 38 V14 C7 10 10 7 14 7 H38"
          stroke="#C5A15B"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          fill="none"
        />
        <circle cx="12" cy="12" r="2" fill="#C5A15B" />
      </svg>
    </div>
  );
};
