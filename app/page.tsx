'use client';

import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import ClientOnly from './components/ClientOnly';
import FinanceDashboardSupabase from './components/FinanceDashboardSupabase';
import SkeletonLoader from './components/SkeletonLoader';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={() => window.location.reload()} />;
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-bg-primary transition-colors duration-200" suppressHydrationWarning>
        {/* Content Area */}
        <main className="max-w-4xl mx-auto px-4 py-8 pb-12" suppressHydrationWarning>
          <FinanceDashboardSupabase />
        </main>
      </div>
    </ClientOnly>
  );
}
