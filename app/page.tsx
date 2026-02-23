'use client';

import ClientOnly from './components/ClientOnly';

export default function Home() {
  return (
    <ClientOnly>
      <div className="min-h-screen bg-bg-primary transition-colors duration-200" suppressHydrationWarning>
        {/* Content Area */}
        <main className="max-w-4xl mx-auto px-4 py-8 pb-12" suppressHydrationWarning>
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Personal Runway Calculator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Migration in progress - LocalStorage implementation coming soon
            </p>
          </div>
        </main>
      </div>
    </ClientOnly>
  );
}
