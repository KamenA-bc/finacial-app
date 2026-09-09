import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFinancialStore } from './transactionStore';
import { supabase } from '@/lib/supabase';

// Mock Supabase retry wrapper to execute immediately
vi.mock('@/lib/supabaseRetry', () => ({
    withJwtRetry: vi.fn(async (op: () => Promise<unknown>) => await op()),
}));

// Mock error logger
vi.mock('@/lib/errorLogger', () => ({
    logError: vi.fn(),
    extractErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

// Mock Supabase client
const mockDelete = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn((table: string) => ({
            select: vi.fn((cols: string) => ({
                eq: vi.fn((col: string, val: string) => ({
                    order: vi.fn(() => Promise.resolve({ data: [], error: null })),
                })),
            })),
            insert: vi.fn((payload: unknown) => ({
                select: vi.fn(() => ({
                    single: mockSingle,
                })),
            })),
            delete: vi.fn(() => ({
                eq: mockDelete,
            })),
        })),
    },
}));

describe('transactionStore - Optimistic Updates & Reliability', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useFinancialStore.setState({
            incomeEntries: [],
            expenseEntries: [],
            userId: 'test-user-123',
            isLoading: false,
            error: null,
            lastFetchedAt: null,
        });
    });

    describe('addIncome', () => {
        it('optimistically adds income immediately and swaps temp ID on server success', async () => {
            const serverId = 'real-db-uuid-1';
            mockSingle.mockResolvedValueOnce({
                data: {
                    id: serverId,
                    date: '2026-03-09',
                    amount: 500,
                    description: 'Salary advance',
                    is_work_income: true,
                    is_with_kami: false,
                },
                error: null,
            });

            const addPromise = useFinancialStore.getState().addIncome({
                date: '2026-03-09',
                amount: 500,
                description: 'Salary advance',
                isWorkIncome: true,
                isWithKami: false,
            });

            // Immediately after call, the item is already present in store state (optimistic)
            const intermediateEntries = useFinancialStore.getState().incomeEntries;
            expect(intermediateEntries).toHaveLength(1);
            expect(intermediateEntries[0].id).toMatch(/^temp_inc_/);
            expect(intermediateEntries[0].amount).toBe(500);

            // Await Supabase sync completion
            await addPromise;

            // After resolve, the temporary ID is replaced with the real DB UUID
            const finalEntries = useFinancialStore.getState().incomeEntries;
            expect(finalEntries).toHaveLength(1);
            expect(finalEntries[0].id).toBe(serverId);
            expect(useFinancialStore.getState().error).toBeNull();
        });

        it('rolls back optimistic income and sets error if Supabase insert fails', async () => {
            mockSingle.mockRejectedValueOnce(new Error('Network disconnected'));

            await useFinancialStore.getState().addIncome({
                date: '2026-03-09',
                amount: 250,
                description: 'Bonus',
                isWorkIncome: true,
                isWithKami: false,
            });

            // Entry must be completely rolled back from store
            const finalEntries = useFinancialStore.getState().incomeEntries;
            expect(finalEntries).toHaveLength(0);
            expect(useFinancialStore.getState().error).toBe('Network disconnected');
        });
    });

    describe('addExpense', () => {
        it('optimistically adds expense immediately and swaps temp ID on server success', async () => {
            const serverId = 'real-expense-uuid-2';
            mockSingle.mockResolvedValueOnce({
                data: {
                    id: serverId,
                    date: '2026-03-09',
                    amount: 42.5,
                    description: 'Lunch with colleagues',
                    category: 'Eating out',
                    is_work_expense: true,
                    is_with_kami: false,
                    is_with_others: true,
                },
                error: null,
            });

            const addPromise = useFinancialStore.getState().addExpense({
                date: '2026-03-09',
                amount: 42.5,
                description: 'Lunch with colleagues',
                category: 'Eating out',
                isWorkExpense: true,
                isWithKami: false,
                isWithOthers: true,
            });

            // Optimistic check
            const intermediate = useFinancialStore.getState().expenseEntries;
            expect(intermediate).toHaveLength(1);
            expect(intermediate[0].id).toMatch(/^temp_exp_/);
            expect(intermediate[0].amount).toBe(42.5);

            await addPromise;

            // Final state with server ID
            const finalEntries = useFinancialStore.getState().expenseEntries;
            expect(finalEntries).toHaveLength(1);
            expect(finalEntries[0].id).toBe(serverId);
            expect(finalEntries[0].category).toBe('Eating out');
        });

        it('rolls back optimistic expense and sets error if Supabase insert fails', async () => {
            mockSingle.mockRejectedValueOnce(new Error('Database row lock timeout'));

            await useFinancialStore.getState().addExpense({
                date: '2026-03-09',
                amount: 100,
                description: 'Fuel',
                category: 'Гориво',
                isWorkExpense: false,
                isWithKami: true,
                isWithOthers: false,
            });

            expect(useFinancialStore.getState().expenseEntries).toHaveLength(0);
            expect(useFinancialStore.getState().error).toBe('Database row lock timeout');
        });
    });

    describe('deleteIncome & deleteExpense', () => {
        it('optimistically deletes income and retains deletion on server success', async () => {
            useFinancialStore.setState({
                incomeEntries: [
                    { id: 'inc-1', date: '2026-03-09', amount: 100, description: 'Freelance', isWorkIncome: true, isWithKami: false },
                    { id: 'inc-2', date: '2026-03-09', amount: 200, description: 'Gift', isWorkIncome: false, isWithKami: false },
                ],
            });

            mockDelete.mockResolvedValueOnce({ error: null });

            const deletePromise = useFinancialStore.getState().deleteIncome('inc-1');

            // Optimistically removed right away
            expect(useFinancialStore.getState().incomeEntries).toHaveLength(1);
            expect(useFinancialStore.getState().incomeEntries[0].id).toBe('inc-2');

            await deletePromise;
            expect(useFinancialStore.getState().incomeEntries).toHaveLength(1);
        });

        it('rolls back deleted income if server delete fails', async () => {
            const initialList = [
                { id: 'inc-1', date: '2026-03-09', amount: 100, description: 'Freelance', isWorkIncome: true, isWithKami: false },
            ];
            useFinancialStore.setState({ incomeEntries: initialList });

            mockDelete.mockRejectedValueOnce(new Error('Server 500 error'));

            await useFinancialStore.getState().deleteIncome('inc-1');

            // Rolled back to initial list
            expect(useFinancialStore.getState().incomeEntries).toHaveLength(1);
            expect(useFinancialStore.getState().incomeEntries[0].id).toBe('inc-1');
            expect(useFinancialStore.getState().error).toBe('Server 500 error');
        });

        it('optimistically deletes expense and rolls back on failure', async () => {
            const initialExpenses = [
                {
                    id: 'exp-1',
                    date: '2026-03-09',
                    amount: 30,
                    description: 'Supermarket',
                    category: 'Магазини (Храна/Вода)' as const,
                    isWorkExpense: false,
                    isWithKami: false,
                    isWithOthers: false,
                },
            ];
            useFinancialStore.setState({ expenseEntries: initialExpenses });

            mockDelete.mockRejectedValueOnce(new Error('Foreign key violation'));

            await useFinancialStore.getState().deleteExpense('exp-1');

            expect(useFinancialStore.getState().expenseEntries).toHaveLength(1);
            expect(useFinancialStore.getState().expenseEntries[0].id).toBe('exp-1');
            expect(useFinancialStore.getState().error).toBe('Foreign key violation');
        });
    });

    describe('fetchTransactions deduplication', () => {
        it('deduplicates calls made within the FETCH_DEDUP_MS window', async () => {
            const recent = Date.now() - 2000; // 2 seconds ago (< 10s)
            useFinancialStore.setState({
                userId: 'user-xyz',
                lastFetchedAt: recent,
                isLoading: false,
            });

            await useFinancialStore.getState().fetchTransactions('user-xyz');

            // Should have been skipped
            expect(supabase.from).not.toHaveBeenCalled();
        });
    });
});
