'use client';

import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function I18nTest() {
  const { t } = useI18n();

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">i18n Multi-Namespace Test</h2>
      
      <div className="mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-bold text-primary">Common:</h3>
          <p className="text-sm"><strong>Title:</strong> {t('app.title')}</p>
          <p className="text-sm"><strong>Loading:</strong> {t('common.loading')}</p>
          <p className="text-sm"><strong>Months:</strong> {t('common.months')}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-primary">Auth:</h3>
          <p className="text-sm"><strong>Hero:</strong> {t('auth:hero.title')}</p>
          <p className="text-sm"><strong>Sign In:</strong> {t('auth:card.signIn')}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-primary">Dashboard:</h3>
          <p className="text-sm"><strong>Title:</strong> {t('dashboard:header.title')}</p>
          <p className="text-sm"><strong>Runway:</strong> {t('dashboard:runway.title')}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-primary">Goals:</h3>
          <p className="text-sm"><strong>Title:</strong> {t('goals:setting.title')}</p>
          <p className="text-sm"><strong>With param:</strong> {t('goals:progress.runwayGoal', { months: '6' })}</p>
        </div>
      </div>
    </div>
  );
}
