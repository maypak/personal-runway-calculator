// Idea
export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  feasibility: number; // 1-5
  profitability: number; // 1-5
  interest: number; // 1-5
  createdAt: string;
  updatedAt: string;
}

// Project
export interface Project {
  id: string;
  title: string;
  status: 'planned' | 'in-progress' | 'completed' | 'paused';
  progress: number; // 0-100
  dueDate: string;
  nextAction: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Daily Check-in
export interface DailyCheckin {
  id: string;
  date: string; // YYYY-MM-DD
  morning: {
    plan: string;
    mood: 'happy' | 'neutral' | 'sad';
    energy: 1 | 2 | 3;
  };
  evening?: {
    done: string;
    learned: string;
    tomorrow: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Expense
export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: string; // Any category
  amount: number; // Currency amount
  memo?: string;
  description?: string;
  createdAt?: string;
}

// Recurring Expense (auto-added monthly)
export interface RecurringExpense {
  id: string;
  name: string; // "Rent", "Phone bill", etc.
  amount: number; // Currency amount
  category: string;
  dayOfMonth: number; // 1~31, when it occurs
  enabled: boolean;
}

// Financial Settings
export interface FinanceSettings {
  monthlyFixed: number; // Monthly fixed expenses
  monthlyVariable: number; // Estimated monthly variable expenses (food, transport, etc.)
  currentSavings: number; // Current savings/cash on hand
  lumpSum: number; // One-time amount (severance, bonus, etc.)
  startDate: string; // Start date
  monthlyIncome: number; // Monthly income (freelance, unemployment benefit, etc.)
  incomeMonths: number; // How many months of income
}

// Monthly Budget
export interface MonthlyBudget {
  id: string;
  month: string; // YYYY-MM
  budget: number; // Target budget
  categories: {
    [key: string]: number; // Budget per category
  };
}

// Financial Goal
export interface FinanceGoal {
  id: string;
  title: string;
  targetAmount: number; // Target amount
  currentAmount: number; // Current amount
  deadline: string; // Deadline
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Financial Data (overall)
export interface FinancialData {
  startDate: string;
  currentSavings: number;
  lumpSum: number;
  monthlyIncome: number;
  incomeMonths: number;
  monthlyFixed: number;
  monthlyVariable: number;
  monthlyBudget: number;
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
}

// User Goal (Goal Setting Feature - Priority 1)
export interface UserGoal {
  id: string;
  goalType: 'runway' | 'savings'; // Runway (months) or Savings ($)
  targetValue: number; // 6 (months) or 30000 ($)
  description?: string; // Optional: "Safe quit my job"
  isActive: boolean; // Only 1 active per user (Free tier)
  achievedAt?: string; // ISO timestamp, null until achieved
  createdAt: string;
  updatedAt: string;
}

// Scenario Comparison (Priority 0 - Week 2)
export interface OneTimeExpense {
  name: string;
  amount: number;
  month: number; // 0-indexed (0 = first month)
}

export interface RecurringItem {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  startMonth: number; // 0-indexed
  endMonth: number | null; // null = infinite
}

export interface MonthData {
  month: number;
  savings: number;
  income: number;
  expenses: number;
  netChange: number;
}

export interface RunwayResult {
  runway: number; // Total months until savings depleted
  burnRate: number; // Average monthly burn rate
  breakevenMonth: number | null; // Month when income >= expenses (null if never)
  endSavings: number; // Final savings amount
  monthlyData: MonthData[]; // Month-by-month breakdown
}

export interface Scenario {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isBase: boolean;
  
  // Financial data
  totalSavings: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  oneTimeExpenses: OneTimeExpense[];
  recurringItems: RecurringItem[];
  
  // Calculated results (cached)
  calculatedRunway?: number;
  calculatedBurnRate?: number;
  calculatedBreakevenMonth?: number | null;
  calculatedEndSavings?: number;
  
  createdAt: string;
  updatedAt: string;
}
