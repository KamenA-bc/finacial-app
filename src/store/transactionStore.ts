/**
 * Centralized Zustand store – single source of truth for all financial data.
 * Data is persisted in Supabase (global DB), not localStorage.
 * The store acts as a thin client-side cache that syncs with the database.
 */
'use client';

import { create } from 'zustand';
import { FinancialStore, IncomeEntry, ExpenseEntry } from '@/types';
import { toISODateString } from '@/lib/dateUtils';
import { supabase } from '@/lib/supabase';

export const useFinancialStore = create<FinancialStore>()((set, get) => ({
    incomeEntries: [],
    expenseEntries: [],
    selectedDate: toISODateString(new Date()),
    userId: null,
    isLoading: false,
    error: null,

    setUserId: (userId: string | null): void => {
        set({ userId });
    },

    fetchTransactions: async (userId: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const [incomeRes, expenseRes] = await Promise.all([
                supabase
                    .from('income_entries')
                    .select('id, date, amount, description, is_work_income')
                    .eq('user_id', userId)
                    .order('date', { ascending: true }),
                supabase
                    .from('expense_entries')
                    .select('id, date, amount, description, category, is_work_expense')
                    .eq('user_id', userId)
                    .order('date', { ascending: true }),
            ]);

            if (incomeRes.error) throw incomeRes.error;
            if (expenseRes.error) throw expenseRes.error;

            set({
                incomeEntries: (incomeRes.data ?? []).map((e: Record<string, unknown>) => ({
                    id: e.id as string,
                    date: e.date as string,
                    amount: e.amount as number,
                    description: e.description as string,
                    isWorkIncome: ((e.is_work_income as boolean) ?? false),
                })) as IncomeEntry[],
                expenseEntries: (expenseRes.data ?? []).map((e: Record<string, unknown>) => ({
                    id: e.id as string,
                    date: e.date as string,
                    amount: e.amount as number,
                    description: e.description as string,
                    category: e.category as string,
                    isWorkExpense: (e.is_work_expense as boolean) ?? false,
                })) as ExpenseEntry[],
                userId,
                isLoading: false,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch transactions';
            set({ error: message, isLoading: false });
        }
    },

    addIncome: async (entry: Omit<IncomeEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        set({ error: null });
        try {
            const { data, error } = await supabase
                .from('income_entries')
                .insert({ user_id: userId, date: entry.date, amount: entry.amount, description: entry.description, is_work_income: entry.isWorkIncome })
                .select('id, date, amount, description, is_work_income')
                .single();

            if (error) throw error;

            const mapped: IncomeEntry = {
                id: (data as Record<string, unknown>).id as string,
                date: (data as Record<string, unknown>).date as string,
                amount: (data as Record<string, unknown>).amount as number,
                description: (data as Record<string, unknown>).description as string,
                isWorkIncome: ((data as Record<string, unknown>).is_work_income as boolean) ?? false,
            };

            set((state) => ({
                incomeEntries: [...state.incomeEntries, mapped],
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add income';
            set({ error: message });
        }
    },

    addExpense: async (entry: Omit<ExpenseEntry, 'id'>): Promise<void> => {
        const userId = get().userId;
        if (!userId) return;

        set({ error: null });
        try {
            const { data, error } = await supabase
                .from('expense_entries')
                .insert({
                    user_id: userId,
                    date: entry.date,
                    amount: entry.amount,
                    description: entry.description,
                    category: entry.category,
                    is_work_expense: entry.isWorkExpense,
                })
                .select('id, date, amount, description, category, is_work_expense')
                .single();

            if (error) throw error;

            const mapped: ExpenseEntry = {
                id: (data as Record<string, unknown>).id as string,
                date: (data as Record<string, unknown>).date as string,
                amount: (data as Record<string, unknown>).amount as number,
                description: (data as Record<string, unknown>).description as string,
                category: (data as Record<string, unknown>).category as string as ExpenseEntry['category'],
                isWorkExpense: ((data as Record<string, unknown>).is_work_expense as boolean) ?? false,
            };

            set((state) => ({
                expenseEntries: [...state.expenseEntries, mapped],
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add expense';
            set({ error: message });
        }
    },

    deleteIncome: async (id: string): Promise<void> => {
        set({ error: null });
        try {
            const { error } = await supabase
                .from('income_entries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                incomeEntries: state.incomeEntries.filter((e) => e.id !== id),
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete income';
            set({ error: message });
        }
    },

    deleteExpense: async (id: string): Promise<void> => {
        set({ error: null });
        try {
            const { error } = await supabase
                .from('expense_entries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                expenseEntries: state.expenseEntries.filter((e) => e.id !== id),
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete expense';
            set({ error: message });
        }
    },

    setSelectedDate: (date: string): void => {
        set({ selectedDate: date });
    },
}));
