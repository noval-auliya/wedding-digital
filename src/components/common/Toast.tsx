import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-3 left-3 right-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col gap-2 overflow-y-auto pointer-events-none md:top-5 md:left-auto md:right-5 md:w-[calc(100%-2.5rem)] md:max-w-sm"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex min-w-0 items-start gap-2.5 rounded-xl border p-3 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 sm:gap-3 sm:p-4 ${
            toast.type === 'success'
              ? 'bg-[#173D32] text-[#F8F3E8] border-[#C5A15B]'
              : toast.type === 'error'
              ? 'bg-[#4a1515] text-[#F8F3E8] border-[#e26d6d]'
              : 'bg-[#1c2e27] text-[#F8F3E8] border-[#7da292]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C5A15B] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#f87171] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#6ee7b7] shrink-0 mt-0.5" />}
          <p className="min-w-0 flex-1 break-words text-sm font-medium leading-snug [overflow-wrap:anywhere]">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Tutup notifikasi"
            className="ml-1 shrink-0 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
