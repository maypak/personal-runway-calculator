'use client';

import { Globe } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const languages = [
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'ko' as const, name: '한국어', flag: '🇰🇷' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const handleChange = (newLocale: 'en' | 'ko') => {
    setLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <select 
        value={locale}
        onChange={(e) => handleChange(e.target.value as 'en' | 'ko')}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
