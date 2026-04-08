import { ExpenseCategory } from '@/types';

/** Maximum number of past days for CSV export. */
export const MAX_EXPORT_DAYS = 30;

/** Maximum number of past days the user can navigate back to (≈ 2 years). */
export const MAX_PAST_DAYS = 730;

/** All allowed expense categories (single source of truth). */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
    'Магазини (Храна/Вода)',
    'Eating out',
    'Гориво',
    'Градски транспорт',
    'Health/Аптека',
    'Beauty',
    'Shopping',
    'Entertainment',
    'Пътуване',
    'Сметки/Разходи',
    'Фирмени разходи',
    'Подаръци',
    'Други',
] as const;

/** Mapping internal categories to display text. */
export const CATEGORY_BG_MAP: Record<ExpenseCategory, string> = {
    'Магазини (Храна/Вода)': 'Магазини (Храна/Вода)',
    'Eating out': 'Eating out',
    'Гориво': 'Гориво',
    'Градски транспорт': 'Градски транспорт',
    'Health/Аптека': 'Health/Аптека',
    'Beauty': 'Beauty',
    'Shopping': 'Shopping',
    'Entertainment': 'Entertainment',
    'Пътуване': 'Пътуване',
    'Сметки/Разходи': 'Сметки/Разходи',
    'Фирмени разходи': 'Фирмени разходи',
    'Подаръци': 'Подаръци',
    'Други': 'Други',
};

/**
 * Muted, sophisticated donut chart palette.
 * One colour per category in the same order as EXPENSE_CATEGORIES.
 */
export const CHART_COLORS: readonly string[] = [
    '#7C9CBF', // Магазини (Храна/Вода)
    '#7DBF9C', // Eating out
    '#BFB27C', // Гориво
    '#BF7C7C', // Градски транспорт
    '#A07CBF', // Health/Аптека
    '#D9A0B0', // Beauty
    '#EFA876', // Shopping
    '#C4B5A5', // Entertainment
    '#8FBFA4', // Пътуване
    '#9CBFBF', // Сметки/Разходи
    '#C9B3C5', // Фирмени разходи
    '#E2A398', // Подаръци
    '#A18C74', // Други
] as const;

/** Currency symbol used throughout the UI. */
export const CURRENCY_SYMBOL = '€';

/** Locale used for number formatting. */
export const NUMBER_LOCALE = 'bg-BG';

/** Options for formatting currency amounts. */
export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};
