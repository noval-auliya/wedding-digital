import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { RoyalDivider } from '../common/GununganIcon';
import { LoveStoryEntry } from '../../types/wedding';

interface LoveStorySectionProps {
  stories: LoveStoryEntry[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  const publishedStories = stories.filter((s) => s.isPublished);
  if (publishedStories.length === 0) return null;

  return (
    <section id="story" className="py-12 px-6 bg-batik-subtle text-[#173D32]">
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#997838] font-bold">
          Lelakon Tresna
        </p>
        <h2 className="font-royal text-2xl font-bold tracking-wider text-[#173D32] mt-1">
          Kisah Kasih Kami
        </h2>
        <RoyalDivider className="my-4" />
        <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic max-w-xs mx-auto">
          Untaian takdir lan pitedahing Gusti ingkang nyawijekaken roso tresna
        </p>
      </div>

      <div className="relative max-w-sm mx-auto pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#C5A15B] before:via-[#E0C782] before:to-[#C5A15B] space-y-8">
        {publishedStories.map((story) => (
          <div key={story.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#173D32] border-2 border-[#C5A15B] shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E0C782]" />
            </div>

            <div className="p-5 rounded-2xl bg-white/80 border border-[#C5A15B]/30 shadow-md backdrop-blur-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#173D32]/10 text-[#173D32] text-[11px] font-semibold mb-2">
                <Calendar className="w-3 h-3 text-[#997838]" />
                <span>{story.storyDate}</span>
              </div>

              <h3 className="font-royal text-base font-bold text-[#173D32] tracking-wide mb-1">
                {story.title}
              </h3>

              {story.imageUrl && (
                <div className="my-3 rounded-xl overflow-hidden border border-[#C5A15B]/30 aspect-video shadow-inner">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <p className="text-xs text-[#4b5563] font-serif-jawa leading-relaxed">
                {story.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
