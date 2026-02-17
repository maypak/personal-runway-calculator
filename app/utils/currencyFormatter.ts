/**
 * Currency Formatting Utility
 * 
 * Handles currency formatting with exchange rates for EN/KO locales
 * - EN: USD format ($10,000)
 * - KO: KRW format (₩13,000,000) with automatic conversion
 * - Fixed exchange rate: 1 USD = 1,300 KRW
 */

const EXCHANGE_RATE = 1300; // 1 USD = 1,300 KRW

export type CurrencyLocale = 'en' | 'ko';

/**
 * Format a number as currency based on locale
 * 
 * @param amount - The amount in USD (internal format)
 * @param locale - The target locale ('en' for USD, 'ko' for KRW)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(10000, 'en') // "$10,000"
 * formatCurrency(10000, 'ko') // "₩13,000,000"
 */
export function formatCurrency(
  amount: number | null | undefined,
  locale: CurrencyLocale = 'en'
): string {
  // Handle edge cases
  if (amount === null || amount === undefined) return '-';
  if (isNaN(amount)) return '-';
  
  // Handle negative values
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  if (locale === 'ko') {
    // Convert USD to KRW and format
    const krwAmount = Math.round(absAmount * EXCHANGE_RATE);
    const formatted = `₩${krwAmount.toLocaleString('ko-KR')}`;
    return isNegative ? `-${formatted}` : formatted;
  }
  
  // Format as USD (en locale)
  const formatted = `$${absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
  
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Parse currency input string to USD number (internal format)
 * 
 * @param input - User input string (e.g., "10,000", "₩13,000,000")
 * @param locale - The source locale of the input
 * @returns Parsed number in USD
 * 
 * @example
 * parseCurrencyInput("10,000", 'en') // 10000
 * parseCurrencyInput("₩13,000,000", 'ko') // 10000
 */
export function parseCurrencyInput(
  input: string,
  locale: CurrencyLocale = 'en'
): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = input.replace(/[^0-9.]/g, '');
  
  // Handle empty or invalid input
  if (!cleaned || cleaned === '.') return 0;
  
  const value = parseFloat(cleaned);
  
  // Handle NaN
  if (isNaN(value)) return 0;
  
  if (locale === 'ko') {
    // Convert KRW input to USD
    return value / EXCHANGE_RATE;
  }
  
  return value;
}

/**
 * Get currency symbol for locale
 * 
 * @param locale - The target locale
 * @returns Currency symbol
 */
export function getCurrencySymbol(locale: CurrencyLocale = 'en'): string {
  return locale === 'ko' ? '₩' : '$';
}

/**
 * Get currency code for locale
 * 
 * @param locale - The target locale
 * @returns Currency code (ISO 4217)
 */
export function getCurrencyCode(locale: CurrencyLocale = 'en'): string {
  return locale === 'ko' ? 'KRW' : 'USD';
}

/**
 * Get exchange rate information
 * 
 * @returns Exchange rate object
 */
export function getExchangeRate() {
  return {
    rate: EXCHANGE_RATE,
    from: 'USD',
    to: 'KRW',
    formatted: `1 USD = ${EXCHANGE_RATE.toLocaleString()} KRW`
  };
}
