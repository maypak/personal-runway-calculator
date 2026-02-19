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
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useScenarios } from '../hooks/useScenarios';
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
  
  // CRUD operations (from hook)
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
  // Use scenarios hook for CRUD operations
  const {
    scenarios,
    loading,
    error,
    loadScenarios,
    createScenario,
    updateScenario,
    deleteScenario,
  } = useScenarios();
  
  // Local state for UI
  const [activeScenario, setActiveScenarioState] = useState<Scenario | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  
  // Memoized calculation results
  const [calculationCache, setCalculationCache] = useState<Map<string, RunwayResult>>(new Map());
  
  /**
   * Set active scenario by ID
   */
  const setActiveScenario = (id: string | null) => {
    
    if (id === null) {
      setActiveScenarioState(null);
      return;
    }
    
    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      setActiveScenarioState(scenario);
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
   * Auto-select first scenario as active when scenarios load
   */
  useEffect(() => {
    if (scenarios.length > 0 && !activeScenario) {
      // Prefer base scenario, otherwise first scenario
      const baseScenario = scenarios.find(s => s.isBase);
      const defaultScenario = baseScenario || scenarios[0];
      
      setActiveScenarioState(defaultScenario);
    }
  }, [scenarios]);
  
  /**
   * Clear cache when scenarios change
   */
  useEffect(() => {
    setCalculationCache(new Map());
  }, [scenarios]);
  
  /**
   * Update active scenario when underlying data changes
   */
  useEffect(() => {
    if (activeScenario) {
      const updated = scenarios.find(s => s.id === activeScenario.id);
      if (updated) {
        setActiveScenarioState(updated);
      }
    }
  }, [scenarios]);
  
  const value: ScenarioContextType = {
    scenarios,
    activeScenario,
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
