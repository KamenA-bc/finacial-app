/**
 * Tests for useHistoryData – verifies 12-month calendar aggregation,
 * daily breakdowns, category groupings, and full year totals.
 */
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useHistoryData } from './useHistoryData';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry, IncomeEntry } from '@/types';

describe('useHistoryData – 12-Month Calendar & Historical Aggregations', () => {
    beforeEach(() => {
        useFinancialStore.setState({
            incomeEntries: [],
            expenseEntries: [],
            selectedDate: '2026-09-09',
        });
    });

    it('initializes 12 months with zero values when store is empty', () => {
        const { result } = renderHook(() => useHistoryData(2026));

        expect(result.current.year).toBe(2026);
        expect(result.current.totalIncome).toBe(0);
        expect(result.current.totalExpenses).toBe(0);
        expect(result.current.totalProfit).toBe(0);
        expect(result.current.months).toHaveLength(12);

        result.current.months.forEach((m, idx) => {
            expect(m.month).toBe(idx);
            expect(m.income).toBe(0);
            expect(m.expenses).toBe(0);
            expect(m.profit).toBe(0);
            expect(m.hasData).toBe(false);
            expect(m.dailyBreakdown).toEqual([]);
            expect(m.categoryBreakdown).toEqual([]);
        });
    });

    it('aggregates transactions into correct months and calculates monthly profit', () => {
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2026-01-05', amount: 2000, description: 'Jan Freelance', isWorkIncome: true, isWithKami: false },
            { id: 'i2', date: '2026-03-20', amount: 3500, description: 'Mar Salary', isWorkIncome: true, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-01-10', amount: 500, description: 'Jan Groceries', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-01-20', amount: 300, description: 'Jan Fuel', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e3', date: '2026-03-25', amount: 1200, description: 'Mar Shopping', category: 'Shopping', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useHistoryData(2026));

        // Year totals
        expect(result.current.totalIncome).toBe(5500);
        expect(result.current.totalExpenses).toBe(2000);
        expect(result.current.totalProfit).toBe(3500);

        // January (month 0)
        const jan = result.current.months[0];
        expect(jan.hasData).toBe(true);
        expect(jan.income).toBe(2000);
        expect(jan.expenses).toBe(800);
        expect(jan.profit).toBe(1200);

        // February (month 1) - empty
        const feb = result.current.months[1];
        expect(feb.hasData).toBe(false);
        expect(feb.income).toBe(0);
        expect(feb.expenses).toBe(0);

        // March (month 2)
        const mar = result.current.months[2];
        expect(mar.hasData).toBe(true);
        expect(mar.income).toBe(3500);
        expect(mar.expenses).toBe(1200);
        expect(mar.profit).toBe(2300);
    });

    it('builds sorted daily breakdowns per month', () => {
        const incomeEntries: IncomeEntry[] = [
            { id: 'i1', date: '2026-05-15', amount: 1000, description: 'Salary', isWorkIncome: true, isWithKami: false },
        ];
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-05-02', amount: 50, description: 'Coffee', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-05-15', amount: 200, description: 'Bills', category: 'Сметки/Разходи', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries, expenseEntries });

        const { result } = renderHook(() => useHistoryData(2026));
        const may = result.current.months[4];

        expect(may.dailyBreakdown).toHaveLength(2);

        // May 2nd
        expect(may.dailyBreakdown[0].date).toBe('2026-05-02');
        expect(may.dailyBreakdown[0].income).toBe(0);
        expect(may.dailyBreakdown[0].expenses).toBe(50);
        expect(may.dailyBreakdown[0].profit).toBe(-50);

        // May 15th
        expect(may.dailyBreakdown[1].date).toBe('2026-05-15');
        expect(may.dailyBreakdown[1].income).toBe(1000);
        expect(may.dailyBreakdown[1].expenses).toBe(200);
        expect(may.dailyBreakdown[1].profit).toBe(800);
    });

    it('aggregates category breakdown correctly and filters out empty categories', () => {
        const expenseEntries: ExpenseEntry[] = [
            { id: 'e1', date: '2026-07-01', amount: 150, description: 'Dinner', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e2', date: '2026-07-10', amount: 250, description: 'Lunch', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'e3', date: '2026-07-15', amount: 100, description: 'Fuel', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ incomeEntries: [], expenseEntries });

        const { result } = renderHook(() => useHistoryData(2026));
        const jul = result.current.months[6];

        expect(jul.categoryBreakdown).toHaveLength(2);
        const eatingOut = jul.categoryBreakdown.find((c) => c.name === 'Eating out');
        const fuel = jul.categoryBreakdown.find((c) => c.name === 'Гориво');

        expect(eatingOut?.value).toBe(400);
        expect(fuel?.value).toBe(100);
    });
});
