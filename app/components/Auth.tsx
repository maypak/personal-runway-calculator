'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;
        setMessage('✅ Check your email for confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage('✅ Signed in successfully!');
        onSuccess();
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 md:p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Hero Section */}
          <div className="text-center md:text-left px-6 md:px-4 order-2 md:order-1">
            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-105 transition-transform">
                💰
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Personal Runway</h1>
                <p className="text-sm text-gray-600">Financial Freedom Tracker</p>
              </div>
            </div>
            
            {/* Hero Message */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Know exactly how long you can{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                survive without a job
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Built by an engineer who quit after 10 years. Track your savings, expenses, 
              and know exactly when you can make your move.
            </p>
            
            {/* Social Proof */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 max-w-md mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🔒</span>
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">☁️</span>
                </div>
                <span className="font-medium">Cloud Sync</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🚀</span>
                </div>
                <span className="font-medium">100% Free</span>
              </div>
            </div>

            {/* Feature Preview (optional, hidden on mobile) */}
            <div className="hidden md:block mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                  23
                </div>
                <div>
                  <div className="text-sm text-gray-600">Your Runway</div>
                  <div className="text-lg font-bold text-gray-900">23 months</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💙 안정적이에요. 계획대로 가고 있습니다.</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'signin' ? 'Welcome back' : 'Get started'}
                </h3>
                <p className="text-gray-600">
                  {mode === 'signin' 
                    ? 'Sign in to check your runway' 
                    : 'Create your free account'}
                </p>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all transform active:scale-95 ${
                    mode === 'signin'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all transform active:scale-95 ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all transform active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                  message.startsWith('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                {mode === 'signup' ? (
                  <p>By signing up, your data is stored securely with Supabase</p>
                ) : (
                  <p>Don&apos;t have an account? Click <strong>Sign Up</strong> above</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
