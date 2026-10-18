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
  | 'Home'
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
  /** Whether this transaction is shared with Kami. */
  readonly isWithKami: boolean;
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
  /** Whether this transaction is shared with Kami. */
  readonly isWithKami: boolean;
  /** Whether this transaction is shared with others. */
  readonly isWithOthers: boolean;
}

/** Input payload for updating an existing income entry. */
export type UpdateIncomeInput = Partial<Omit<IncomeEntry, 'id'>>;

/** Input payload for updating an existing expense entry. */
export type UpdateExpenseInput = Partial<Omit<ExpenseEntry, 'id'>>;

/** Time window scope for TransactionList filtering. */
export type FilterScope = 'day' | 'month' | 'year';

/** Entry type filter for TransactionList. */
export type TransactionFilterType = 'all' | 'income' | 'expenses';

/** Category filter value (supports single category or Pareto 'Останали' slice). */
export type CategoryFilterValue = ExpenseCategory | 'Останали' | null;

/** Transient filter state shared between CategoryChart, TransactionList, and History drill-down. */
export interface TransactionFilters {
  readonly searchQuery: string;
  readonly type: TransactionFilterType;
  readonly scope: FilterScope;
  readonly category: CategoryFilterValue;
  readonly isWork: boolean;
  readonly isKami: boolean;
  readonly isShared: boolean;
}

/** Shape of the centralized Zustand store. */
export interface FinancialStore {
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
  /** Currently selected date: YYYY-MM-DD */
  selectedDate: string;
  /** Transient search, category, tag, and scope filters for TransactionList */
  transactionFilters: TransactionFilters;
  /** Authenticated user ID */
  userId: string | null;
  /** Whether data is being loaded from the server */
  isLoading: boolean;
  /** Last error from a server operation */
  error: string | null;
  /** Epoch ms of the last successful fetchTransactions — used to deduplicate fetches across pages. */
  lastFetchedAt: number | null;
  /** List of calendar years currently cached in memory. */
  loadedYears: number[];
  setUserId: (userId: string | null) => void;
  fetchTransactions: (userId: string, targetYear?: number) => Promise<void>;
  addIncome: (entry: Omit<IncomeEntry, 'id'>) => Promise<void>;
  addExpense: (entry: Omit<ExpenseEntry, 'id'>) => Promise<void>;
  updateIncome: (id: string, updates: UpdateIncomeInput) => Promise<void>;
  updateExpense: (id: string, updates: UpdateExpenseInput) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setTransactionFilters: (updates: Partial<TransactionFilters>) => void;
  toggleCategoryFilter: (category: ExpenseCategory | 'Останали', scope?: FilterScope) => void;
  resetTransactionFilters: (keepScope?: boolean) => void;
  clearStoreCache: () => void;
}

/** Recharts-compatible data point for the category pie chart. */
export interface CategoryDataPoint {
  name: ExpenseCategory;
  value: number;
}
