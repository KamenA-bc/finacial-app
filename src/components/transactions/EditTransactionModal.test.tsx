import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditTransactionModal } from './EditTransactionModal';
import { useFinancialStore } from '@/store/transactionStore';
import { useToastStore } from '@/store/toastStore';
import { ExpenseEntry, IncomeEntry } from '@/types';

// Mock Supabase retry wrapper
vi.mock('@/lib/supabaseRetry', () => ({
    withJwtRetry: vi.fn(async (op: () => Promise<unknown>) => await op()),
}));

describe('EditTransactionModal', () => {
    const mockExpense: ExpenseEntry = {
        id: 'exp-123',
        amount: 45.5,
        date: '2026-03-15',
        description: 'Dinner with friends',
        category: 'Eating out',
        isWorkExpense: false,
        isWithKami: true,
        isWithOthers: false,
    };

    const mockIncome: IncomeEntry = {
        id: 'inc-123',
        amount: 1200,
        date: '2026-03-10',
        description: 'Consulting',
        isWorkIncome: true,
        isWithKami: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useToastStore.setState({ isOpen: false, message: '', id: 0 });
        useFinancialStore.setState({
            incomeEntries: [mockIncome],
            expenseEntries: [mockExpense],
            error: null,
            userId: 'test-user',
        });
    });

    it('renders null when not open or no transaction provided', () => {
        const { container: c1 } = render(
            <EditTransactionModal isOpen={false} transaction={{ type: 'expense', entry: mockExpense }} onClose={vi.fn()} />
        );
        expect(c1.firstChild).toBeNull();

        const { container: c2 } = render(
            <EditTransactionModal isOpen={true} transaction={null} onClose={vi.fn()} />
        );
        expect(c2.firstChild).toBeNull();
    });

    it('prefills fields correctly for an expense transaction', () => {
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByRole('heading', { name: /редактиране на разход/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/^сума/i)).toHaveValue('45.5');
        expect(screen.getByLabelText(/^дата/i)).toHaveValue('2026-03-15');
        expect(screen.getByLabelText(/^описание/i)).toHaveValue('Dinner with friends');
        expect(screen.getByLabelText(/^категория/i)).toHaveValue('Eating out');

        // Check tag buttons
        const workTag = screen.getByRole('button', { name: /работни/i });
        const kamiTag = screen.getByRole('button', { name: /kami/i });
        const othersTag = screen.getByRole('button', { name: /с други/i });

        expect(workTag).toHaveAttribute('aria-pressed', 'false');
        expect(kamiTag).toHaveAttribute('aria-pressed', 'true');
        expect(othersTag).toHaveAttribute('aria-pressed', 'false');
    });

    it('prefills fields correctly for an income transaction', () => {
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'income', entry: mockIncome }}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByRole('heading', { name: /редактиране на приход/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/^сума/i)).toHaveValue('1200');
        expect(screen.getByLabelText(/^дата/i)).toHaveValue('2026-03-10');
        expect(screen.getByLabelText(/^описание/i)).toHaveValue('Consulting');
        expect(screen.queryByLabelText(/^категория/i)).not.toBeInTheDocument();

        const workTag = screen.getByRole('button', { name: /работен/i });
        expect(workTag).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows validation error when amount is invalid or zero', async () => {
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={vi.fn()}
            />
        );

        const amountInput = screen.getByLabelText(/^сума/i);
        fireEvent.change(amountInput, { target: { value: '0' } });

        const saveButton = screen.getByRole('button', { name: /запази промените/i });
        fireEvent.click(saveButton);

        expect(await screen.findByText(/моля, въведете валидна сума по-голяма от 0/i)).toBeInTheDocument();
    });

    it('shows validation error when expense description is empty', async () => {
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={vi.fn()}
            />
        );

        const descInput = screen.getByLabelText(/^описание/i);
        fireEvent.change(descInput, { target: { value: '   ' } });

        const saveButton = screen.getByRole('button', { name: /запази промените/i });
        fireEvent.click(saveButton);

        expect(await screen.findByText(/описанието е задължително за разход/i)).toBeInTheDocument();
    });

    it('submits updated expense values and calls updateExpense on the store', async () => {
        const updateExpenseSpy = vi.spyOn(useFinancialStore.getState(), 'updateExpense').mockResolvedValue();
        const onClose = vi.fn();

        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={onClose}
            />
        );

        const amountInput = screen.getByLabelText(/^сума/i);
        const descInput = screen.getByLabelText(/^описание/i);
        const workTag = screen.getByRole('button', { name: /работни/i });

        fireEvent.change(amountInput, { target: { value: '60.00' } });
        fireEvent.change(descInput, { target: { value: 'Team Lunch' } });
        fireEvent.click(workTag); // Toggle on

        const saveButton = screen.getByRole('button', { name: /запази промените/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(updateExpenseSpy).toHaveBeenCalledWith('exp-123', {
                amount: 60,
                date: '2026-03-15',
                description: 'Team Lunch',
                category: 'Eating out',
                isWorkExpense: true,
                isWithKami: true,
                isWithOthers: false,
            });
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('submits updated income values and calls updateIncome on the store', async () => {
        const updateIncomeSpy = vi.spyOn(useFinancialStore.getState(), 'updateIncome').mockResolvedValue();
        const onClose = vi.fn();

        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'income', entry: mockIncome }}
                onClose={onClose}
            />
        );

        const amountInput = screen.getByLabelText(/^сума/i);
        fireEvent.change(amountInput, { target: { value: '1500' } });

        const saveButton = screen.getByRole('button', { name: /запази промените/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(updateIncomeSpy).toHaveBeenCalledWith('inc-123', {
                amount: 1500,
                date: '2026-03-10',
                description: 'Consulting',
                isWorkIncome: true,
                isWithKami: false,
            });
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('closes on cancel button click', () => {
        const onClose = vi.fn();
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={onClose}
            />
        );

        const cancelBtn = screen.getByRole('button', { name: /отказ/i });
        fireEvent.click(cancelBtn);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape key press', () => {
        const onClose = vi.fn();
        render(
            <EditTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={onClose}
            />
        );

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
