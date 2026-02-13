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
            {/* Logo with Clock Animation */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-6">
                <span className="relative z-10">⏱️</span>
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-blue-400 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Personal Runway</h1>
                <p className="text-sm text-gray-600">Financial Freedom Tracker</p>
              </div>
            </div>
            
            {/* Hero Message */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your money isn&apos;t just money.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent animate-pulse">
                It&apos;s TIME.
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              How much <strong className="text-blue-600">time</strong> do you have to chase your dream? Build your startup? Find yourself?
            </p>
            
            <p className="text-base text-gray-700 mb-8 font-medium">
              Calculate your <span className="text-blue-600 font-bold">TIME</span> in 30 seconds. ⏰
            </p>
            
            {/* Social Proof - Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 max-w-md mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                  </svg>
                </div>
                <span className="font-medium">Cloud Sync</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </div>
                <span className="font-medium">100% Free</span>
              </div>
            </div>

            {/* Feature Preview with Timer Animation */}
            <div className="hidden md:block mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  2yr
                  {/* Tick mark animation */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Your TIME</div>
                  <div className="text-lg font-bold text-gray-900">24 months</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💙 Looking good! You&apos;re on track.</p>
            </div>
          </div>

          {/* Auth Card - Enhanced */}
          <div className="order-1 md:order-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 p-6 md:p-8 max-w-md mx-auto hover:shadow-3xl transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'signin' ? 'Welcome back' : 'Get started'}
                </h3>
                <p className="text-gray-600">
                  {mode === 'signin' 
                    ? 'Sign in to check your TIME ⏱️' 
                    : 'Create your free account 🚀'}
                </p>
              </div>

              {/* Mode Toggle - Enhanced */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform ${
                    mode === 'signin'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 hover:border-blue-400"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 hover:border-blue-400"
                    placeholder="••••••••"
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:scale-100"
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
                    mode === 'signin' ? 'Sign In →' : 'Create Account →'
                  )}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center transition-all duration-300 ${
                  message.startsWith('✅') 
                    ? 'bg-green-50 text-green-700 border-2 border-green-200 animate-pulse' 
                    : 'bg-red-50 text-red-700 border-2 border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                {mode === 'signup' ? (
                  <p>By signing up, your data is stored securely with Supabase 🔒</p>
                ) : (
                  <p>Don&apos;t have an account? Click <strong className="text-blue-600">Sign Up</strong> above</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
