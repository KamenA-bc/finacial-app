import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFinancialData } from './useFinancialData';
import { useFinancialStore } from '@/store/transactionStore';
import { IncomeEntry, ExpenseEntry } from '@/types';

describe('useFinancialData - Financial Math & Aggregations', () => {
    beforeEach(() => {
        act(() => {
            useFinancialStore.setState({
                incomeEntries: [],
                expenseEntries: [],
                selectedDate: '2026-09-09',
                userId: 'test-user',
                isLoading: false,
                error: null,
                loadedYears: [2026],
            });
        });
    });

    it('calculates daily profit correctly when income exceeds expenses', () => {
        const income: IncomeEntry[] = [
            { id: 'inc-1', date: '2026-09-09', amount: 500, description: 'Salary', isWorkIncome: true, isWithKami: false },
            { id: 'inc-2', date: '2026-09-09', amount: 150, description: 'Freelance', isWorkIncome: true, isWithKami: false },
        ];
        const expenses: ExpenseEntry[] = [
            { id: 'exp-1', date: '2026-09-09', amount: 200, description: 'Groceries', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'exp-2', date: '2026-09-09', amount: 50, description: 'Coffee', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        act(() => {
            useFinancialStore.setState({ incomeEntries: income, expenseEntries: expenses });
        });

        const { result } = renderHook(() => useFinancialData());

        expect(result.current.dailyIncome).toBe(650);
        expect(result.current.dailyExpenses).toBe(250);
        expect(result.current.dailyProfit).toBe(400); // 650 - 250 = 400
    });

    it('calculates daily profit as a negative number when expenses exceed income (loss scenario)', () => {
        const income: IncomeEntry[] = [
            { id: 'inc-1', date: '2026-09-09', amount: 100, description: 'Side gig', isWorkIncome: false, isWithKami: false },
        ];
        const expenses: ExpenseEntry[] = [
            { id: 'exp-1', date: '2026-09-09', amount: 350, description: 'Car repair', category: 'Сметки/Разходи', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        act(() => {
            useFinancialStore.setState({ incomeEntries: income, expenseEntries: expenses });
        });

        const { result } = renderHook(() => useFinancialData());

        expect(result.current.dailyIncome).toBe(100);
        expect(result.current.dailyExpenses).toBe(350);
        expect(result.current.dailyProfit).toBe(-250); // 100 - 350 = -250
    });

    it('faithfully calculates user screenshot scenario: 1455 income, 855 expenses = +600 profit', () => {
        // User had 7 incomes: 100, 100, 100, 100, 55, 500, 500 = 1455
        const income: IncomeEntry[] = [
            { id: 'inc-1', date: '2026-09-09', amount: 100, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-2', date: '2026-09-09', amount: 100, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-3', date: '2026-09-09', amount: 100, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-4', date: '2026-09-09', amount: 100, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-5', date: '2026-09-09', amount: 55, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-6', date: '2026-09-09', amount: 500, description: 'Приход', isWorkIncome: false, isWithKami: false },
            { id: 'inc-7', date: '2026-09-09', amount: 500, description: 'YES', isWorkIncome: true, isWithKami: false },
        ];
        // 4 visible expenses: test (100), yes (100), new (100), fff (555) = 855
        const expenses: ExpenseEntry[] = [
            { id: 'exp-1', date: '2026-09-09', amount: 100, description: 'test', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'exp-2', date: '2026-09-09', amount: 100, description: 'yes', category: 'Магазини (Храна/Вода)', isWorkExpense: true, isWithKami: true, isWithOthers: true },
            { id: 'exp-3', date: '2026-09-09', amount: 100, description: 'new', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: true, isWithOthers: false },
            { id: 'exp-4', date: '2026-09-09', amount: 555, description: 'fff', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        act(() => {
            useFinancialStore.setState({ incomeEntries: income, expenseEntries: expenses });
        });

        const { result } = renderHook(() => useFinancialData());

        expect(result.current.dailyIncome).toBe(1455);
        expect(result.current.dailyExpenses).toBe(855);
        expect(result.current.dailyProfit).toBe(600); // 1455 - 855 = 600
    });

    it('isolates daily entries to the selected date only', () => {
        const income: IncomeEntry[] = [
            { id: 'inc-1', date: '2026-09-09', amount: 200, description: 'Today', isWorkIncome: false, isWithKami: false },
            { id: 'inc-2', date: '2026-09-08', amount: 300, description: 'Yesterday', isWorkIncome: false, isWithKami: false },
            { id: 'inc-3', date: '2026-09-10', amount: 400, description: 'Tomorrow', isWorkIncome: false, isWithKami: false },
        ];
        const expenses: ExpenseEntry[] = [
            { id: 'exp-1', date: '2026-09-09', amount: 50, description: 'Today exp', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'exp-2', date: '2026-09-08', amount: 150, description: 'Yesterday exp', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        act(() => {
            useFinancialStore.setState({
                selectedDate: '2026-09-09',
                incomeEntries: income,
                expenseEntries: expenses,
            });
        });

        const { result } = renderHook(() => useFinancialData());

        // Daily only matches 2026-09-09
        expect(result.current.dailyIncome).toBe(200);
        expect(result.current.dailyExpenses).toBe(50);
        expect(result.current.dailyProfit).toBe(150);

        // Monthly includes all September entries (200 + 300 + 400 = 900 income, 50 + 150 = 200 expense)
        expect(result.current.monthlyIncome).toBe(900);
        expect(result.current.monthlyExpenses).toBe(200);
        expect(result.current.monthlyProfit).toBe(700);
    });

    it('aggregates category breakdown accurately and filters zero sums', () => {
        const expenses: ExpenseEntry[] = [
            { id: 'exp-1', date: '2026-09-01', amount: 120, description: 'Supermarket', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'exp-2', date: '2026-09-05', amount: 80, description: 'Market', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: 'exp-3', date: '2026-09-09', amount: 60, description: 'Gas', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        act(() => {
            useFinancialStore.setState({ expenseEntries: expenses });
        });

        const { result } = renderHook(() => useFinancialData());

        expect(result.current.monthlyCategoryBreakdown).toEqual([
            { name: 'Магазини (Храна/Вода)', value: 200 },
            { name: 'Гориво', value: 60 },
        ]);
    });
});
