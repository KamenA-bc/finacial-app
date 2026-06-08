/**
 * useStatisticsData – derives all statistics for a given year.
 * Pure business logic hook – no side effects, no API calls.
 * All data is computed from the Zustand store via useMemo.
 */
'use client';

import { useMemo } from 'react';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry, IncomeEntry } from '@/types';
import { getMonthRange, getMonthName } from '@/lib/dateUtils';
import { EXPENSE_CATEGORIES, CATEGORY_BG_MAP } from '@/lib/constants';

// ── Interfaces ───────────────────────────────────────────────────────────────

interface MonthRecord {
    month: string;
    amount: number;
}

interface DayRecord {
    date: string;
    amount: number;
}

interface CategoryRankEntry {
    name: string;
    displayName: string;
    amount: number;
}

interface MonthlyTrendPoint {
    month: string;
    income: number;
    expenses: number;
    profit: number;
}

export interface StatisticsData {
    // Section 1: Overview KPIs
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    savingsRate: number;

    // Section 2: Best & Worst Months
    biggestEarningMonth: MonthRecord | null;
    biggestSpendingMonth: MonthRecord | null;
    mostProfitableMonth: MonthRecord | null;
    worstMonth: MonthRecord | null;

    // Section 3: Spending Habits
    topCategory: CategoryRankEntry | null;
    categoryRanking: CategoryRankEntry[];
    avgExpensePerTransaction: number;
    totalTransactionCount: number;
    incomeTransactionCount: number;
    expenseTransactionCount: number;

    // Section 4: Income Analysis
    workIncome: number;
    personalIncome: number;
    workExpenses: number;
    personalExpenses: number;

    // Section 5: Monthly Trends
    monthlyTrends: MonthlyTrendPoint[];

    // Section 6: Fun Facts
    biggestSpendingDay: DayRecord | null;
    biggestEarningDay: DayRecord | null;
    avgDailyExpense: number;
    activeDays: number;
    kamiSpending: number;

    /** Whether there is any data at all for this year. */
    hasData: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const sumAmount = (entries: Array<{ amount: number }>): number =>
    entries.reduce((acc, e) => acc + e.amount, 0);

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useStatisticsData = (year: number): StatisticsData => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);

    return useMemo((): StatisticsData => {
        const yearStart = `${year}-01-01`;
        const yearEnd = `${year}-12-31`;

        // Filter entries for the selected year
        const yearIncome = incomeEntries.filter(
            (e) => e.date >= yearStart && e.date <= yearEnd
        );
        const yearExpense = expenseEntries.filter(
            (e) => e.date >= yearStart && e.date <= yearEnd
        );

        const hasData = yearIncome.length > 0 || yearExpense.length > 0;

        // ── Section 1: Overview KPIs ──────────────────────────────────────
        const totalIncome = sumAmount(yearIncome);
        const totalExpenses = sumAmount(yearExpense);
        const netProfit = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0
            ? (netProfit / totalIncome) * 100
            : 0;

        // ── Section 2: Best & Worst Months ────────────────────────────────
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const { start, end } = getMonthRange(year, i);

            const mIncome = sumAmount(
                yearIncome.filter((e) => e.date >= start && e.date <= end)
            );
            const mExpense = sumAmount(
                yearExpense.filter((e) => e.date >= start && e.date <= end)
            );

            return {
                monthIndex: i,
                monthName: getMonthName(i),
                income: mIncome,
                expenses: mExpense,
                profit: mIncome - mExpense,
                hasData: mIncome > 0 || mExpense > 0,
            };
        });

        const monthsWithData = monthlyData.filter((m) => m.hasData);

        const biggestEarningMonth = monthsWithData.length > 0
            ? (() => {
                const m = [...monthsWithData].sort((a, b) => b.income - a.income)[0];
                return m.income > 0 ? { month: m.monthName, amount: m.income } : null;
            })()
            : null;

        const biggestSpendingMonth = monthsWithData.length > 0
            ? (() => {
                const m = [...monthsWithData].sort((a, b) => b.expenses - a.expenses)[0];
                return m.expenses > 0 ? { month: m.monthName, amount: m.expenses } : null;
            })()
            : null;

        const mostProfitableMonth = monthsWithData.length > 0
            ? (() => {
                const m = [...monthsWithData].sort((a, b) => b.profit - a.profit)[0];
                return { month: m.monthName, amount: m.profit };
            })()
            : null;

        const worstMonth = monthsWithData.length > 0
            ? (() => {
                const m = [...monthsWithData].sort((a, b) => a.profit - b.profit)[0];
                return { month: m.monthName, amount: m.profit };
            })()
            : null;

        // ── Section 3: Spending Habits ────────────────────────────────────
        const categoryTotals: CategoryRankEntry[] = EXPENSE_CATEGORIES.map((cat) => ({
            name: cat,
            displayName: CATEGORY_BG_MAP[cat] ?? cat,
            amount: sumAmount(yearExpense.filter((e) => e.category === cat)),
        }))
            .filter((c) => c.amount > 0)
            .sort((a, b) => b.amount - a.amount);

        const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

        const incomeTransactionCount = yearIncome.length;
        const expenseTransactionCount = yearExpense.length;
        const totalTransactionCount = incomeTransactionCount + expenseTransactionCount;
        const avgExpensePerTransaction = expenseTransactionCount > 0
            ? totalExpenses / expenseTransactionCount
            : 0;

        // ── Section 4: Income Analysis ────────────────────────────────────
        const workIncome = sumAmount(yearIncome.filter((e) => e.isWorkIncome));
        const personalIncome = sumAmount(yearIncome.filter((e) => !e.isWorkIncome));
        const workExpenses = sumAmount(yearExpense.filter((e) => e.isWorkExpense));
        const personalExpenses = sumAmount(yearExpense.filter((e) => !e.isWorkExpense));

        // ── Section 5: Monthly Trends ─────────────────────────────────────
        const monthlyTrends: MonthlyTrendPoint[] = monthlyData.map((m) => ({
            month: m.monthName.slice(0, 3),
            income: m.income,
            expenses: m.expenses,
            profit: m.profit,
        }));

        // ── Section 6: Fun Facts ──────────────────────────────────────────
        // Group expenses by day
        const expensesByDay = new Map<string, number>();
        yearExpense.forEach((e) => {
            expensesByDay.set(e.date, (expensesByDay.get(e.date) ?? 0) + e.amount);
        });

        const incomeByDay = new Map<string, number>();
        yearIncome.forEach((e) => {
            incomeByDay.set(e.date, (incomeByDay.get(e.date) ?? 0) + e.amount);
        });

        let biggestSpendingDay: DayRecord | null = null;
        expensesByDay.forEach((amount, date) => {
            if (!biggestSpendingDay || amount > biggestSpendingDay.amount) {
                biggestSpendingDay = { date, amount };
            }
        });

        let biggestEarningDay: DayRecord | null = null;
        incomeByDay.forEach((amount, date) => {
            if (!biggestEarningDay || amount > biggestEarningDay.amount) {
                biggestEarningDay = { date, amount };
            }
        });

        const daysWithExpenses = expensesByDay.size;
        const avgDailyExpense = daysWithExpenses > 0
            ? totalExpenses / daysWithExpenses
            : 0;

        // Active days = unique days with any transaction
        const allDates = new Set<string>();
        yearIncome.forEach((e) => allDates.add(e.date));
        yearExpense.forEach((e) => allDates.add(e.date));
        const activeDays = allDates.size;

        // Kami spending: use the dedicated isWithKami boolean flag
        const kamiExpenses = sumAmount(
            yearExpense.filter((e) => e.isWithKami)
        );
        const kamiIncome = sumAmount(
            yearIncome.filter((e) => e.isWithKami)
        );
        const kamiSpending = kamiExpenses + kamiIncome;

        return {
            totalIncome,
            totalExpenses,
            netProfit,
            savingsRate,
            biggestEarningMonth,
            biggestSpendingMonth,
            mostProfitableMonth,
            worstMonth,
            topCategory,
            categoryRanking: categoryTotals,
            avgExpensePerTransaction,
            totalTransactionCount,
            incomeTransactionCount,
            expenseTransactionCount,
            workIncome,
            personalIncome,
            workExpenses,
            personalExpenses,
            monthlyTrends,
            biggestSpendingDay,
            biggestEarningDay,
            avgDailyExpense,
            activeDays,
            kamiSpending,
            hasData,
        };
    }, [incomeEntries, expenseEntries, year]);
};
