import {
  WeddingSettings,
  Guest,
  WeddingEvent,
  GalleryImage,
  LoveStoryEntry,
  WeddingGift,
  RSVP,
} from '../types/wedding';
import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import {
  firebaseAuth,
  firestore,
  isFirebaseConfigured,
  publicLikeAuth,
  publicLikeFirestore,
} from './firebase';

const STORAGE_KEYS = {
  SETTINGS: 'javanese_wedding_settings_v1',
  GUESTS: 'javanese_wedding_guests_v1',
  EVENTS: 'javanese_wedding_events_v1',
  GALLERY: 'javanese_wedding_gallery_v1',
  LOVE_STORY: 'javanese_wedding_story_v1',
  GIFTS: 'javanese_wedding_gifts_v1',
  RSVPS: 'javanese_wedding_rsvps_v1',
  PUBLIC_WISHES: 'javanese_wedding_public_wishes_v1',
};

const FIRESTORE_COLLECTIONS: Partial<Record<string, string>> = {
  [STORAGE_KEYS.GUESTS]: 'guests',
  [STORAGE_KEYS.EVENTS]: 'events',
  [STORAGE_KEYS.GALLERY]: 'gallery',
  [STORAGE_KEYS.LOVE_STORY]: 'loveStories',
  [STORAGE_KEYS.GIFTS]: 'gifts',
  [STORAGE_KEYS.RSVPS]: 'rsvps',
  [STORAGE_KEYS.PUBLIC_WISHES]: 'publicWishes',
};

const omitUndefinedFields = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : omitUndefinedFields(item))) as T;
  }

  if (
    value !== null &&
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    const entries = Object.entries(value).filter(
      ([key, item]) => item !== undefined && key !== 'attendeeCount' && key !== 'checkedInAt',
    );
    return Object.fromEntries(
      entries.map(([key, item]) => [key, omitUndefinedFields(item)]),
    ) as T;
  }

  return value;
};

const ADMIN_UID = 'WAvwL7eDdgh7KNtgaq3180BHy1F2';

// Royal Traditional Royalty Seed Data
const DEFAULT_SETTINGS: WeddingSettings = {
  id: 'royal-wedding-2026',
  brideName: 'Syifau Ainul Fitri',
  brideNickname: 'Syifau Ainul Fitri',
  brideTitle: 'Putri Pertama',
  brideParents: '',
  groomName: 'Muhammad Noval Nur Auliya',
  groomNickname: 'Muhammad Noval Nur Auliya',
  groomTitle: 'Putra Kedua',
  groomParents: '',
  weddingDate: '2026-11-28',
  weddingTime: '08:00 WIB',
  timezone: 'Asia/Jakarta',
  faviconUrl: '/images/gunungan-emas.svg',
  coverTitle: 'Perayaan Pernikahan',
  openingMessage:
    'Dengan memohon rahmat dan restu, melalui undangan ini kami sekeluarga menyampaikan kabar bahagia dan mengundang Bapak/Ibu/Saudara/i untuk hadir:',
  closingMessage:
    'Terima kasih atas perhatian, doa, dan kehadiran Bapak/Ibu/Saudara/i dalam acara pernikahan kami. Semoga Tuhan senantiasa melimpahkan berkah dan kebahagiaan.',
  weddingPrayer:
    'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  prayerSource: 'QS. Ar-Rum: 21',
  heroImageUrl: '/images/wedding-couple.jpeg',
  brideImageUrl:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  groomImageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  backgroundMusicUrl: '/musics/backsound.m4a',
  backgroundMusicTitle: 'Backsound',
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
    title: 'Resepsi Pernikahan',
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
    wishes: 'Turut berbahagia atas pernikahan Muhammad Noval & Syifau Ainul Fitri. Semoga senantiasa diberkahi dengan keluarga yang sakinah, mawaddah, dan warahmah.',
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
    wishes: 'Selamat menempuh hidup baru Syifau! Semoga rumah tangganya penuh kehangatan dan rezeki melimpah.',
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
    rsvpStatus: 'Belum Mengonfirmasi',
    wishes: 'Selamat atas pernikahannya Muhammad Noval & Syifau. Semoga lancar acaranya!',
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
    wishes: 'Selamat menempuh hidup baru. Semoga cinta dan kebahagiaan selalu menyertai hingga akhir hayat.',
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
    wishes: 'Turut berbahagia atas pernikahan Muhammad Noval & Syifau Ainul Fitri. Semoga senantiasa diberkahi dengan keluarga yang sakinah, mawaddah, dan warahmah.',
    submittedAt: '2026-10-05T14:10:00Z',
    updatedAt: '2026-10-05T14:10:00Z',
  },
  {
    id: 'rsvp-2',
    guestId: 'gst-3',
    guestSlug: 'siti-rahma',
    guestName: 'Siti Rahma',
    attendanceStatus: 'Hadir',
    wishes: 'Selamat menempuh hidup baru Syifau! Semoga rumah tangganya penuh kehangatan dan rezeki melimpah.',
    submittedAt: '2026-10-06T10:20:00Z',
    updatedAt: '2026-10-06T10:20:00Z',
  },
  {
    id: 'rsvp-3',
    guestId: 'gst-4',
    guestSlug: 'bambang-sujatmiko',
    guestName: 'Bambang Sujatmiko, S.T.',
    attendanceStatus: 'Belum Mengonfirmasi',
    wishes: 'Selamat atas pernikahannya Muhammad Noval & Syifau. Semoga lancar acaranya!',
    submittedAt: '2026-10-07T16:00:00Z',
    updatedAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'rsvp-4',
    guestId: 'gst-5',
    guestSlug: 'dr-hendra-kusuma',
    guestName: 'Dr. Hendra Kusuma & Keluarga',
    attendanceStatus: 'Hadir',
    wishes: 'Selamat menempuh hidup baru. Semoga cinta dan kebahagiaan selalu menyertai hingga akhir hayat.',
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
    description: 'Dengan restu kedua orang tua, Muhammad Noval dan Syifau Ainul Fitri melangkah menuju jenjang pernikahan.',
    imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
    isPublished: true,
  },
];

const DEFAULT_GIFTS: WeddingGift[] = [
  {
    id: 'gift-1',
    bankName: 'BCA (Bank Central Asia)',
    accountHolder: 'Muhammad Noval Nur Auliya',
    accountNumber: '8691234567',
    description: 'Amplop Digital Mempelai Pria',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'gift-2',
    bankName: 'Bank Mandiri',
    accountHolder: 'Syifau Ainul Fitri',
    accountNumber: '1370019283746',
    description: 'Amplop Digital Mempelai Wanita',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'gift-3',
    bankName: 'BSI (Bank Syariah Indonesia)',
    accountHolder: 'Muhammad Noval Nur Auliya',
    accountNumber: '7192837465',
    description: 'Rekening Syariah Bersama',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'gift-4',
    bankName: 'Kirim Hadiah Fisik (Alamat Kediaman)',
    accountHolder: 'Keluarga Muhammad Noval & Syifau',
    accountNumber: 'Jl. D.I. Panjaitan No. 45, Mantrijeron, Yogyakarta 55143',
    description: 'Konfirmasi pengiriman paket via WhatsApp: +6281234567890',
    deliveryAddress: '',
    displayOrder: 4,
    isPublished: true,
  },
];

class StorageService {
  private remoteIds = new Map<string, Set<string>>();
  private unsubscribeFirestore: Array<() => void> = [];
  private memory = new Map<string, unknown>();
  private loadedKeys = new Set<string>();
  private dataError: string | null = null;
  private lastNotifiedError: string | null = null;

  constructor() {
    if (firestore) this.subscribeToFirebase();
    else this.dataError = 'Firebase belum dikonfigurasi. Periksa file .env.';
    window.addEventListener('offline', this.clearVolatileData);
  }

  private clearVolatileData = (): void => {
    this.memory.clear();
    this.loadedKeys.clear();
    this.dataError = 'Koneksi internet terputus. Hubungkan kembali untuk memuat data.';
    window.dispatchEvent(new CustomEvent('wedding-storage-error', { detail: { message: this.dataError } }));
    window.dispatchEvent(new CustomEvent('wedding-storage-updated', { detail: { key: '*' } }));
  };

  isDataReady(): boolean {
    return this.loadedKeys.size === Object.keys(FIRESTORE_COLLECTIONS).length + 1 && !this.dataError;
  }

  getDataError(): string | null {
    return this.dataError;
  }

  private notifyStorageError(error: unknown, source: string): void {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
    const detail = error instanceof Error ? error.message : 'Unknown Firebase error';
    const message = code === 'permission-denied'
      ? `Akses ditolak saat membaca/menulis ${source}. Periksa Firestore Rules dan project Firebase.`
      : `${source}: ${detail}`;
    this.dataError = message;
    this.memory.clear();
    this.loadedKeys.clear();
    if (this.lastNotifiedError !== message) {
      console.error(`Firebase storage error (${source}):`, error);
      this.lastNotifiedError = message;
      window.dispatchEvent(new CustomEvent('wedding-storage-error', { detail: { message } }));
    }
    window.dispatchEvent(new CustomEvent('wedding-storage-updated', { detail: { key: '*' } }));
  }

  private writeLocal<T>(key: string, value: T): void {
    this.memory.set(key, value);
    this.loadedKeys.add(key);
    if (this.loadedKeys.size === Object.keys(FIRESTORE_COLLECTIONS).length + 1) {
      this.dataError = null;
      this.lastNotifiedError = null;
    }
    window.dispatchEvent(new CustomEvent('wedding-storage-updated', { detail: { key } }));
  }

  private get<T>(key: string, defaultValue: T): T {
    return (this.memory.get(key) as T | undefined) ?? defaultValue;
  }

  private isAdminAuthenticated(): boolean {
    return firebaseAuth?.currentUser?.uid === ADMIN_UID;
  }

  private set<T>(key: string, value: T): void {
    this.writeLocal(key, value);
    if (!firestore || !this.isAdminAuthenticated()) return;
    if (key === STORAGE_KEYS.SETTINGS) {
      void setDoc(doc(firestore, 'settings', 'main'), value as WeddingSettings).catch((error: unknown) =>
        this.notifyStorageError(error, 'settings/main'),
      );
      return;
    }
    const collectionName = FIRESTORE_COLLECTIONS[key];
    if (collectionName && Array.isArray(value)) {
      void this.writeCollection(collectionName, value as Array<{ id: string }>).catch(
        (error: unknown) => this.notifyStorageError(error, collectionName),
      );
    }
  }

  private subscribeToFirebase(): void {
    const db = firestore;
    if (!db) return;
    this.unsubscribeFirestore.push(onSnapshot(
      doc(db, 'settings', 'main'),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) return;
        if (!snapshot.exists()) {
          this.handleReadError(
            new Error('Dokumen settings/main belum tersedia di Firestore.'),
            'settings/main',
          );
          return;
        }
        const incomingSettings = snapshot.data() as WeddingSettings;
        const currentSettings = this.get<WeddingSettings | undefined>(
          STORAGE_KEYS.SETTINGS,
          undefined,
        );
        const incomingUpdatedAt = Date.parse(incomingSettings.updatedAt || '');
        const currentUpdatedAt = Date.parse(currentSettings?.updatedAt || '');
        if (
          currentSettings &&
          Number.isFinite(incomingUpdatedAt) &&
          Number.isFinite(currentUpdatedAt) &&
          incomingUpdatedAt < currentUpdatedAt
        ) {
          return;
        }
        this.writeLocal(STORAGE_KEYS.SETTINGS, incomingSettings);
      },
      (error) => this.handleReadError(error, 'settings/main'),
    ));
    (Object.entries(FIRESTORE_COLLECTIONS) as Array<[string, string]>)
      .filter(([key]) => key !== STORAGE_KEYS.PUBLIC_WISHES)
      .forEach(([key, collectionName]) => {
        this.unsubscribeFirestore.push(onSnapshot(
          collection(db, collectionName),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (snapshot.metadata.fromCache) return;
            const items = snapshot.docs.map((item) => {
              const data = item.data();
              if (data.rsvpStatus === 'Masih Ragu') data.rsvpStatus = 'Belum Mengonfirmasi';
              if (data.attendanceStatus === 'Masih Ragu') {
                data.attendanceStatus = 'Belum Mengonfirmasi';
              }
              return { ...data, id: item.id };
            });
            this.remoteIds.set(key, new Set(snapshot.docs.map((item) => item.id)));
            this.writeLocal(key, items);
            if (key === STORAGE_KEYS.RSVPS) {
              void this.syncPublicWishes(items as RSVP[]).catch((error: unknown) =>
                this.notifyStorageError(error, 'publicWishes (sinkronisasi RSVP admin)'),
              );
            }
          },
          (error) => this.handleReadError(error, collectionName),
        ));
      });
    this.unsubscribeFirestore.push(onSnapshot(
      collection(db, 'publicWishes'),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) return;
        this.writeLocal(
          STORAGE_KEYS.PUBLIC_WISHES,
          snapshot.docs.map((item) => ({ ...item.data(), id: item.id })),
        );
      },
      (error) => this.handleReadError(error, 'publicWishes'),
    ));
  }

  private handleReadError(error: unknown, source: string): void {
    this.notifyStorageError(error, source);
  }

  private async syncPublicWishes(rsvps: RSVP[]): Promise<void> {
    const db = firestore;
    if (!db || !this.isAdminAuthenticated()) return;
    const batch = writeBatch(db);
    rsvps.forEach((rsvp) => {
      const ref = doc(db, 'publicWishes', rsvp.id);
      if (rsvp.wishes.trim()) {
        const { id: _id, ...wish } = this.toPublicWish(rsvp);
        batch.set(ref, { ...wish, likesCount: increment(0) }, { merge: true });
      } else {
        batch.delete(ref);
      }
    });
    await batch.commit();
  }

  private requireFirestore(): Firestore {
    if (!firestore) throw new Error('Firebase belum dikonfigurasi.');
    return firestore;
  }

  private async writeCollection<T extends { id: string }>(name: string, items: T[]): Promise<void> {
    const db = this.requireFirestore();
    const collectionRef = collection(db, name);
    const snapshot = await getDocsFromServer(collectionRef);
    const nextIds = new Set(items.map((item) => item.id));
    const operations = items.length + snapshot.docs.filter((item) => !nextIds.has(item.id)).length;
    if (operations > 500) throw new Error(`Firestore batch limit exceeded for ${name}.`);

    const batch = writeBatch(db);
    items.forEach(({ id, ...data }) =>
      batch.set(doc(collectionRef, id), omitUndefinedFields(data)),
    );
    snapshot.docs.forEach((item) => {
      if (!nextIds.has(item.id)) batch.delete(item.ref);
    });
    await batch.commit();
  }

  private toPublicWish(rsvp: RSVP): RSVP {
    return {
      id: rsvp.id,
      guestName: rsvp.guestName,
      attendanceStatus: rsvp.attendanceStatus,
      wishes: rsvp.wishes,
      submittedAt: rsvp.submittedAt,
      updatedAt: rsvp.updatedAt,
      likesCount: rsvp.likesCount || 0,
    };
  }


  // --- SETTINGS ---
  getSettings(): WeddingSettings {
    const settings = this.get<WeddingSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    let shouldSave = false;

    if (settings.coverTitle === 'The Royal Wedding Celebration') {
      settings.coverTitle = DEFAULT_SETTINGS.coverTitle;
      shouldSave = true;
    }
    if (!settings.faviconUrl) {
      settings.faviconUrl = DEFAULT_SETTINGS.faviconUrl;
      shouldSave = true;
    }
    if (settings.brideName === 'Raden Ajeng Sekar Ayu Kinanti, S.Hum.') {
      settings.brideName = DEFAULT_SETTINGS.brideName;
      shouldSave = true;
    }
    if (settings.brideNickname === 'Sekar') {
      settings.brideNickname = DEFAULT_SETTINGS.brideNickname;
      shouldSave = true;
    }
    if (settings.groomName === 'Raden Mas Dimas Arya Daniswara, S.T., M.Sc.') {
      settings.groomName = DEFAULT_SETTINGS.groomName;
      shouldSave = true;
    }
    if (settings.groomNickname === 'Dimas') {
      settings.groomNickname = DEFAULT_SETTINGS.groomNickname;
      shouldSave = true;
    }

    if (
      settings.heroImageUrl ===
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' ||
      settings.heroImageUrl === '/images/wedding-couple.png'
    ) {
      settings.heroImageUrl = DEFAULT_SETTINGS.heroImageUrl;
      shouldSave = true;
    }

    if (
      settings.backgroundMusicUrl ===
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3' ||
      settings.backgroundMusicUrl?.includes('codeskulptor')
    ) {
      settings.backgroundMusicTitle = DEFAULT_SETTINGS.backgroundMusicTitle;
      settings.backgroundMusicUrl = DEFAULT_SETTINGS.backgroundMusicUrl;
      shouldSave = true;
    }

    if (!settings.backgroundMusicUrl) {
      settings.backgroundMusicUrl = DEFAULT_SETTINGS.backgroundMusicUrl;
      settings.backgroundMusicTitle = DEFAULT_SETTINGS.backgroundMusicTitle;
      shouldSave = true;
    }

    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(settings.backgroundMusicUrl || '')) {
      settings.backgroundMusicUrl = '';
      settings.backgroundMusicTitle = DEFAULT_SETTINGS.backgroundMusicTitle;
      shouldSave = true;
    }

    if (!settings.backgroundMusicTitle) {
      settings.backgroundMusicTitle = DEFAULT_SETTINGS.backgroundMusicTitle;
      shouldSave = true;
    }

    if (shouldSave) this.writeLocal(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }

  async updateSettings(settings: Partial<WeddingSettings>): Promise<WeddingSettings> {
    const current = this.get<WeddingSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = {
      ...current,
      ...settings,
      features: { ...current.features, ...(settings.features || {}) },
      updatedAt: new Date().toISOString(),
    };

    const db = this.requireFirestore();
    if (!this.isAdminAuthenticated()) {
      throw new Error('Sesi admin tidak valid. Silakan login kembali.');
    }

    try {
      const settingsRef = doc(db, 'settings', 'main');
      await setDoc(settingsRef, updated);
      const savedSnapshot = await getDocFromServer(settingsRef);
      if (!savedSnapshot.exists()) {
        throw new Error('Firebase tidak menemukan pengaturan setelah proses simpan.');
      }

      const savedSettings = savedSnapshot.data() as WeddingSettings;
      const changedFields = Object.keys(settings) as Array<keyof WeddingSettings>;
      const hasDifferentValues = changedFields.some(
        (field) => JSON.stringify(savedSettings[field]) !== JSON.stringify(updated[field]),
      );
      if (hasDifferentValues) {
        throw new Error('Data yang tersimpan di Firebase berbeda dari perubahan terakhir.');
      }

      this.writeLocal(STORAGE_KEYS.SETTINGS, savedSettings);
      return savedSettings;
    } catch (error) {
      this.notifyStorageError(error, 'settings/main');
      throw error;
    }
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
    const rsvps = this.get<RSVP[]>(STORAGE_KEYS.RSVPS, DEFAULT_RSVPS);
    return this.sortNewestFirst([...new Map(rsvps.map((rsvp) => [rsvp.id, rsvp])).values()]);
  }

  getPublicWishes(): RSVP[] {
    const defaultWishes = DEFAULT_RSVPS.filter((rsvp) => rsvp.wishes.trim());
    const wishes = this.get<RSVP[]>(STORAGE_KEYS.PUBLIC_WISHES, defaultWishes)
      .filter((rsvp) => rsvp.wishes?.trim());
    return this.sortNewestFirst([...new Map(wishes.map((wish) => [wish.id, wish])).values()]);
  }

  private sortNewestFirst(items: RSVP[]): RSVP[] {
    return items.sort((a, b) => {
      const submittedDifference = Date.parse(b.submittedAt) - Date.parse(a.submittedAt);
      if (!Number.isNaN(submittedDifference) && submittedDifference !== 0) return submittedDifference;
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    });
  }

  async submitRSVP(data: {
    guestSlug?: string;
    guestName: string;
    attendanceStatus: Guest['rsvpStatus'];
    wishes: string;
  }): Promise<RSVP> {
    const rsvps = this.getRSVPs();
    const guests = this.getGuests();
    const now = new Date().toISOString();

    let targetGuest: Guest | null = null;
    if (data.guestSlug) {
      targetGuest = this.getGuestBySlug(data.guestSlug);
    } else {
      targetGuest = guests.find((g) => g.fullName.toLowerCase() === data.guestName.toLowerCase()) || null;
    }

    if (firestore && !this.isAdminAuthenticated()) {
      const rsvpRef = doc(collection(firestore, 'rsvps'));
      const publicRSVP: RSVP = {
        id: rsvpRef.id,
        guestName: data.guestName,
        attendanceStatus: data.attendanceStatus,
        wishes: data.wishes,
        submittedAt: now,
        updatedAt: now,
        ...(data.guestSlug ? { guestSlug: data.guestSlug } : {}),
      };
      if (targetGuest) publicRSVP.guestId = targetGuest.id;

      const rsvpDocument: Omit<RSVP, 'id' | 'guestId' | 'likesCount'> = {
        guestName: publicRSVP.guestName,
        attendanceStatus: publicRSVP.attendanceStatus,
        wishes: publicRSVP.wishes,
        submittedAt: publicRSVP.submittedAt,
        updatedAt: publicRSVP.updatedAt,
        ...(publicRSVP.guestSlug ? { guestSlug: publicRSVP.guestSlug } : {}),
      };
      const publicDocument: Omit<RSVP, 'id' | 'guestId'> = {
        ...rsvpDocument,
        likesCount: 0,
      };
      const batch = writeBatch(firestore);
      batch.set(rsvpRef, omitUndefinedFields(rsvpDocument));
      batch.set(doc(collection(firestore, 'publicWishes'), rsvpRef.id), publicDocument);
      await batch.commit();
      const currentRsvps = this.getRSVPs().filter((rsvp) => rsvp.id !== publicRSVP.id);
      this.writeLocal(STORAGE_KEYS.RSVPS, [publicRSVP, ...currentRsvps]);
      const currentPublicWishes = this.getPublicWishes().filter((wish) => wish.id !== publicRSVP.id);
      this.writeLocal(STORAGE_KEYS.PUBLIC_WISHES, [
        this.toPublicWish(publicRSVP),
        ...currentPublicWishes,
      ]);

      if (targetGuest) {
        const guestIndex = guests.findIndex((guest) => guest.id === targetGuest?.id);
        if (guestIndex !== -1) {
          guests[guestIndex] = {
            ...guests[guestIndex],
            rsvpStatus: data.attendanceStatus,
            wishes: data.wishes,
            updatedAt: now,
          };
          this.writeLocal(STORAGE_KEYS.GUESTS, guests);
        }
      }
      return publicRSVP;
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
        wishes: data.wishes,
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
        wishes: data.wishes,
        submittedAt: now,
        updatedAt: now,
      };
      rsvps.unshift(savedRSVP);
    }

    this.set(STORAGE_KEYS.RSVPS, rsvps);
    await this.syncPublicWishes([savedRSVP]);

    // Update guest record if found
    if (targetGuest) {
      const guestIdx = guests.findIndex((g) => g.id === targetGuest.id);
      if (guestIdx !== -1) {
        guests[guestIdx] = {
          ...guests[guestIdx],
          rsvpStatus: data.attendanceStatus,
          wishes: data.wishes,
          invitationStatus: guests[guestIdx].invitationStatus === 'Belum Dikirim' ? 'Terkirim' : 'Dibuka',
          updatedAt: now,
        };
        this.set(STORAGE_KEYS.GUESTS, guests);
      }
    }

    return savedRSVP;
  }

  async updateRSVP(
    id: string,
    changes: Pick<RSVP, 'guestName' | 'attendanceStatus' | 'wishes'>,
  ): Promise<boolean> {
    const rsvps = this.getRSVPs();
    const index = rsvps.findIndex((rsvp) => rsvp.id === id);
    if (index === -1) return false;

    const now = new Date().toISOString();
    const updated: RSVP = { ...rsvps[index], ...changes, updatedAt: now };
    const existingPublicWish = this.getPublicWishes().find((wish) => wish.id === id);
    const publicWish = {
      ...this.toPublicWish(updated),
      likesCount: existingPublicWish?.likesCount || 0,
    };

    if (firestore && this.isAdminAuthenticated()) {
      const batch = writeBatch(firestore);
      const rsvpRef = doc(firestore, 'rsvps', id);
      const publicWishRef = doc(firestore, 'publicWishes', id);
      const { id: _id, ...rsvpDocument } = updated;
      const { id: _publicId, ...publicDocument } = publicWish;
      batch.set(rsvpRef, rsvpDocument);
      if (updated.wishes.trim()) {
        batch.set(publicWishRef, publicDocument, { merge: true });
      } else {
        batch.delete(publicWishRef);
      }
      await batch.commit();
    }

    rsvps[index] = updated;
    this.writeLocal(STORAGE_KEYS.RSVPS, rsvps);

    const publicWishes = this.getPublicWishes().filter((wish) => wish.id !== id);
    if (updated.wishes.trim()) publicWishes.unshift(publicWish);
    this.writeLocal(STORAGE_KEYS.PUBLIC_WISHES, publicWishes);

    if (updated.guestId) {
      const guests = this.getGuests();
      const guestIndex = guests.findIndex((guest) => guest.id === updated.guestId);
      if (guestIndex !== -1) {
        guests[guestIndex] = {
          ...guests[guestIndex],
          fullName: updated.guestName,
          rsvpStatus: updated.attendanceStatus,
          wishes: updated.wishes,
          updatedAt: now,
        };
        this.set(STORAGE_KEYS.GUESTS, guests);
      }
    }

    return true;
  }

  async deleteRSVP(id: string): Promise<boolean> {
    const rsvps = this.getRSVPs();
    const rsvp = rsvps.find((item) => item.id === id);
    if (!rsvp) return false;

    if (firestore && this.isAdminAuthenticated()) {
      const batch = writeBatch(firestore);
      batch.delete(doc(firestore, 'rsvps', id));
      batch.delete(doc(firestore, 'publicWishes', id));
      await batch.commit();
    }

    this.set(STORAGE_KEYS.RSVPS, rsvps.filter((item) => item.id !== id));
    this.writeLocal(
      STORAGE_KEYS.PUBLIC_WISHES,
      this.getPublicWishes().filter((item) => item.id !== id),
    );

    if (rsvp.guestId) {
      const guests = this.getGuests();
      const guestIndex = guests.findIndex((guest) => guest.id === rsvp.guestId);
      if (guestIndex !== -1) {
        guests[guestIndex] = {
          ...guests[guestIndex],
          rsvpStatus: 'Belum Mengonfirmasi',
          wishes: '',
          updatedAt: new Date().toISOString(),
        };
        this.set(STORAGE_KEYS.GUESTS, guests);
      }
    }

    return true;
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
    return this.get<WeddingGift[]>(STORAGE_KEYS.GIFTS, DEFAULT_GIFTS)
      .map((gift, index) => ({
        ...gift,
        displayOrder: Number.isFinite(gift.displayOrder) ? gift.displayOrder : index + 1,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
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
        displayOrder: Number.isFinite(gift.displayOrder) ? gift.displayOrder : gifts.length + 1,
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
    const unconfirmedCount = guests.filter((g) => g.rsvpStatus === 'Belum Mengonfirmasi').length;
    return {
      totalGuests,
      deliveredCount,
      attendingCount,
      notAttendingCount,
      unconfirmedCount,
    };
  }

  async likeWish(rsvpId: string): Promise<{ wish: RSVP; alreadyLiked: boolean } | null> {
    const wishes = this.getPublicWishes();
    const index = wishes.findIndex((wish) => wish.id === rsvpId);
    if (index === -1) return null;
    if (!publicLikeFirestore || !publicLikeAuth) {
      throw new Error('Firebase Authentication untuk Aamiin belum dikonfigurasi.');
    }
    const db = publicLikeFirestore;
    const user = publicLikeAuth.currentUser || (await signInAnonymously(publicLikeAuth)).user;
    const wishRef = doc(db, 'publicWishes', rsvpId);
    const likeRef = doc(db, 'publicWishes', rsvpId, 'likes', user.uid);

    const result = await runTransaction(db, async (transaction) => {
      const [wishSnapshot, likeSnapshot] = await Promise.all([
        transaction.get(wishRef),
        transaction.get(likeRef),
      ]);
      if (!wishSnapshot.exists()) throw new Error('Doa tidak ditemukan di Firestore.');
      const likesCount = Number(wishSnapshot.data().likesCount || 0);
      if (likeSnapshot.exists()) return { liked: false, likesCount };

      transaction.update(wishRef, { likesCount: increment(1) });
      transaction.set(likeRef, { createdAt: serverTimestamp() });
      return { liked: true, likesCount: likesCount + 1 };
    });

    wishes[index] = { ...wishes[index], likesCount: result.likesCount };
    this.writeLocal(STORAGE_KEYS.PUBLIC_WISHES, wishes);
    return { wish: wishes[index], alreadyLiked: !result.liked };
  }

  // Reset to default seed
  async resetToDefaults(): Promise<void> {
    const db = firestore;
    const defaults: Record<string, unknown> = {
      [STORAGE_KEYS.SETTINGS]: { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() },
      [STORAGE_KEYS.GUESTS]: DEFAULT_GUESTS,
      [STORAGE_KEYS.EVENTS]: DEFAULT_EVENTS,
      [STORAGE_KEYS.GALLERY]: DEFAULT_GALLERY,
      [STORAGE_KEYS.LOVE_STORY]: DEFAULT_STORIES,
      [STORAGE_KEYS.GIFTS]: DEFAULT_GIFTS,
      [STORAGE_KEYS.RSVPS]: DEFAULT_RSVPS,
      [STORAGE_KEYS.PUBLIC_WISHES]: DEFAULT_RSVPS.filter((rsvp) => rsvp.wishes.trim()),
    };

    Object.entries(defaults).forEach(([key, value]) => this.writeLocal(key, value));
    if (!db) return;

    try {
      await setDoc(doc(db, 'settings', 'main'), defaults[STORAGE_KEYS.SETTINGS]);
      await Promise.all(
        (Object.entries(FIRESTORE_COLLECTIONS) as Array<[string, string]>).map(
          ([key, collectionName]) =>
            this.writeCollection(collectionName, defaults[key] as Array<{ id: string }>),
        ),
      );
    } catch (error) {
      this.notifyStorageError(error, 'reset data Firestore');
      throw error;
    }
  }

  isFirebaseConfigured(): boolean {
    return isFirebaseConfigured;
  }
}

export const weddingStorage = new StorageService();
