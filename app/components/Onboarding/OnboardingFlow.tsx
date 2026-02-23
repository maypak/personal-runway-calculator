/**
 * OnboardingFlow.tsx - 온보딩 전체 플로우
 * 
 * Purpose: 3단계 온보딩 프로세스 관리
 * Created: 2026-02-23
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRunwayStore } from '../../../lib/stores/runwayStore';
import Step1Situation from './Step1Situation';
import Step2Assets from './Step2Assets';
import Step3Expenses from './Step3Expenses';

type SituationType = 'freelancer' | 'job-seeker' | 'startup' | 'quick';

export default function OnboardingFlow() {
  const router = useRouter();
  const { saveBasicData } = useRunwayStore();
  
  // Current step
  const [step, setStep] = useState(1);
  
  // Form data
  const [situationType, setSituationType] = useState<SituationType | null>(null);
  const [balance, setBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [hasVariableIncome, setHasVariableIncome] = useState(false);
  const [recentIncomes, setRecentIncomes] = useState<number[]>([0, 0, 0]);
  
  // Navigation handlers
  const goToNextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const goToPrevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleComplete = () => {
    if (!situationType) return;
    
    // Calculate average income if variable
    const avgIncome = hasVariableIncome
      ? recentIncomes.reduce((sum, income) => sum + income, 0) / recentIncomes.length
      : 0;
    
    // Save to LocalStorage via Zustand
    saveBasicData({
      balance,
      monthlyExpenses,
      hasVariableIncome,
      situationType,
      monthlyIncome: avgIncome,
      recentIncomes: hasVariableIncome ? recentIncomes : undefined,
      createdAt: new Date().toISOString(),
    });
    
    // Navigate to dashboard
    router.push('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Progress Bar (sticky) */}
      <div className="sticky top-0 bg-white shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Desktop Progress */}
          <div className="hidden md:flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of 3
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {step === 1 && '당신의 상황은?'}
              {step === 2 && '현재 자산은?'}
              {step === 3 && '월 지출은?'}
            </span>
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`
                    rounded-full transition-all
                    ${
                      stepNumber === step
                        ? 'w-4 h-4 bg-orange-500'
                        : stepNumber < step
                        ? 'w-4 h-4 bg-green-500'
                        : 'w-3 h-3 bg-gray-300'
                    }
                  `}
                />
                {stepNumber < 3 && (
                  <div
                    className={`
                      flex-1 h-0.5 transition-all
                      ${stepNumber < step ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Mobile Title */}
          <div className="md:hidden mt-2 text-center">
            <span className="text-sm font-semibold text-gray-800">
              {step === 1 && '당신의 상황은?'}
              {step === 2 && '현재 자산은?'}
              {step === 3 && '월 지출은?'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="container mx-auto py-8">
        {step === 1 && (
          <Step1Situation
            selected={situationType}
            onSelect={setSituationType}
            onNext={goToNextStep}
          />
        )}
        
        {step === 2 && (
          <Step2Assets
            balance={balance}
            monthlyExpenses={monthlyExpenses}
            onBalanceChange={setBalance}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
          />
        )}
        
        {step === 3 && (
          <Step3Expenses
            balance={balance}
            monthlyExpenses={monthlyExpenses}
            hasVariableIncome={hasVariableIncome}
            recentIncomes={recentIncomes}
            onExpensesChange={setMonthlyExpenses}
            onVariableIncomeToggle={setHasVariableIncome}
            onRecentIncomesChange={setRecentIncomes}
            onComplete={handleComplete}
            onPrev={goToPrevStep}
          />
        )}
      </div>
    </div>
  );
}
