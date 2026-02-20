'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, Wallet, TrendingDown, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../contexts/I18nContext';
import { formatCurrency } from '../utils/currencyFormatter';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (data: { savings: number; monthlyExpense: number }) => void;
  onSkip?: () => void;
  currency?: string;
}

export default function OnboardingWizard({ 
  isOpen, 
  onComplete,
  onSkip,
  currency = 'USD'
}: OnboardingWizardProps) {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [savings, setSavings] = useState<string>('');
  const [monthlyExpense, setMonthlyExpense] = useState<string>('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const savingsNum = parseFloat(savings) || 0;
    const expenseNum = parseFloat(monthlyExpense) || 0;
    
    onComplete({
      savings: savingsNum,
      monthlyExpense: expenseNum
    });
  };

  const calculateRunway = () => {
    const s = parseFloat(savings) || 0;
    const e = parseFloat(monthlyExpense) || 0;
    if (e === 0) return 999;
    return Math.floor(s / e);
  };

  const runway = calculateRunway();
  const runwayYears = Math.floor(runway / 12);
  const runwayMonths = runway % 12;

  // Keyboard handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 1) handleNext();
      else if (step === 2 && savings) handleNext();
      else if (step === 3 && monthlyExpense) handleNext();
      else if (step === 4) handleComplete();
    }
  };

  // Celebration confetti when reaching result step
  useEffect(() => {
    if (step === 4 && isOpen) {
      // Small delay to let the result render first
      setTimeout(() => {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 9999,
        };

        function fire(particleRatio: number, opts: any) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        // Multiple bursts for dramatic effect
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      }, 300);
    }
  }, [step, isOpen]);

  return (
    <div 
      data-testid="onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onKeyDown={handleKeyPress}
    >
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border-subtle">
        {/* Progress Bar */}
        <div className="sticky top-0 bg-surface-card border-b border-border-subtle px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary">
              Step {step} of 4
            </span>
            {onSkip && step === 1 && (
              <button
                onClick={onSkip}
                className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-6 py-8">
              <div className="text-6xl md:text-7xl mb-4 animate-bounce">🎯</div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                {t('onboarding:welcome.title') || 'Calculate Your Runway'}
              </h2>
              <p className="text-lg text-text-secondary max-w-lg mx-auto">
                {t('onboarding:welcome.description') || 
                'Find out how long you can survive on your savings. Takes just 60 seconds!'}
              </p>
              
              <div className="flex items-center justify-center gap-8 py-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-text-tertiary">Enter savings</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingDown className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-text-tertiary">Enter expenses</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-tertiary" />
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-text-tertiary">See runway!</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="px-8 py-4 bg-primary hover:bg-primary-hover active:bg-primary-active
                  text-white text-lg font-semibold rounded-xl shadow-lg
                  transform hover:-translate-y-1 hover:shadow-xl active:scale-98
                  transition-all duration-200"
              >
                {t('onboarding:welcome.cta') || 'Let\'s Go! →'}
              </button>
            </div>
          )}

          {/* Step 2: Savings Input */}
          {step === 2 && (
            <div className="space-y-6 py-4">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  {t('onboarding:savings.title') || 'What\'s your current savings?'}
                </h2>
                <p className="text-text-secondary">
                  {t('onboarding:savings.description') || 
                  'Total amount you have available right now'}
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Current Savings
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-text-tertiary">
                    $
                  </span>
                  <input
                    name="onboarding-savings"
                    type="number"
                    value={savings}
                    onChange={(e) => setSavings(e.target.value)}
                    placeholder="45000"
                    autoFocus
                    className="w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 text-2xl sm:text-3xl font-bold text-center
                      bg-surface-card border-2 border-primary rounded-xl
                      text-text-primary placeholder:text-text-tertiary
                      focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
                      transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-text-tertiary mt-3 text-center">
                  💡 Include: Bank accounts, emergency fund, accessible cash
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Monthly Expense Input */}
          {step === 3 && (
            <div className="space-y-6 py-4">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  {t('onboarding:expenses.title') || 'What do you spend per month?'}
                </h2>
                <p className="text-text-secondary">
                  {t('onboarding:expenses.description') || 
                  'Rough estimate is fine! Include rent, food, bills, etc.'}
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Monthly Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-text-tertiary">
                    $
                  </span>
                  <input
                    name="onboarding-expenses"
                    type="number"
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(e.target.value)}
                    placeholder="3500"
                    autoFocus
                    className="w-full pl-10 sm:pl-12 pr-6 py-3 sm:py-4 text-2xl sm:text-3xl font-bold text-center
                      bg-surface-card border-2 border-primary rounded-xl
                      text-text-primary placeholder:text-text-tertiary
                      focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
                      transition-all duration-200"
                  />
                </div>
                <p className="text-sm text-text-tertiary mt-3 text-center">
                  💡 Typical: $2,500-$5,000/month depending on location
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="text-6xl md:text-7xl mb-4 animate-bounce">
                {runway > 24 ? '🎉' : runway > 12 ? '🎯' : runway > 6 ? '⚠️' : '🚨'}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                {t('onboarding:result.title') || 'Your runway is...'}
              </h2>
              
              <div className="py-6">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2">
                  {runwayYears > 0 && `${runwayYears}yr `}
                  {runwayMonths}mo
                </div>
                <p className="text-lg text-text-secondary mt-4">
                  {runway > 24 
                    ? '🎉 Excellent! You have a comfortable runway.'
                    : runway > 12 
                    ? '👍 Solid! You have over a year of runway.'
                    : runway > 6
                    ? '⚠️ Moderate. Consider building your runway.'
                    : '🚨 Tight! Focus on increasing savings or reducing expenses.'}
                </p>
              </div>

              <div className="bg-primary-light rounded-xl p-6 max-w-md mx-auto">
                <h3 className="font-semibold text-text-primary mb-3">
                  Your Numbers:
                </h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Savings:</span>
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(parseFloat(savings) || 0, currency as any)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Monthly Expenses:</span>
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(parseFloat(monthlyExpense) || 0, currency as any)}
                    </span>
                  </div>
                  <div className="border-t border-border-subtle pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-text-primary">Runway:</span>
                    <span className="font-bold text-primary">
                      {runway} months
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-tertiary max-w-md mx-auto">
                💡 You can refine these numbers anytime in Settings
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-surface-card border-t border-border-subtle px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {step > 1 && step < 4 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-border-default rounded-lg
                  text-text-secondary hover:text-text-primary hover:border-border-subtle
                  transition-all duration-200"
              >
                ← Back
              </button>
            )}
            
            <div className="flex-1" />

            {step === 2 && (
              <button
                onClick={handleNext}
                disabled={!savings || parseFloat(savings) <= 0}
                className="px-6 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active
                  text-white font-semibold rounded-lg shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                  transition-all duration-200"
              >
                Next →
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleNext}
                disabled={!monthlyExpense || parseFloat(monthlyExpense) <= 0}
                className="px-6 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active
                  text-white font-semibold rounded-lg shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                  transition-all duration-200"
              >
                Calculate! 🎯
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-success hover:bg-success/90 active:bg-success/80
                  text-white text-lg font-semibold rounded-lg shadow-lg
                  transform hover:-translate-y-1 hover:shadow-xl active:scale-98
                  transition-all duration-200"
              >
                Done! Let's Go 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
