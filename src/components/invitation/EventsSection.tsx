import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus } from 'lucide-react';
import { GununganIcon, RoyalCornerOrnament, RoyalDivider } from '../common/GununganIcon';
import { WeddingEvent } from '../../types/wedding';

interface EventsSectionProps {
  events: WeddingEvent[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const publishedEvents = events.filter((e) => e.isPublished);

  const createGoogleCalendarLink = (event: WeddingEvent) => {
    // Format YYYYMMDDTHHmmSS
    const dateClean = event.eventDate.replace(/-/g, '');
    const startClean = (event.startTime || '08:00').replace(':', '') + '00';
    let endClean = '120000';
    if (event.endTime && event.endTime.includes(':')) {
      endClean = event.endTime.replace(':', '') + '00';
    } else {
      endClean = (parseInt(startClean.substring(0, 2)) + 3).toString().padStart(2, '0') + '0000';
    }

    const startDateTime = `${dateClean}T${startClean}`;
    const endDateTime = `${dateClean}T${endClean}`;

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || 'Pahargyan Pawiwahan Ageng Jawi');
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}&ctz=Asia/Jakarta`;
  };

  return (
    <section id="events" className="relative py-12 px-6 bg-batik-dark text-[#F8F3E8]">
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C5A15B] font-semibold">
          Reroncening Adat & Pahargyan
        </p>
        <h2 className="font-royal text-2xl font-bold tracking-wider gold-shimmer mt-1">
          Jadwal Acara Pernikahan
        </h2>
        <RoyalDivider className="my-4" />
        <p className="text-xs text-[#E0C782]/80 font-serif-jawa italic max-w-xs mx-auto">
          Kanthi hangajab berkahing Gusti, keparenga rawuh hangestreni adicara:
        </p>
      </div>

      <div className="space-y-6 max-w-sm mx-auto">
        {publishedEvents.map((evt, index) => (
          <div
            key={evt.id}
            className="relative p-6 rounded-3xl bg-[#0e2720]/85 border border-[#C5A15B]/50 shadow-2xl backdrop-blur-sm overflow-hidden"
          >
            <RoyalCornerOrnament position="top-right" className="top-2 right-2 opacity-60" />
            
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#C5A15B]/20 text-[#E0C782] border border-[#C5A15B] flex items-center justify-center text-xs font-bold font-royal">
                {index + 1}
              </span>
              <h3 className="font-royal text-lg font-bold text-[#F8F3E8] tracking-wide">
                {evt.title}
              </h3>
            </div>

            {evt.description && (
              <p className="text-xs text-[#E0C782]/70 font-serif-jawa italic mb-4 leading-relaxed">
                {evt.description}
              </p>
            )}

            <div className="space-y-2.5 text-xs text-[#F8F3E8]/90 my-4 border-y border-[#C5A15B]/20 py-3.5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#C5A15B] shrink-0" />
                <span className="font-medium">
                  {new Date(evt.eventDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A15B] shrink-0" />
                <span>
                  {evt.startTime} - {evt.endTime} WIB
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#E0C782]">{evt.venue}</p>
                  <p className="text-[11px] text-[#F8F3E8]/70 leading-snug mt-0.5">{evt.address}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <a
                href={evt.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#173D32] hover:bg-[#235244] border border-[#C5A15B] text-xs font-medium text-[#E0C782] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A15B]" />
                <span>Buka Peta</span>
              </a>

              <a
                href={createGoogleCalendarLink(evt)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#997838] to-[#C5A15B] text-xs font-semibold text-[#173D32] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#173D32]" />
                <span>Simpan Jadwal</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
