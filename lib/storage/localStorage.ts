/**
 * localStorage.ts - Export/Import Utilities
 * 
 * Purpose: JSON export/import for data portability
 * Pattern: Standard JSON serialization
 * 
 * Features:
 * - Export all data to JSON file
 * - Import and validate JSON data
 * - Backup/restore functionality
 * 
 * Created: 2026-02-23 (Phase 2: LocalStorage Migration)
 * Author: Developer Agent (Subagent)
 * 
 * NOTE: Full implementation in Phase 3
 * This file provides basic structure for now
 */

import type { Scenario } from '../../app/types';

/**
 * Export data structure (matches RunwayData from store)
 */
export interface ExportData {
  balance: number;
  monthlyExpenses: number;
  income: {
    monthly: number;
    isVariable: boolean;
  };
  scenarios: Scenario[];
  activeScenarioId: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  
  // Export metadata
  exportedAt: string;
  exportVersion: string; // App version
}

/**
 * Export data to JSON string
 * 
 * @param data - Data to export
 * @returns JSON string
 */
export function exportToJSON(data: Omit<ExportData, 'exportedAt' | 'exportVersion'>): string {
  const exportData: ExportData = {
    ...data,
    exportedAt: new Date().toISOString(),
    exportVersion: '1.0.0', // TODO: Get from package.json
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export data and trigger download
 * 
 * @param data - Data to export
 * @param filename - Optional filename (default: runway-data-YYYYMMDD.json)
 */
export function downloadJSON(
  data: Omit<ExportData, 'exportedAt' | 'exportVersion'>,
  filename?: string
): void {
  const json = exportToJSON(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `runway-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Parse and validate imported JSON data
 * 
 * @param json - JSON string to parse
 * @returns Parsed and validated data, or null if invalid
 */
export function parseImportJSON(json: string): ExportData | null {
  try {
    const data = JSON.parse(json) as ExportData;
    
    // Basic validation
    if (!data.scenarios || !Array.isArray(data.scenarios)) {
      console.error('❌ Invalid import data: scenarios must be an array');
      return null;
    }
    
    if (typeof data.balance !== 'number' || typeof data.monthlyExpenses !== 'number') {
      console.error('❌ Invalid import data: balance and monthlyExpenses must be numbers');
      return null;
    }
    
    if (!data.version || typeof data.version !== 'number') {
      console.error('❌ Invalid import data: version is required');
      return null;
    }
    
    // TODO: Add more validation (schema validation with Zod in Phase 3)
    
    return data;
  } catch (error) {
    console.error('❌ Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Import data from file
 * 
 * @param file - File object from input
 * @returns Promise with parsed data or null
 */
export async function importFromFile(file: File): Promise<ExportData | null> {
  try {
    const text = await file.text();
    return parseImportJSON(text);
  } catch (error) {
    console.error('❌ Failed to read file:', error);
    return null;
  }
}

/**
 * Get storage size in bytes
 * 
 * @param key - LocalStorage key
 * @returns Size in bytes, or 0 if not found
 */
export function getStorageSize(key: string): number {
  try {
    const item = localStorage.getItem(key);
    if (!item) return 0;
    
    // Calculate size in bytes (UTF-16, so 2 bytes per character)
    return new Blob([item]).size;
  } catch (error) {
    console.error('❌ Failed to get storage size:', error);
    return 0;
  }
}

/**
 * Get human-readable storage size
 * 
 * @param key - LocalStorage key
 * @returns Formatted size string (e.g., "12.5 KB")
 */
export function getStorageSizeFormatted(key: string): string {
  const bytes = getStorageSize(key);
  
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Check if LocalStorage is available and has space
 * 
 * @returns true if LocalStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Estimate remaining LocalStorage space
 * 
 * @returns Estimated remaining bytes (approximate)
 */
export function estimateRemainingSpace(): number {
  // Most browsers limit LocalStorage to ~5-10MB
  // This is a rough estimate
  const QUOTA_ESTIMATE = 5 * 1024 * 1024; // 5MB
  
  try {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        used += getStorageSize(key);
      }
    }
    
    return Math.max(0, QUOTA_ESTIMATE - used);
  } catch (error) {
    console.error('❌ Failed to estimate remaining space:', error);
    return 0;
  }
}
