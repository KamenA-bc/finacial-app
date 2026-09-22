/**
 * Tests for type definitions and data contracts.
 * Ensures that ExpenseEntry includes isWithOthers but IncomeEntry does not.
 */

import { describe, it, expect } from 'vitest';
import type { IncomeEntry, ExpenseEntry } from '@/types';

const makeIncome = (overrides: Partial<IncomeEntry> = {}): IncomeEntry => ({
    id: 'inc-1',
    date: '2026-08-11',
    amount: 100,
    description: 'Test income',
    isWorkIncome: false,
    isWithKami: false,
    ...overrides,
});

const makeExpense = (overrides: Partial<ExpenseEntry> = {}): ExpenseEntry => ({
    id: 'exp-1',
    date: '2026-08-11',
    amount: 50,
    description: 'Test expense',
    category: 'Други',
    isWorkExpense: false,
    isWithKami: false,
    isWithOthers: false,
    ...overrides,
});

describe('ExpenseEntry type contract', () => {
    it('includes isWithOthers field', () => {
        const expense = makeExpense({ isWithOthers: true });
        expect(expense.isWithOthers).toBe(true);
    });

    it('defaults isWithOthers to false', () => {
        const expense = makeExpense();
        expect(expense.isWithOthers).toBe(false);
    });

    it('includes all three boolean flags', () => {
        const expense = makeExpense({
            isWorkExpense: true,
            isWithKami: true,
            isWithOthers: true,
        });
        expect(expense.isWorkExpense).toBe(true);
        expect(expense.isWithKami).toBe(true);
        expect(expense.isWithOthers).toBe(true);
    });

    it('has required fields: id, date, amount, description, category', () => {
        const expense = makeExpense();
        expect(expense.id).toBeDefined();
        expect(expense.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof expense.amount).toBe('number');
        expect(typeof expense.description).toBe('string');
        expect(typeof expense.category).toBe('string');
    });
});

describe('IncomeEntry type contract', () => {
    it('does NOT include isWithOthers field', () => {
        const income = makeIncome();
        expect('isWithOthers' in income).toBe(false);
    });

    it('includes isWithKami field', () => {
        const income = makeIncome({ isWithKami: true });
        expect(income.isWithKami).toBe(true);
    });

    it('has required fields: id, date, amount, description', () => {
        const income = makeIncome();
        expect(income.id).toBeDefined();
        expect(income.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof income.amount).toBe('number');
        expect(typeof income.description).toBe('string');
    });
});

describe('ExpenseEntry vs IncomeEntry – structural differences', () => {
    it('ExpenseEntry has category and isWithOthers, IncomeEntry does not', () => {
        const expense = makeExpense();
        const income = makeIncome();
        expect('category' in expense).toBe(true);
        expect('isWithOthers' in expense).toBe(true);
        expect('category' in income).toBe(false);
        expect('isWithOthers' in income).toBe(false);
    });
});

describe('Expense categories contract', () => {
    it('contains Home category right before Shopping in EXPENSE_CATEGORIES', async () => {
        const { EXPENSE_CATEGORIES, CATEGORY_BG_MAP, CHART_COLORS } = await import('@/lib/constants');
        
        expect(EXPENSE_CATEGORIES).toContain('Home');
        const homeIndex = EXPENSE_CATEGORIES.indexOf('Home');
        const shoppingIndex = EXPENSE_CATEGORIES.indexOf('Shopping');
        expect(homeIndex).toBe(shoppingIndex - 1);
        expect(CATEGORY_BG_MAP['Home']).toBe('Home');
        expect(CHART_COLORS).toHaveLength(EXPENSE_CATEGORIES.length);
        expect(EXPENSE_CATEGORIES).toHaveLength(14);
    });

    it('allows Home as a valid category on an ExpenseEntry', () => {
        const expense = makeExpense({ category: 'Home' });
        expect(expense.category).toBe('Home');
    });
});

