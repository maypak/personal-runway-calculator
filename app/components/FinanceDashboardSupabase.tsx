'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseFinance } from '../hooks/useSupabaseFinance';
import { useTheme } from '../hooks/useTheme';

export default function FinanceDashboardSupabase() {
  const { user, signOut } = useAuth();
  const { theme, setTheme, allThemes, accent, classes } = useTheme();
  const {
    settings,
    expenses,
    recurringExpenses,
    loading,
    updateSettings,
    addExpense,
    deleteExpense,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
  } = useSupabaseFinance();

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const [newExpense, setNewExpense] = useState({ 
    amount: '', 
    category: 'Food', 
    memo: '' 
  });
  
  const [newRecurring, setNewRecurring] = useState({ 
    name: '', 
    amount: '', 
    category: 'Fixed', 
    dayOfMonth: 1 
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

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading your data...</div>
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

  // Total recurring expenses
  const totalRecurring = recurringExpenses
    .filter(r => r.enabled)
    .reduce((sum, r) => sum + r.amount, 0);

  const handleAddExpense = async () => {
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert('Please enter a valid amount');
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

  const handleAddRecurring = async () => {
    if (!newRecurring.name || !newRecurring.amount || parseFloat(newRecurring.amount) <= 0) {
      alert('Please fill in all fields');
      return;
    }

    await addRecurringExpense({
      name: newRecurring.name,
      amount: parseFloat(newRecurring.amount),
      category: newRecurring.category,
      dayOfMonth: newRecurring.dayOfMonth,
      enabled: true,
    });

    setNewRecurring({ name: '', amount: '', category: 'Fixed', dayOfMonth: 1 });
    setShowRecurringForm(false);
  };

  const categories = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">💰 Personal Runway</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className={`px-3 py-2 md:px-4 ${classes.bg600} ${classes.bgHover} text-white rounded-lg text-sm transition`}
              title="Change theme"
            >
              🎨
            </button>
            
            {showThemePicker && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 min-w-[160px]">
                <div className="text-xs font-semibold text-gray-700 mb-2">Choose Theme</div>
                <div className="space-y-2">
                  {allThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        theme === t.id
                          ? `${classes.bg600} text-white`
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 md:px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm transition"
          >
            ⚙️
          </button>
          <button
            onClick={signOut}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900">Financial Settings</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Savings ($)
              </label>
              <input
                type="number"
                value={settings.currentSavings}
                onChange={(e) => updateSettings({ ...settings, currentSavings: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lump Sum ($)
              </label>
              <input
                type="number"
                value={settings.lumpSum}
                onChange={(e) => updateSettings({ ...settings, lumpSum: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income ($)
              </label>
              <input
                type="number"
                value={settings.monthlyIncome}
                onChange={(e) => updateSettings({ ...settings, monthlyIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Months
              </label>
              <input
                type="number"
                value={settings.incomeMonths}
                onChange={(e) => updateSettings({ ...settings, incomeMonths: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Fixed ($)
              </label>
              <input
                type="number"
                value={settings.monthlyFixed}
                onChange={(e) => updateSettings({ ...settings, monthlyFixed: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Variable ($)
              </label>
              <input
                type="number"
                value={settings.monthlyVariable}
                onChange={(e) => updateSettings({ ...settings, monthlyVariable: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => updateSettings({ ...settings, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-gray-900 rounded"
          >
            Done
          </button>
        </div>
      )}

      {/* Runway Display - Enhanced */}
      <div className={`${classes.bgLight} rounded-2xl shadow-xl p-6 md:p-8 border-2 ${classes.border200}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">Your Financial Runway</h2>
          <span className="text-4xl">
            {runway > 24 ? '🛡️' : runway > 12 ? '⚠️' : '🚨'}
          </span>
        </div>
        
        {/* Main Number */}
        <div className="text-center mb-6">
          <div className="text-4xl md:text-6xl font-bold text-gray-900 mb-3 tabular-nums">
            {runwayYears > 0 && (
              <span>
                {runwayYears}
                <span className="text-3xl text-gray-500">yr</span>
                {' '}
              </span>
            )}
            {runwayMonths}
            <span className="text-3xl text-gray-500">mo</span>
          </div>
          
          {/* Emotional Message */}
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {runway > 24 
              ? '💚 You\'re in great shape! Feel free to take new risks.' 
              : runway > 12 
              ? '💙 Looking solid. You\'re on the right track.'
              : runway > 6
              ? '💛 Getting tight. Consider cutting expenses.'
              : '❤️ Needs attention. Boost income or reduce spending.'}
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${
                runway > 24 ? 'bg-green-500' : 
                runway > 12 ? 'bg-blue-500' : 
                runway > 6 ? 'bg-yellow-500' : 'bg-red-500'
              } rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min((runway / 36) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0mo</span>
            <span className="font-medium">36mo (3yr goal)</span>
          </div>
        </div>
        
        {/* Details */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xs md:text-sm text-gray-500">Available</div>
            <div className="text-base md:text-lg font-semibold text-green-600">
              ${remainingFunds.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs md:text-sm text-gray-500">Monthly</div>
            <div className="text-base md:text-lg font-semibold text-red-600">
              ${monthlyExpense.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs md:text-sm text-gray-500">Daily burn</div>
            <div className="text-base md:text-lg font-semibold text-gray-700">
              ${Math.round(monthlyExpense / 30).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-gray-600">Total Income</div>
            <span className="text-xl md:text-2xl">💰</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            ${totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-gray-600">Total Spent</div>
            <span className="text-xl md:text-2xl">💸</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs md:text-sm text-gray-600">Days Since Start</div>
            <span className="text-xl md:text-2xl">📅</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {daysSince}
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm md:text-base font-semibold text-gray-700">
            This Month's Budget
          </span>
          <span className="text-xs md:text-sm font-medium text-gray-600">
            ${thisMonthExpenses.toLocaleString()} / ${monthlyBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              budgetUsagePercent >= 100
                ? 'bg-red-600'
                : budgetUsagePercent >= 80
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {budgetUsagePercent.toFixed(0)}% used
          </span>
          <span className={`text-xs font-semibold ${
            budgetUsagePercent >= 100 ? 'text-red-600' :
            budgetUsagePercent >= 80 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {budgetUsagePercent >= 100 ? 'Over budget!' :
             budgetUsagePercent >= 80 ? 'Almost spent' : 'Looking good'}
          </span>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className={`px-3 py-2 md:px-4 ${classes.bg600} ${classes.bgHover} text-white rounded-lg text-sm font-semibold transform active:scale-95 transition-all shadow-md hover:shadow-lg`}
          >
            <span className="hidden sm:inline">+ Add Expense</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        </div>

        {showExpenseForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Amount ($)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Memo (optional)"
              value={newExpense.memo}
              onChange={(e) => setNewExpense({ ...newExpense, memo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transform active:scale-95 transition-all"
              >
                Add
              </button>
              <button
                onClick={() => setShowExpenseForm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {expenses.slice(0, 10).map((exp) => (
            <div key={exp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <div className="text-sm md:text-base font-semibold text-gray-900">${exp.amount} - {exp.category}</div>
                <div className="text-xs md:text-sm text-gray-600">
                  {exp.date} {exp.memo && `• ${exp.memo}`}
                </div>
              </div>
              <button
                onClick={() => deleteExpense(exp.id)}
                className="w-full sm:w-auto px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs md:text-sm font-medium transform active:scale-95 transition-all"
              >
                Delete
              </button>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No expenses yet. Add your first expense above!
            </div>
          )}
        </div>
      </div>

      {/* Runway Simulator */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full flex justify-between items-center text-lg font-semibold mb-4"
        >
          <span>🎲 Runway Simulator</span>
          <span className="text-2xl">{showSimulator ? '▼' : '▶'}</span>
        </button>

        {showSimulator && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Expense: ${simMonthlyExpense}
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
              <label className="block text-sm font-medium mb-2">
                Additional Monthly Income: ${simAdditionalIncome}
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
              <label className="block text-sm font-medium mb-2">
                One-time Expense: ${simOneTimeExpense}
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

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-2">Simulated Runway</div>
              <div className="text-4xl font-bold text-blue-600">
                {simRunwayYears > 0 && `${simRunwayYears}y `}
                {simRunwayMonths}m
              </div>
              <div className={`mt-2 text-sm font-medium ${runwayDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {runwayDiff >= 0 ? '+' : ''}{runwayDiff} months vs current
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
