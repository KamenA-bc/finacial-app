import { describe, it, expect } from 'vitest';
import { filterTransactions, DEFAULT_TRANSACTION_FILTERS } from '@/lib/filterTransactions';
import { ExpenseEntry, IncomeEntry, TransactionFilters } from '@/types';

const SAMPLE_INCOMES: IncomeEntry[] = [
    {
        id: 'inc-1',
        date: '2026-10-05',
        amount: 1200,
        description: 'Заплата Октомври',
        isWorkIncome: true,
        isWithKami: false,
    },
    {
        id: 'inc-2',
        date: '2026-10-12',
        amount: 150.5,
        description: 'Общ проект с Ками',
        isWorkIncome: true,
        isWithKami: true,
    },
    {
        id: 'inc-3',
        date: '2026-10-18',
        amount: 50,
        description: 'Подарък от баба',
        isWorkIncome: false,
        isWithKami: false,
    },
];

const SAMPLE_EXPENSES: ExpenseEntry[] = [
    {
        id: 'exp-1',
        date: '2026-10-02',
        amount: 45.2,
        description: 'Lidl пазар',
        category: 'Магазини (Храна/Вода)',
        isWorkExpense: false,
        isWithKami: true,
        isWithOthers: false,
    },
    {
        id: 'exp-2',
        date: '2026-10-10',
        amount: 80,
        description: 'Лукойл дизел',
        category: 'Гориво',
        isWorkExpense: true,
        isWithKami: true,
        isWithOthers: true,
    },
    {
        id: 'exp-3',
        date: '2026-10-14',
        amount: 25.5,
        description: 'Вечеря с приятели',
        category: 'Eating out',
        isWorkExpense: false,
        isWithKami: false,
        isWithOthers: true,
    },
    {
        id: 'exp-4',
        date: '2026-10-18',
        amount: 19.99,
        description: 'Аптека Софарма',
        category: 'Health/Аптека',
        isWorkExpense: false,
        isWithKami: false,
        isWithOthers: false,
    },
];

const makeFilters = (overrides: Partial<TransactionFilters> = {}): TransactionFilters => ({
    ...DEFAULT_TRANSACTION_FILTERS,
    ...overrides,
});

describe('filterTransactions', () => {
    it('returns all entries and computes totals when no filters are active', () => {
        const result = filterTransactions(SAMPLE_INCOMES, SAMPLE_EXPENSES, makeFilters());

        expect(result.filteredIncome).toHaveLength(3);
        expect(result.filteredExpense).toHaveLength(4);
        expect(result.filteredIncomeTotal).toBeCloseTo(1400.5);
        expect(result.filteredExpenseTotal).toBeCloseTo(170.69);
        expect(result.hasActiveFilters).toBe(false);
    });

    it('matches Cyrillic and Latin search queries case-insensitively across description and category', () => {
        const byMerchant = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: '  lIdL  ' })
        );
        expect(byMerchant.filteredIncome).toHaveLength(0);
        expect(byMerchant.filteredExpense.map((e) => e.id)).toEqual(['exp-1']);
        expect(byMerchant.hasActiveFilters).toBe(true);

        const byCyrillicCategory = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: 'ГОРИВО' })
        );
        expect(byCyrillicCategory.filteredExpense.map((e) => e.id)).toEqual(['exp-2']);
    });

    it('matches numeric amounts written with either a dot or a comma', () => {
        const withDot = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: '25.50' })
        );
        expect(withDot.filteredExpense.map((e) => e.id)).toEqual(['exp-3']);

        const withComma = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: '25,50' })
        );
        expect(withComma.filteredExpense.map((e) => e.id)).toEqual(['exp-3']);
    });

    it('combines multiple flag chips with AND and matches any entry having all selected flags regardless of other flags', () => {
        // Both Work AND Kami selected -> matches inc-2 (Work + Kami) and exp-2 (Work + Kami + Others)
        const workAndKami = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ isWork: true, isKami: true })
        );
        expect(workAndKami.filteredIncome.map((i) => i.id)).toEqual(['inc-2']);
        expect(workAndKami.filteredExpense.map((e) => e.id)).toEqual(['exp-2']);

        // Shared (С Други) selected -> hides all income and returns expenses with isWithOthers=true
        const sharedOnly = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ isShared: true })
        );
        expect(sharedOnly.filteredIncome).toHaveLength(0);
        expect(sharedOnly.filteredExpense.map((e) => e.id)).toEqual(['exp-2', 'exp-3']);
    });

    it('filters by a specific category and hides income entries when a category filter is active', () => {
        const result = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ category: 'Магазини (Храна/Вода)' })
        );
        expect(result.filteredIncome).toHaveLength(0);
        expect(result.filteredExpense.map((e) => e.id)).toEqual(['exp-1']);
        expect(result.filteredExpenseTotal).toBeCloseTo(45.2);
    });

    it('resolves the synthetic "Останали" slice against non-top-5 remainder categories', () => {
        const result = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ category: 'Останали' }),
            ['Health/Аптека', 'Eating out']
        );
        expect(result.filteredIncome).toHaveLength(0);
        expect(result.filteredExpense.map((e) => e.id)).toEqual(['exp-3', 'exp-4']);
    });

    it('matches all income entries when searching "Приход", "Приходи", "Доход", "Постъпление", or "Income"', () => {
        for (const term of ['Приход', 'приходи', 'ДОХОД', 'постъпление', 'Спечелени пари', 'income']) {
            const result = filterTransactions(
                SAMPLE_INCOMES,
                SAMPLE_EXPENSES,
                makeFilters({ searchQuery: term })
            );
            expect(result.filteredIncome).toHaveLength(3);
            expect(result.filteredExpense).toHaveLength(0);
        }
    });

    it('matches all expense entries when searching "Разход", "Разходи", "Харч", "Плащане", or "Expense"', () => {
        for (const term of ['Разход', 'разходи', 'ХАРЧ', 'плащане', 'покупка', 'expense']) {
            const result = filterTransactions(
                SAMPLE_INCOMES,
                SAMPLE_EXPENSES,
                makeFilters({ searchQuery: term })
            );
            expect(result.filteredIncome).toHaveLength(0);
            expect(result.filteredExpense).toHaveLength(4);
        }
    });

    it('matches bilingual category and flag synonyms (e.g. "ресторант" for Eating out, "ками" for Kami ❤️)', () => {
        const restaurantSearch = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: 'ресторант' })
        );
        expect(restaurantSearch.filteredExpense.map((e) => e.id)).toEqual(['exp-3']);

        const kamiSearch = filterTransactions(
            SAMPLE_INCOMES,
            SAMPLE_EXPENSES,
            makeFilters({ searchQuery: 'ками' })
        );
        expect(kamiSearch.filteredIncome.map((i) => i.id)).toEqual(['inc-2']);
        expect(kamiSearch.filteredExpense.map((e) => e.id)).toEqual(['exp-1', 'exp-2']);
    });
});

