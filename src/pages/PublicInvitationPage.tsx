import React, { useState, useEffect, useRef } from 'react';
import { WeddingSettings, Guest } from '../types/wedding';
import { weddingStorage } from '../services/storage';
import { EnvelopeCover } from '../components/invitation/EnvelopeCover';
import { HeroSection } from '../components/invitation/HeroSection';
import { CoupleSection } from '../components/invitation/CoupleSection';
import { EventsSection } from '../components/invitation/EventsSection';
import { LoveStorySection } from '../components/invitation/LoveStorySection';
import { GallerySection } from '../components/invitation/GallerySection';
import { GiftsSection } from '../components/invitation/GiftsSection';
import { RSVPSection } from '../components/invitation/RSVPSection';
import { ClosingSection } from '../components/invitation/ClosingSection';
import { BottomNav } from '../components/invitation/BottomNav';
import { AudioPlayer, AudioPlayerHandle } from '../components/common/AudioPlayer';
import { GununganIcon } from '../components/common/GununganIcon';
import { NotFoundInvitationPage } from './NotFoundInvitationPage';

interface PublicInvitationPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
  onNotify: (msg: string) => void;
}

const setMetaContent = (attribute: 'name' | 'property', key: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const getPublicAssetUrl = (value: string | undefined, fallback: string): string => {
  try {
    const url = new URL(value || fallback, window.location.origin);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : new URL(fallback, window.location.origin).href;
  } catch {
    return new URL(fallback, window.location.origin).href;
  }
};

export const PublicInvitationPage: React.FC<PublicInvitationPageProps> = ({
  slug,
  onNavigate,
  onNotify,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isDataReady, setIsDataReady] = useState(weddingStorage.isDataReady());
  const [dataError, setDataError] = useState(weddingStorage.getDataError());
  const [settings, setSettings] = useState<WeddingSettings>(weddingStorage.getSettings());
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isSlugNotFound, setIsSlugNotFound] = useState(false);
  const [events, setEvents] = useState(weddingStorage.getEvents());
  const [gallery, setGallery] = useState(weddingStorage.getGallery());
  const [stories, setStories] = useState(weddingStorage.getLoveStories());
  const [gifts, setGifts] = useState(weddingStorage.getGifts());
  const audioPlayerRef = useRef<AudioPlayerHandle>(null);

  useEffect(() => {
    const title = `${settings.brideNickname} & ${settings.groomNickname} | Undangan Pernikahan`;
    const imageUrl = getPublicAssetUrl(
      '/images/wedding-share-preview.jpeg',
      '/images/wedding-share-preview.jpeg',
    );
    const faviconUrl = getPublicAssetUrl(settings.faviconUrl, '/images/gunungan-emas.svg');
    const description =
      (settings.openingMessage || '').trim().slice(0, 200)
      || 'Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan kami.';

    document.title = title;
    setMetaContent('property', 'og:title', title);
    setMetaContent('property', 'og:description', description);
    setMetaContent('property', 'og:url', window.location.href);
    setMetaContent('property', 'og:image', imageUrl);
    setMetaContent('property', 'og:image:width', '1023');
    setMetaContent('property', 'og:image:height', '1023');
    setMetaContent(
      'property',
      'og:image:alt',
      'Foto Noval dan Syifau mengenakan busana adat pernikahan',
    );
    setMetaContent('name', 'twitter:title', title);
    setMetaContent('name', 'twitter:description', description);
    setMetaContent('name', 'twitter:image', imageUrl);

    const favicon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]')
      || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = faviconUrl;
    if (!favicon.isConnected) document.head.appendChild(favicon);
  }, [settings]);

  useEffect(() => {
    const refreshFromStorage = () => {
      setIsDataReady(weddingStorage.isDataReady());
      setDataError(weddingStorage.getDataError());
      setSettings(weddingStorage.getSettings());
      setEvents(weddingStorage.getEvents());
      setGallery(weddingStorage.getGallery());
      setStories(weddingStorage.getLoveStories());
      setGifts(weddingStorage.getGifts());

      if (slug) {
        const found = weddingStorage.getGuestBySlug(slug);
        if (found) {
          setGuest(found);
          setIsSlugNotFound(false);
          if (found.invitationStatus === 'Belum Dikirim') {
            weddingStorage.saveGuest({
              ...found,
              invitationStatus: 'Dibuka',
            });
          }
        } else {
          setIsSlugNotFound(true);
        }
      } else {
        setGuest(null);
        setIsSlugNotFound(false);
      }
    };

    refreshFromStorage();
    window.addEventListener('wedding-storage-updated', refreshFromStorage);
    return () => window.removeEventListener('wedding-storage-updated', refreshFromStorage);
  }, [slug]);

  useEffect(() => {
    if (!isDataReady) return;

    const observerSupported = 'IntersectionObserver' in window;
    const observers: IntersectionObserver[] = [];

    document.querySelectorAll<HTMLElement>('main section').forEach((section) => {
      const targets = Array.from(
        section.querySelectorAll<HTMLElement>(
          ':scope > *:not(.absolute):not([aria-hidden="true"]), :scope :is(h1, h2, h3, h4, p, img, button, a)',
        ),
      );

      targets.forEach((target, index) => {
        target.classList.add('page-reveal');
        target.style.setProperty(
          '--page-reveal-delay',
          `${Math.min(index * 65, 390)}ms`,
        );
      });

      if (!observerSupported) {
        targets.forEach((target) => target.classList.add('is-visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );

      targets.forEach((target) => observer.observe(target));
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [isDataReady]);

  useEffect(() => {
    if (!isOpening) return;

    const timeout = window.setTimeout(() => setIsOpen(true), 1250);
    return () => window.clearTimeout(timeout);
  }, [isOpening]);

  if (!isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071713] px-6 text-center text-[#F8F3E8]">
        <div className="max-w-sm">
          <GununganIcon size={64} className="mx-auto mb-5" />
          <p className="font-serif-jawa">
            {dataError || 'Memuat undangan...'}
          </p>
          {dataError && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full border border-[#C5A15B] px-5 py-2 text-sm text-[#E0C782]"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isSlugNotFound) {
    return (
      <NotFoundInvitationPage
        slug={slug}
        onNavigateHome={() => onNavigate('/')}
      />
    );
  }

  const handleOpenInvitation = () => {
    setIsOpening(true);
    if (settings.features.enableMusicAutoplay) {
      audioPlayerRef.current?.play();
    }
    // Smooth scroll to hero
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRSVPUpdated = () => {
    if (slug) {
      const refreshed = weddingStorage.getGuestBySlug(slug);
      if (refreshed) setGuest(refreshed);
    }
  };

  return (
    <div className="min-h-screen bg-[#071713] flex justify-center items-start text-[#2c3e35] relative overflow-x-hidden">
      {/* Royal Desktop Framing with Traditional Background Ambience */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center text-center opacity-40 max-w-xs pointer-events-none text-[#C5A15B]">
        <GununganIcon size={120} />
        <h2 className="font-royal text-lg tracking-widest mt-4 text-[#E0C782]">
          Muhammad Noval Nur Auliya & Syifau Ainul Fitri
        </h2>
        <p className="font-serif-jawa italic text-xs mt-1 text-[#F8F3E8]/70">
          Semoga senantiasa berbahagia
        </p>
      </div>

      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center text-center opacity-40 max-w-xs pointer-events-none text-[#C5A15B]">
        <GununganIcon size={120} />
        <h2 className="font-royal text-lg tracking-widest mt-4 text-[#E0C782]">
          Muhammad Noval Nur Auliya & Syifau Ainul Fitri
        </h2>
        <p className="font-serif-jawa italic text-xs mt-1 text-[#F8F3E8]/70">
          Semoga senantiasa berbahagia
        </p>
      </div>

      {/* Main Mobile-Only Invitation Container (Strictly Max 430px) */}
      <main className="w-full max-w-[430px] min-h-screen bg-[#FAF6EE] shadow-2xl relative border-x border-[#C5A15B]/30 overflow-x-hidden">
        {/* Envelope Opening Overlay */}
        {!isOpen && (
          <EnvelopeCover
            settings={settings}
            guest={guest}
            onOpen={handleOpenInvitation}
            isOpening={isOpening}
          />
        )}

        {/* Content sections */}
        <HeroSection settings={settings} />
        <CoupleSection settings={settings} />
        <EventsSection events={events} />

        {settings.features.enableLoveStory && (
          <LoveStorySection stories={stories} />
        )}

        {settings.features.enableGallery && (
          <GallerySection images={gallery} />
        )}

        {settings.features.enableWeddingGifts && (
          <GiftsSection gifts={gifts} onNotify={onNotify} />
        )}

        {settings.features.enableRSVP && (
          <RSVPSection
            guest={guest}
            settings={settings}
            onRSVPSubmitted={handleRSVPUpdated}
            onNotify={onNotify}
          />
        )}

        <ClosingSection settings={settings} />

        {/* Floating Audio Controller */}
        {settings.backgroundMusicUrl && (
          <AudioPlayer
            ref={audioPlayerRef}
            audioUrl={settings.backgroundMusicUrl}
            songTitle={settings.backgroundMusicTitle || 'Musik Pengiring Pernikahan'}
          />
        )}

        {/* Fixed Bottom Navigation */}
        <BottomNav features={settings.features} />
      </main>
    </div>
  );
};
