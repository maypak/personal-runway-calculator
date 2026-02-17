'use client';

import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function I18nTest() {
  const { t } = useI18n();

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">i18n Test</h2>
      
      <div className="mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="space-y-2">
        <p><strong>Title:</strong> {t('app.title')}</p>
        <p><strong>Tagline:</strong> {t('app.tagline')}</p>
        <p><strong>Test:</strong> {t('test.hello')}</p>
        <p><strong>Dashboard:</strong> {t('nav.dashboard')}</p>
        <p><strong>Calculate:</strong> {t('cta.calculate')}</p>
      </div>
    </div>
  );
}
