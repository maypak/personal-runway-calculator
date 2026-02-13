'use client';

import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Auth from './components/Auth';
import ClientOnly from './components/ClientOnly';
import FinanceDashboardSupabase from './components/FinanceDashboardSupabase';

export default function Home() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  // 테마별 배경색 명시적 매핑 (Tailwind 동적 클래스 문제 해결)
  const bgClasses = {
    whiteBlue: 'bg-white',
    whiteBlack: 'bg-gray-50',
    skyGreen: 'bg-sky-50',
    mint: 'bg-emerald-50',
    purple: 'bg-purple-50',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={() => window.location.reload()} />;
  }

  return (
    <ClientOnly>
      <div key={theme} className={`min-h-screen transition-colors duration-300 ${bgClasses[theme]}`}>
        {/* Content Area */}
        <main className="max-w-4xl mx-auto px-4 py-8 pb-12">
          <FinanceDashboardSupabase />
        </main>
      </div>
    </ClientOnly>
  );
}
