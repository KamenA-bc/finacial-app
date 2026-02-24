/**
 * useFinancialData – pure business logic hook.
 * All math, filtering, and derived state lives here; components are dumb.
 */
'use client';

import { useMemo } from 'react';
import { useFinancialStore } from '@/store/transactionStore';
import { CategoryDataPoint, ExpenseEntry, IncomeEntry } from '@/types';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { daysAgoString } from '@/lib/dateUtils';
import { MAX_PAST_DAYS } from '@/lib/constants';

interface FinancialData {
    /** All income entries for the selected day. */
    dailyIncomeEntries: IncomeEntry[];
    /** All expense entries for the selected day. */
    dailyExpenseEntries: ExpenseEntry[];
    dailyIncome: number;
    dailyExpenses: number;
    dailyProfit: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyProfit: number;
    /** Category breakdown for the selected day – ready for Recharts. */
    categoryBreakdown: CategoryDataPoint[];
}

const sumAmount = (entries: Array<{ amount: number }>): number =>
    entries.reduce((acc, e) => acc + e.amount, 0);

export const useFinancialData = (): FinancialData => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);
    const selectedDate = useFinancialStore((s) => s.selectedDate);

    return useMemo((): FinancialData => {
        // ── Daily ────────────────────────────────────────────────────────────────
        const dailyIncomeEntries = incomeEntries.filter(
            (e) => e.date === selectedDate
        );
        const dailyExpenseEntries = expenseEntries.filter(
            (e) => e.date === selectedDate
        );

        const dailyIncome = sumAmount(dailyIncomeEntries);
        const dailyExpenses = sumAmount(dailyExpenseEntries);
        const dailyProfit = dailyIncome - dailyExpenses;

        // ── Monthly (last 30 days from today) ────────────────────────────────────
        const monthlyStart = daysAgoString(MAX_PAST_DAYS);
        const monthlyIncomeEntries = incomeEntries.filter(
            (e) => e.date >= monthlyStart
        );
        const monthlyExpenseEntries = expenseEntries.filter(
            (e) => e.date >= monthlyStart
        );

        const monthlyIncome = sumAmount(monthlyIncomeEntries);
        const monthlyExpenses = sumAmount(monthlyExpenseEntries);
        const monthlyProfit = monthlyIncome - monthlyExpenses;

        // ── Category breakdown for selected day ──────────────────────────────────
        const categoryBreakdown: CategoryDataPoint[] = EXPENSE_CATEGORIES.map(
            (cat) => ({
                name: cat,
                value: sumAmount(
                    dailyExpenseEntries.filter((e) => e.category === cat)
                ),
            })
        ).filter((point) => point.value > 0);

        return {
            dailyIncomeEntries,
            dailyExpenseEntries,
            dailyIncome,
            dailyExpenses,
            dailyProfit,
            monthlyIncome,
            monthlyExpenses,
            monthlyProfit,
            categoryBreakdown,
        };
    }, [incomeEntries, expenseEntries, selectedDate]);
};
