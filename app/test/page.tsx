'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';

export default function TestPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [testData, setTestData] = useState<any>(null);
  const [testAmount, setTestAmount] = useState('1000');
  const [status, setStatus] = useState('');

  const testInsert = async () => {
    if (!user) {
      setStatus('❌ No user authenticated');
      return;
    }

    setStatus('⏳ Inserting test expense...');

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        category: 'Test',
        amount: parseFloat(testAmount),
        memo: 'Test expense from dashboard',
      })
      .select()
      .single();

    if (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Insert error:', error);
    } else {
      setStatus('✅ Successfully inserted!');
      setTestData(data);
      loadExpenses();
    }
  };

  const [expenses, setExpenses] = useState<any[]>([]);

  const loadExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Load error:', error);
    } else {
      setExpenses(data || []);
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (!error) {
      loadExpenses();
    }
  };

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading authentication...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            🧪 Supabase Connection Test
          </h1>

          {/* Auth Status */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold text-white">Authentication Status</h2>
              <button
                onClick={signOut}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Sign Out
              </button>
            </div>
            {user ? (
              <div className="text-green-400">
                ✅ Authenticated
                <div className="text-sm text-gray-300 mt-2">
                  <div>User ID: <code className="bg-black/30 px-2 py-1 rounded">{user.id}</code></div>
                  <div className="mt-1">Email: {user.email || 'No email'}</div>
                </div>
              </div>
            ) : (
              <div className="text-red-400">❌ Not authenticated</div>
            )}
          </div>

          {/* Test Insert */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Test Insert</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm text-gray-300 mb-2 block">Amount</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="1000"
                />
              </div>
              <button
                onClick={testInsert}
                disabled={!user}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Insert Test Expense
              </button>
            </div>
            {status && (
              <div className="mt-4 p-3 bg-black/30 rounded text-white">
                {status}
              </div>
            )}
            {testData && (
              <div className="mt-4 p-3 bg-black/30 rounded">
                <pre className="text-xs text-green-400 overflow-auto">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Expenses List */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Your Expenses</h2>
              <button
                onClick={loadExpenses}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                🔄 Reload
              </button>
            </div>
            {expenses.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No expenses yet. Try inserting a test expense above!
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <div className="text-white font-medium">
                        ${exp.amount} - {exp.category}
                      </div>
                      <div className="text-sm text-gray-400">
                        {exp.date} {exp.memo && `• ${exp.memo}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {exp.id}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-400">
              Total expenses: {expenses.length}
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
