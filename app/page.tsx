'use client';

import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Auth from './components/Auth';
import ClientOnly from './components/ClientOnly';
import FinanceDashboardSupabase from './components/FinanceDashboardSupabase';

export default function Home() {
  const { user, loading } = useAuth();
  const { gradient, theme } = useTheme(); // theme 추가로 리렌더 트리거

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
      <div key={theme} className={`min-h-screen ${gradient}`}>
        {/* Content Area */}
        <main className="max-w-4xl mx-auto px-4 py-8 pb-12">
          <FinanceDashboardSupabase />
        </main>
      </div>
    </ClientOnly>
  );
}
