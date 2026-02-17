/**
 * Service Worker Registration Component
 * 
 * Purpose: Register service worker for PWA functionality
 * - Offline support
 * - Asset caching
 * - Background sync (future)
 * 
 * Created: 2026-02-17
 * Author: Senior Performance Engineer
 */

'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });

      // Handle updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[SW] New service worker activated, reloading...');
        window.location.reload();
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
