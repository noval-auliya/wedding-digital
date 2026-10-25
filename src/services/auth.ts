import {
  onAuthStateChanged,
  browserLocalPersistence,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin';
  lastLogin: string;
}

type AuthStateListener = (user: AdminUser | null) => void;

const toAdminUser = (user: User | null): AdminUser | null => {
  if (!user || !user.email) return null;

  return {
    id: user.uid,
    email: user.email,
    name: user.displayName || user.email,
    role: 'superadmin',
    lastLogin: user.metadata.lastSignInTime || '',
  };
};

class AuthService {
  private currentUser: AdminUser | null = null;

  subscribe(listener: AuthStateListener): () => void {
    if (!firebaseAuth) {
      this.currentUser = null;
      listener(null);
      return () => undefined;
    }

    return onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUser = toAdminUser(user);
      listener(this.currentUser);
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getUser(): AdminUser | null {
    return this.currentUser;
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    if (!firebaseAuth) {
      return {
        success: false,
        error: 'Firebase belum dikonfigurasi. Periksa file .env dan mulai ulang server.',
      };
    }

    try {
      await setPersistence(
        firebaseAuth,
        rememberMe ? browserLocalPersistence : inMemoryPersistence,
      );
      const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      this.currentUser = toAdminUser(credential.user);
      return { success: true };
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : '';

      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        return { success: false, error: 'Email atau kata sandi tidak sesuai.' };
      }
      if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.' };
      }
      if (code === 'auth/operation-not-allowed') {
        return { success: false, error: 'Metode Email/Password belum diaktifkan di Firebase Authentication.' };
      }
      if (code === 'auth/network-request-failed') {
        return { success: false, error: 'Tidak dapat terhubung ke Firebase. Periksa koneksi internet.' };
      }

      console.error('Firebase sign-in failed:', error);
      return { success: false, error: 'Login gagal. Periksa konfigurasi Firebase lalu coba lagi.' };
    }
  }

  async logout(): Promise<void> {
    if (!firebaseAuth) return;
    await signOut(firebaseAuth);
    this.currentUser = null;
  }
}

export const authService = new AuthService();
