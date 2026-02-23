'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientOnly from './components/ClientOnly';
import { useRunwayStore } from '../lib/stores/runwayStore';

export default function Home() {
  const router = useRouter();
  const { getBasicData, hydrated } = useRunwayStore();
  
  useEffect(() => {
    if (hydrated) {
      const basicData = getBasicData();
      
      // Redirect based on data presence
      if (basicData) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [hydrated, getBasicData, router]);
  
  // Loading screen while checking
  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">로딩 중...</p>
        </div>
      </div>
    </ClientOnly>
  );
}
