/**
 * Centralized Zustand store – single source of truth for all financial data.
 * Data is persisted in Supabase (global DB), not localStorage.
 * The store acts as a thin client-side cache that syncs with the database.
 *
 * All Supabase operations are wrapped with `withJwtRetry` to transparently
 * handle transient "JWT Issued at future" (PGRST303) clock-skew errors
 * with exponential back-off and session refresh.
 */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialStore, IncomeEntry, ExpenseEntry } from '@/types';
import { toISODateString } from '@/lib/dateUtils';
import { supabase } from '@/lib/supabase';
import { logError, extractErrorMessage } from '@/lib/errorLogger';
import { withJwtRetry } from '@/lib/supabaseRetry';

/**
 * Minimum interval (ms) between two successive fetchTransactions calls.
 * Prevents redundant fetches when the user navigates between pages that
 * all call fetchTransactions on mount (Dashboard, History, Statistics).
 */
const FETCH_DEDUP_MS = 10_000;

function generateTempId(prefix: string): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const isMockTestUser = (id: string | null | undefined): boolean =>
    id === 'e2e-test-user-id' || id === '00000000-0000-0000-0000-000000000001';

function resolveTargetYear(targetYear?: number, selectedDate?: string): number {
    if (typeof targetYear === 'number' && Number.isInteger(targetYear) && targetYear >= 2000 && targetYear <= 2100) {
        return targetYear;
    }
    if (selectedDate && typeof selectedDate === 'string' && selectedDate.length >= 4) {
        const parsed = parseInt(selectedDate.slice(0, 4), 10);
        if (Number.isInteger(parsed) && parsed >= 2000 && parsed <= 2100) {
            return parsed;
        }
    }
    return new Date().getFullYear();
}

export const useFinancialStore = create<FinancialStore>()(
    persist(
        (set, get) => ({
    incomeEntries: [],
    expenseEntries: [],
    selectedDate: toISODateString(new Date()),
    userId: null,
    isLoading: false,
    error: null,
    lastFetchedAt: null,
    loadedYears: [],

    setUserId: (userId: string | null): void => {
        set({ userId });
    },

    fetchTransactions: async (userId: string, targetYear?: number) => {
        const { lastFetchedAt, userId: currentUserId, loadedYears, selectedDate } = get();
        const year = resolveTargetYear(targetYear, selectedDate);

        // ── Mock Test User Guard: skip real DB query in E2E mock sessions ──
        if (!userId || isMockTestUser(userId)) {
            set((state) => ({
                userId,
                loadedYears: state.loadedYears.includes(year) ? state.loadedYears : [...state.loadedYears, year],
                isLoading: false,
                lastFetchedAt: Date.now(),
            }));
            return;
        }

        // ── Deduplication guard: skip if year is already loaded and was fetched recently ──
        const isYearLoaded = loadedYears.includes(year);
        if (currentUserId === userId && isYearLoaded && lastFetchedAt && Date.now() - lastFetchedAt < FETCH_DEDUP_MS) {
            return;
        }

        // Only set full-screen loader if the target year is not yet cached in memory
        if (!isYearLoaded) {
            set({ isLoading: true, error: null });
        }
        try {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;

            const [incomeRes, expenseRes] = await withJwtRetry(async () => {
                const results = await Promise.all([
                    supabase
                        .from('income_entries')
                        .select('id, date, amount, description, is_work_income, is_with_kami')
                        .eq('user_id', userId)
                        .gte('date', startDate)
                        .lte('date', endDate)
                        .order('date', { ascending: true }),
                    supabase
                        .from('expense_entries')
                        .select('id, date, amount, description, category, is_work_expense, is_with_kami, is_with_others')
                        .eq('user_id', userId)
                        .gte('date', startDate)
                        .lte('date', endDate)
                        .order('date', { ascending: true }),
                ]);

                if (results[0].error) throw results[0].error;
                if (results[1].error) throw results[1].error;

                return results;
            }, 'fetchTransactions');

            const newIncomeEntries: IncomeEntry[] = (incomeRes.data ?? []).map((row) => ({
                id: row.id,
                date: row.date,
                amount: Number(row.amount),
                description: row.description ?? '',
                isWorkIncome: Boolean(row.is_work_income),
                isWithKami: Boolean(row.is_with_kami),
            }));

            const newExpenseEntries: ExpenseEntry[] = (expenseRes.data ?? []).map((row) => ({
                id: row.id,
                date: row.date,
                amount: Number(row.amount),
                description: row.description ?? '',
                category: row.category,
                isWorkExpense: Boolean(row.is_work_expense),
                isWithKami: Boolean(row.is_with_kami),
                isWithOthers: Boolean(row.is_with_others),
            }));

            set((state) => {
                const incomeMap = new Map(state.incomeEntries.map((e) => [e.id, e]));
                newIncomeEntries.forEach((e) => incomeMap.set(e.id, e));

                const expenseMap = new Map(state.expenseEntries.map((e) => [e.id, e]));
                newExpenseEntries.forEach((e) => expenseMap.set(e.id, e));

                const updatedLoadedYears = state.loadedYears.includes(year)
                    ? state.loadedYears
                    : [...state.loadedYears, year];

                return {
                    incomeEntries: Array.from(incomeMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
                    expenseEntries: Array.from(expenseMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
                    loadedYears: updatedLoadedYears,
                    userId,
                    isLoading: false,
                    lastFetchedAt: Date.now(),
                };
            });
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('fetchTransactions', err, { userId, year });
            set({ error: message, isLoading: false });
        }
    },

    addIncome: async (entry: Omit<IncomeEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        const tempId = generateTempId('temp_inc');
        const optimisticEntry: IncomeEntry = {
            id: tempId,
            date: entry.date,
            amount: entry.amount,
            description: entry.description,
            isWorkIncome: entry.isWorkIncome,
            isWithKami: entry.isWithKami,
        };

        // 1. Optimistically insert into local state immediately (0ms UI latency)
        set((state) => ({
            incomeEntries: [...state.incomeEntries, optimisticEntry],
            error: null,
        }));

        if (isMockTestUser(userId)) return;

        try {
            const { data } = await withJwtRetry(async () => {
                const res = await supabase
                    .from('income_entries')
                    .insert({
                        user_id: userId,
                        date: entry.date,
                        amount: entry.amount,
                        description: entry.description,
                        is_work_income: entry.isWorkIncome,
                        is_with_kami: entry.isWithKami,
                    })
                    .select('id, date, amount, description, is_work_income, is_with_kami')
                    .single();

                if (res.error) throw res.error;
                return res;
            }, 'addIncome');

            const mapped: IncomeEntry = {
                id: (data as Record<string, unknown>).id as string,
                date: (data as Record<string, unknown>).date as string,
                amount: (data as Record<string, unknown>).amount as number,
                description: (data as Record<string, unknown>).description as string,
                isWorkIncome: ((data as Record<string, unknown>).is_work_income as boolean) ?? false,
                isWithKami: ((data as Record<string, unknown>).is_with_kami as boolean) ?? false,
            };

            // 2. Seamlessly swap temporary ID with persistent database ID
            set((state) => ({
                incomeEntries: state.incomeEntries.map((e) => (e.id === tempId ? mapped : e)),
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('addIncome', err, { userId });
            // 3. Roll back optimistic entry on failure
            set((state) => ({
                incomeEntries: state.incomeEntries.filter((e) => e.id !== tempId),
                error: message,
            }));
        }
    },

    addExpense: async (entry: Omit<ExpenseEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        const tempId = generateTempId('temp_exp');
        const optimisticEntry: ExpenseEntry = {
            id: tempId,
            date: entry.date,
            amount: entry.amount,
            description: entry.description,
            category: entry.category,
            isWorkExpense: entry.isWorkExpense,
            isWithKami: entry.isWithKami,
            isWithOthers: entry.isWithOthers,
        };

        // 1. Optimistically insert into local state immediately (0ms UI latency)
        set((state) => ({
            expenseEntries: [...state.expenseEntries, optimisticEntry],
            error: null,
        }));

        if (isMockTestUser(userId)) return;

        try {
            const { data } = await withJwtRetry(async () => {
                const res = await supabase
                    .from('expense_entries')
                    .insert({
                        user_id: userId,
                        date: entry.date,
                        amount: entry.amount,
                        description: entry.description,
                        category: entry.category,
                        is_work_expense: entry.isWorkExpense,
                        is_with_kami: entry.isWithKami,
                        is_with_others: entry.isWithOthers,
                    })
                    .select('id, date, amount, description, category, is_work_expense, is_with_kami, is_with_others')
                    .single();

                if (res.error) throw res.error;
                return res;
            }, 'addExpense');

            const mapped: ExpenseEntry = {
                id: (data as Record<string, unknown>).id as string,
                date: (data as Record<string, unknown>).date as string,
                amount: (data as Record<string, unknown>).amount as number,
                description: (data as Record<string, unknown>).description as string,
                category: (data as Record<string, unknown>).category as ExpenseEntry['category'],
                isWorkExpense: ((data as Record<string, unknown>).is_work_expense as boolean) ?? false,
                isWithKami: ((data as Record<string, unknown>).is_with_kami as boolean) ?? false,
                isWithOthers: ((data as Record<string, unknown>).is_with_others as boolean) ?? false,
            };

            // 2. Seamlessly swap temporary ID with persistent database ID
            set((state) => ({
                expenseEntries: state.expenseEntries.map((e) => (e.id === tempId ? mapped : e)),
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('addExpense', err, { userId });
            // 3. Roll back optimistic entry on failure
            set((state) => ({
                expenseEntries: state.expenseEntries.filter((e) => e.id !== tempId),
                error: message,
            }));
        }
    },

    deleteIncome: async (id: string): Promise<void> => {
        const previousEntries = get().incomeEntries;
        const target = previousEntries.find((e) => e.id === id);
        if (!target) return;

        // 1. Optimistically remove immediately from local state
        set((state) => ({
            incomeEntries: state.incomeEntries.filter((e) => e.id !== id),
            error: null,
        }));

        if (id.startsWith('temp_')) return;

        try {
            await withJwtRetry(async () => {
                const { error } = await supabase
                    .from('income_entries')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }, 'deleteIncome');
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('deleteIncome', err, { entryId: id });
            // 2. Roll back state on failure
            set({
                incomeEntries: previousEntries,
                error: message,
            });
        }
    },

    deleteExpense: async (id: string): Promise<void> => {
        const previousEntries = get().expenseEntries;
        const target = previousEntries.find((e) => e.id === id);
        if (!target) return;

        // 1. Optimistically remove immediately from local state
        set((state) => ({
            expenseEntries: state.expenseEntries.filter((e) => e.id !== id),
            error: null,
        }));

        if (id.startsWith('temp_')) return;

        try {
            await withJwtRetry(async () => {
                const { error } = await supabase
                    .from('expense_entries')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }, 'deleteExpense');
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('deleteExpense', err, { entryId: id });
            // 2. Roll back state on failure
            set({
                expenseEntries: previousEntries,
                error: message,
            });
        }
    },

    setSelectedDate: (date: string): void => {
        set({ selectedDate: date });
    },
}),
        {
            name: 'finance-tracker-store-cache',
            partialize: (state) => ({
                incomeEntries: state.incomeEntries,
                expenseEntries: state.expenseEntries,
                loadedYears: state.loadedYears,
            }),
        }
    )
);
