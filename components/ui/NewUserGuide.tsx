'use client';

import { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { useI18n } from '@/app/contexts/I18nContext';

export function NewUserGuide() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen this before
    const hasSeenGuide = localStorage.getItem('hasSeenRunwayGuide');
    if (!hasSeenGuide) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenRunwayGuide', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('dashboard:newUserGuide.title')}
            </h3>
            <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">1.</span>
                <span>
                  <strong>{t('dashboard:newUserGuide.step1.title')}</strong> - {t('dashboard:newUserGuide.step1.description')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">2.</span>
                <span>
                  <strong>{t('dashboard:newUserGuide.step2.title')}</strong> - {t('dashboard:newUserGuide.step2.description')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">3.</span>
                <span>
                  <strong>{t('dashboard:newUserGuide.step3.title')}</strong> - {t('dashboard:newUserGuide.step3.description')}
                </span>
              </li>
            </ol>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              💡 <strong>{t('dashboard:newUserGuide.tip.label')}</strong> {t('dashboard:newUserGuide.tip.text')}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
          aria-label="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
