/**
 * FIRE Calculator Page
 * 
 * Purpose: Standalone page for FIRE calculator
 * Route: /fire
 * Features:
 * - Full FIRE dashboard with all components
 * - Requires authentication
 * - Mobile responsive
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nContext';
import Auth from '../components/Auth';
import ClientOnly from '../components/ClientOnly';
import FIREDashboard from '../components/FIREDashboard';
import SkeletonLoader from '../components/SkeletonLoader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FIREPage() {
  const { user, loading } = useAuth();
  const { t } = useI18n();

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
      <div className="min-h-screen bg-bg-primary transition-colors duration-200">
        {/* Main Content - Accessibility Landmark */}
        <main 
          role="main" 
          aria-label="FIRE Calculator Dashboard"
          className="max-w-4xl mx-auto px-4 py-8 pb-12"
        >
          {/* Back button */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 
                       hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('phases:page.backToDashboard')}
            </Link>
          </div>

          {/* FIRE Dashboard */}
          <FIREDashboard />
        </main>
      </div>
    </ClientOnly>
  );
}
