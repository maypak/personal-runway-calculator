/**
 * CreateScenarioModal - Scenario Creation Dialog
 * 
 * Purpose: Modal for creating new scenarios
 * Features:
 * - Scenario name input
 * - Description (optional)
 * - Clone from existing scenario or base financial settings
 * - Free tier limit messaging
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import type { Scenario } from '../types';

interface CreateScenarioModalProps {
  scenarios: Scenario[];
  onCreate: (name: string, description?: string, cloneFromId?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CreateScenarioModal({
  scenarios,
  onCreate,
  onCancel,
  loading = false,
}: CreateScenarioModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cloneFromId, setCloneFromId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert(t('scenarios:create.errors.nameRequired'));
      return;
    }

    onCreate(name.trim(), description.trim() || undefined, cloneFromId || undefined);
  };

  // Free tier check
  const nonBaseScenarios = scenarios.filter(s => !s.isBase);
  const isAtLimit = nonBaseScenarios.length >= 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('scenarios:create.title')}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={loading}
            aria-label={t('scenarios:create.cta.cancel')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free tier limit warning */}
        {isAtLimit && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>{t('scenarios:create.freeTier.warning')}</strong>
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="scenario-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('scenarios:create.fields.name.label')} <span className="text-red-500">*</span>
            </label>
            <input
              id="scenario-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('scenarios:create.fields.name.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              maxLength={100}
              required
              disabled={loading || isAtLimit}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="scenario-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('scenarios:create.fields.description.label')} ({t('scenarios:create.fields.description.optional')})
            </label>
            <textarea
              id="scenario-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('scenarios:create.fields.description.placeholder')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              maxLength={500}
              disabled={loading || isAtLimit}
            />
          </div>

          {/* Clone From */}
          <div>
            <label htmlFor="clone-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('scenarios:create.fields.cloneFrom.label')}
            </label>
            <select
              id="clone-from"
              value={cloneFromId}
              onChange={(e) => setCloneFromId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={loading || isAtLimit}
            >
              <option value="">{t('scenarios:create.fields.cloneFrom.current')}</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.isBase ? `(${t('scenarios:card.base')})` : ''}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('scenarios:create.fields.cloneFrom.help')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              {t('scenarios:create.cta.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isAtLimit || !name.trim()}
            >
              {loading ? t('scenarios:create.cta.creating') : isAtLimit ? t('scenarios:create.cta.limitReached') : t('scenarios:create.cta.create')}
            </button>
          </div>
        </form>

        {/* Upgrade CTA (if at limit) */}
        {isAtLimit && (
          <div className="px-6 pb-6">
            <button
              className="w-full px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              onClick={() => {
                // TODO: Navigate to pricing page
                alert(t('scenarios:create.freeTier.upgrade'));
              }}
            >
              {t('scenarios:create.freeTier.upgrade')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
