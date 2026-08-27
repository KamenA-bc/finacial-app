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

export const useFinancialStore = create<FinancialStore>()((set, get) => ({
    incomeEntries: [],
    expenseEntries: [],
    selectedDate: toISODateString(new Date()),
    userId: null,
    isLoading: false,
    error: null,
    lastFetchedAt: null,

    setUserId: (userId: string | null): void => {
        set({ userId });
    },

    fetchTransactions: async (userId: string) => {
        // ── Deduplication guard ──────────────────────────────────────────
        const { lastFetchedAt } = get();
        if (lastFetchedAt && Date.now() - lastFetchedAt < FETCH_DEDUP_MS) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const [incomeRes, expenseRes] = await withJwtRetry(async () => {
                const results = await Promise.all([
                    supabase
                        .from('income_entries')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: true }),
                    supabase
                        .from('expense_entries')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: true }),
                ]);

                if (results[0].error) throw results[0].error;
                if (results[1].error) throw results[1].error;

                return results;
            }, 'fetchTransactions');

            const incomeEntries: IncomeEntry[] = (incomeRes.data ?? []).map((row) => ({
                id: row.id,
                date: row.date,
                amount: Number(row.amount),
                description: row.description ?? '',
                isWorkIncome: Boolean(row.is_work_income),
                isWithKami: Boolean(row.is_with_kami),
            }));

            const expenseEntries: ExpenseEntry[] = (expenseRes.data ?? []).map((row) => ({
                id: row.id,
                date: row.date,
                amount: Number(row.amount),
                description: row.description ?? '',
                category: row.category,
                isWorkExpense: Boolean(row.is_work_expense),
                isWithKami: Boolean(row.is_with_kami),
                isWithOthers: Boolean(row.is_with_others),
            }));

            set({
                incomeEntries,
                expenseEntries,
                userId,
                isLoading: false,
                lastFetchedAt: Date.now(),
            });
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('fetchTransactions', err, { userId });
            set({ error: message, isLoading: false });
        }
    },

    addIncome: async (entry: Omit<IncomeEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        set({ error: null });
        try {
            const { data } = await withJwtRetry(async () => {
                const res = await supabase
                    .from('income_entries')
                    .insert({ user_id: userId, date: entry.date, amount: entry.amount, description: entry.description, is_work_income: entry.isWorkIncome, is_with_kami: entry.isWithKami })
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

            set((state) => ({
                incomeEntries: [...state.incomeEntries, mapped],
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('addIncome', err, { userId: get().userId });
            set({ error: message });
        }
    },

    addExpense: async (entry: Omit<ExpenseEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        set({ error: null });
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
                category: (data as Record<string, unknown>).category as string as ExpenseEntry['category'],
                isWorkExpense: ((data as Record<string, unknown>).is_work_expense as boolean) ?? false,
                isWithKami: ((data as Record<string, unknown>).is_with_kami as boolean) ?? false,
                isWithOthers: ((data as Record<string, unknown>).is_with_others as boolean) ?? false,
            };

            set((state) => ({
                expenseEntries: [...state.expenseEntries, mapped],
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('addExpense', err, { userId: get().userId });
            set({ error: message });
        }
    },

    deleteIncome: async (id: string): Promise<void> => {
        set({ error: null });
        try {
            await withJwtRetry(async () => {
                const { error } = await supabase
                    .from('income_entries')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }, 'deleteIncome');

            set((state) => ({
                incomeEntries: state.incomeEntries.filter((e) => e.id !== id),
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('deleteIncome', err, { entryId: id });
            set({ error: message });
        }
    },

    deleteExpense: async (id: string): Promise<void> => {
        set({ error: null });
        try {
            await withJwtRetry(async () => {
                const { error } = await supabase
                    .from('expense_entries')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }, 'deleteExpense');

            set((state) => ({
                expenseEntries: state.expenseEntries.filter((e) => e.id !== id),
            }));
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('deleteExpense', err, { entryId: id });
            set({ error: message });
        }
    },

    setSelectedDate: (date: string): void => {
        set({ selectedDate: date });
    },
}));
