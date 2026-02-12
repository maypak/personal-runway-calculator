'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FinancialData, Expense, RecurringExpense } from '../types';

const defaultData: FinancialData = {
  startDate: new Date().toISOString().split('T')[0],
  currentSavings: 50000,
  lumpSum: 70000,
  monthlyIncome: 2000,
  incomeMonths: 6,
  monthlyFixed: 3000,
  monthlyVariable: 1000,
  monthlyBudget: 4000,
  expenses: [],
  recurringExpenses: []
};

export default function FinanceDashboard() {
  const [data, setData] = useLocalStorage<FinancialData>('financial-data', defaultData);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', memo: '' });
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

  // Auto-add recurring expenses monthly
  useEffect(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const lastProcessedMonth = localStorage.getItem('last-recurring-month');

    if (lastProcessedMonth !== currentMonth && data.recurringExpenses.length > 0) {
      // New month and has recurring expenses
      const newExpenses: Expense[] = data.recurringExpenses
        .filter(r => r.enabled)
        .map(r => ({
          id: `recurring-${Date.now()}-${r.id}`,
          amount: r.amount,
          category: r.category,
          memo: `${r.name} (auto)`,
          date: `${currentMonth}-${String(r.dayOfMonth).padStart(2, '0')}`
        }));

      if (newExpenses.length > 0) {
        setData({ 
          ...data, 
          expenses: [...newExpenses, ...data.expenses] 
        });
        localStorage.setItem('last-recurring-month', currentMonth);
      }
    }
  }, []);

  // Calculations
  const today = new Date();
  const startDate = new Date(data.startDate);
  const daysSince = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const totalIncome = data.currentSavings + data.lumpSum + (data.monthlyIncome * data.incomeMonths);
  
  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingFunds = totalIncome - totalExpenses;
  
  const monthlyExpense = data.monthlyFixed + data.monthlyVariable;
  const runway = Math.floor(remainingFunds / monthlyExpense);
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
  const thisMonthExpenses = data.expenses
    .filter(exp => exp.date.startsWith(thisMonth))
    .reduce((sum, exp) => sum + exp.amount, 0);
  const budgetUsagePercent = (thisMonthExpenses / data.monthlyBudget) * 100;

  // Total recurring expenses
  const totalRecurring = data.recurringExpenses
    .filter(r => r.enabled)
    .reduce((sum, r) => sum + r.amount, 0);

  const addExpense = () => {
    if (!newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      memo: newExpense.memo,
      date: new Date().toISOString().split('T')[0]
    };
    
    setData({ ...data, expenses: [expense, ...data.expenses] });
    setNewExpense({ amount: '', category: 'Food', memo: '' });
    setShowExpenseForm(false);
  };

  const addRecurring = () => {
    if (!newRecurring.name || !newRecurring.amount) return;

    const recurring: RecurringExpense = {
      id: Date.now().toString(),
      name: newRecurring.name,
      amount: parseFloat(newRecurring.amount),
      category: newRecurring.category,
      dayOfMonth: newRecurring.dayOfMonth,
      enabled: true
    };

    setData({ 
      ...data, 
      recurringExpenses: [...data.recurringExpenses, recurring] 
    });
    setNewRecurring({ name: '', amount: '', category: 'Fixed', dayOfMonth: 1 });
    setShowRecurringForm(false);
  };

  const toggleRecurring = (id: string) => {
    setData({
      ...data,
      recurringExpenses: data.recurringExpenses.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    });
  };

  const deleteRecurring = (id: string) => {
    setData({
      ...data,
      recurringExpenses: data.recurringExpenses.filter(r => r.id !== id)
    });
  };

  const deleteExpense = (id: string) => {
    setData({ ...data, expenses: data.expenses.filter(exp => exp.id !== id) });
  };

  const resetSimulator = () => {
    setSimMonthlyExpense(monthlyExpense);
    setSimAdditionalIncome(0);
    setSimOneTimeExpense(0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personal Runway Calculator
        </h1>
        <p className="text-sm text-gray-600 mt-1">Financial Freedom Tracker</p>
      </div>

      {/* Day Counter Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">Day {daysSince}</div>
          <div className="text-sm opacity-90">Since {data.startDate}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">Total Funds</div>
          <div className="text-2xl font-bold text-gray-900">${totalIncome.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">Runway</div>
          <div className="text-2xl font-bold text-blue-600">{runway}mo</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">This Month</div>
          <div className="text-2xl font-bold text-orange-600">${thisMonthExpenses.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-xs mb-1">Remaining</div>
          <div className="text-2xl font-bold text-green-600">${remainingFunds.toLocaleString()}</div>
        </div>
      </div>

      {/* Recurring Expenses */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 shadow-sm border-2 border-indigo-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📌</span>
              Recurring Expenses
            </h3>
            <p className="text-xs text-gray-600 mt-1">Auto-added monthly</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Total</div>
            <div className="text-lg font-bold text-indigo-600">${totalRecurring.toLocaleString()}</div>
          </div>
        </div>

        {/* Recurring list */}
        <div className="space-y-2 mb-4">
          {data.recurringExpenses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No recurring expenses. Add rent, subscriptions, etc.!
            </p>
          ) : (
            data.recurringExpenses.map((recurring) => (
              <div
                key={recurring.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  recurring.enabled 
                    ? 'bg-white border-2 border-indigo-200' 
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleRecurring(recurring.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      recurring.enabled 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {recurring.enabled ? '✓' : ''}
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{recurring.name}</div>
                    <div className="text-xs text-gray-500">
                      {recurring.dayOfMonth} of each month · {recurring.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900">${recurring.amount.toLocaleString()}</span>
                  <button
                    onClick={() => deleteRecurring(recurring.id)}
                    className="text-red-500 text-sm active:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowRecurringForm(!showRecurringForm)}
          className="w-full bg-indigo-500 text-white py-3 rounded-xl font-medium active:bg-indigo-600 transition-colors"
        >
          {showRecurringForm ? 'Cancel' : '+ Add Recurring Expense'}
        </button>

        {/* Add form */}
        {showRecurringForm && (
          <div className="mt-4 p-4 bg-white rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Name (e.g. Rent, Phone bill)"
              value={newRecurring.name}
              onChange={(e) => setNewRecurring({ ...newRecurring, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newRecurring.amount}
              onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={newRecurring.category}
                onChange={(e) => setNewRecurring({ ...newRecurring, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
              >
                <option>Fixed</option>
                <option>Subscription</option>
                <option>Utilities</option>
                <option>Insurance</option>
                <option>Other</option>
              </select>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Day"
                value={newRecurring.dayOfMonth}
                onChange={(e) => setNewRecurring({ ...newRecurring, dayOfMonth: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
              />
            </div>
            <button
              onClick={addRecurring}
              className="w-full bg-indigo-500 text-white py-3 rounded-xl font-medium active:bg-indigo-600 transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Runway Simulator */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 shadow-sm border-2 border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🎮</span>
            Runway Simulator
          </h3>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="text-purple-600 text-sm font-medium"
          >
            {showSimulator ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {showSimulator && (
          <div className="space-y-5">
            {/* Monthly expense */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">💸 Monthly Expense</label>
                <span className="text-lg font-bold text-gray-900">${simMonthlyExpense.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                value={simMonthlyExpense}
                onChange={(e) => setSimMonthlyExpense(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1K</span>
                <span className="text-purple-600 font-medium">
                  Current {simMonthlyExpense > monthlyExpense ? '+' : ''}{(simMonthlyExpense - monthlyExpense).toLocaleString()}
                </span>
                <span>$10K</span>
              </div>
            </div>

            {/* Additional income */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">💰 Additional Income (mo)</label>
                <span className="text-lg font-bold text-green-600">+${simAdditionalIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={simAdditionalIncome}
                onChange={(e) => setSimAdditionalIncome(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span className="text-green-600 font-medium">
                  {simAdditionalIncome > 0 && `Freelance/Side gig`}
                </span>
                <span>$10K</span>
              </div>
            </div>

            {/* One-time expense */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">🔥 One-time Expense</label>
                <span className="text-lg font-bold text-red-600">-${simOneTimeExpense.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={simOneTimeExpense}
                onChange={(e) => setSimOneTimeExpense(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span className="text-red-600 font-medium">
                  {simOneTimeExpense > 0 && `Trip/Emergency`}
                </span>
                <span>$50K</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl p-4 mt-4">
              <div className="text-center mb-3">
                <div className="text-sm text-gray-500 mb-1">Simulation Result</div>
                <div className="text-4xl font-bold text-purple-600">
                  {simRunway > 99 ? '∞' : `${simRunway}mo`}
                </div>
                {simRunway <= 99 && (
                  <div className="text-sm text-gray-600 mt-1">
                    (≈ {simRunwayYears}y {simRunwayMonths}mo)
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-sm text-gray-600">vs. current</span>
                <span className={`text-xl font-bold ${
                  runwayDiff > 0 ? 'text-green-600' : runwayDiff < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {runwayDiff > 0 ? '+' : ''}{runwayDiff > 99 ? '∞' : runwayDiff}mo
                </span>
                <span className="text-2xl">
                  {runwayDiff > 0 ? '📈' : runwayDiff < 0 ? '📉' : '➡️'}
                </span>
              </div>

              {/* Details */}
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining funds</span>
                  <span className="font-medium text-gray-900">${simRemainingFunds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net monthly expense</span>
                  <span className="font-medium text-gray-900">${simNetMonthlyExpense.toLocaleString()}</span>
                </div>
                {simAdditionalIncome > 0 && (
                  <div className="bg-green-50 rounded-lg p-2 mt-2">
                    <p className="text-xs text-green-700">
                      💡 Additional income reduces net monthly expense to ${simNetMonthlyExpense.toLocaleString()}!
                    </p>
                  </div>
                )}
                {simOneTimeExpense > 0 && (
                  <div className="bg-orange-50 rounded-lg p-2 mt-2">
                    <p className="text-xs text-orange-700">
                      ⚠️ One-time expense reduces available funds by ${simOneTimeExpense.toLocaleString()}.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={resetSimulator}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-medium active:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900">This Month Budget</h3>
          <span className="text-sm font-medium text-gray-600">
            ${thisMonthExpenses.toLocaleString()} / ${data.monthlyBudget.toLocaleString()}
          </span>
        </div>
        
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all rounded-full ${
              budgetUsagePercent > 100 ? 'bg-red-500' :
              budgetUsagePercent > 80 ? 'bg-orange-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
          />
        </div>
        
        <div className="text-right">
          <span className={`text-sm font-bold ${
            budgetUsagePercent > 100 ? 'text-red-600' :
            budgetUsagePercent > 80 ? 'text-orange-600' : 'text-blue-600'
          }`}>
            {budgetUsagePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Recent Expenses</h3>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium active:bg-blue-600 transition-colors"
          >
            {showExpenseForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showExpenseForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-xl space-y-3">
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Living</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
            <input
              type="text"
              placeholder="Memo (optional)"
              value={newExpense.memo}
              onChange={(e) => setNewExpense({ ...newExpense, memo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base"
            />
            <button
              onClick={addExpense}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium active:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        )}

        <div className="space-y-2">
          {data.expenses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No expenses yet</p>
          ) : (
            data.expenses.slice(0, 10).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{expense.category}</span>
                    <span className="text-xs text-gray-400">{expense.date}</span>
                    {expense.memo?.includes('(auto)') && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">auto</span>
                    )}
                  </div>
                  {expense.memo && (
                    <p className="text-sm text-gray-500">{expense.memo}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900">${expense.amount.toLocaleString()}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-500 text-sm active:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Runway Detail */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Runway Breakdown</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">💰 Current Savings</span>
            <span className="font-bold text-gray-900">+${data.currentSavings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">🎁 Lump Sum</span>
            <span className="font-bold text-gray-900">+${data.lumpSum.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">💵 Income ({data.incomeMonths}mo)</span>
            <span className="font-bold text-gray-900">+${(data.monthlyIncome * data.incomeMonths).toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-900">Total Available</span>
            <span className="font-bold text-blue-600">${totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-500">Total Spent</span>
            <span className="font-bold text-red-600">-${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-900">Remaining</span>
            <span className="font-bold text-green-600">${remainingFunds.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-600">💳 Monthly Fixed</span>
            <span className="text-gray-900">${data.monthlyFixed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">🍔 Monthly Variable</span>
            <span className="text-gray-900">${data.monthlyVariable.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-900">Monthly Expense</span>
            <span className="font-bold text-orange-600">${monthlyExpense.toLocaleString()}</span>
          </div>
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between text-lg">
            <span className="font-bold text-gray-900">Expected Runway</span>
            <span className="font-bold text-purple-600">
              {runway}mo (≈ {runwayYears}y {runwayMonths}mo)
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Built with ❤️ by someone who&apos;s been there.</p>
      </div>
    </div>
  );
}
