'use client';

import { useState, useEffect } from 'react';

export type Theme = 'whiteBlue' | 'whiteBlack' | 'skyGreen' | 'mint' | 'purple';

const themes = {
  whiteBlue: {
    gradient: 'bg-white',
    name: 'Clean Blue',
    accent: 'blue',
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
  whiteBlack: {
    gradient: 'bg-gray-50',
    name: 'Classic Gray',
    accent: 'gray',
    classes: {
      bg500: 'bg-gray-700',
      bg600: 'bg-gray-800',
      bg700: 'bg-gray-900',
      bgHover: 'hover:bg-gray-900',
      text500: 'text-gray-700',
      text600: 'text-gray-800',
      text700: 'text-gray-900',
      border200: 'border-gray-200',
      border300: 'border-gray-300',
      bgLight: 'bg-gray-100',
      bgGradient: 'bg-gradient-to-br from-gray-800 to-gray-900',
    }
  },
  skyGreen: {
    gradient: 'bg-sky-50',
    name: 'Fresh Lime',
    accent: 'lime',
    classes: {
      bg500: 'bg-lime-500',
      bg600: 'bg-lime-600',
      bg700: 'bg-lime-700',
      bgHover: 'hover:bg-lime-700',
      text500: 'text-lime-500',
      text600: 'text-lime-600',
      text700: 'text-lime-700',
      border200: 'border-lime-200',
      border300: 'border-lime-300',
      bgLight: 'bg-lime-50',
      bgGradient: 'bg-gradient-to-br from-sky-500 to-lime-600',
    }
  },
  mint: {
    gradient: 'bg-emerald-50',
    name: 'Mint Green',
    accent: 'emerald',
    classes: {
      bg500: 'bg-emerald-500',
      bg600: 'bg-emerald-600',
      bg700: 'bg-emerald-700',
      bgHover: 'hover:bg-emerald-700',
      text500: 'text-emerald-500',
      text600: 'text-emerald-600',
      text700: 'text-emerald-700',
      border200: 'border-emerald-200',
      border300: 'border-emerald-300',
      bgLight: 'bg-emerald-50',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    }
  },
  purple: {
    gradient: 'bg-purple-50',
    name: 'Purple Dream',
    accent: 'purple',
    classes: {
      bg500: 'bg-purple-500',
      bg600: 'bg-purple-600',
      bg700: 'bg-purple-700',
      bgHover: 'hover:bg-purple-700',
      text500: 'text-purple-500',
      text600: 'text-purple-600',
      text700: 'text-purple-700',
      border200: 'border-purple-200',
      border300: 'border-purple-300',
      bgLight: 'bg-purple-50',
      bgGradient: 'bg-gradient-to-br from-purple-600 to-pink-600',
    }
  },
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('whiteBlue');

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
    classes: themes[theme].classes,
    allThemes: Object.entries(themes).map(([key, value]) => ({
      id: key as Theme,
      ...value,
    })),
  };
}
