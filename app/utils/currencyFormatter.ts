/**
 * Currency Formatting Utility
 * 
 * Handles currency formatting with NO exchange rate conversion
 * - All amounts stored as-is (no base currency)
 * - Display based on selected currency preference
 * - Language and currency are independent settings
 */

export type CurrencyCode = 'USD' | 'KRW' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'AUD' | 'CAD';

// Currency metadata
const CURRENCY_INFO: Record<CurrencyCode, {
  symbol: string;
  name: string;
  locale: string; // For number formatting
  decimals: number;
}> = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', decimals: 0 },
  KRW: { symbol: '₩', name: 'Korean Won', locale: 'ko-KR', decimals: 0 },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', decimals: 0 },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', decimals: 0 },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', decimals: 0 },
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', decimals: 0 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', decimals: 0 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', decimals: 0 },
};

/**
 * Format a number as currency
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(10000, 'USD') // "$10,000"
 * formatCurrency(10000, 'KRW') // "₩10,000"
 * formatCurrency(10000, 'EUR') // "€10,000"
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: CurrencyCode = 'USD'
): string {
  // Handle edge cases
  if (amount === null || amount === undefined) return '-';
  if (isNaN(amount)) return '-';
  
  const info = CURRENCY_INFO[currency] || CURRENCY_INFO.USD;
  
  // Handle negative values
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format the number
  const formatted = absAmount.toLocaleString(info.locale, {
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals
  });
  
  // Add symbol
  const result = `${info.symbol}${formatted}`;
  
  return isNegative ? `-${result}` : result;
}

/**
 * Parse currency input string to number
 * NO conversion - just parse the numeric value
 * 
 * @param input - User input string (e.g., "10,000", "€13,000")
 * @returns Parsed number
 * 
 * @example
 * parseCurrencyInput("10,000") // 10000
 * parseCurrencyInput("€13,000") // 13000
 */
export function parseCurrencyInput(input: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = input.replace(/[^0-9.-]/g, '');
  
  // Handle empty or invalid input
  if (!cleaned || cleaned === '.' || cleaned === '-') return 0;
  
  const value = parseFloat(cleaned);
  
  // Handle NaN
  if (isNaN(value)) return 0;
  
  return value;
}

/**
 * Get currency symbol
 * 
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: CurrencyCode = 'USD'): string {
  return CURRENCY_INFO[currency]?.symbol || '$';
}

/**
 * Get currency name
 * 
 * @param currency - The currency code
 * @returns Currency name
 */
export function getCurrencyName(currency: CurrencyCode = 'USD'): string {
  return CURRENCY_INFO[currency]?.name || 'US Dollar';
}

/**
 * Get all supported currencies
 * 
 * @returns Array of currency codes
 */
export function getSupportedCurrencies(): CurrencyCode[] {
  return Object.keys(CURRENCY_INFO) as CurrencyCode[];
}

/**
 * Get currency info for dropdown
 * 
 * @returns Array of {code, symbol, name} objects
 */
export function getCurrencyOptions() {
  return Object.entries(CURRENCY_INFO).map(([code, info]) => ({
    code: code as CurrencyCode,
    symbol: info.symbol,
    name: info.name,
    display: `${info.symbol} ${info.name} (${code})`
  }));
}
