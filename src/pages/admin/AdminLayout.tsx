import React, { useState } from 'react';
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
  QrCode,
} from 'lucide-react';
import { GununganIcon } from '../../components/common/GununganIcon';
import { authService } from '../../services/auth';
import { weddingStorage } from '../../services/storage';

export type AdminTab =
  | 'dashboard'
  | 'content'
  | 'guests'
  | 'checkin'
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
  const user = authService.getUser();

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Konten Undangan', icon: FileEdit },
    { id: 'guests', label: 'Data Tamu', icon: Users },
    { id: 'checkin', label: 'Presensi Tamu (QR)', icon: QrCode },
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
                Pranatan Pawiwahan
              </h2>
              <span className="text-[11px] text-[#E0C782]/80 font-serif-jawa italic">
                Sekar & Dimas
              </span>
            </div>
          </div>

          {/* Database Mode pill */}
          <div className="mx-4 my-3 p-2.5 rounded-xl bg-[#0e2720]/80 border border-[#C5A15B]/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px]">
              <Database className="w-3.5 h-3.5 text-[#C5A15B]" />
              <span className="text-[#F8F3E8]/80 font-medium">Database:</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A15B]/20 text-[#E0C782]">
              {weddingStorage.isSupabaseConfigured() ? 'Supabase' : 'Local Storage'}
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
              {user?.email || 'admin@royalwedding.id'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
