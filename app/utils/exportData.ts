/**
 * Data Export Utility
 * GDPR Article 20 - Right to Data Portability
 * 
 * NOTE: Temporarily disabled during Supabase removal (Phase 1)
 * Will be re-implemented with LocalStorage in Phase 2
 */

// import { supabase } from '../lib/supabase'; // Removed during migration

interface ExportOptions {
  userId: string;
  format: 'csv' | 'json';
}

/**
 * Export all user data from all tables
 * STUB: Disabled during migration
 */
export async function exportAllData({ userId, format }: ExportOptions): Promise<void> {
  console.warn('⚠️ Export functionality is temporarily disabled during LocalStorage migration');
  throw new Error('Export functionality not available - will be restored in Phase 2');
}

/**
 * Download file
 * STUB: Disabled during migration
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  console.warn('⚠️ Download functionality is temporarily disabled during LocalStorage migration');
  throw new Error('Download functionality not available - will be restored in Phase 2');
}

/**
 * Convert to CSV
 * STUB: Disabled during migration
 */
export function convertToCSV(data: any[]): string {
  console.warn('⚠️ CSV conversion is temporarily disabled during LocalStorage migration');
  throw new Error('CSV conversion not available - will be restored in Phase 2');
}
