/**
 * Error handling utilities with locale context
 * 
 * Purpose: Track errors with user locale for Korean market debugging
 * 
 * Usage:
 *   try {
 *     // risky operation
 *   } catch (error) {
 *     logError(error as Error, { component: 'Dashboard' });
 *   }
 */

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Get current locale from localStorage
 * This matches the I18nContext implementation
 */
function getLocale(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('preferredLocale') || navigator.language || 'en';
}

/**
 * Log an error with locale and context information
 * 
 * Sends to:
 * 1. Console (always)
 * 2. Sentry (if configured)
 * 3. Vercel Analytics (if available)
 * 
 * @param error - The error object
 * @param context - Additional context about where/why the error occurred
 */
export function logError(error: Error, context?: ErrorContext): void {
  const locale = getLocale();
  const timestamp = new Date().toISOString();
  
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    locale,
    timestamp,
    ...context,
  };

  // 1. Console logging (always available)
  console.error('Error logged:', errorData);

  // 2. Send to Sentry if available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      extra: errorData,
      tags: {
        locale,
        component: context?.component,
      },
    });
  }

  // 3. Send to Vercel Analytics as event
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', 'error_occurred', {
      error_name: error.name,
      error_message: error.message,
      locale,
      component: context?.component,
      action: context?.action,
    });
  }
}

/**
 * Log a warning (non-critical issue)
 * 
 * @param message - Warning message
 * @param context - Additional context
 */
export function logWarning(message: string, context?: ErrorContext): void {
  const locale = getLocale();
  const timestamp = new Date().toISOString();
  
  console.warn('Warning:', message, {
    locale,
    timestamp,
    ...context,
  });

  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', 'warning_logged', {
      message,
      locale,
      ...context,
    });
  }
}

/**
 * Create an error boundary fallback with locale-aware error logging
 * 
 * @param error - The error that was caught
 * @param errorInfo - React error info with component stack
 */
export function logReactError(error: Error, errorInfo: { componentStack?: string | null }): void {
  logError(error, {
    component: 'ErrorBoundary',
    componentStack: errorInfo.componentStack || undefined,
  });
}

/**
 * Log a network error with request details
 * 
 * @param error - The error object
 * @param url - The URL that failed
 * @param method - HTTP method (GET, POST, etc.)
 */
export function logNetworkError(error: Error, url: string, method: string = 'GET'): void {
  logError(error, {
    component: 'Network',
    action: `${method} ${url}`,
    url,
    method,
  });
}

/**
 * Type guard to check if error is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safe error message extraction
 * Handles Error objects, strings, and unknown types
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}
