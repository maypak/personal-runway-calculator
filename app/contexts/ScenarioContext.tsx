/**
 * ScenarioContext - Global Scenario State Management
 * 
 * Purpose: Provide scenario data and actions throughout the app
 * Pattern: Mirrors I18nContext.tsx structure
 * 
 * Features:
 * - Global access to scenarios
 * - Active scenario selection
 * - Comparison mode state
 * - Scenario CRUD operations
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 * 
 * Updated: 2026-02-23 (Phase 2: LocalStorage Migration)
 * Now uses Zustand store for LocalStorage persistence
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRunwayStore, useScenarios as useZustandScenarios, useActiveScenario as useZustandActiveScenario } from '@/lib/stores/runwayStore';
import type { Scenario, RunwayResult } from '../types';
import { calculateRunway } from '../utils/runwayCalculator';

interface ScenarioContextType {
  // State
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  comparisonMode: boolean;
  selectedScenarios: string[]; // Scenario IDs for comparison
  loading: boolean;
  error: string | null;
  
  // Actions
  setActiveScenario: (id: string | null) => void;
  toggleComparisonMode: () => void;
  selectForComparison: (ids: string[]) => void;
  
  // CRUD operations
  loadScenarios: () => Promise<void>;
  createScenario: (name: string, basedOnId?: string) => Promise<{ success: boolean; data?: Scenario; error?: string }>;
  updateScenario: (id: string, updates: Partial<Scenario>) => Promise<{ success: boolean; error?: string }>;
  deleteScenario: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Calculated results
  getScenarioResult: (id: string) => RunwayResult | null;
  getComparisonResults: () => Map<string, RunwayResult>;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  // Get scenarios from Zustand store
  const scenarios = useZustandScenarios();
  const activeScenarioFromStore = useZustandActiveScenario();
  const { addScenario, updateScenario: updateInStore, deleteScenario: deleteFromStore, setActiveScenario: setActiveInStore } = useRunwayStore();
  
  // LocalStorage is always available on client, no loading state needed
  const loading = false;
  const error = null;
  
  // Local state for UI (comparison mode)
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  
  // Memoized calculation results
  const [calculationCache, setCalculationCache] = useState<Map<string, RunwayResult>>(new Map());
  
  /**
   * Load scenarios (no-op for LocalStorage, but kept for API compatibility)
   */
  const loadScenarios = async () => {
    // LocalStorage is auto-loaded by Zustand persist middleware
    return Promise.resolve();
  };
  
  /**
   * Create a new scenario
   */
  const createScenario = async (name: string, basedOnId?: string): Promise<{ success: boolean; data?: Scenario; error?: string }> => {
    try {
      // Find base scenario if provided
      const baseScenario = basedOnId ? scenarios.find(s => s.id === basedOnId) : null;
      
      // Generate new scenario
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'local-user', // LocalStorage doesn't need real user ID
        name,
        description: baseScenario ? `Based on ${baseScenario.name}` : '',
        isBase: scenarios.length === 0, // First scenario is base
        
        // Financial data (copy from base or use defaults)
        totalSavings: baseScenario?.totalSavings || 0,
        monthlyExpenses: baseScenario?.monthlyExpenses || 0,
        monthlyIncome: baseScenario?.monthlyIncome || 0,
        oneTimeExpenses: baseScenario?.oneTimeExpenses || [],
        recurringItems: baseScenario?.recurringItems || [],
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to store
      addScenario(newScenario);
      
      return { success: true, data: newScenario };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to create scenario:', error);
      return { success: false, error };
    }
  };
  
  /**
   * Update an existing scenario
   */
  const updateScenario = async (id: string, updates: Partial<Scenario>): Promise<{ success: boolean; error?: string }> => {
    try {
      updateInStore(id, updates);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to update scenario:', error);
      return { success: false, error };
    }
  };
  
  /**
   * Delete a scenario
   */
  const deleteScenario = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      deleteFromStore(id);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to delete scenario:', error);
      return { success: false, error };
    }
  };
  
  /**
   * Set active scenario by ID
   */
  const setActiveScenario = (id: string | null) => {
    if (id === null) {
      setActiveInStore(null);
      return;
    }
    
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      setActiveInStore(id);
    } else {
      console.warn('⚠️ [ScenarioContext] Scenario not found:', id);
    }
  };
  
  /**
   * Toggle comparison mode
   */
  const toggleComparisonMode = () => {
    setComparisonMode(prev => {
      const newMode = !prev;
      
      // Reset selection when entering comparison mode
      if (newMode && selectedScenarios.length === 0 && scenarios.length >= 2) {
        // Auto-select first 2 scenarios
        const autoSelect = scenarios.slice(0, 2).map(s => s.id);
        setSelectedScenarios(autoSelect);
      }
      
      return newMode;
    });
  };
  
  /**
   * Select scenarios for comparison
   */
  const selectForComparison = (ids: string[]) => {
    // Limit to max 3 scenarios for comparison
    if (ids.length > 3) {
      console.warn('⚠️ [ScenarioContext] Max 3 scenarios for comparison');
      setSelectedScenarios(ids.slice(0, 3));
      return;
    }
    
    setSelectedScenarios(ids);
  };
  
  /**
   * Get calculated result for a scenario (with caching)
   */
  const getScenarioResult = (id: string): RunwayResult | null => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return null;
    
    // Check cache first
    if (calculationCache.has(id)) {
      return calculationCache.get(id)!;
    }
    
    // Calculate and cache
    const result = calculateRunway(scenario);
    setCalculationCache(prev => new Map(prev).set(id, result));
    
    return result;
  };
  
  /**
   * Get results for all selected scenarios
   */
  const getComparisonResults = (): Map<string, RunwayResult> => {
    const results = new Map<string, RunwayResult>();
    
    selectedScenarios.forEach(id => {
      const result = getScenarioResult(id);
      if (result) {
        results.set(id, result);
      }
    });
    
    return results;
  };
  
  /**
   * Clear cache when scenarios change
   */
  useEffect(() => {
    setCalculationCache(new Map());
  }, [scenarios]);
  
  const value: ScenarioContextType = {
    scenarios,
    activeScenario: activeScenarioFromStore,
    comparisonMode,
    selectedScenarios,
    loading,
    error,
    setActiveScenario,
    toggleComparisonMode,
    selectForComparison,
    loadScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
    getScenarioResult,
    getComparisonResults,
  };
  
  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenarioContext() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioContext must be used within ScenarioProvider');
  }
  return context;
}
