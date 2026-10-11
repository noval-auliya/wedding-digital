import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { GununganIcon, RoyalCornerOrnament, RoyalDivider } from '../components/common/GununganIcon';
import { authService } from '../services/auth';
import { weddingStorage } from '../services/storage';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
  onNotify: (msg: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
  onNotify,
}) => {
  const [email, setEmail] = useState('admin@royalwedding.id');
  const [password, setPassword] = useState('keraton2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await authService.login(email, password);
    setIsLoading(false);

    if (res.success) {
      onNotify('Sugeng rawuh! Berhasil masuk ke Pranatan Undangan.');
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Autentikasi gagal.');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@royalwedding.id');
    setPassword('keraton2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#071713] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-batik-dark border-2 border-[#C5A15B]/50 shadow-2xl text-[#F8F3E8] backdrop-blur-md">
        <RoyalCornerOrnament position="top-left" className="top-3 left-3 opacity-70" />
        <RoyalCornerOrnament position="top-right" className="top-3 right-3 opacity-70" />
        <RoyalCornerOrnament position="bottom-left" className="bottom-3 left-3 opacity-70" />
        <RoyalCornerOrnament position="bottom-right" className="bottom-3 right-3 opacity-70" />

        <div className="text-center pt-2">
          <div className="flex justify-center mb-3">
            <GununganIcon size={64} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A15B] font-bold">
            Portal Pranatan Adat
          </span>
          <h1 className="font-royal text-2xl font-bold gold-shimmer tracking-wider mt-1">
            Admin Wedding System
          </h1>
          <p className="text-xs text-[#E0C782]/70 font-serif-jawa italic mt-1">
            Pengelolaan Serat Ulem & Data Tamu Undangan
          </p>
          <RoyalDivider className="my-4" />
        </div>

        {/* Database Status indicator */}
        <div className="mb-5 p-2.5 rounded-xl bg-[#0e2720]/80 border border-[#C5A15B]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#C5A15B]" />
            <span className="text-[#E0C782] font-medium">Mode Basis Data:</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A15B]/20 text-[#E0C782] border border-[#C5A15B]/40">
            {weddingStorage.isSupabaseConfigured() ? 'Supabase Connected' : 'Persistent Local Engine'}
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E0C782] font-semibold mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@royalwedding.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-[#0e2720] border border-[#C5A15B]/40 text-[#F8F3E8] placeholder-[#F8F3E8]/30 focus:outline-none focus:border-[#C5A15B] transition-all"
              />
              <Mail className="w-4 h-4 text-[#C5A15B] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E0C782] font-semibold mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs bg-[#0e2720] border border-[#C5A15B]/40 text-[#F8F3E8] placeholder-[#F8F3E8]/30 focus:outline-none focus:border-[#C5A15B] transition-all"
              />
              <Lock className="w-4 h-4 text-[#C5A15B] absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#C5A15B] hover:text-[#E0C782]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#997838] via-[#C5A15B] to-[#E0C782] text-[#173D32] font-bold text-xs tracking-wider shadow-lg hover:shadow-[#C5A15B]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin">⌛</span>
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Memverifikasi...' : 'MASUK KE DASHBOARD'}</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#C5A15B]/20 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-[11px] text-[#C5A15B] hover:underline"
          >
            Gunakan Akun Admin Bawaan
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-[11px] text-[#F8F3E8]/60 hover:text-[#F8F3E8] flex items-center gap-1"
          >
            <span>Ke Undangan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
