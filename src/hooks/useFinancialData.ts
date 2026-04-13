/**
 * useFinancialData – pure business logic hook.
 * All math, filtering, and derived state lives here; components are dumb.
 */
'use client';

import { useMemo } from 'react';
import { useFinancialStore } from '@/store/transactionStore';
import { CategoryDataPoint, ExpenseEntry, IncomeEntry } from '@/types';
import { EXPENSE_CATEGORIES, MONTH_NAMES_BG } from '@/lib/constants';
import { getCalendarMonthRange, getCalendarYearRange } from '@/lib/dateUtils';

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
    /** Category breakdown for the entire month of the selected date. */
    monthlyCategoryBreakdown: CategoryDataPoint[];
    /** Category breakdown for the entire YEAR of the selected date. */
    yearlyCategoryBreakdown: CategoryDataPoint[];
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

        // ── Monthly (calendar month of the selected date) ─────────────────────
        const { start: monthStart, end: monthEnd } =
            getCalendarMonthRange(selectedDate);

        const monthlyIncomeEntries = incomeEntries.filter(
            (e) => e.date >= monthStart && e.date <= monthEnd
        );
        const monthlyExpenseEntries = expenseEntries.filter(
            (e) => e.date >= monthStart && e.date <= monthEnd
        );

        const monthlyIncome = sumAmount(monthlyIncomeEntries);
        const monthlyExpenses = sumAmount(monthlyExpenseEntries);
        const monthlyProfit = monthlyIncome - monthlyExpenses;

        // ── CATEGORY BREAKDOWN (MONTHLY) ──────────────────────────────────────────
        const monthlyCategoryBreakdown: CategoryDataPoint[] = EXPENSE_CATEGORIES.map(
            (cat) => ({
                name: cat,
                value: sumAmount(
                    monthlyExpenseEntries.filter((e) => e.category === cat)
                ),
            })
        ).filter((point) => point.value > 0);

        // ── CATEGORY BREAKDOWN (YEARLY) ──────────────────────────────────────────
        const { start: yearStart, end: yearEnd } = getCalendarYearRange(selectedDate);
        const yearlyExpenseEntries = expenseEntries.filter(
            (e) => e.date >= yearStart && e.date <= yearEnd
        );

        const yearlyCategoryBreakdown: CategoryDataPoint[] = EXPENSE_CATEGORIES.map(
            (cat) => ({
                name: cat,
                value: sumAmount(
                    yearlyExpenseEntries.filter((e) => e.category === cat)
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
            monthlyCategoryBreakdown,
            yearlyCategoryBreakdown,
        };
    }, [incomeEntries, expenseEntries, selectedDate]);
};
