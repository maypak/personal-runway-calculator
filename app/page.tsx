'use client';

import ClientOnly from './components/ClientOnly';
import ScenarioManager from './components/ScenarioManager';
import DataExport from './components/DataExport';
import { useScenarioContext } from './contexts/ScenarioContext';

export default function Home() {
  return (
    <ClientOnly>
      <div className="min-h-screen bg-bg-primary transition-colors duration-200" suppressHydrationWarning>
        {/* Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-8 pb-12" suppressHydrationWarning>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Personal Runway Calculator</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Plan your financial runway with scenario-based projections
            </p>
          </div>

          {/* Scenario Manager */}
          <ScenarioManager />

          {/* Data Export - Phase 3 */}
          <div className="mt-8">
            <DataExport />
          </div>
        </main>
      </div>
    </ClientOnly>
  );
}
