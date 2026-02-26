/**
 * tracking.ts - Analytics Event Tracking
 * 
 * Purpose: Track user actions for analytics
 * Note: Uses gtag if available (Google Analytics)
 * 
 * Created: 2026-02-26 (P1 Features)
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, unknown>
    ) => void;
  }
}

export function trackShare(method: 'kakao' | 'twitter' | 'link' | 'email') {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'share', {
      method,
      content_type: 'runway_result',
    });
  }

  // Console log for development
  console.log(`📊 Share tracked: ${method}`);
}

export function trackCustomScenario(action: 'add' | 'edit' | 'delete', scenarioType: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'custom_scenario', {
      action,
      scenario_type: scenarioType,
    });
  }

  console.log(`📊 Custom scenario ${action}: ${scenarioType}`);
}

export function trackDataExport(format: 'csv' | 'json') {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'data_export', {
      format,
    });
  }

  console.log(`📊 Data export: ${format}`);
}
