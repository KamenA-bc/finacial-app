import { ExpenseCategory } from '@/types';

/** Maximum number of past days for CSV export. */
export const MAX_EXPORT_DAYS = 30;

/** Maximum number of past days the user can navigate back to (≈ 2 years). */
export const MAX_PAST_DAYS = 730;

/** All allowed expense categories (single source of truth). */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
    'Public Transport',
    'Groceries',
    'Utilities',
    'Eating Out',
    'Entertainment',
    'Others',
] as const;

/**
 * Muted, sophisticated donut chart palette.
 * One colour per category in the same order as EXPENSE_CATEGORIES.
 */
export const CHART_COLORS: readonly string[] = [
    '#7C9CBF', // Public Transport – slate blue
    '#7DBF9C', // Groceries – sage green
    '#BFB27C', // Utilities – warm sand
    '#BF7C7C', // Eating Out – muted rose
    '#A07CBF', // Entertainment – lavender
    '#9CBFBF', // Others – teal
] as const;

/** Currency symbol used throughout the UI. */
export const CURRENCY_SYMBOL = '€';

/** Locale used for number formatting. */
export const NUMBER_LOCALE = 'en-US';

/** Options for formatting currency amounts. */
export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};
