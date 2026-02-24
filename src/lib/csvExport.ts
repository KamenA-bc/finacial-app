/**
 * CSV export utility for Google Sheets import.
 * Generates a comma-separated file of all income and expense entries
 * for the last 30 days, suitable for direct import into Google Sheets
 * via File → Import.
 */

import { IncomeEntry, ExpenseEntry } from '@/types';
import { daysAgoString } from '@/lib/dateUtils';
import { MAX_PAST_DAYS } from '@/lib/constants';

/** A normalised row used inside the CSV builder. */
interface CsvRow {
    date: string;
    type: 'Income' | 'Expense';
    description: string;
    category: string;
    amount: number;
}

const CSV_HEADERS = ['Date', 'Type', 'Description', 'Category', 'Amount (€)'] as const;

/** Escape a cell value so commas and quotes inside strings don't break CSV. */
const escapeCell = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

const rowToCsv = (row: CsvRow): string =>
    [row.date, row.type, row.description, row.category, row.amount]
        .map(escapeCell)
        .join(',');

/**
 * Build and trigger a CSV download of the last 30 days of transactions.
 * @param incomeEntries - All income entries from the store.
 * @param expenseEntries - All expense entries from the store.
 */
export const exportToCsv = (
    incomeEntries: IncomeEntry[],
    expenseEntries: ExpenseEntry[]
): void => {
    const monthlyStart = daysAgoString(MAX_PAST_DAYS);

    const incomeRows: CsvRow[] = incomeEntries
        .filter((e) => e.date >= monthlyStart)
        .map((e) => ({
            date: e.date,
            type: 'Income',
            description: 'Money Earned',
            category: '',
            amount: e.amount,
        }));

    const expenseRows: CsvRow[] = expenseEntries
        .filter((e) => e.date >= monthlyStart)
        .map((e) => ({
            date: e.date,
            type: 'Expense',
            description: e.description,
            category: e.category,
            amount: e.amount,
        }));

    // Sort all rows by date ascending
    const allRows: CsvRow[] = [...incomeRows, ...expenseRows].sort((a, b) =>
        a.date.localeCompare(b.date)
    );

    const lines = [
        CSV_HEADERS.join(','),
        ...allRows.map(rowToCsv),
    ];

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-export-${today}.csv`;
    link.click();

    // Clean up the object URL after the download is triggered
    URL.revokeObjectURL(url);
};
