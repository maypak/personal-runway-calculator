/**
 * Data Export Utility
 * GDPR Article 20 - Right to Data Portability
 */

import { supabase } from '../lib/supabase';

interface ExportOptions {
  userId: string;
  format: 'csv' | 'json';
}

/**
 * Export all user data from all tables
 */
export async function exportAllData({ userId, format }: ExportOptions): Promise<void> {
  try {
    // Fetch all user data from all tables
    const [
      financeSettings,
      expenses,
      recurringExpenses,
      monthlyBudgets,
      userGoals,
      scenarios,
      fireSettings,
      phases,
    ] = await Promise.all([
      supabase.from('finance_settings').select('*').eq('user_id', userId).single(),
      supabase.from('expenses').select('*').eq('user_id', userId),
      supabase.from('recurring_expenses').select('*').eq('user_id', userId),
      supabase.from('monthly_budgets').select('*').eq('user_id', userId),
      supabase.from('user_goals').select('*').eq('user_id', userId),
      supabase.from('scenarios').select('*').eq('user_id', userId),
      supabase.from('fire_settings').select('*').eq('user_id', userId).single(),
      supabase.from('phases').select('*').eq('user_id', userId),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      userId,
      financeSettings: financeSettings.data || null,
      expenses: expenses.data || [],
      recurringExpenses: recurringExpenses.data || [],
      monthlyBudgets: monthlyBudgets.data || [],
      userGoals: userGoals.data || [],
      scenarios: scenarios.data || [],
      fireSettings: fireSettings.data || null,
      phases: phases.data || [],
    };

    if (format === 'json') {
      downloadJSON(exportData, `personal-runway-data-${new Date().toISOString().split('T')[0]}.json`);
    } else {
      downloadCSV(exportData, `personal-runway-data-${new Date().toISOString().split('T')[0]}.csv`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Download data as JSON file
 */
function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download data as CSV file
 */
function downloadCSV(data: any, filename: string): void {
  // Create a comprehensive CSV with multiple sheets (as separate sections)
  let csv = '';
  
  // Finance Settings
  csv += '=== FINANCE SETTINGS ===\n';
  if (data.financeSettings) {
    const headers = Object.keys(data.financeSettings).join(',');
    const values = Object.values(data.financeSettings).map(v => 
      typeof v === 'string' && v.includes(',') ? `"${v}"` : v
    ).join(',');
    csv += headers + '\n' + values + '\n\n';
  }
  
  // Expenses
  csv += '=== EXPENSES ===\n';
  if (data.expenses.length > 0) {
    const headers = Object.keys(data.expenses[0]).join(',');
    csv += headers + '\n';
    data.expenses.forEach((expense: any) => {
      const values = Object.values(expense).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // Recurring Expenses
  csv += '=== RECURRING EXPENSES ===\n';
  if (data.recurringExpenses.length > 0) {
    const headers = Object.keys(data.recurringExpenses[0]).join(',');
    csv += headers + '\n';
    data.recurringExpenses.forEach((expense: any) => {
      const values = Object.values(expense).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // Monthly Budgets
  csv += '=== MONTHLY BUDGETS ===\n';
  if (data.monthlyBudgets.length > 0) {
    const headers = Object.keys(data.monthlyBudgets[0]).join(',');
    csv += headers + '\n';
    data.monthlyBudgets.forEach((budget: any) => {
      const values = Object.values(budget).map(v => 
        typeof v === 'string' && (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // User Goals
  csv += '=== GOALS ===\n';
  if (data.userGoals.length > 0) {
    const headers = Object.keys(data.userGoals[0]).join(',');
    csv += headers + '\n';
    data.userGoals.forEach((goal: any) => {
      const values = Object.values(goal).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // Scenarios
  csv += '=== SCENARIOS ===\n';
  if (data.scenarios.length > 0) {
    const headers = Object.keys(data.scenarios[0]).join(',');
    csv += headers + '\n';
    data.scenarios.forEach((scenario: any) => {
      const values = Object.values(scenario).map(v => 
        typeof v === 'string' && (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // FIRE Settings
  csv += '=== FIRE SETTINGS ===\n';
  if (data.fireSettings) {
    const headers = Object.keys(data.fireSettings).join(',');
    const values = Object.values(data.fireSettings).map(v => 
      typeof v === 'string' && v.includes(',') ? `"${v}"` : v
    ).join(',');
    csv += headers + '\n' + values + '\n\n';
  }
  
  // Phases
  csv += '=== PHASES ===\n';
  if (data.phases.length > 0) {
    const headers = Object.keys(data.phases[0]).join(',');
    csv += headers + '\n';
    data.phases.forEach((phase: any) => {
      const values = Object.values(phase).map(v => 
        typeof v === 'string' && (v.includes(',') || v.includes('"')) ? `"${v.replace(/"/g, '""')}"` : v
      ).join(',');
      csv += values + '\n';
    });
    csv += '\n';
  }
  
  // Export metadata
  csv += '=== EXPORT METADATA ===\n';
  csv += `Exported At,${data.exportedAt}\n`;
  csv += `User ID,${data.userId}\n`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
