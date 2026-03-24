/**
 * useHistoryData – aggregates income & expense data by month for a given year.
 * Provides monthly summaries, daily breakdowns, and annual totals.
 */
'use client';

import { useMemo } from 'react';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry, IncomeEntry, CategoryDataPoint } from '@/types';
import { getMonthRange, getMonthName } from '@/lib/dateUtils';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

/** Summary data for a single day. */
export interface DailySummary {
    date: string;
    income: number;
    expenses: number;
    profit: number;
}

/** Summary data for a single month. */
export interface MonthlySummary {
    month: number;
    monthName: string;
    startDate: string;
    endDate: string;
    income: number;
    expenses: number;
    profit: number;
    incomeEntries: IncomeEntry[];
    expenseEntries: ExpenseEntry[];
    dailyBreakdown: DailySummary[];
    categoryBreakdown: CategoryDataPoint[];
    hasData: boolean;
}

/** Full year aggregation. */
export interface YearData {
    year: number;
    totalIncome: number;
    totalExpenses: number;
    totalProfit: number;
    months: MonthlySummary[];
}

const sumAmount = (entries: Array<{ amount: number }>): number =>
    entries.reduce((acc, e) => acc + e.amount, 0);

export const useHistoryData = (year: number): YearData => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);

    return useMemo((): YearData => {
        const months: MonthlySummary[] = Array.from({ length: 12 }, (_, i) => {
            const { start, end } = getMonthRange(year, i);

            const monthIncome = incomeEntries.filter(
                (e) => e.date >= start && e.date <= end
            );
            const monthExpense = expenseEntries.filter(
                (e) => e.date >= start && e.date <= end
            );

            const income = sumAmount(monthIncome);
            const expenses = sumAmount(monthExpense);

            // Build daily breakdown
            const dailyMap = new Map<string, DailySummary>();
            monthIncome.forEach((e) => {
                const existing = dailyMap.get(e.date) ?? {
                    date: e.date,
                    income: 0,
                    expenses: 0,
                    profit: 0,
                };
                existing.income += e.amount;
                existing.profit = existing.income - existing.expenses;
                dailyMap.set(e.date, existing);
            });
            monthExpense.forEach((e) => {
                const existing = dailyMap.get(e.date) ?? {
                    date: e.date,
                    income: 0,
                    expenses: 0,
                    profit: 0,
                };
                existing.expenses += e.amount;
                existing.profit = existing.income - existing.expenses;
                dailyMap.set(e.date, existing);
            });

            const dailyBreakdown = Array.from(dailyMap.values()).sort((a, b) =>
                a.date.localeCompare(b.date)
            );

            // Category breakdown
            const categoryBreakdown: CategoryDataPoint[] = EXPENSE_CATEGORIES.map(
                (cat) => ({
                    name: cat,
                    value: sumAmount(monthExpense.filter((e) => e.category === cat)),
                })
            ).filter((p) => p.value > 0);

            return {
                month: i,
                monthName: getMonthName(i),
                startDate: start,
                endDate: end,
                income,
                expenses,
                profit: income - expenses,
                incomeEntries: monthIncome,
                expenseEntries: monthExpense,
                dailyBreakdown,
                categoryBreakdown,
                hasData: monthIncome.length > 0 || monthExpense.length > 0,
            };
        });

        const totalIncome = months.reduce((acc, m) => acc + m.income, 0);
        const totalExpenses = months.reduce((acc, m) => acc + m.expenses, 0);

        return {
            year,
            totalIncome,
            totalExpenses,
            totalProfit: totalIncome - totalExpenses,
            months,
        };
    }, [incomeEntries, expenseEntries, year]);
};
