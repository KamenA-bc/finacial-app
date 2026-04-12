/**
 * Core data models for the Expense & Income Tracker.
 * Follows Google TypeScript Style Guide: use interfaces for data models,
 * explicit types, no `any`.
 */

/** All allowed expense categories. */
export type ExpenseCategory =
  | 'Магазини (Храна/Вода)'
  | 'Eating out'
  | 'Гориво'
  | 'Градски транспорт'
  | 'Health/Аптека'
  | 'Beauty'
  | 'Shopping'
  | 'Entertainment'
  | 'Пътуване'
  | 'Сметки/Разходи'
  | 'Фирмени разходи'
  | 'Подаръци'
  | 'Други';

/** Discriminated union for transaction type. */
export type TransactionType = 'income' | 'expense';

/** A single income entry logged by the user. */
export interface IncomeEntry {
  readonly id: string;
  /** ISO 8601 date string: YYYY-MM-DD */
  readonly date: string;
  readonly amount: number;
  readonly description: string;
  /** Whether this income was earned from work/job. */
  readonly isWorkIncome: boolean;
}

/** A single expense entry logged by the user. */
export interface ExpenseEntry {
  readonly id: string;
  /** ISO 8601 date string: YYYY-MM-DD */
  readonly date: string;
  readonly amount: number;
  readonly description: string;
  readonly category: ExpenseCategory;
  /** Whether this expense was made for work purposes. */
  readonly isWorkExpense: boolean;
}

/** Shape of the centralized Zustand store. */
export interface FinancialStore {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  /** Currently selected date: YYYY-MM-DD */
  selectedDate: string;
  /** Authenticated user ID */
  userId: string | null;
  /** Whether data is being loaded from the server */
  isLoading: boolean;
  /** Last error from a server operation */
  error: string | null;
  setUserId: (userId: string | null) => void;
  fetchTransactions: (userId: string) => Promise<void>;
  addIncome: (entry: Omit<IncomeEntry, 'id'>) => Promise<void>;
  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
}

/** Recharts-compatible data point for the category pie chart. */
export interface CategoryDataPoint {
  name: ExpenseCategory;
  value: number;
}
