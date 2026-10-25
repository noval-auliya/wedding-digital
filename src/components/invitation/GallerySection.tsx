import React, { useEffect, useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { RoyalDivider } from '../common/GununganIcon';
import { GalleryImage } from '../../types/wedding';

interface GallerySectionProps {
  images: GalleryImage[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ images }) => {
  const publishedImages = images.filter((img) => img.isPublished);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');

  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSlideDirection('next');
        setActiveModalIndex((currentIndex) =>
          currentIndex === null ? null : (currentIndex + 1) % publishedImages.length
        );
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSlideDirection('previous');
        setActiveModalIndex((currentIndex) =>
          currentIndex === null
            ? null
            : (currentIndex - 1 + publishedImages.length) % publishedImages.length
        );
      } else if (event.key === 'Escape') {
        setActiveModalIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex, publishedImages.length]);

  if (publishedImages.length === 0) return null;

  const openLightbox = (index: number) => {
    setActiveModalIndex(index);
  };

  const closeLightbox = () => {
    setActiveModalIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection('next');
    setActiveModalIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % publishedImages.length
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection('previous');
    setActiveModalIndex((currentIndex) =>
      currentIndex === null
        ? null
        : (currentIndex - 1 + publishedImages.length) % publishedImages.length
    );
  };

  return (
    <section id="gallery" className="py-12 px-6 bg-batik-dark text-[#F8F3E8]">
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#C5A15B] font-semibold">
          Potret Kenangan
        </p>
        <h2 className="font-royal text-2xl font-bold tracking-wider gold-shimmer mt-1">
          Galeri Foto Prewedding
        </h2>
        <RoyalDivider className="my-4" />
        <p className="text-xs text-[#E0C782]/80 font-serif-jawa italic max-w-xs mx-auto">
          Momen bahagia ing busana ageng adat Jawa
        </p>
      </div>

      {/* Grid of photos */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {publishedImages.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => openLightbox(idx)}
            className={`group relative rounded-2xl overflow-hidden border border-[#C5A15B]/40 shadow-lg cursor-pointer bg-[#0e2720] ${
              idx % 3 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
            }`}
          >
            <img
              src={img.imageUrl}
              alt={img.caption || 'Prewedding Photo'}
              className={`w-full h-full ${img.imageFit === 'cover' ? 'object-cover group-hover:scale-105' : 'object-contain'} transition-transform duration-500`}
              style={{
                objectPosition: `${img.imagePositionX ?? 50}% ${img.imagePositionY ?? 50}%`,
                transformOrigin: `${img.imagePositionX ?? 50}% ${img.imagePositionY ?? 50}%`,
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e2720]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-xs text-[#E0C782] font-serif-jawa line-clamp-1">{img.caption}</p>
              <div className="flex items-center gap-1 text-[10px] text-[#F8F3E8]/80 mt-0.5">
                <Eye className="w-3 h-3 text-[#C5A15B]" />
                <span>Lihat Foto</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full flex flex-col items-center"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#C5A15B]/50 shadow-2xl max-h-[75vh]">
              <img
                key={publishedImages[activeModalIndex].id}
                src={publishedImages[activeModalIndex].imageUrl}
                alt={publishedImages[activeModalIndex].caption}
                className={`w-full h-auto max-h-[70vh] object-contain gallery-slide-${slideDirection}`}
              />
            </div>
            {publishedImages[activeModalIndex].caption && (
              <p className="text-center text-xs text-[#E0C782] font-serif-jawa italic mt-3 px-4">
                {publishedImages[activeModalIndex].caption}
              </p>
            )}
            <p className="text-[11px] text-white/50 mt-1">
              {activeModalIndex + 1} / {publishedImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
