'use client';

import { useState, useEffect } from 'react';

export type Theme = 'classic' | 'dark' | 'ocean' | 'forest' | 'sunset';

const themes = {
  classic: {
    gradient: 'bg-white',
    name: 'Classic Blue',
    accent: 'blue',
    description: 'Clean & Professional',
    classes: {
      bg500: 'bg-blue-500',
      bg600: 'bg-blue-600',
      bg700: 'bg-blue-700',
      bgHover: 'hover:bg-blue-700',
      text500: 'text-blue-500',
      text600: 'text-blue-600',
      text700: 'text-blue-700',
      border200: 'border-blue-200',
      border300: 'border-blue-300',
      bgLight: 'bg-blue-50',
      bgGradient: 'bg-gradient-to-br from-blue-600 to-blue-700',
    }
  },
  dark: {
    gradient: 'bg-slate-900',
    name: 'Dark Mode',
    accent: 'slate',
    description: 'Easy on Eyes',
    classes: {
      bg500: 'bg-slate-600',
      bg600: 'bg-slate-700',
      bg700: 'bg-slate-800',
      bgHover: 'hover:bg-slate-700',
      text500: 'text-slate-400',
      text600: 'text-slate-300',
      text700: 'text-slate-200',
      border200: 'border-slate-700',
      border300: 'border-slate-600',
      bgLight: 'bg-slate-800',
      bgGradient: 'bg-gradient-to-br from-slate-700 to-slate-800',
    }
  },
  ocean: {
    gradient: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    name: 'Ocean Breeze',
    accent: 'cyan',
    description: 'Fresh & Calm',
    classes: {
      bg500: 'bg-cyan-500',
      bg600: 'bg-cyan-600',
      bg700: 'bg-cyan-700',
      bgHover: 'hover:bg-cyan-700',
      text500: 'text-cyan-600',
      text600: 'text-cyan-700',
      text700: 'text-cyan-800',
      border200: 'border-cyan-200',
      border300: 'border-cyan-300',
      bgLight: 'bg-cyan-50',
      bgGradient: 'bg-gradient-to-br from-cyan-600 to-blue-700',
    }
  },
  forest: {
    gradient: 'bg-gradient-to-br from-emerald-50 to-green-100',
    name: 'Forest Green',
    accent: 'emerald',
    description: 'Natural & Balanced',
    classes: {
      bg500: 'bg-emerald-500',
      bg600: 'bg-emerald-600',
      bg700: 'bg-emerald-700',
      bgHover: 'hover:bg-emerald-700',
      text500: 'text-emerald-600',
      text600: 'text-emerald-700',
      text700: 'text-emerald-800',
      border200: 'border-emerald-200',
      border300: 'border-emerald-300',
      bgLight: 'bg-emerald-50',
      bgGradient: 'bg-gradient-to-br from-emerald-600 to-green-700',
    }
  },
  sunset: {
    gradient: 'bg-gradient-to-br from-orange-50 to-pink-100',
    name: 'Sunset Glow',
    accent: 'orange',
    description: 'Warm & Energetic',
    classes: {
      bg500: 'bg-orange-500',
      bg600: 'bg-orange-600',
      bg700: 'bg-orange-700',
      bgHover: 'hover:bg-orange-700',
      text500: 'text-orange-600',
      text600: 'text-orange-700',
      text700: 'text-orange-800',
      border200: 'border-orange-200',
      border300: 'border-orange-300',
      bgLight: 'bg-orange-50',
      bgGradient: 'bg-gradient-to-br from-orange-600 to-pink-600',
    }
  },
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('classic');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    setTheme,
    gradient: themes[theme].gradient,
    accent: themes[theme].accent,
    themeName: themes[theme].name,
    description: themes[theme].description,
    classes: themes[theme].classes,
    allThemes: Object.entries(themes).map(([key, value]) => ({
      id: key as Theme,
      ...value,
    })),
  };
}
