import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { VolumeX, Disc } from 'lucide-react';

export interface AudioPlayerHandle {
  play: () => void;
}

interface AudioPlayerProps {
  audioUrl: string;
  songTitle?: string;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({
  audioUrl,
  songTitle = 'Musik Pengiring Pernikahan',
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTitleTooltip, setShowTitleTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playAudio = useCallback(() => {
    audioRef.current?.play().catch((err) => {
      setIsPlaying(false);
      console.error('Audio play error:', err);
    });
  }, []);

  useImperativeHandle(ref, () => ({ play: playAudio }), [playAudio]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      playAudio();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="fixed bottom-20 right-4 z-40 flex items-center gap-2 md:right-auto md:left-[calc(50%+140px)]">
        {/* Floating Animated Song Pill */}
        {isPlaying && showTitleTooltip && (
          <div
            onClick={() => setShowTitleTooltip(false)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173D32]/95 border border-[#C5A15B] text-[#E0C782] text-[11px] shadow-xl backdrop-blur-md animate-in slide-in-from-right duration-300 max-w-[220px] cursor-pointer"
            title="Klik untuk menyembunyikan judul"
          >
            {/* Animated mini equalizer */}
            <div className="flex items-end gap-0.5 h-3 shrink-0">
              <span className="w-0.5 h-full bg-[#C5A15B] animate-pulse" />
              <span className="w-0.5 h-2/3 bg-[#E0C782] animate-bounce" />
              <span className="w-0.5 h-4/5 bg-[#C5A15B] animate-pulse" />
            </div>
            <span className="truncate font-serif-jawa italic">{songTitle}</span>
          </div>
        )}

        {/* Main floating disc button */}
        <button
          onClick={togglePlay}
          title={isPlaying ? `Heningkan: ${songTitle}` : `Putar: ${songTitle}`}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-2 border-[#C5A15B] ${
            isPlaying
              ? 'bg-[#173D32] text-[#E0C782] shadow-[#C5A15B]/40'
              : 'bg-[#F8F3E8] text-[#173D32] opacity-80 hover:opacity-100'
          }`}
        >
          {isPlaying ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-1.5 rounded-full animate-ping bg-[#C5A15B]/25 pointer-events-none" />
              <Disc className="w-5 h-5 text-[#E0C782] animate-spin [animation-duration:4s]" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-[#888]" />
          )}
        </button>
      </div>
    </>
  );
});
