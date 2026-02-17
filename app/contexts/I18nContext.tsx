'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ko';
type Messages = Record<string, any>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const NAMESPACES = ['common', 'auth', 'dashboard', 'goals', 'scenarios', 'fire'];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = (localStorage.getItem('preferredLocale') || 'en') as Locale;
    setLocaleState(savedLocale);
    loadMessages(savedLocale);
  }, []);

  const loadMessages = async (loc: Locale) => {
    try {
      setLoading(true);
      const allMessages: Messages = {};
      
      // Load all namespaces
      await Promise.all(
        NAMESPACES.map(async (namespace) => {
          try {
            const response = await fetch(`/locales/${loc}/${namespace}.json`);
            const msgs = await response.json();
            allMessages[namespace] = msgs;
          } catch (error) {
            console.error(`Failed to load ${namespace}:`, error);
            allMessages[namespace] = {};
          }
        })
      );
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferredLocale', newLocale);
    loadMessages(newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Support namespace:key.subkey format (e.g., "auth:hero.title")
    const [namespaceOrKey, ...restKeys] = key.split(':');
    let namespace = 'common';
    let keys: string[] = [];
    
    if (restKeys.length > 0) {
      // Has namespace prefix
      namespace = namespaceOrKey;
      keys = restKeys[0].split('.');
    } else {
      // No namespace, treat first part as key
      keys = namespaceOrKey.split('.');
    }
    
    // Navigate through the message object
    let value: any = messages[namespace];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    
    // Replace params if provided (e.g., {{months}} → 6)
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Show loading state briefly
  if (loading && Object.keys(messages).length === 0) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
