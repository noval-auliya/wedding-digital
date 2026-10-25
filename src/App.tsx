/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { PublicInvitationPage } from './pages/PublicInvitationPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminGuestsPage } from './pages/admin/AdminGuestsPage';
import { AdminRSVPPage } from './pages/admin/AdminRSVPPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminLoveStoryPage } from './pages/admin/AdminLoveStoryPage';
import { AdminGiftsPage } from './pages/admin/AdminGiftsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { ToastContainer, ToastMessage } from './components/common/Toast';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [authReady, setAuthReady] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleStorageError = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string }>).detail;
      addNotification(
        `Gagal menyinkronkan data Firebase${detail?.message ? `: ${detail.message}` : '.'}`,
        'error',
      );
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('wedding-storage-error', handleStorageError);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('wedding-storage-error', handleStorageError);
    };
  }, []);

  useEffect(() => authService.subscribe(() => setAuthReady(true)), []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Route parsing
  const cleanPath = currentPath.replace(/\/$/, '') || '/';

  // 1. Personalized guest invitation: /invitation/:slug
  if (cleanPath.startsWith('/invitation/')) {
    const slug = cleanPath.replace('/invitation/', '').trim();
    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <PublicInvitationPage
          slug={slug}
          onNavigate={navigate}
          onNotify={addNotification}
        />
      </>
    );
  }

  // 2. Admin Login: /admin/login
  if (cleanPath === '/admin/login') {
    if (!authReady) return null;
    if (authService.isAuthenticated()) {
      navigate('/admin');
      return null;
    }

    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
          onNotify={addNotification}
        />
      </>
    );
  }

  // 3. Admin Dashboard & Sub-pages: /admin or /admin/*
  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    if (!authReady) return null;
    // Route protection check
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
      return null;
    }

    // Determine active tab based on path
    let currentTab: AdminTab = 'dashboard';
    if (cleanPath === '/admin/content') currentTab = 'content';
    else if (cleanPath === '/admin/guests') currentTab = 'guests';
    else if (cleanPath === '/admin/rsvp') currentTab = 'rsvp';
    else if (cleanPath === '/admin/events') currentTab = 'events';
    else if (cleanPath === '/admin/gallery') currentTab = 'gallery';
    else if (cleanPath === '/admin/love-story') currentTab = 'love-story';
    else if (cleanPath === '/admin/gifts') currentTab = 'gifts';
    else if (cleanPath === '/admin/settings') currentTab = 'settings';

    const handleSelectTab = (tab: AdminTab) => {
      if (tab === 'dashboard') navigate('/admin');
      else navigate(`/admin/${tab}`);
    };

    const handleLogout = async () => {
      try {
        await authService.logout();
        addNotification('Anda telah keluar dari sesi administrator.');
        navigate('/admin/login');
      } catch (error) {
        console.error('Firebase sign-out failed:', error);
        addNotification('Gagal keluar dari akun Firebase. Silakan coba lagi.', 'error');
      }
    };

    return (
      <>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <AdminLayout
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onNavigateHome={() => navigate('/')}
          onLogout={handleLogout}
        >
          {currentTab === 'dashboard' && (
            <AdminDashboardPage
              onNavigateTab={handleSelectTab}
              onNavigateHome={() => navigate('/')}
              onNotify={addNotification}
            />
          )}
          {currentTab === 'content' && (
            <AdminContentPage
              onNotify={addNotification}
              onNavigateHome={() => navigate('/')}
            />
          )}
          {currentTab === 'guests' && (
            <AdminGuestsPage
              onNotify={addNotification}
              onOpenInvitation={(slug) => navigate(`/invitation/${slug}`)}
            />
          )}
          {currentTab === 'rsvp' && (
            <AdminRSVPPage
              onNotify={addNotification}
              onOpenInvitation={(slug) => navigate(`/invitation/${slug}`)}
            />
          )}
          {currentTab === 'events' && (
            <AdminEventsPage onNotify={addNotification} />
          )}
          {currentTab === 'gallery' && (
            <AdminGalleryPage onNotify={addNotification} />
          )}
          {currentTab === 'love-story' && (
            <AdminLoveStoryPage onNotify={addNotification} />
          )}
          {currentTab === 'gifts' && (
            <AdminGiftsPage onNotify={addNotification} />
          )}
          {currentTab === 'settings' && (
            <AdminSettingsPage onNotify={addNotification} />
          )}
        </AdminLayout>
      </>
    );
  }

  // 4. Default / Public Invitation: /
  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <PublicInvitationPage
        onNavigate={navigate}
        onNotify={addNotification}
      />
    </>
  );
}
