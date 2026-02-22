'use client';

import { useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

/**
 * LocaleTracker - Sends locale information to Vercel Analytics
 * 
 * Tracks:
 * - Initial locale on mount
 * - Locale changes when user switches language
 * 
 * This enables filtering analytics by Korean vs English users.
 */
export function LocaleTracker() {
  const { locale } = useI18n();

  useEffect(() => {
    // Send locale to Vercel Analytics when it changes
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', 'locale_detected', { 
        locale,
        timestamp: new Date().toISOString()
      });
    }
  }, [locale]);

  return null; // This component doesn't render anything
}
