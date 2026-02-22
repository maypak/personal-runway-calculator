/**
 * Analytics tracking utilities for Vercel Analytics
 * 
 * Purpose: Track Korean user onboarding funnel for market launch
 * 
 * Funnel steps:
 * 1. dashboard_arrived - User lands on dashboard
 * 2. savings_entered - User enters their savings amount
 * 3. expense_added - User adds at least one expense
 * 4. runway_calculated - Runway is successfully calculated
 * 
 * Success metric: (runway_calculated / dashboard_arrived) * 100%
 */

/**
 * Send a custom event to Vercel Analytics
 * 
 * @param eventName - Name of the event (e.g., 'onboarding_step')
 * @param properties - Additional properties to track with the event
 */
export function trackEvent(
  eventName: string, 
  properties?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track onboarding funnel steps
 * 
 * Use this in components to track user progress through onboarding.
 * 
 * @param step - One of: 'dashboard_arrived' | 'savings_entered' | 'expense_added' | 'runway_calculated'
 */
export function trackOnboardingStep(
  step: 'dashboard_arrived' | 'savings_entered' | 'expense_added' | 'runway_calculated'
): void {
  trackEvent('onboarding_step', { step });
}

/**
 * Track feature usage
 * 
 * @param feature - Feature name (e.g., 'fire_calculator', 'scenario_comparison')
 */
export function trackFeatureUsage(feature: string): void {
  trackEvent('feature_used', { feature });
}

/**
 * Track user actions
 * 
 * @param action - Action name (e.g., 'export_csv', 'share_link')
 * @param context - Additional context about the action
 */
export function trackAction(action: string, context?: Record<string, any>): void {
  trackEvent('user_action', { action, ...context });
}

// Type augmentation for window.va
declare global {
  interface Window {
    va?: (event: string, name: string, properties?: Record<string, any>) => void;
  }
}
