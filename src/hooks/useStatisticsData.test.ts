/**
 * Tests for useStatisticsData – verifies financial metrics, aggregations,
 * KPIs, and specifically that Kami calculations ignore income entries.
 */
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useStatisticsData } from './useStatisticsData';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry, IncomeEntry } from '@/types';

describe('useStatisticsData – Mathematical Aggregations & KPIs', () => {
    beforeEach(() => {
        useFinancialStore.setState({
            incomeEntries: [],
            expenseEntries: [],
            selectedDate: '2026-09-09',
        });
    });

    it('returns zeroes and nulls when no data exists for the year', () => {
        const { result } = renderHook(() => useStatisticsData(2026));

        expect(result.current.hasData).toBe(false);
        expect(result.current.totalIncome).toBe(0);
        expect(result.current.totalExpenses).toBe(0);
        expect(result.current.netProfit).toBe(0);
        expect(result.current.savingsRate).toBe(0);
        expect(result.current.biggestEarningMonth).toBeNull();
        expect(result.current.biggestSpendingMonth).toBeNull();
        expect(result.current.mostProfitableMonth).toBeNull();
        expect(result.current.worstMonth).toBeNull();
        expect(result.current.topCategory).toBeNull();
        expect(result.current.categoryRanking).toEqual([]);
        expect(result.current.activeDays).toBe(0);
        expect(result.current.avgDailyExpense).toBe(0);
        expect(result.current.kamiSpending).toBe(0);
    });

    it('calculates total income, expenses, net profit, and savings rate correctly', () => {
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2026-01-15', amount: 3000, description: 'Salary', isWorkIncome: true, isWithKami: false },
            { id: 'i2', date: '2026-02-10', amount: 1000, description: 'Bonus', isWorkIncome: false, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-01-20', amount: 800, description: 'Rent', category: 'Сметки/Разходи', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-02-15', amount: 1200, description: 'Flight', category: 'Пътуване', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useStatisticsData(2026));

        expect(result.current.hasData).toBe(true);
        expect(result.current.totalIncome).toBe(4000);
        expect(result.current.totalExpenses).toBe(2000);
        expect(result.current.netProfit).toBe(2000);
        // Savings rate = (2000 / 4000) * 100 = 50%
        expect(result.current.savingsRate).toBe(50);
        expect(result.current.workIncome).toBe(3000);
        expect(result.current.personalIncome).toBe(1000);
    });

    it('handles zero income gracefully without NaN for savingsRate', () => {
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-05-10', amount: 500, description: 'Groceries', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries: [], expenseEntries });

        const { result } = renderHook(() => useStatisticsData(2026));

        expect(result.current.totalIncome).toBe(0);
        expect(result.current.totalExpenses).toBe(500);
        expect(result.current.netProfit).toBe(-500);
        expect(result.current.savingsRate).toBe(0);
        expect(Number.isNaN(result.current.savingsRate)).toBe(false);
    });

    it('strictly calculates kamiSpending from expenses and ignores income with isWithKami', () => {
        // Business rule: Kami is strictly for tracking shared/Kami expenses.
        // Even if an income entry has isWithKami: true in the database, it MUST NOT be added to kamiSpending.
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2026-09-01', amount: 1000, description: 'Shared gift income', isWorkIncome: false, isWithKami: true },
            { id: 'i2', date: '2026-09-02', amount: 500, description: 'Regular income', isWorkIncome: true, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-09-05', amount: 150, description: 'Dinner with Kami', category: 'Eating out', isWorkExpense: false, isWithKami: true, isWithOthers: false },
            { id: 'e2', date: '2026-09-06', amount: 80, description: 'Groceries with Kami', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: true, isWithOthers: false },
            { id: 'e3', date: '2026-09-07', amount: 200, description: 'Solo tech purchase', category: 'Shopping', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useStatisticsData(2026));

        // Kami spending must ONLY sum e1 (150) + e2 (80) = 230
        // i1 (1000) MUST NOT be included or subtracted
        expect(result.current.kamiSpending).toBe(230);
    });

    it('correctly identifies best and worst months', () => {
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2026-01-10', amount: 5000, description: 'Jan Pay', isWorkIncome: true, isWithKami: false },
            { id: 'i2', date: '2026-03-15', amount: 2000, description: 'Mar Pay', isWorkIncome: true, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-01-15', amount: 1000, description: 'Jan Exp', category: 'Сметки/Разходи', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-03-20', amount: 4000, description: 'Mar Exp', category: 'Shopping', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useStatisticsData(2026));

        // Jan: Income 5000, Expense 1000, Profit +4000
        // Mar: Income 2000, Expense 4000, Profit -2000
        expect(result.current.biggestEarningMonth?.amount).toBe(5000);
        expect(result.current.biggestSpendingMonth?.amount).toBe(4000);
        expect(result.current.mostProfitableMonth?.amount).toBe(4000);
        expect(result.current.worstMonth?.amount).toBe(-2000);
    });

    it('filters out entries that belong to other years', () => {
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2025-12-31', amount: 10000, description: 'Old year', isWorkIncome: false, isWithKami: false },
            { id: 'i2', date: '2026-01-01', amount: 1500, description: 'Current year', isWorkIncome: false, isWithKami: false },
            { id: 'i3', date: '2027-01-01', amount: 20000, description: 'Future year', isWorkIncome: false, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2025-12-31', amount: 5000, description: 'Old expense', category: 'Други', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-06-15', amount: 300, description: 'Current expense', category: 'Други', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useStatisticsData(2026));

        expect(result.current.totalIncome).toBe(1500);
        expect(result.current.totalExpenses).toBe(300);
        expect(result.current.netProfit).toBe(1200);
    });
});
