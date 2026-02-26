/**
 * AddScenarioModal.tsx - P1: 커스텀 시나리오 추가 모달
 * 
 * Purpose: Modal for creating custom runway scenarios
 * Features: Balance increase (funding) or expense adjustment
 * 
 * Created: 2026-02-26 (P1 Features)
 */

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export interface CustomScenario {
  id: string;
  name: string;
  type: 'balance_increase' | 'expense_adjustment';
  value: number;
  icon: string;
}

interface AddScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (scenario: CustomScenario) => void;
}

export default function AddScenarioModal({
  isOpen,
  onClose,
  onAdd,
}: AddScenarioModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'balance_increase' | 'expense_adjustment'>('balance_increase');
  const [value, setValue] = useState<number>(0);
  const [selectedIcon, setSelectedIcon] = useState('💎');

  const icons = ['💎', '💰', '🦄', '📝', '🔥', '❄️', '🎁', '👪', '🚀', '⭐'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || value === 0) {
      alert('이름과 금액을 입력해주세요');
      return;
    }

    const scenario: CustomScenario = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      type,
      value: type === 'expense_adjustment' ? value / 100 : value,
      icon: selectedIcon,
    };

    onAdd(scenario);
    
    // Reset form
    setName('');
    setValue(0);
    setSelectedIcon('💎');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-scenario-title"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="add-scenario-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ➕ 새 시나리오 추가
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="scenario-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              시나리오 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="scenario-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 브릿지 펀딩"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              maxLength={50}
              required
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              유형 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('balance_increase')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'balance_increase'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-semibold text-sm">자산 증가</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  펀딩, 상여금 등
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setType('expense_adjustment')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'expense_adjustment'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">📉</div>
                <div className="font-semibold text-sm">지출 변경</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  절약, 증가 등
                </div>
              </button>
            </div>
          </div>

          {/* Value Input */}
          <div>
            <label htmlFor="scenario-value" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {type === 'balance_increase' ? '금액 (원)' : '변경률 (%)'} <span className="text-red-500">*</span>
            </label>
            <input
              id="scenario-value"
              type="number"
              value={value || ''}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder={type === 'balance_increase' ? '10000000' : '30'}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
              min={type === 'balance_increase' ? 1 : -100}
              max={type === 'expense_adjustment' ? 100 : undefined}
              step={type === 'balance_increase' ? 1000000 : 5}
            />
            {type === 'balance_increase' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                예: 10,000,000 = 천만원
              </p>
            )}
            {type === 'expense_adjustment' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                양수: 지출 증가 | 음수: 지출 감소 (절약)
              </p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              아이콘
            </label>
            <div className="grid grid-cols-10 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedIcon === icon
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim() || value === 0}
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
