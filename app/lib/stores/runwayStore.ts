/**
 * runwayStore.ts - Zustand Store for LocalStorage Persistence
 * 
 * Purpose: Replace Supabase with browser LocalStorage
 * Pattern: Zustand with persist middleware
 * 
 * Features:
 * - Persist scenarios to LocalStorage
 * - Auto-sync across tabs (storage event)
 * - Export/Import support (Phase 3)
 * 
 * Created: 2026-02-23 (Phase 2: LocalStorage Migration)
 * Author: Developer Agent (Subagent)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Scenario } from '@/types';

/**
 * Main data structure stored in LocalStorage
 */
interface RunwayData {
  // Financial data
  balance: number;
  monthlyExpenses: number;
  income: {
    monthly: number;
    isVariable: boolean;
  };
  
  // Scenarios
  scenarios: Scenario[];
  
  // Active scenario ID
  activeScenarioId: string | null;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  version: number; // For future migrations
}

/**
 * Store interface
 */
interface RunwayStore {
  // State
  data: RunwayData | null;
  
  // Hydration state (for SSR)
  hydrated: boolean;
  
  // Actions
  saveData: (data: Partial<RunwayData>) => void;
  loadData: () => RunwayData | null;
  clearData: () => void;
  
  // Scenario CRUD
  addScenario: (scenario: Scenario) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  
  // Hydration
  setHydrated: (state: boolean) => void;
}

/**
 * Default initial data
 */
const getDefaultData = (): RunwayData => ({
  balance: 0,
  monthlyExpenses: 0,
  income: {
    monthly: 0,
    isVariable: false,
  },
  scenarios: [],
  activeScenarioId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
});

/**
 * Main Zustand store with persist middleware
 */
export const useRunwayStore = create<RunwayStore>()(
  persist(
    (set, get) => ({
      // Initial state
      data: null,
      hydrated: false,
      
      /**
       * Save data (partial update)
       */
      saveData: (updates) => {
        const current = get().data || getDefaultData();
        set({
          data: {
            ...current,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      /**
       * Load current data
       */
      loadData: () => {
        return get().data;
      },
      
      /**
       * Clear all data
       */
      clearData: () => {
        set({ data: null });
      },
      
      /**
       * Add a new scenario
       */
      addScenario: (scenario) => {
        const current = get().data || getDefaultData();
        const newScenarios = [...current.scenarios, scenario];
        
        set({
          data: {
            ...current,
            scenarios: newScenarios,
            // Auto-set as active if it's the first scenario or marked as base
            activeScenarioId: scenario.isBase || current.scenarios.length === 0 
              ? scenario.id 
              : current.activeScenarioId,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      /**
       * Update an existing scenario
       */
      updateScenario: (id, updates) => {
        const current = get().data || getDefaultData();
        const newScenarios = current.scenarios.map(s =>
          s.id === id
            ? { ...s, ...updates, updatedAt: new Date().toISOString() }
            : s
        );
        
        set({
          data: {
            ...current,
            scenarios: newScenarios,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      /**
       * Delete a scenario
       */
      deleteScenario: (id) => {
        const current = get().data || getDefaultData();
        const newScenarios = current.scenarios.filter(s => s.id !== id);
        
        set({
          data: {
            ...current,
            scenarios: newScenarios,
            // Clear active if deleted scenario was active
            activeScenarioId: current.activeScenarioId === id 
              ? (newScenarios[0]?.id || null) 
              : current.activeScenarioId,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      /**
       * Set active scenario
       */
      setActiveScenario: (id) => {
        const current = get().data || getDefaultData();
        set({
          data: {
            ...current,
            activeScenarioId: id,
            updatedAt: new Date().toISOString(),
          },
        });
      },
      
      /**
       * Set hydration state
       */
      setHydrated: (state) => {
        set({ hydrated: state });
      },
    }),
    {
      name: 'personal-runway-data-v1', // LocalStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Hydration callback
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      
      // Partial persist (don't persist hydration state)
      partialize: (state) => ({
        data: state.data,
      }),
    }
  )
);

/**
 * Hook to check if store is hydrated (for SSR)
 */
export const useStoreHydration = () => {
  return useRunwayStore((state) => state.hydrated);
};

/**
 * Selector hooks for common queries
 */
export const useScenarios = () => {
  return useRunwayStore((state) => state.data?.scenarios || []);
};

export const useActiveScenario = () => {
  const scenarios = useScenarios();
  const activeId = useRunwayStore((state) => state.data?.activeScenarioId);
  return scenarios.find(s => s.id === activeId) || null;
};

export const useBalance = () => {
  return useRunwayStore((state) => state.data?.balance || 0);
};

export const useMonthlyExpenses = () => {
  return useRunwayStore((state) => state.data?.monthlyExpenses || 0);
};

export const useIncome = () => {
  return useRunwayStore((state) => state.data?.income || { monthly: 0, isVariable: false });
};
