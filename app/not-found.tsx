'use client';

import Link from 'next/link';
import { useI18n } from './contexts/I18nContext';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-text-tertiary mb-4">
          {t('common:errors.404')}
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          {t('common:errors.pageNotFound')}
        </h2>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
        >
          {t('phases:page.backToDashboard')}
        </Link>
      </div>
    </div>
  );
}
