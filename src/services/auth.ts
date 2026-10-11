export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'wedding_organizer';
  lastLogin: string;
}

const AUTH_STORAGE_KEY = 'javanese_wedding_admin_session';

class AuthService {
  private currentUser: AdminUser | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        this.currentUser = JSON.parse(saved);
      }
    } catch {
      this.currentUser = null;
    }
  }

  isAuthenticated(): boolean {
    if (!this.currentUser) {
      this.restoreSession();
    }
    return this.currentUser !== null;
  }

  getUser(): AdminUser | null {
    if (!this.currentUser) {
      this.restoreSession();
    }
    return this.currentUser;
  }

  async login(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    // Artificial latency for authentic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 450));

    const cleanEmail = email.trim().toLowerCase();
    
    // Check credentials (supports admin@royalwedding.id, admin@wedding.id, or user email)
    if (
      (cleanEmail === 'admin@royalwedding.id' && pass === 'keraton2026') ||
      (cleanEmail === 'admin@wedding.id' && pass === 'admin123') ||
      (cleanEmail === 'auliya.id.1922@gmail.com' && pass === 'keraton2026')
    ) {
      const user: AdminUser = {
        id: 'usr_admin_01',
        email: cleanEmail,
        name: 'Pengageng Pranatan (Wedding Admin)',
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
      };
      this.currentUser = user;
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (err) {
        console.error('Session storage error:', err);
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Email atau kata sandi tidak sesuai. Silakan gunakan kredensial administrator resmi.',
    };
  }

  logout(): void {
    this.currentUser = null;
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

export const authService = new AuthService();
