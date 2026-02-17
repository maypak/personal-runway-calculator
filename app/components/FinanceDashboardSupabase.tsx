'use client';

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Settings, 
  LogOut,
  Calendar,
  Plus,
  Moon,
  Sun,
  Zap,
  DollarSign,
  Shield,
  AlertTriangle,
  AlertCircle,
  Flame,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseFinance } from '../hooks/useSupabaseFinance';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../contexts/I18nContext';
import GoalSetting from './GoalSetting';
import GoalProgress from './GoalProgress';
import SkeletonLoader from './SkeletonLoader';
import LanguageSwitcher from './LanguageSwitcher';

export default function FinanceDashboardSupabase() {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const {
    settings,
    expenses,
    goals,
    loading,
    updateSettings,
    addExpense,
    deleteExpense,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useSupabaseFinance();

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<typeof goals[0] | null>(null);
  
  const [newExpense, setNewExpense] = useState({ 
    amount: '', 
    category: 'Food', 
    memo: '' 
  });
  
  // Simulator state
  const [simMonthlyExpense, setSimMonthlyExpense] = useState(4000);
  const [simAdditionalIncome, setSimAdditionalIncome] = useState(0);
  const [simOneTimeExpense, setSimOneTimeExpense] = useState(0);

  // Initialize simulator with actual monthly expense
  useEffect(() => {
    if (settings) {
      setSimMonthlyExpense(settings.monthlyFixed + settings.monthlyVariable);
    }
  }, [settings]);

  // Keyboard accessibility: Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowExpenseForm(false);
        setShowSimulator(false);
        setShowGoalModal(false);
        setEditingGoal(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (loading || !settings) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SkeletonLoader />
      </div>
    );
  }

  // Calculations
  const today = new Date();
  const startDate = new Date(settings.startDate);
  const daysSince = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const totalIncome = settings.currentSavings + settings.lumpSum + (settings.monthlyIncome * settings.incomeMonths);
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingFunds = totalIncome - totalExpenses;
  
  const monthlyExpense = settings.monthlyFixed + settings.monthlyVariable;
  const runway = monthlyExpense > 0 ? Math.floor(remainingFunds / monthlyExpense) : 999;
  const runwayYears = Math.floor(runway / 12);
  const runwayMonths = runway % 12;

  // Simulator calculations
  const simRemainingFunds = remainingFunds - simOneTimeExpense;
  const simNetMonthlyExpense = simMonthlyExpense - simAdditionalIncome;
  const simRunway = simNetMonthlyExpense > 0 ? Math.floor(simRemainingFunds / simNetMonthlyExpense) : 999;
  const simRunwayYears = Math.floor(simRunway / 12);
  const simRunwayMonths = simRunway % 12;
  const runwayDiff = simRunway - runway;

  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthExpenses = expenses
    .filter(exp => exp.date.startsWith(thisMonth))
    .reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthlyBudget = monthlyExpense;
  const budgetUsagePercent = monthlyBudget > 0 ? (thisMonthExpenses / monthlyBudget) * 100 : 0;

  const handleAddExpense = async () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert(t('dashboard:expenses.validation.invalidAmount'));
      return;
    }

    await addExpense({
      date: new Date().toISOString().split('T')[0],
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      memo: newExpense.memo || undefined,
    });

    setNewExpense({ amount: '', category: 'Food', memo: '' });
    setShowExpenseForm(false);
  };

  // Goal handlers
  const handleSaveGoal = async (goal: Parameters<typeof addGoal>[0]) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goal);
      setEditingGoal(null);
    } else {
      await addGoal(goal);
    }
    setShowGoalModal(false);
  };

  const handleEditGoal = (goal: typeof goals[0]) => {
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  // Get active goal (Free tier: only 1 active)
  const activeGoal = goals.find(g => g.isActive);

  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Wallet className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            {t('auth:hero.logo')}
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          {/* FIRE Calculator Link */}
          <Link
            href="/fire"
            className="p-2 md:p-3 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20
              hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30
              border border-orange-200 dark:border-orange-800 rounded-lg
              transition-all duration-200 active:scale-98 group"
            aria-label="FIRE Calculator"
            title="FIRE Calculator"
          >
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300" />
          </Link>
          
          {/* Phase Planning Link */}
          <Link
            href="/phases"
            className="p-2 md:p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20
              hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30
              border border-blue-200 dark:border-blue-800 rounded-lg
              transition-all duration-200 active:scale-98 group"
            aria-label="Phase Planning"
            title="Phase Planning"
          >
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
          </Link>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 md:p-3 bg-surface-card hover:bg-surface-hover active:bg-surface-active
              border border-border-subtle rounded-lg
              transition-all duration-200 active:scale-98"
            aria-label={t('theme.toggle')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-text-secondary" />
            ) : (
              <Sun className="w-5 h-5 text-text-secondary" />
            )}
          </button>
          
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 md:p-3 bg-surface-card hover:bg-surface-hover active:bg-surface-active
              border border-border-subtle rounded-lg
              transition-all duration-200 active:scale-98"
            aria-label={t('nav.settings')}
          >
            <Settings className="w-5 h-5 text-text-secondary" />
          </button>
          
          {/* Sign Out (Desktop only) */}
          <button
            onClick={signOut}
            className="hidden sm:flex items-center gap-2 px-4 py-2
              bg-error hover:bg-error/90 active:bg-error/80
              text-white rounded-lg text-sm font-medium
              transition-all duration-200 active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('dashboard:header.signOut')}</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-surface-card rounded-xl shadow-lg border border-border-subtle p-6 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text-primary">
            {t('dashboard:settings.title')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.currentSavingsLabel')}
              </label>
              <input
                type="number"
                value={settings.currentSavings}
                onChange={(e) => updateSettings({ ...settings, currentSavings: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.lumpSumLabel')}
                <span className="text-text-tertiary text-xs ml-1">({t('dashboard:expenses.optional')})</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={settings.lumpSum || ''}
                onChange={(e) => updateSettings({ ...settings, lumpSum: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.monthlyIncomeLabel')}
                <span className="text-text-tertiary text-xs ml-1">({t('dashboard:expenses.optional')})</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={settings.monthlyIncome || ''}
                onChange={(e) => updateSettings({ ...settings, monthlyIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.incomeMonths')}
                <span className="text-text-tertiary text-xs ml-1">({t('dashboard:expenses.optional')})</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={settings.incomeMonths || ''}
                onChange={(e) => updateSettings({ ...settings, incomeMonths: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.monthlyFixedLabel')}
              </label>
              <input
                type="number"
                value={settings.monthlyFixed}
                onChange={(e) => updateSettings({ ...settings, monthlyFixed: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.monthlyVariableLabel')}
                <span className="text-text-tertiary text-xs ml-1">({t('dashboard:expenses.optional')})</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={settings.monthlyVariable || ''}
                onChange={(e) => updateSettings({ ...settings, monthlyVariable: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {t('dashboard:settings.startDate')}
              </label>
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => updateSettings({ ...settings, startDate: e.target.value })}
                className="w-full px-4 py-3
                  bg-surface-card border border-border-default rounded-lg
                  text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
            </div>
          </div>

          {/* Mobile Sign Out (inside Settings) */}
          <div className="sm:hidden pt-4 mt-4 border-t border-border-subtle">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3
                bg-error hover:bg-error/90 active:bg-error/80
                text-white rounded-lg font-medium
                transition-all duration-200 active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('dashboard:header.signOut')}</span>
            </button>
          </div>

          {/* Language Switcher (Mobile) */}
          <div className="sm:hidden pt-2">
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-3 bg-success hover:bg-success/90 text-white rounded-lg font-semibold
              transition-all duration-200 active:scale-98"
          >
            {t('cta.close')}
          </button>
        </div>
      )}

      {/* Runway Display - Enhanced */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-text-secondary">
            {t('dashboard:runway.title')}
          </h2>
          {runway > 24 ? (
            <Shield className="w-10 h-10 text-success" />
          ) : runway > 12 ? (
            <AlertTriangle className="w-10 h-10 text-warning" />
          ) : (
            <AlertCircle className="w-10 h-10 text-error" />
          )}
        </div>
        
        {/* Main Number */}
        <div className="text-center mb-6">
          <div className="text-4xl md:text-6xl font-bold text-text-primary mb-3 tabular-nums">
            {runwayYears > 0 && (
              <span>
                {runwayYears}
                <span className="text-3xl text-text-tertiary">{t('dashboard:runway.yr')}</span>
                {' '}
              </span>
            )}
            {runwayMonths}
            <span className="text-3xl text-text-tertiary">{t('dashboard:runway.mo')}</span>
          </div>
          
          {/* Emotional Message */}
          <p className="text-base md:text-lg text-text-secondary max-w-md mx-auto leading-relaxed">
            {runway > 24 
              ? t('dashboard:runway.status.great')
              : runway > 12 
              ? t('dashboard:runway.status.solid')
              : runway > 6
              ? t('dashboard:runway.status.tight')
              : t('dashboard:runway.status.attention')}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative w-full h-4 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className={`absolute h-full rounded-full transition-all duration-500 ease-out ${
                runway > 24 ? 'bg-success' : 
                runway > 12 ? 'bg-info' : 
                runway > 6 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${Math.min((runway / 36) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-tertiary mt-2">
            <span>0{t('dashboard:runway.mo')}</span>
            <span className="font-medium">{t('dashboard:runway.goalProgress')}</span>
          </div>
        </div>
        
        {/* Details */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-subtle">
          <div className="text-center">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:runway.details.available')}</div>
            <div className="text-base md:text-lg font-semibold text-success">
              ${remainingFunds.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:runway.details.monthly')}</div>
            <div className="text-base md:text-lg font-semibold text-error">
              ${monthlyExpense.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:runway.details.dailyBurn')}</div>
            <div className="text-base md:text-lg font-semibold text-text-primary">
              ${Math.round(monthlyExpense / 30).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress Section */}
      {activeGoal ? (
        <GoalProgress
          goal={activeGoal}
          currentRunway={runway}
          remainingFunds={remainingFunds}
          onEdit={() => handleEditGoal(activeGoal)}
          onDelete={() => handleDeleteGoal(activeGoal.id)}
        />
      ) : (
        <div className="bg-primary-light rounded-xl shadow-md p-6 border-2 border-dashed border-primary/30 text-center">
          <Target className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {t('dashboard:goals.setGoal')}
          </h3>
          <p className="text-text-secondary mb-4 max-w-md mx-auto">
            {t('dashboard:goals.noGoals')}
          </p>
          <button
            onClick={() => {
              setEditingGoal(null);
              setShowGoalModal(true);
            }}
            className="px-6 py-3 bg-primary hover:bg-primary-hover active:bg-primary-active
              text-white rounded-xl font-semibold shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5 active:scale-98
              transition-all duration-200"
          >
            {t('dashboard:goals.setGoal')}
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4 md:p-5 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:stats.totalIncome')}</div>
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-success" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-success">
            ${totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4 md:p-5 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:stats.totalSpent')}</div>
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-error" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-error">
            ${totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4 md:p-5 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-text-tertiary">{t('dashboard:stats.daysSince')}</div>
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-info" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-info">
            {daysSince}
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4 md:p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm md:text-base font-semibold text-text-secondary">
            {t('dashboard:budget.title')}
          </span>
          <span className="text-xs md:text-sm font-medium text-text-tertiary">
            ${thisMonthExpenses.toLocaleString()} / ${monthlyBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              budgetUsagePercent >= 100
                ? 'bg-error'
                : budgetUsagePercent >= 80
                ? 'bg-warning'
                : 'bg-success'
            }`}
            style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-text-tertiary">
            {budgetUsagePercent.toFixed(0)}% {t('dashboard:budget.used')}
          </span>
          <span className={`text-xs font-semibold ${
            budgetUsagePercent >= 100 ? 'text-error' :
            budgetUsagePercent >= 80 ? 'text-warning' : 'text-success'
          }`}>
            {budgetUsagePercent >= 100 ? t('dashboard:budget.overBudget') :
             budgetUsagePercent >= 80 ? t('dashboard:budget.almostSpent') : t('dashboard:budget.lookingGood')}
          </span>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-semibold text-text-primary">
            {t('dashboard:expenses.title')}
          </h3>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2
              bg-primary hover:bg-primary-hover active:bg-primary-active
              text-white rounded-lg text-sm font-semibold
              shadow-md hover:shadow-lg
              active:scale-98 transition-all duration-200"
            aria-label={t('dashboard:expenses.addExpense')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('dashboard:expenses.addExpense')}</span>
            <span className="sm:hidden">{t('cta.add')}</span>
          </button>
        </div>

        {showExpenseForm && (
          <div className="mb-4 p-4 bg-bg-secondary rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                placeholder={t('dashboard:expenses.amountPlaceholder')}
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="px-4 py-3 border border-border-default rounded-lg
                  bg-surface-card text-text-primary placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="px-4 py-3 border border-border-default rounded-lg
                  bg-surface-card text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  transition-all duration-200"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{t(`dashboard:expenses.categories.${cat}`)}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder={t('dashboard:expenses.memoPlaceholder')}
              value={newExpense.memo}
              onChange={(e) => setNewExpense({ ...newExpense, memo: e.target.value })}
              className="w-full px-4 py-3 border border-border-default rounded-lg
                bg-surface-card text-text-primary placeholder:text-text-tertiary
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                transition-all duration-200"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 py-3 bg-success hover:bg-success/90 text-white rounded-lg font-semibold
                  active:scale-98 transition-all duration-200"
              >
                {t('dashboard:expenses.add')}
              </button>
              <button
                onClick={() => setShowExpenseForm(false)}
                className="px-4 py-3 bg-surface-hover hover:bg-surface-active text-text-primary rounded-lg font-semibold
                  transition-all duration-200"
              >
                {t('dashboard:expenses.cancel')}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {expenses.slice(0, 10).map((exp) => (
            <div key={exp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-surface-hover rounded-lg hover:bg-surface-active transition-colors duration-200">
              <div className="flex-1">
                <div className="text-sm md:text-base font-semibold text-text-primary">
                  ${exp.amount} - {t(`dashboard:expenses.categories.${exp.category}`)}
                </div>
                <div className="text-xs md:text-sm text-text-tertiary">
                  {exp.date} {exp.memo && `• ${exp.memo}`}
                </div>
              </div>
              <button
                onClick={() => deleteExpense(exp.id)}
                className="w-full sm:w-auto px-3 py-1 bg-error hover:bg-error/90 text-white rounded-lg text-xs md:text-sm font-medium
                  active:scale-98 transition-all duration-200"
                aria-label={`${t('dashboard:expenses.delete')} ${t(`dashboard:expenses.categories.${exp.category}`)} ${t('dashboard:expenses.amount')} $${exp.amount}`}
              >
                {t('dashboard:expenses.delete')}
              </button>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="text-center text-text-tertiary py-8">
              {t('dashboard:expenses.noExpenses')}
            </div>
          )}
        </div>
      </div>

      {/* Runway Simulator */}
      <div className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-4">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full flex justify-between items-center text-lg font-semibold mb-4 text-text-primary"
          aria-expanded={showSimulator}
          aria-label={t('dashboard:simulator.title')}
        >
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {t('dashboard:simulator.title')}
          </span>
          <span className="text-2xl text-text-tertiary">
            {showSimulator ? '▼' : '▶'}
          </span>
        </button>

        {showSimulator && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                {t('dashboard:simulator.monthlyExpenseLabel')}{simMonthlyExpense}
              </label>
              <input
                type="range"
                min="0"
                max={monthlyExpense * 2}
                step="100"
                value={simMonthlyExpense}
                onChange={(e) => setSimMonthlyExpense(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                {t('dashboard:simulator.additionalIncomeLabel')}{simAdditionalIncome}
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={simAdditionalIncome}
                onChange={(e) => setSimAdditionalIncome(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                {t('dashboard:simulator.oneTimeExpenseLabel')}{simOneTimeExpense}
              </label>
              <input
                type="range"
                min="0"
                max={remainingFunds}
                step="1000"
                value={simOneTimeExpense}
                onChange={(e) => setSimOneTimeExpense(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="bg-primary-light rounded-lg p-4 text-center">
              <div className="text-sm text-text-tertiary mb-2">{t('dashboard:simulator.simulatedRunway')}</div>
              <div className="text-4xl font-bold text-primary">
                {simRunwayYears > 0 && `${simRunwayYears}${t('dashboard:runway.yr')} `}
                {simRunwayMonths}{t('dashboard:runway.mo')}
              </div>
              <div className={`mt-2 text-sm font-medium ${runwayDiff >= 0 ? 'text-success' : 'text-error'}`}>
                {runwayDiff >= 0 ? '+' : ''}{runwayDiff} {t('dashboard:simulator.vsCurrent')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Goal Setting Modal */}
      <GoalSetting
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        existingGoal={editingGoal}
      />
    </div>
  );
}
