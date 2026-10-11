export type GuestCategory = 'Keluarga' | 'VIP' | 'Teman' | 'Rekan Kerja' | 'Lainnya';

export type RSVPStatus = 'Hadir' | 'Tidak Hadir' | 'Masih Ragu' | 'Belum Mengonfirmasi';

export type DeliveryStatus = 'Belum Dikirim' | 'Terkirim' | 'Dibuka';

export interface WeddingSettings {
  id: string;
  weddingTitle: string;
  brideName: string;
  brideNickname: string;
  brideTitle: string;
  brideParents: string;
  groomName: string;
  groomNickname: string;
  groomTitle: string;
  groomParents: string;
  weddingDate: string; // ISO date string: YYYY-MM-DD
  weddingTime: string; // e.g. "09:00 WIB"
  timezone: string; // e.g. "Asia/Jakarta"
  coverTitle: string;
  openingMessage: string;
  closingMessage: string;
  weddingPrayer: string;
  prayerSource: string;
  heroImageUrl: string;
  brideImageUrl: string;
  groomImageUrl: string;
  backgroundMusicUrl: string;
  backgroundMusicTitle?: string;
  defaultGuestGreeting: string;
  features: {
    enableCountdown: boolean;
    enableRSVP: boolean;
    enableGuestWishes: boolean;
    enableWeddingGifts: boolean;
    enableLoveStory: boolean;
    enableGallery: boolean;
    enableMusicAutoplay: boolean;
    enableCheckInPass?: boolean;
  };
  updatedAt: string;
}

export interface Guest {
  id: string;
  fullName: string;
  slug: string;
  category: GuestCategory;
  institution?: string;
  phone?: string;
  invitationStatus: DeliveryStatus;
  adminNotes?: string;
  tableAssignment?: string;
  checkedInAt?: string;
  rsvpStatus: RSVPStatus;
  attendeeCount: number;
  wishes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm or "Selesai"
  venue: string;
  address: string;
  mapsUrl: string;
  description?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface LoveStoryEntry {
  id: string;
  title: string;
  storyDate: string; // e.g. "Januari 2021"
  description: string;
  imageUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface WeddingGift {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  description?: string;
  deliveryAddress?: string;
  isPublished: boolean;
}

export interface RSVP {
  id: string;
  guestId?: string;
  guestSlug?: string;
  guestName: string;
  attendanceStatus: RSVPStatus;
  attendeeCount: number;
  wishes: string;
  likesCount?: number;
  submittedAt: string;
  updatedAt: string;
}
