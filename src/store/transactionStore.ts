/**
 * Centralized Zustand store – single source of truth for all financial data.
 * Uses `persist` middleware to survive page refreshes via localStorage.
 */
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FinancialStore, IncomeEntry, ExpenseEntry } from '@/types';
import { toISODateString } from '@/lib/dateUtils';

const generateId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useFinancialStore = create<FinancialStore>()(
    persist(
        (set) => ({
            incomeEntries: [],
            expenseEntries: [],
            selectedDate: toISODateString(new Date()),

            addIncome: (entry: Omit<IncomeEntry, 'id'>): void => {
                set((state) => ({
                    incomeEntries: [
                        ...state.incomeEntries,
                        { ...entry, id: generateId() },
                    ],
                }));
            },

            addExpense: (entry: Omit<ExpenseEntry, 'id'>): void => {
                set((state) => ({
                    expenseEntries: [
                        ...state.expenseEntries,
                        { ...entry, id: generateId() },
                    ],
                }));
            },

            deleteIncome: (id: string): void => {
                set((state) => ({
                    incomeEntries: state.incomeEntries.filter((e) => e.id !== id),
                }));
            },

            deleteExpense: (id: string): void => {
                set((state) => ({
                    expenseEntries: state.expenseEntries.filter((e) => e.id !== id),
                }));
            },

            setSelectedDate: (date: string): void => {
                set({ selectedDate: date });
            },
        }),
        {
            name: 'financial-tracker-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
