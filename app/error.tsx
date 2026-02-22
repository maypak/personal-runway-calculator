'use client';

import { useEffect } from 'react';
import { useI18n } from './contexts/I18nContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          {t('common:errors.somethingWrong')}
        </h2>
        <p className="text-text-secondary mb-6">
          {error.message || t('common:errors.unexpectedError')}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors"
        >
          {t('common:errors.tryAgain')}
        </button>
      </div>
    </div>
  );
}
