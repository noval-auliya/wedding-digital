import React, { useState, useEffect } from 'react';
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
import { AudioPlayer } from '../components/common/AudioPlayer';
import { GununganIcon } from '../components/common/GununganIcon';
import { NotFoundInvitationPage } from './NotFoundInvitationPage';

interface PublicInvitationPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
  onNotify: (msg: string) => void;
}

export const PublicInvitationPage: React.FC<PublicInvitationPageProps> = ({
  slug,
  onNavigate,
  onNotify,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<WeddingSettings>(weddingStorage.getSettings());
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isSlugNotFound, setIsSlugNotFound] = useState(false);
  const [events, setEvents] = useState(weddingStorage.getEvents());
  const [gallery, setGallery] = useState(weddingStorage.getGallery());
  const [stories, setStories] = useState(weddingStorage.getLoveStories());
  const [gifts, setGifts] = useState(weddingStorage.getGifts());
  const [audioTrigger, setAudioTrigger] = useState(false);

  useEffect(() => {
    // Refresh data from storage
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
        // Mark as opened if not already
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
  }, [slug]);

  if (isSlugNotFound) {
    return (
      <NotFoundInvitationPage
        slug={slug}
        onNavigateHome={() => onNavigate('/')}
      />
    );
  }

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setAudioTrigger(true);
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
          Pawiwahan Ageng
        </h2>
        <p className="font-serif-jawa italic text-xs mt-1 text-[#F8F3E8]/70">
          Kraton Ngayogyakarta Hadiningrat
        </p>
      </div>

      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center text-center opacity-40 max-w-xs pointer-events-none text-[#C5A15B]">
        <GununganIcon size={120} />
        <h2 className="font-royal text-lg tracking-widest mt-4 text-[#E0C782]">
          Sekar & Dimas
        </h2>
        <p className="font-serif-jawa italic text-xs mt-1 text-[#F8F3E8]/70">
          Mugi pinaringan karaharjan langgeng
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
            audioUrl={settings.backgroundMusicUrl}
            songTitle={settings.backgroundMusicTitle || 'Ketika Cinta Bertasbih - Melly Goeslaw & Amee'}
            autoPlayTrigger={audioTrigger}
          />
        )}

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </main>
    </div>
  );
};
