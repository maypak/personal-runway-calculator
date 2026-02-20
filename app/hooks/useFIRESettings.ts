/**
 * useFIRESettings Hook
 * 
 * Purpose: CRUD operations for fire_settings table + FIRE calculations
 * Features:
 * - Load settings from Supabase
 * - Update settings with optimistic updates
 * - Calculate and cache FIRE metrics
 * - Real-time sync with database
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { calculateFIREMetrics } from '../utils/fireCalculator';
import type { FIRECalculationResult } from '../types';

export interface FIRESettings {
  id: string;
  user_id: string;
  investment_return_rate: number;
  safe_withdrawal_rate: number;
  target_annual_expenses: number | null;
  fi_number: number | null;
  fi_date: string | null;
  coast_fire_date: string | null;
  lean_fi_number: number | null;
  fat_fi_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface UseFIRESettingsResult {
  settings: FIRESettings | null;
  calculatedMetrics: FIRECalculationResult | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<FIRESettings>) => Promise<void>;
  calculateAndCache: (params: {
    currentSavings: number;
    monthlyContribution: number;
    annualExpenses?: number;
  }) => Promise<void>;
  
  // Reset to defaults
  resetToDefaults: () => Promise<void>;
}

/**
 * Hook for managing FIRE settings and calculations
 */
export function useFIRESettings(): UseFIRESettingsResult {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<FIRESettings | null>(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState<FIRECalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load settings from Supabase (with graceful fallback)
   */
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('fire_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // If no settings exist yet, that's OK (not an error)
        if (fetchError.code === 'PGRST116') {
          setSettings(null);
        } 
        // If table doesn't exist (42P01), use default values silently
        else if (fetchError.code === '42P01' || fetchError.message?.includes('relation') || fetchError.message?.includes('does not exist')) {
          console.warn('fire_settings table not found, using defaults');
          // Create default settings object (not persisted)
          // FIXED: Use empty string to avoid hydration mismatch
          const defaultSettings: FIRESettings = {
            id: 'temp-default',
            user_id: user.id,
            investment_return_rate: 7.0,
            safe_withdrawal_rate: 4.0,
            target_annual_expenses: null,
            fi_number: null,
            fi_date: null,
            coast_fire_date: null,
            lean_fi_number: null,
            fat_fi_number: null,
            created_at: '',
            updated_at: '',
          };
          setSettings(defaultSettings);
        } else {
          throw fetchError;
        }
      } else {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load FIRE settings:', err);
      // Don't show error to user if it's just missing table - use defaults instead
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        console.warn('Graceful fallback: using default FIRE settings');
        // FIXED: Use empty string to avoid hydration mismatch
        const defaultSettings: FIRESettings = {
          id: 'temp-default',
          user_id: user.id,
          investment_return_rate: 7.0,
          safe_withdrawal_rate: 4.0,
          target_annual_expenses: null,
          fi_number: null,
          fi_date: null,
          coast_fire_date: null,
          lean_fi_number: null,
          fat_fi_number: null,
          created_at: '',
          updated_at: '',
        };
        setSettings(defaultSettings);
        setError(null); // Clear error, we're handling it gracefully
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Update settings in Supabase (with graceful fallback)
   */
  const updateSettings = useCallback(async (updates: Partial<FIRESettings>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      // Optimistic update
      if (settings) {
        setSettings({ ...settings, ...updates });
      }

      // CLAUDE.md principle: Use explicit INSERT/UPDATE instead of UPSERT
      // First, check if settings exist
      const { data: existing } = await supabase
        .from('fire_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let data;
      let updateError;

      if (existing) {
        // Update existing record
        const result = await supabase
          .from('fire_settings')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();
        
        data = result.data;
        updateError = result.error;
      } else {
        // Insert new record
        const result = await supabase
          .from('fire_settings')
          .insert({ ...updates, user_id: user.id })
          .select()
          .single();
        
        data = result.data;
        updateError = result.error;
      }

      if (updateError) {
        // If table doesn't exist, just update local state without persisting
        const errorMessage = updateError.message || '';
        if (updateError.code === '42P01' || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
          console.warn('fire_settings table not found, updates not persisted (local only)');
          // Keep the optimistic update, don't throw
          return;
        }
        throw updateError;
      }

      setSettings(data);
    } catch (err) {
      console.error('Failed to update FIRE settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // If it's a missing table error, don't show to user
      if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        console.warn('Graceful degradation: FIRE settings updated locally only');
        return; // Don't revert, don't throw
      }
      
      setError(errorMessage);
      
      // Revert optimistic update for real errors
      await loadSettings();
      
      throw err;
    }
  }, [user, settings, loadSettings]);

  /**
   * Calculate FIRE metrics and cache in database
   */
  const calculateAndCache = useCallback(async (params: {
    currentSavings: number;
    monthlyContribution: number;
    annualExpenses?: number;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const { currentSavings, monthlyContribution, annualExpenses } = params;

      // Use target_annual_expenses if set, otherwise use provided annualExpenses
      const expenses = settings?.target_annual_expenses ?? annualExpenses;
      
      if (!expenses || expenses <= 0) {
        throw new Error('Annual expenses must be provided and greater than 0');
      }

      const investmentReturnRate = settings?.investment_return_rate ?? 7.0;
      const safeWithdrawalRate = settings?.safe_withdrawal_rate ?? 4.0;

      // Calculate FIRE metrics
      const metrics = calculateFIREMetrics(
        currentSavings,
        monthlyContribution,
        expenses,
        investmentReturnRate,
        safeWithdrawalRate
      );

      // Cache calculated values in database
      const updates = {
        fi_number: metrics.fiNumber,
        fi_date: metrics.fiDate?.toISOString().split('T')[0] ?? null,
        coast_fire_date: metrics.coastFireDate?.toISOString().split('T')[0] ?? null,
        lean_fi_number: metrics.leanFiNumber,
        fat_fi_number: metrics.fatFiNumber,
      };

      await updateSettings(updates);

      // Update local state
      setCalculatedMetrics(metrics);
    } catch (err) {
      console.error('Failed to calculate and cache FIRE metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate metrics');
      throw err;
    }
  }, [user, settings, updateSettings]);

  /**
   * Reset settings to defaults
   */
  const resetToDefaults = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);

      const defaults = {
        investment_return_rate: 7.0,
        safe_withdrawal_rate: 4.0,
        target_annual_expenses: null,
        fi_number: null,
        fi_date: null,
        coast_fire_date: null,
        lean_fi_number: null,
        fat_fi_number: null,
      };

      await updateSettings(defaults);
    } catch (err) {
      console.error('Failed to reset FIRE settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
      throw err;
    }
  }, [user, updateSettings]);

  // Load settings on mount and when user changes
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Set up real-time subscription for settings changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('fire_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fire_settings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setSettings(payload.new as FIRESettings);
          } else if (payload.eventType === 'DELETE') {
            setSettings(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    settings,
    calculatedMetrics,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    calculateAndCache,
    resetToDefaults,
  };
}
