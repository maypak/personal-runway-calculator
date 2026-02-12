'use client';

import ClientOnly from './components/ClientOnly';
import FinanceDashboard from './components/FinanceDashboard';

export default function Home() {
  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Content Area */}
        <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
          <FinanceDashboard />
        </main>
      </div>
    </ClientOnly>
  );
}
