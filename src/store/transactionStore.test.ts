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
const mockOrder = vi.fn(() => Promise.resolve({ data: [] as Record<string, unknown>[], error: null }));
const mockLte = vi.fn(() => ({ order: mockOrder }));
const mockGte = vi.fn(() => ({ lte: mockLte }));
const mockUpdateEqUser = vi.fn(() => Promise.resolve({ error: null }));
const mockUpdateEqId = vi.fn(() => ({ eq: mockUpdateEqUser }));
const mockUpdate = vi.fn(() => ({ eq: mockUpdateEqId }));

vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    gte: mockGte,
                    lte: mockLte,
                    order: mockOrder,
                })),
            })),
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: mockSingle,
                })),
            })),
            update: mockUpdate,
            delete: vi.fn(() => ({
                eq: mockDelete,
            })),
        })),
    },
}));

describe('transactionStore - Optimistic Updates & Reliability', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUpdateEqUser.mockReset().mockResolvedValue({ error: null });
        mockUpdateEqId.mockReset().mockReturnValue({ eq: mockUpdateEqUser });
        mockUpdate.mockReset().mockReturnValue({ eq: mockUpdateEqId });
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

    describe('updateIncome', () => {
        it('optimistically updates income in store immediately and persists to Supabase with snake_case payload', async () => {
            const initialIncome = [
                { id: 'inc-1', date: '2026-03-09', amount: 100, description: 'Freelance', isWorkIncome: false, isWithKami: false },
            ];
            useFinancialStore.setState({ incomeEntries: initialIncome, userId: 'test-user-123' });

            const updatePromise = useFinancialStore.getState().updateIncome('inc-1', {
                amount: 150,
                description: 'Freelance Design',
                isWorkIncome: true,
                isWithKami: true,
            });

            // Optimistically updated right away
            const intermediate = useFinancialStore.getState().incomeEntries;
            expect(intermediate[0].amount).toBe(150);
            expect(intermediate[0].description).toBe('Freelance Design');
            expect(intermediate[0].isWorkIncome).toBe(true);
            expect(intermediate[0].isWithKami).toBe(true);

            await updatePromise;

            expect(mockUpdate).toHaveBeenCalledWith({
                amount: 150,
                description: 'Freelance Design',
                is_work_income: true,
                is_with_kami: true,
            });
            expect(mockUpdateEqId).toHaveBeenCalledWith('id', 'inc-1');
            expect(mockUpdateEqUser).toHaveBeenCalledWith('user_id', 'test-user-123');
            expect(useFinancialStore.getState().error).toBeNull();
        });

        it('rolls back optimistic update when Supabase update fails', async () => {
            const initialIncome = [
                { id: 'inc-1', date: '2026-03-09', amount: 100, description: 'Old Description', isWorkIncome: false, isWithKami: false },
            ];
            useFinancialStore.setState({ incomeEntries: initialIncome, userId: 'test-user-123' });

            mockUpdateEqUser.mockRejectedValueOnce(new Error('Network connection dropped'));

            await useFinancialStore.getState().updateIncome('inc-1', {
                amount: 200,
                description: 'New Description',
            });

            // Rolled back
            const finalEntries = useFinancialStore.getState().incomeEntries;
            expect(finalEntries[0].amount).toBe(100);
            expect(finalEntries[0].description).toBe('Old Description');
            expect(useFinancialStore.getState().error).toBe('Network connection dropped');
        });

        it('skips Supabase call for temp ID or mock test user', async () => {
            const tempIncome = [
                { id: 'temp_inc_123', date: '2026-03-09', amount: 50, description: 'Temp', isWorkIncome: false, isWithKami: false },
            ];
            useFinancialStore.setState({ incomeEntries: tempIncome, userId: 'test-user-123' });

            await useFinancialStore.getState().updateIncome('temp_inc_123', { amount: 60 });

            expect(useFinancialStore.getState().incomeEntries[0].amount).toBe(60);
            expect(mockUpdate).not.toHaveBeenCalled();
        });

        it('logs warning and does not alter store if entry not found', async () => {
            useFinancialStore.setState({ incomeEntries: [], userId: 'test-user-123' });

            await useFinancialStore.getState().updateIncome('non-existent-id', { amount: 50 });

            expect(mockUpdate).not.toHaveBeenCalled();
            expect(useFinancialStore.getState().incomeEntries).toHaveLength(0);
        });
    });

    describe('updateExpense', () => {
        it('optimistically updates expense amount, category, and flags immediately and persists to Supabase', async () => {
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
            useFinancialStore.setState({ expenseEntries: initialExpenses, userId: 'test-user-123' });

            const updatePromise = useFinancialStore.getState().updateExpense('exp-1', {
                amount: 45.5,
                category: 'Eating out',
                isWorkExpense: true,
                isWithKami: true,
                isWithOthers: true,
                description: 'Lunch meeting',
            });

            // Immediately reflected in store
            const intermediate = useFinancialStore.getState().expenseEntries;
            expect(intermediate[0].amount).toBe(45.5);
            expect(intermediate[0].category).toBe('Eating out');
            expect(intermediate[0].isWorkExpense).toBe(true);
            expect(intermediate[0].isWithKami).toBe(true);
            expect(intermediate[0].isWithOthers).toBe(true);
            expect(intermediate[0].description).toBe('Lunch meeting');

            await updatePromise;

            expect(mockUpdate).toHaveBeenCalledWith({
                amount: 45.5,
                category: 'Eating out',
                is_work_expense: true,
                is_with_kami: true,
                is_with_others: true,
                description: 'Lunch meeting',
            });
            expect(mockUpdateEqId).toHaveBeenCalledWith('id', 'exp-1');
            expect(mockUpdateEqUser).toHaveBeenCalledWith('user_id', 'test-user-123');
            expect(useFinancialStore.getState().error).toBeNull();
        });

        it('rolls back optimistic expense update when Supabase update fails', async () => {
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
            useFinancialStore.setState({ expenseEntries: initialExpenses, userId: 'test-user-123' });

            mockUpdateEqUser.mockRejectedValueOnce(new Error('Supabase database error'));

            await useFinancialStore.getState().updateExpense('exp-1', {
                amount: 99,
                category: 'Shopping',
            });

            // Rolled back to initial
            const finalEntries = useFinancialStore.getState().expenseEntries;
            expect(finalEntries[0].amount).toBe(30);
            expect(finalEntries[0].category).toBe('Магазини (Храна/Вода)');
            expect(useFinancialStore.getState().error).toBe('Supabase database error');
        });

        it('logs warning and does not alter store if expense not found', async () => {
            useFinancialStore.setState({ expenseEntries: [], userId: 'test-user-123' });

            await useFinancialStore.getState().updateExpense('non-existent-id', { amount: 50 });

            expect(mockUpdate).not.toHaveBeenCalled();
            expect(useFinancialStore.getState().expenseEntries).toHaveLength(0);
        });
    });

    describe('fetchTransactions date scoping and caching', () => {
        it('queries for specific year date range and records year in loadedYears', async () => {
            useFinancialStore.setState({
                userId: 'user-xyz',
                loadedYears: [],
                lastFetchedAt: null,
            });

            await useFinancialStore.getState().fetchTransactions('user-xyz', 2026);

            expect(mockGte).toHaveBeenCalledWith('date', '2026-01-01');
            expect(mockLte).toHaveBeenCalledWith('date', '2026-12-31');
            expect(useFinancialStore.getState().loadedYears).toContain(2026);
        });

        it('deduplicates calls made within the FETCH_DEDUP_MS window for already loaded year', async () => {
            const recent = Date.now() - 2000; // 2 seconds ago (< 10s)
            useFinancialStore.setState({
                userId: 'user-xyz',
                loadedYears: [2026],
                lastFetchedAt: recent,
                isLoading: false,
                selectedDate: '2026-05-10',
            });

            await useFinancialStore.getState().fetchTransactions('user-xyz', 2026);

            // Should have been skipped
            expect(supabase.from).not.toHaveBeenCalled();
        });

        it('reuses in-flight fetch promise when called concurrently for the same user and year', async () => {
            useFinancialStore.setState({
                userId: 'user-xyz',
                loadedYears: [],
                lastFetchedAt: null,
            });

            const call1 = useFinancialStore.getState().fetchTransactions('user-xyz', 2026);
            const call2 = useFinancialStore.getState().fetchTransactions('user-xyz', 2026);

            await Promise.all([call1, call2]);

            // supabase.from should only be called twice (1 for income, 1 for expense), NOT 4 times
            expect(supabase.from).toHaveBeenCalledTimes(2);
        });
    });

    describe('deduplication & cache clearing', () => {
        it('deduplicates when server record is already present when addExpense completes', async () => {
            const serverId = 'real-db-exp-duplicate-test';
            mockSingle.mockResolvedValueOnce({
                data: {
                    id: serverId,
                    date: '2026-09-09',
                    amount: 100,
                    description: 'Grocery run',
                    category: 'Магазини (Храна/Вода)',
                    is_work_expense: false,
                    is_with_kami: false,
                    is_with_others: false,
                },
                error: null,
            });

            // Simulate race condition: fetchTransactions or another event inserted serverId while addExpense was pending
            useFinancialStore.setState({
                expenseEntries: [
                    {
                        id: serverId,
                        date: '2026-09-09',
                        amount: 100,
                        description: 'Grocery run',
                        category: 'Магазини (Храна/Вода)',
                        isWorkExpense: false,
                        isWithKami: false,
                        isWithOthers: false,
                    },
                ],
            });

            await useFinancialStore.getState().addExpense({
                date: '2026-09-09',
                amount: 100,
                description: 'Grocery run',
                category: 'Магазини (Храна/Вода)',
                isWorkExpense: false,
                isWithKami: false,
                isWithOthers: false,
            });

            // Must NOT have 2 copies of serverId
            const expenses = useFinancialStore.getState().expenseEntries;
            expect(expenses).toHaveLength(1);
            expect(expenses[0].id).toBe(serverId);
            expect(expenses.filter((e) => e.id === serverId)).toHaveLength(1);
        });

        it('deduplicates when server record is already present when addIncome completes', async () => {
            const serverId = 'real-db-inc-duplicate-test';
            mockSingle.mockResolvedValueOnce({
                data: {
                    id: serverId,
                    date: '2026-09-09',
                    amount: 500,
                    description: 'Salary',
                    is_work_income: true,
                    is_with_kami: false,
                },
                error: null,
            });

            useFinancialStore.setState({
                incomeEntries: [
                    {
                        id: serverId,
                        date: '2026-09-09',
                        amount: 500,
                        description: 'Salary',
                        isWorkIncome: true,
                        isWithKami: false,
                    },
                ],
            });

            await useFinancialStore.getState().addIncome({
                date: '2026-09-09',
                amount: 500,
                description: 'Salary',
                isWorkIncome: true,
                isWithKami: false,
            });

            const income = useFinancialStore.getState().incomeEntries;
            expect(income).toHaveLength(1);
            expect(income[0].id).toBe(serverId);
        });

        it('clearStoreCache resets transactions, loaded years, and lastFetchedAt', () => {
            useFinancialStore.setState({
                incomeEntries: [
                    { id: 'inc-1', date: '2026-09-09', amount: 100, description: 'Test', isWorkIncome: false, isWithKami: false },
                ],
                expenseEntries: [
                    { id: 'exp-1', date: '2026-09-09', amount: 50, description: 'Test', category: 'Други', isWorkExpense: false, isWithKami: false, isWithOthers: false },
                ],
                loadedYears: [2025, 2026],
                lastFetchedAt: Date.now(),
                userId: 'user-123',
            });

            useFinancialStore.getState().clearStoreCache();

            const state = useFinancialStore.getState();
            expect(state.incomeEntries).toEqual([]);
            expect(state.expenseEntries).toEqual([]);
            expect(state.loadedYears).toEqual([]);
            expect(state.lastFetchedAt).toBeNull();
            expect(state.userId).toBeNull();
        });
    });

    describe('error exit logging & observability', () => {
        it('logs a warning when addIncome is called without an authenticated userId', async () => {
            const { logError } = await import('@/lib/errorLogger');
            useFinancialStore.setState({ userId: null });

            await useFinancialStore.getState().addIncome({
                date: '2026-09-09',
                amount: 100,
                description: 'Unauth income',
                isWorkIncome: false,
                isWithKami: false,
            });

            expect(logError).toHaveBeenCalledWith(
                'addIncome:unauthorized',
                expect.anything(),
                expect.anything(),
                'warning'
            );
        });

        it('logs a warning when addExpense is called without an authenticated userId', async () => {
            const { logError } = await import('@/lib/errorLogger');
            useFinancialStore.setState({ userId: null });

            await useFinancialStore.getState().addExpense({
                date: '2026-09-09',
                amount: 50,
                description: 'Unauth expense',
                category: 'Други',
                isWorkExpense: false,
                isWithKami: false,
                isWithOthers: false,
            });

            expect(logError).toHaveBeenCalledWith(
                'addExpense:unauthorized',
                expect.anything(),
                expect.anything(),
                'warning'
            );
        });

        it('logs a warning when deleteExpense is called for a non-existent ID', async () => {
            const { logError } = await import('@/lib/errorLogger');
            useFinancialStore.setState({ expenseEntries: [] });

            await useFinancialStore.getState().deleteExpense('non-existent-uuid');

            expect(logError).toHaveBeenCalledWith(
                'deleteExpense:notFound',
                expect.anything(),
                expect.objectContaining({ entryId: 'non-existent-uuid' }),
                'warning'
            );
        });

        it('logs a warning when deleteIncome is called for a non-existent ID', async () => {
            const { logError } = await import('@/lib/errorLogger');
            useFinancialStore.setState({ incomeEntries: [] });

            await useFinancialStore.getState().deleteIncome('non-existent-uuid');

            expect(logError).toHaveBeenCalledWith(
                'deleteIncome:notFound',
                expect.anything(),
                expect.objectContaining({ entryId: 'non-existent-uuid' }),
                'warning'
            );
        });
    });

    describe('Cross-User Cache Isolation & Remote Deletion Sync', () => {
        it('flushes store state when setUserId is called with a different user ID', () => {
            useFinancialStore.setState({
                userId: 'user-a',
                incomeEntries: [{
                    id: 'inc-a',
                    date: '2026-05-10',
                    amount: 1000,
                    description: 'Salary A',
                    isWorkIncome: true,
                    isWithKami: false,
                }],
                expenseEntries: [{
                    id: 'exp-a',
                    date: '2026-05-11',
                    amount: 50,
                    description: 'Groceries A',
                    category: 'Магазини (Храна/Вода)',
                    isWorkExpense: false,
                    isWithKami: false,
                    isWithOthers: false,
                }],
                loadedYears: [2026],
                lastFetchedAt: Date.now(),
            });

            useFinancialStore.getState().setUserId('user-b');

            const state = useFinancialStore.getState();
            expect(state.userId).toBe('user-b');
            expect(state.incomeEntries).toHaveLength(0);
            expect(state.expenseEntries).toHaveLength(0);
            expect(state.loadedYears).toHaveLength(0);
            expect(state.lastFetchedAt).toBeNull();
        });

        it('purges remotely deleted entries for the fetched year while keeping other years intact', async () => {
            // Setup store with an entry from 2025 and an entry from 2026
            useFinancialStore.setState({
                userId: 'test-user-123',
                incomeEntries: [
                    {
                        id: 'inc-2025',
                        date: '2025-12-15',
                        amount: 300,
                        description: 'Old Income',
                        isWorkIncome: false,
                        isWithKami: false,
                    },
                    {
                        id: 'inc-2026-deleted-on-server',
                        date: '2026-04-10',
                        amount: 500,
                        description: 'Deleted on server',
                        isWorkIncome: true,
                        isWithKami: false,
                    },
                ],
                expenseEntries: [
                    {
                        id: 'exp-2025',
                        date: '2025-11-20',
                        amount: 100,
                        description: 'Old Expense',
                        category: 'Други',
                        isWorkExpense: false,
                        isWithKami: false,
                        isWithOthers: false,
                    },
                    {
                        id: 'exp-2026-deleted-on-server',
                        date: '2026-04-12',
                        amount: 70,
                        description: 'Deleted Expense',
                        category: 'Eating out',
                        isWorkExpense: false,
                        isWithKami: false,
                        isWithOthers: false,
                    },
                ],
                loadedYears: [2025],
                lastFetchedAt: null,
            });

            // Server returns only a brand-new 2026 transaction (the previously cached 2026 ones were deleted remotely)
            mockOrder.mockResolvedValueOnce({
                data: [
                    {
                        id: 'inc-2026-new',
                        date: '2026-04-15',
                        amount: 600,
                        description: 'Active Income',
                        is_work_income: true,
                        is_with_kami: false,
                    },
                ],
                error: null,
            });
            mockOrder.mockResolvedValueOnce({
                data: [
                    {
                        id: 'exp-2026-new',
                        date: '2026-04-16',
                        amount: 80,
                        description: 'Active Expense',
                        category: 'Shopping',
                        is_work_expense: false,
                        is_with_kami: false,
                        is_with_others: false,
                    },
                ],
                error: null,
            });

            await useFinancialStore.getState().fetchTransactions('test-user-123', 2026);

            const state = useFinancialStore.getState();

            // 2025 entries must be preserved
            expect(state.incomeEntries.some((e) => e.id === 'inc-2025')).toBe(true);
            expect(state.expenseEntries.some((e) => e.id === 'exp-2025')).toBe(true);

            // New 2026 entries must be present
            expect(state.incomeEntries.some((e) => e.id === 'inc-2026-new')).toBe(true);
            expect(state.expenseEntries.some((e) => e.id === 'exp-2026-new')).toBe(true);

            // Remotely deleted 2026 entries must be purged
            expect(state.incomeEntries.some((e) => e.id === 'inc-2026-deleted-on-server')).toBe(false);
            expect(state.expenseEntries.some((e) => e.id === 'exp-2026-deleted-on-server')).toBe(false);
        });
    });
});


