'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, CheckCircle, XCircle, Shield, Cloud, Sparkles, Wallet } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Auth({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 12) return 'Password must be at least 12 characters';
    if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter';
    if (!/[0-9]/.test(pw)) return 'Password must include a number';
    if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include a special character';
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const pwError = validatePassword(password);
        if (pwError) {
          setMessage({ type: 'error', text: pwError });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;
        setMessage({ type: 'success', text: t('auth:messages.confirmEmail') });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage({ type: 'success', text: t('auth:messages.signedIn') });
        onSuccess();
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : t('auth:messages.error');
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
          skipBrowserRedirect: false,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      const text = error instanceof Error ? error.message : t('auth:messages.error');
      setMessage({ type: 'error', text });
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
      });

      if (error) throw error;
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent! Check your inbox.' 
      });
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Failed to send reset email';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-tertiary flex items-center justify-center p-6 md:p-4">
      {/* Language Switcher - Fixed Position (avoids beta banner) */}
      <div className="fixed top-24 right-4 md:top-20 md:right-6 z-40">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Hero Section */}
          <div className="text-center md:text-left px-6 md:px-4 order-2 md:order-1">
            {/* Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-6">
                <Clock className="w-8 h-8 text-white relative z-10" />
                <div className="absolute inset-0 bg-primary-light rounded-2xl animate-ping opacity-20"></div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-text-primary">{t('auth:hero.logo')}</h1>
                <p className="text-sm text-text-tertiary">{t('auth:hero.subtitle')}</p>
              </div>
            </div>
            
            {/* Hero Message */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
              {t('auth:hero.title')}
            </h2>
            
            <p className="text-base md:text-lg text-text-secondary mb-8 leading-relaxed">
              {t('auth:hero.description')}
            </p>
            
            <p className="text-base text-text-primary mb-8 font-medium flex items-center justify-center md:justify-start gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t('auth:hero.cta')}
            </p>
            
            {/* Social Proof */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-text-secondary max-w-md mx-auto md:mx-0">
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <span className="font-medium">{t('auth:hero.features.secure')}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cloud className="w-5 h-5 text-info" />
                </div>
                <span className="font-medium">{t('auth:hero.features.cloud')}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{t('auth:hero.features.free')}</span>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="hidden md:block mt-12 p-6 bg-surface-card rounded-2xl shadow-lg border border-border-subtle hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  2yr
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <div className="text-sm text-text-tertiary">{t('auth:hero.preview.label')}</div>
                  <div className="text-lg font-bold text-text-primary">24 {t('auth:hero.preview.months')}</div>
                </div>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-hover h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs text-text-tertiary mt-2 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-info" />
                {t('auth:hero.preview.status')}
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="order-1 md:order-2">
            <div className="bg-surface-card rounded-2xl shadow-xl border border-border-subtle p-6 md:p-8 max-w-md mx-auto hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  {mode === 'reset' ? 'Reset Password' : mode === 'signin' ? t('auth:card.welcomeBack') : t('auth:card.getStarted')}
                </h3>
                <p className="text-text-tertiary">
                  {mode === 'reset' ? 'Enter your email to receive a password reset link' : mode === 'signin' ? t('auth:card.signInSubtitle') : t('auth:card.signUpSubtitle')}
                </p>
              </div>

              {/* Mode Toggle */}
              {mode !== 'reset' && <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    mode === 'signin'
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-md scale-105'
                      : 'bg-surface-hover text-text-secondary hover:bg-surface-active'
                  }`}
                >
                  {t('auth:card.signIn')}
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-md scale-105'
                      : 'bg-surface-hover text-text-secondary hover:bg-surface-active'
                  }`}
                >
                  {t('auth:card.signUp')}
                </button>
              </div>}

              {/* Social Login Buttons */}
              {mode !== 'reset' && <div className="space-y-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-surface-card border-2 border-border-default hover:border-border-strong rounded-lg font-semibold text-text-primary transition-all duration-200 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('auth:social.continueWithGoogle')}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg font-semibold transition-all duration-200 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                  {t('auth:social.continueWithGithub')}
                </button>
              </div>}

              {/* Divider */}
              {mode !== 'reset' && <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-surface-card text-text-tertiary font-medium">{t('auth:social.divider')}</span>
                </div>
              </div>}

              <form onSubmit={mode === 'reset' ? handlePasswordReset : handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    {t('auth:form.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-border-default rounded-lg
                      bg-surface-card text-base text-text-primary placeholder:text-text-tertiary
                      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                      transition-all duration-200 hover:border-border-strong"
                    placeholder={t('auth:form.emailPlaceholder')}
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-text-secondary">
                        {t('auth:form.password')}
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setMode('reset')}
                          className="text-xs text-primary hover:text-primary-hover transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={12}
                      className="w-full px-4 py-3 border-2 border-border-default rounded-lg
                        bg-surface-card text-base text-text-primary placeholder:text-text-tertiary
                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                        transition-all duration-200 hover:border-border-strong"
                      placeholder={t('auth:form.passwordPlaceholder')}
                    />
                    {mode === 'signup' && (
                      <p className="text-xs text-text-tertiary mt-2">{t('auth:form.passwordHint')}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3
                    bg-gradient-to-r from-primary to-primary-hover
                    hover:from-primary-hover hover:to-primary-active
                    disabled:from-text-disabled disabled:to-text-disabled
                    text-white font-semibold rounded-lg
                    transition-all duration-200 active:scale-98
                    shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('auth:form.loading')}
                    </span>
                  ) : mode === 'reset' ? (
                    'Send Reset Link →'
                  ) : (
                    mode === 'signin' ? t('auth:form.signInButton') : t('auth:form.signUpButton')
                  )}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 ${
                  message.type === 'success'
                    ? 'bg-success/10 text-success border-2 border-success/20' 
                    : 'bg-error/10 text-error border-2 border-error/20'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-text-tertiary space-y-2">
                {mode === 'reset' ? (
                  <p>
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      ← Back to sign in
                    </button>
                  </p>
                ) : mode === 'signup' ? (
                  <p className="flex items-center justify-center gap-1">
                    <Shield className="w-4 h-4" />
                    {t('auth:footer.privacy')}
                  </p>
                ) : (
                  <p>{t('auth:footer.switchMode')}</p>
                )}
                {mode !== 'reset' && (
                  <p>
                    <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
