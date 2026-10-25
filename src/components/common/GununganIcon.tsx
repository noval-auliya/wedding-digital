import React from 'react';

interface GununganProps {
  className?: string;
  size?: number;
}

export const GununganIcon: React.FC<GununganProps> = ({
  className = '',
  size = 64,
}) => {
  return (
    <img
      src="/images/gunungan-emas.svg"
      alt=""
      width={size}
      height={size * (900 / 718)}
      className={className}
      aria-hidden="true"
    />
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
