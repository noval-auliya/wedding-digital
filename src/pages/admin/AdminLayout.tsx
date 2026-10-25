import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Users,
  MessageSquare,
  CalendarDays,
  Image as ImageIcon,
  HeartHandshake,
  Gift,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Database,
  LoaderCircle,
} from 'lucide-react';
import { GununganIcon } from '../../components/common/GununganIcon';
import { authService } from '../../services/auth';
import { weddingStorage } from '../../services/storage';

export type AdminTab =
  | 'dashboard'
  | 'content'
  | 'guests'
  | 'rsvp'
  | 'events'
  | 'gallery'
  | 'love-story'
  | 'gifts'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  onLogout,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dataReady, setDataReady] = useState(weddingStorage.isDataReady());
  const [dataError, setDataError] = useState(weddingStorage.getDataError());
  const user = authService.getUser();

  useEffect(() => {
    const refreshDataStatus = () => {
      setDataReady(weddingStorage.isDataReady());
      setDataError(weddingStorage.getDataError());
    };
    window.addEventListener('wedding-storage-updated', refreshDataStatus);
    return () => window.removeEventListener('wedding-storage-updated', refreshDataStatus);
  }, []);

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Konten Undangan', icon: FileEdit },
    { id: 'guests', label: 'Data Tamu', icon: Users },
    { id: 'rsvp', label: 'RSVP & Ucapan', icon: MessageSquare },
    { id: 'events', label: 'Jadwal Acara', icon: CalendarDays },
    { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'love-story', label: 'Love Story', icon: HeartHandshake },
    { id: 'gifts', label: 'Hadiah Pernikahan', icon: Gift },
    { id: 'settings', label: 'Pengaturan Website', icon: Settings },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F3E8] text-[#173D32] flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#173D32] text-[#F8F3E8] p-4 flex items-center justify-between border-b border-[#C5A15B]/30 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <GununganIcon size={28} />
          <div>
            <h1 className="font-royal text-sm font-bold text-[#E0C782]">Pranatan Undangan</h1>
            <p className="text-[10px] text-[#F8F3E8]/70">Admin Wedding Panel</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-[#0e2720] text-[#E0C782] border border-[#C5A15B]/40"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#173D32] text-[#F8F3E8] border-r border-[#C5A15B]/30 flex flex-col justify-between z-50 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-[#C5A15B]/20 flex items-center gap-3">
            <GununganIcon size={38} />
            <div>
              <h2 className="font-royal text-base font-bold gold-shimmer tracking-wide leading-tight">
                Pengelolaan Undangan
              </h2>
            </div>
          </div>

          {/* Database Mode pill */}
          <div className="mx-4 my-3 p-2.5 rounded-xl bg-[#0e2720]/80 border border-[#C5A15B]/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px]">
              <Database className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span className="text-[#F8F3E8]/80 font-medium">Database:</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A15B]/20 text-[#E0C782]">
              {weddingStorage.isFirebaseConfigured() ? 'Firebase' : 'Belum dikonfigurasi'}
            </span>
          </div>

          {/* Nav items */}
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#997838] to-[#C5A15B] text-[#173D32] font-bold shadow-md'
                      : 'text-[#F8F3E8]/85 hover:bg-[#0e2720]/70 hover:text-[#E0C782]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#173D32]' : 'text-[#C5A15B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#173D32]" />}
                </button>
              );
            })}
          </nav>

          {/* Bottom user & actions */}
          <div className="p-4 border-t border-[#C5A15B]/20 space-y-2">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#E0C782] bg-[#0e2720] hover:bg-[#071713] transition-all border border-[#C5A15B]/40"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span>Lihat Undangan</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-300 hover:bg-red-950/40 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Keluar (Logout)</span>
            </button>

            <div className="pt-2 text-[10px] text-[#F8F3E8]/50 text-center font-serif-jawa">
              {user?.email || 'Admin Firebase'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 md:p-8 w-full overflow-y-auto">
        {!dataReady ? (
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#C5A15B]/30 bg-white px-8 py-10 text-center shadow-[0_20px_60px_-25px_rgba(23,61,50,0.3)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#173D32] via-[#C5A15B] to-[#173D32]" />
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#C5A15B]/40 bg-[#FAF6EE]">
                <div className="absolute inset-1 rounded-full border border-dashed border-[#C5A15B]/50 animate-[spin_12s_linear_infinite]" />
                <GununganIcon size={40} className="text-[#997838]" />
                {!dataError && (
                  <LoaderCircle className="absolute -right-1 -top-1 h-6 w-6 animate-spin rounded-full bg-white text-[#173D32]" />
                )}
              </div>
              <p className="font-royal text-lg font-bold text-[#173D32]">
                {dataError ? 'Data belum dapat dimuat' : 'Menyiapkan undangan'}
              </p>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#64736D]">
                {dataError || 'Memuat data dari Firebase...'}
              </p>
              {!dataError && (
                <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#F1E8D6]">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#997838] to-[#D8BA73]" />
                </div>
              )}
              {dataError && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-xl bg-[#173D32] px-5 py-2.5 text-sm font-semibold text-[#E0C782] shadow-sm transition-colors hover:bg-[#235244]"
                >
                  Coba lagi
                </button>
              )}
            </div>
          </div>
        ) : children}
      </main>
    </div>
  );
};
