import {
  WeddingSettings,
  Guest,
  WeddingEvent,
  GalleryImage,
  LoveStoryEntry,
  WeddingGift,
  RSVP,
} from '../types/wedding';

const STORAGE_KEYS = {
  SETTINGS: 'javanese_wedding_settings_v1',
  GUESTS: 'javanese_wedding_guests_v1',
  EVENTS: 'javanese_wedding_events_v1',
  GALLERY: 'javanese_wedding_gallery_v1',
  LOVE_STORY: 'javanese_wedding_story_v1',
  GIFTS: 'javanese_wedding_gifts_v1',
  RSVPS: 'javanese_wedding_rsvps_v1',
};

// Royal Traditional Royalty Seed Data
const DEFAULT_SETTINGS: WeddingSettings = {
  id: 'royal-wedding-2026',
  weddingTitle: 'Pawiwahan Ageng Jawi',
  brideName: 'Raden Ajeng Sekar Ayu Kinanti, S.Hum.',
  brideNickname: 'Sekar',
  brideTitle: 'Putri Pertama',
  brideParents: 'K.P.H. Tedjokusumo & K.R.Ay. Retno Palupi',
  groomName: 'Raden Mas Dimas Arya Daniswara, S.T., M.Sc.',
  groomNickname: 'Dimas',
  groomTitle: 'Putra Kedua',
  groomParents: 'K.P.H. Suryodiningrat & K.R.Ay. Wardani',
  weddingDate: '2026-11-28',
  weddingTime: '08:00 WIB',
  timezone: 'Asia/Jakarta',
  coverTitle: 'The Royal Wedding Celebration',
  openingMessage:
    'Nyuwun lumunturing sih nugraha lan pangestu panjenengan sami. Kanthi asma Gusti Kang Maha Asih, kula sakulawarga ngaturaken pawartos punika ing dinten kalodhangan:',
  closingMessage:
    'Matur nuwun sanget awit saking sih kawigatosan, pandonga, saha rawuh panjenengan sami ing pahargyan punika. Mugi Gusti Kang Maha Mirah tansah paring berkah karaharjan.',
  weddingPrayer:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  prayerSource: 'QS. Ar-Rum: 21',
  heroImageUrl:
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  brideImageUrl:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  groomImageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  backgroundMusicUrl:
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  backgroundMusicTitle: 'Ketika Cinta Bertasbih - Melly Goeslaw & Amee',
  defaultGuestGreeting: 'Bapak/Ibu/Saudara/i',
  features: {
    enableCountdown: true,
    enableRSVP: true,
    enableGuestWishes: true,
    enableWeddingGifts: true,
    enableLoveStory: true,
    enableGallery: true,
    enableMusicAutoplay: true,
  },
  updatedAt: new Date().toISOString(),
};

const DEFAULT_EVENTS: WeddingEvent[] = [
  {
    id: 'evt-siraman',
    title: 'Upacara Siraman & Midodareni',
    eventDate: '2026-11-27',
    startTime: '15:30',
    endTime: '21:00',
    venue: 'Ndalem Ageng Tedjokusuman',
    address: 'Jl. D.I. Panjaitan No. 45, Mantrijeron, Kota Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Yogyakarta',
    description: 'Adat pembersihan diri dan doa tirakatan menyambut hari suci pernikahan.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'evt-akad',
    title: 'Akad Nikah & Panggih Adat',
    eventDate: '2026-11-28',
    startTime: '08:00',
    endTime: '11:00',
    venue: 'Pendopo Agung Royal Ambarrukmo',
    address: 'Jl. Laksda Adisucipto No. 81, Caturtunggal, Sleman, D.I. Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=Royal+Ambarrukmo+Yogyakarta',
    description: 'Ijab qabul dilanjutkan dengan upacara sakral Panggih Gagrak Ngayogyakarta.',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'evt-resepsi',
    title: 'Pahargyan Ageng (Resepsi Pernikahan)',
    eventDate: '2026-11-28',
    startTime: '18:30',
    endTime: '22:00',
    venue: 'Grand Ballroom The Phoenix Hotel Yogyakarta',
    address: 'Jl. Jend. Sudirman No. 9, Gowongan, Jetis, D.I. Yogyakarta',
    mapsUrl: 'https://maps.google.com/?q=The+Phoenix+Hotel+Yogyakarta',
    description: 'Jamuan makan malam dan resepsi agung bersama kerabat dan sahabat terkasih.',
    displayOrder: 3,
    isPublished: true,
  },
];

const DEFAULT_GUESTS: Guest[] = [
  {
    id: 'gst-1',
    fullName: 'Noval Auliya',
    slug: 'noval-auliya',
    category: 'VIP',
    institution: 'Pemerintah Provinsi D.I. Yogyakarta',
    phone: '+6281234567890',
    invitationStatus: 'Terkirim',
    adminNotes: 'Tamu kehormatan keluarga besar',
    rsvpStatus: 'Belum Mengonfirmasi',
    attendeeCount: 0,
    wishes: '',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'gst-2',
    fullName: 'Keluarga Bapak Ahmad',
    slug: 'keluarga-bapak-ahmad',
    category: 'Keluarga',
    institution: 'Keluarga Besar Trah Tedjokusumo',
    phone: '+6281398765432',
    invitationStatus: 'Terkirim',
    adminNotes: 'Meja Baris A - VIP Keluarga',
    rsvpStatus: 'Hadir',
    attendeeCount: 4,
    wishes: 'Ndherek mangayubagya Mas Dimas & Mbak Sekar. Mugi tansah pinaringan berkah sakinah mawaddah warahmah.',
    createdAt: '2026-10-02T09:30:00Z',
    updatedAt: '2026-10-05T14:10:00Z',
  },
  {
    id: 'gst-3',
    fullName: 'Siti Rahma',
    slug: 'siti-rahma',
    category: 'Teman',
    institution: 'Sahabat Sastra UGM',
    phone: '+6285712345678',
    invitationStatus: 'Terkirim',
    adminNotes: 'Sahabat dekat mempelai wanita',
    rsvpStatus: 'Hadir',
    attendeeCount: 2,
    wishes: 'Selamat menempuh hidup baru Sekar sayang! Semoga rumah tangganya penuh kehangatan, rezeki melimpah dan lekas dikaruniai momongan lucu.',
    createdAt: '2026-10-03T11:00:00Z',
    updatedAt: '2026-10-06T10:20:00Z',
  },
  {
    id: 'gst-4',
    fullName: 'Bambang Sujatmiko, S.T.',
    slug: 'bambang-sujatmiko',
    category: 'Rekan Kerja',
    institution: 'PT Rekayasa Mahakarya Enjiniring',
    phone: '+6282133445566',
    invitationStatus: 'Terkirim',
    adminNotes: 'Rekan kerja mempelai pria',
    rsvpStatus: 'Masih Ragu',
    attendeeCount: 1,
    wishes: 'Selamat atas pernikahannya Dimas & Sekar. Semoga lancar acaranya!',
    createdAt: '2026-10-04T13:45:00Z',
    updatedAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'gst-5',
    fullName: 'Dr. Hendra Kusuma & Keluarga',
    slug: 'dr-hendra-kusuma',
    category: 'VIP',
    institution: 'Keraton Ngayogyakarta Hadiningrat',
    phone: '+6281299887766',
    invitationStatus: 'Terkirim',
    adminNotes: 'Tamu VIP Utama',
    rsvpStatus: 'Hadir',
    attendeeCount: 2,
    wishes: 'Rahajeng miwah mangayubagya. Mugi langgeng dumugi kaken-kaken ninen-ninen.',
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-08T08:15:00Z',
  },
  {
    id: 'gst-6',
    fullName: 'Rizky Pratama',
    slug: 'rizky-pratama',
    category: 'Teman',
    institution: 'Alumni SMA 1 Yogyakarta',
    phone: '+6287766554433',
    invitationStatus: 'Belum Dikirim',
    adminNotes: '',
    rsvpStatus: 'Belum Mengonfirmasi',
    attendeeCount: 0,
    wishes: '',
    createdAt: '2026-10-06T15:20:00Z',
    updatedAt: '2026-10-06T15:20:00Z',
  },
];

const DEFAULT_RSVPS: RSVP[] = [
  {
    id: 'rsvp-1',
    guestId: 'gst-2',
    guestSlug: 'keluarga-bapak-ahmad',
    guestName: 'Keluarga Bapak Ahmad',
    attendanceStatus: 'Hadir',
    attendeeCount: 4,
    wishes: 'Ndherek mangayubagya Mas Dimas & Mbak Sekar. Mugi tansah pinaringan berkah sakinah mawaddah warahmah.',
    submittedAt: '2026-10-05T14:10:00Z',
    updatedAt: '2026-10-05T14:10:00Z',
  },
  {
    id: 'rsvp-2',
    guestId: 'gst-3',
    guestSlug: 'siti-rahma',
    guestName: 'Siti Rahma',
    attendanceStatus: 'Hadir',
    attendeeCount: 2,
    wishes: 'Selamat menempuh hidup baru Sekar sayang! Semoga rumah tangganya penuh kehangatan, rezeki melimpah dan lekas dikaruniai momongan lucu.',
    submittedAt: '2026-10-06T10:20:00Z',
    updatedAt: '2026-10-06T10:20:00Z',
  },
  {
    id: 'rsvp-3',
    guestId: 'gst-4',
    guestSlug: 'bambang-sujatmiko',
    guestName: 'Bambang Sujatmiko, S.T.',
    attendanceStatus: 'Masih Ragu',
    attendeeCount: 1,
    wishes: 'Selamat atas pernikahannya Dimas & Sekar. Semoga lancar acaranya!',
    submittedAt: '2026-10-07T16:00:00Z',
    updatedAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'rsvp-4',
    guestId: 'gst-5',
    guestSlug: 'dr-hendra-kusuma',
    guestName: 'Dr. Hendra Kusuma & Keluarga',
    attendanceStatus: 'Hadir',
    attendeeCount: 2,
    wishes: 'Rahajeng miwah mangayubagya. Mugi langgeng dumugi kaken-kaken ninen-ninen.',
    submittedAt: '2026-10-08T08:15:00Z',
    updatedAt: '2026-10-08T08:15:00Z',
  },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: 'gal-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    caption: 'Busana Basahan Ageng Ngayogyakarta',
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'gal-2',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    caption: 'Tatapan Penuh Makna ing Pelataran Keraton',
    displayOrder: 2,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'gal-3',
    imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    caption: 'Keanggunan Busana Beludru Hitam Sulam Benang Emas',
    displayOrder: 3,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'gal-4',
    imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
    caption: 'Langkah Bersama Menuju Bahtera Suci',
    displayOrder: 4,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'gal-5',
    imageUrl: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80',
    caption: 'Janji Setia ing Bumi Mataram',
    displayOrder: 5,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
    caption: 'Cincin Kawin & Lambang Kasih Sejati',
    displayOrder: 6,
    isFeatured: false,
    isPublished: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
];

const DEFAULT_STORIES: LoveStoryEntry[] = [
  {
    id: 'st-1',
    title: 'Pepanggihan Kapisan (Pertemuan Pertama)',
    storyDate: 'Oktober 2021',
    description: 'Di sebuah pameran seni budaya Jawa di Taman Budaya Yogyakarta, takdir mempertemukan kami saat memandangi karya lukisan wayang yang sama.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'st-2',
    title: 'Nyawiji ing Roso (Menjalin Kasih)',
    storyDate: 'Agustus 2023',
    description: 'Dua tahun saling mengenal kebiasaan, nilai keluarga, dan kecintaan pada adat leluhur membuat kami yakin untuk melangkah ke jenjang yang lebih serius.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'st-3',
    title: 'Adat Nglamar (Lamaran Resmi)',
    storyDate: 'Januari 2026',
    description: 'Dengan restu kedua orang tua dan leluhur, keluarga besar Mas Dimas hadir membawa tanda tresna menghaturkan pinangan resmi kepada Sekar.',
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
    isPublished: true,
  },
];

const DEFAULT_GIFTS: WeddingGift[] = [
  {
    id: 'gift-1',
    bankName: 'BCA (Bank Central Asia)',
    accountHolder: 'Dimas Arya Daniswara',
    accountNumber: '8691234567',
    description: 'Amplop Digital Mempelai Pria',
    isPublished: true,
  },
  {
    id: 'gift-2',
    bankName: 'Bank Mandiri',
    accountHolder: 'Sekar Ayu Kinanti',
    accountNumber: '1370019283746',
    description: 'Amplop Digital Mempelai Wanita',
    isPublished: true,
  },
  {
    id: 'gift-3',
    bankName: 'BSI (Bank Syariah Indonesia)',
    accountHolder: 'Dimas Arya Daniswara',
    accountNumber: '7192837465',
    description: 'Rekening Syariah Bersama',
    isPublished: true,
  },
  {
    id: 'gift-4',
    bankName: 'Kirim Hadiah Fisik (Alamat Kediaman)',
    accountHolder: 'Keluarga Sekar & Dimas',
    accountNumber: 'Jl. D.I. Panjaitan No. 45, Mantrijeron, Yogyakarta 55143',
    description: 'Konfirmasi pengiriman paket via WhatsApp: +6281234567890',
    deliveryAddress: 'Jl. D.I. Panjaitan No. 45, Mantrijeron, Kota Yogyakarta, D.I. Yogyakarta 55143 (Penerima: Sekar & Dimas)',
    isPublished: true,
  },
];

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }

  // --- SETTINGS ---
  getSettings(): WeddingSettings {
    const settings = this.get<WeddingSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (!settings.backgroundMusicTitle || settings.backgroundMusicUrl?.includes('codeskulptor')) {
      settings.backgroundMusicTitle = 'Ketika Cinta Bertasbih - Melly Goeslaw & Amee';
      settings.backgroundMusicUrl =
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
      this.set(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  }

  updateSettings(settings: Partial<WeddingSettings>): WeddingSettings {
    const current = this.getSettings();
    const updated = {
      ...current,
      ...settings,
      features: { ...current.features, ...(settings.features || {}) },
      updatedAt: new Date().toISOString(),
    };
    this.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // --- GUESTS ---
  getGuests(): Guest[] {
    return this.get<Guest[]>(STORAGE_KEYS.GUESTS, DEFAULT_GUESTS);
  }

  getGuestBySlug(slug: string): Guest | null {
    const guests = this.getGuests();
    const cleanSlug = slug.trim().toLowerCase();
    return guests.find((g) => g.slug.toLowerCase() === cleanSlug) || null;
  }

  getGuestById(id: string): Guest | null {
    const guests = this.getGuests();
    return guests.find((g) => g.id === id) || null;
  }

  saveGuest(guestData: Partial<Guest> & { fullName: string }): Guest {
    const guests = this.getGuests();
    const now = new Date().toISOString();

    let targetSlug = (guestData.slug || this.slugify(guestData.fullName)).toLowerCase().trim();
    // Ensure slug uniqueness
    const existingIndex = guests.findIndex((g) => g.id === guestData.id);
    let counter = 1;
    let uniqueSlug = targetSlug;
    while (guests.some((g, idx) => g.slug.toLowerCase() === uniqueSlug && idx !== existingIndex)) {
      uniqueSlug = `${targetSlug}-${counter}`;
      counter++;
    }

    if (guestData.id && existingIndex !== -1) {
      const updated: Guest = {
        ...guests[existingIndex],
        ...guestData,
        slug: uniqueSlug,
        updatedAt: now,
      };
      guests[existingIndex] = updated;
      this.set(STORAGE_KEYS.GUESTS, guests);
      return updated;
    } else {
      const newGuest: Guest = {
        id: `gst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fullName: guestData.fullName,
        slug: uniqueSlug,
        category: guestData.category || 'Teman',
        institution: guestData.institution || '',
        phone: guestData.phone || '',
        invitationStatus: guestData.invitationStatus || 'Belum Dikirim',
        adminNotes: guestData.adminNotes || '',
        rsvpStatus: guestData.rsvpStatus || 'Belum Mengonfirmasi',
        attendeeCount: guestData.attendeeCount || 0,
        wishes: guestData.wishes || '',
        createdAt: now,
        updatedAt: now,
      };
      guests.unshift(newGuest);
      this.set(STORAGE_KEYS.GUESTS, guests);
      return newGuest;
    }
  }

  deleteGuest(id: string): boolean {
    const guests = this.getGuests();
    const filtered = guests.filter((g) => g.id !== id);
    if (filtered.length !== guests.length) {
      this.set(STORAGE_KEYS.GUESTS, filtered);
      return true;
    }
    return false;
  }

  importGuests(newGuests: Array<Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>>): {
    imported: number;
    duplicates: number;
  } {
    const existing = this.getGuests();
    let imported = 0;
    let duplicates = 0;
    const now = new Date().toISOString();

    const updatedList = [...existing];

    for (const item of newGuests) {
      const slugCandidate = (item.slug || this.slugify(item.fullName)).toLowerCase();
      const isDuplicate = updatedList.some(
        (g) => g.slug.toLowerCase() === slugCandidate || g.fullName.toLowerCase() === item.fullName.toLowerCase()
      );

      if (isDuplicate) {
        duplicates++;
        continue;
      }

      const created: Guest = {
        id: `gst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fullName: item.fullName,
        slug: slugCandidate,
        category: item.category || 'Teman',
        institution: item.institution || '',
        phone: item.phone || '',
        invitationStatus: item.invitationStatus || 'Belum Dikirim',
        adminNotes: item.adminNotes || '',
        rsvpStatus: item.rsvpStatus || 'Belum Mengonfirmasi',
        attendeeCount: item.attendeeCount || 0,
        wishes: item.wishes || '',
        createdAt: now,
        updatedAt: now,
      };

      updatedList.push(created);
      imported++;
    }

    this.set(STORAGE_KEYS.GUESTS, updatedList);
    return { imported, duplicates };
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // --- RSVPS ---
  getRSVPs(): RSVP[] {
    return this.get<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
  }

  submitRSVP(data: {
    guestSlug?: string;
    guestName: string;
    attendanceStatus: Guest['rsvpStatus'];
    attendeeCount: number;
    wishes: string;
  }): RSVP {
    const rsvps = this.getRSVPs();
    const guests = this.getGuests();
    const now = new Date().toISOString();

    let targetGuest: Guest | null = null;
    if (data.guestSlug) {
      targetGuest = this.getGuestBySlug(data.guestSlug);
    } else {
      targetGuest = guests.find((g) => g.fullName.toLowerCase() === data.guestName.toLowerCase()) || null;
    }

    // Check if RSVP exists for this guest or slug to update without duplicates
    const existingIndex = rsvps.findIndex(
      (r) =>
        (data.guestSlug && r.guestSlug === data.guestSlug) ||
        (targetGuest && r.guestId === targetGuest.id) ||
        r.guestName.toLowerCase() === data.guestName.toLowerCase()
    );

    let savedRSVP: RSVP;

    if (existingIndex !== -1) {
      savedRSVP = {
        ...rsvps[existingIndex],
        guestName: data.guestName,
        guestSlug: data.guestSlug || rsvps[existingIndex].guestSlug,
        guestId: targetGuest ? targetGuest.id : rsvps[existingIndex].guestId,
        attendanceStatus: data.attendanceStatus,
        attendeeCount: data.attendeeCount,
        wishes: data.wishes || rsvps[existingIndex].wishes,
        updatedAt: now,
      };
      rsvps[existingIndex] = savedRSVP;
    } else {
      savedRSVP = {
        id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        guestId: targetGuest ? targetGuest.id : undefined,
        guestSlug: data.guestSlug || (targetGuest ? targetGuest.slug : undefined),
        guestName: data.guestName,
        attendanceStatus: data.attendanceStatus,
        attendeeCount: data.attendeeCount,
        wishes: data.wishes,
        submittedAt: now,
        updatedAt: now,
      };
      rsvps.unshift(savedRSVP);
    }

    this.set(STORAGE_KEYS.RSVPS, rsvps);

    // Update guest record if found
    if (targetGuest) {
      const guestIdx = guests.findIndex((g) => g.id === targetGuest.id);
      if (guestIdx !== -1) {
        guests[guestIdx] = {
          ...guests[guestIdx],
          rsvpStatus: data.attendanceStatus,
          attendeeCount: data.attendeeCount,
          wishes: data.wishes,
          invitationStatus: guests[guestIdx].invitationStatus === 'Belum Dikirim' ? 'Terkirim' : 'Dibuka',
          updatedAt: now,
        };
        this.set(STORAGE_KEYS.GUESTS, guests);
      }
    }

    return savedRSVP;
  }

  // --- EVENTS ---
  getEvents(): WeddingEvent[] {
    const list = this.get<WeddingEvent[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveEvent(event: WeddingEvent): WeddingEvent {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx !== -1) {
      events[idx] = event;
    } else {
      events.push({
        ...event,
        id: event.id || `evt-${Date.now()}`,
        displayOrder: event.displayOrder || events.length + 1,
      });
    }
    this.set(STORAGE_KEYS.EVENTS, events);
    return event;
  }

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length !== events.length) {
      this.set(STORAGE_KEYS.EVENTS, filtered);
      return true;
    }
    return false;
  }

  // --- GALLERY ---
  getGallery(): GalleryImage[] {
    const list = this.get<GalleryImage[]>(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveGalleryImage(image: GalleryImage): GalleryImage {
    const gallery = this.getGallery();
    const idx = gallery.findIndex((g) => g.id === image.id);
    if (idx !== -1) {
      gallery[idx] = image;
    } else {
      gallery.push({
        ...image,
        id: image.id || `gal-${Date.now()}`,
        displayOrder: image.displayOrder || gallery.length + 1,
        createdAt: new Date().toISOString(),
      });
    }
    this.set(STORAGE_KEYS.GALLERY, gallery);
    return image;
  }

  deleteGalleryImage(id: string): boolean {
    const gallery = this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    if (filtered.length !== gallery.length) {
      this.set(STORAGE_KEYS.GALLERY, filtered);
      return true;
    }
    return false;
  }

  // --- LOVE STORY ---
  getLoveStories(): LoveStoryEntry[] {
    const list = this.get<LoveStoryEntry[]>(STORAGE_KEYS.LOVE_STORY, DEFAULT_STORIES);
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveLoveStory(story: LoveStoryEntry): LoveStoryEntry {
    const stories = this.getLoveStories();
    const idx = stories.findIndex((s) => s.id === story.id);
    if (idx !== -1) {
      stories[idx] = story;
    } else {
      stories.push({
        ...story,
        id: story.id || `st-${Date.now()}`,
        displayOrder: story.displayOrder || stories.length + 1,
      });
    }
    this.set(STORAGE_KEYS.LOVE_STORY, stories);
    return story;
  }

  deleteLoveStory(id: string): boolean {
    const stories = this.getLoveStories();
    const filtered = stories.filter((s) => s.id !== id);
    if (filtered.length !== stories.length) {
      this.set(STORAGE_KEYS.LOVE_STORY, filtered);
      return true;
    }
    return false;
  }

  // --- GIFTS ---
  getGifts(): WeddingGift[] {
    return this.get<WeddingGift[]>(STORAGE_KEYS.GIFTS, DEFAULT_GIFTS);
  }

  saveGift(gift: WeddingGift): WeddingGift {
    const gifts = this.getGifts();
    const idx = gifts.findIndex((g) => g.id === gift.id);
    if (idx !== -1) {
      gifts[idx] = gift;
    } else {
      gifts.push({
        ...gift,
        id: gift.id || `gift-${Date.now()}`,
      });
    }
    this.set(STORAGE_KEYS.GIFTS, gifts);
    return gift;
  }

  deleteGift(id: string): boolean {
    const gifts = this.getGifts();
    const filtered = gifts.filter((g) => g.id !== id);
    if (filtered.length !== gifts.length) {
      this.set(STORAGE_KEYS.GIFTS, filtered);
      return true;
    }
    return false;
  }

  // --- SUMMARY STATS ---
  getStats() {
    const guests = this.getGuests();
    const totalGuests = guests.length;
    const deliveredCount = guests.filter((g) => g.invitationStatus === 'Terkirim' || g.invitationStatus === 'Dibuka').length;
    const attendingCount = guests.filter((g) => g.rsvpStatus === 'Hadir').length;
    const notAttendingCount = guests.filter((g) => g.rsvpStatus === 'Tidak Hadir').length;
    const undecidedCount = guests.filter((g) => g.rsvpStatus === 'Masih Ragu').length;
    const unconfirmedCount = guests.filter((g) => g.rsvpStatus === 'Belum Mengonfirmasi').length;
    const totalAttendingPax = guests
      .filter((g) => g.rsvpStatus === 'Hadir')
      .reduce((sum, g) => sum + (g.attendeeCount || 1), 0);

    const checkedInCount = guests.filter((g) => Boolean(g.checkedInAt)).length;

    return {
      totalGuests,
      deliveredCount,
      attendingCount,
      notAttendingCount,
      undecidedCount,
      unconfirmedCount,
      totalAttendingPax,
      checkedInCount,
    };
  }

  checkInGuest(query: string): { success: boolean; guest?: Guest; message: string } {
    const guests = this.getGuests();
    const clean = query.trim().toLowerCase();
    const idx = guests.findIndex(
      (g) => g.id === clean || g.slug.toLowerCase() === clean || g.fullName.toLowerCase() === clean
    );

    if (idx === -1) {
      return { success: false, message: 'Data tamu tidak ditemukan di sistem.' };
    }

    const now = new Date().toISOString();
    guests[idx] = {
      ...guests[idx],
      checkedInAt: now,
      invitationStatus: 'Dibuka',
      updatedAt: now,
    };
    this.set(STORAGE_KEYS.GUESTS, guests);
    return { success: true, guest: guests[idx], message: `${guests[idx].fullName} berhasil check-in!` };
  }

  undoCheckIn(id: string): Guest | null {
    const guests = this.getGuests();
    const idx = guests.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    guests[idx] = {
      ...guests[idx],
      checkedInAt: undefined,
      updatedAt: now,
    };
    this.set(STORAGE_KEYS.GUESTS, guests);
    return guests[idx];
  }

  likeWish(rsvpId: string): RSVP | null {
    const rsvps = this.getRSVPs();
    const idx = rsvps.findIndex((r) => r.id === rsvpId);
    if (idx === -1) return null;
    rsvps[idx].likesCount = (rsvps[idx].likesCount || 0) + 1;
    this.set(STORAGE_KEYS.RSVPS, rsvps);
    return rsvps[idx];
  }

  // Reset to default seed
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.GUESTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.LOVE_STORY);
    localStorage.removeItem(STORAGE_KEYS.GIFTS);
    localStorage.removeItem(STORAGE_KEYS.RSVPS);
  }

  // Production check
  isSupabaseConfigured(): boolean {
    const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL;
    const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;
    return Boolean(envUrl && envKey && !envUrl.includes('placeholder'));
  }
}

export const weddingStorage = new StorageService();
