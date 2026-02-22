/**
 * Phase Planning Page - Temporarily Hidden
 * 
 * Purpose: Redirect to dashboard (feature under development)
 * Route: /phases
 * 
 * Updated: 2026-02-22
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PhasesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
