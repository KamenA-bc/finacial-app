import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionList } from './TransactionList';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry, IncomeEntry } from '@/types';

// Mock Supabase retry wrapper
vi.mock('@/lib/supabaseRetry', () => ({
    withJwtRetry: vi.fn(async (op: () => Promise<unknown>) => await op()),
}));

describe('TransactionList', () => {
    const mockExpense: ExpenseEntry = {
        id: 'exp-1',
        amount: 85.2,
        date: '2026-09-22',
        description: 'Supermarket weekly grocery run',
        category: 'Магазини (Храна/Вода)',
        isWorkExpense: false,
        isWithKami: true,
        isWithOthers: false,
    };

    const mockIncome: IncomeEntry = {
        id: 'inc-1',
        amount: 1500,
        date: '2026-09-22',
        description: 'Client payment',
        isWorkIncome: true,
        isWithKami: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useFinancialStore.setState({
            selectedDate: '2026-09-22',
            expenseEntries: [mockExpense],
            incomeEntries: [mockIncome],
            userId: 'user-123',
        });
    });

    it('renders transactions for the selected day', () => {
        render(<TransactionList />);

        expect(screen.getByText('Supermarket weekly grocery run')).toBeInTheDocument();
        expect(screen.getByText('Client payment')).toBeInTheDocument();
        expect(screen.getByText('Магазини (Храна/Вода)')).toBeInTheDocument();
    });

    it('opens ViewTransactionModal when clicking the transaction card body', () => {
        render(<TransactionList />);

        // Click the expense card tap zone
        const expenseCardBtn = screen.getByLabelText(/Виж детайли за Supermarket weekly grocery run/);
        fireEvent.click(expenseCardBtn);

        // ViewTransactionModal should appear
        expect(screen.getByRole('dialog', { name: /Магазини \(Храна\/Вода\)/i })).toBeInTheDocument();
        expect(screen.getByText('Пълно описание')).toBeInTheDocument();
    });

    it('opens EditTransactionModal without opening ViewTransactionModal when clicking Edit button', () => {
        render(<TransactionList />);

        const editBtn = screen.getByLabelText(/Редактирай разход: Supermarket weekly grocery run/);
        fireEvent.click(editBtn);

        // EditTransactionModal should be open
        expect(screen.getByRole('dialog', { name: /Редактиране на разход/i })).toBeInTheDocument();
        // ViewTransactionModal should NOT be open
        expect(screen.queryByText('Пълно описание')).not.toBeInTheDocument();
    });

    it('opens DeleteDialog without opening ViewTransactionModal when clicking Delete button', () => {
        render(<TransactionList />);

        const deleteBtn = screen.getByLabelText(/Delete expense: Supermarket weekly grocery run/);
        fireEvent.click(deleteBtn);

        // Delete confirmation should be open
        expect(screen.getByText('Изтриване на транзакция')).toBeInTheDocument();
        // ViewTransactionModal should NOT be open
        expect(screen.queryByText('Пълно описание')).not.toBeInTheDocument();
    });

    it('filters entries when changing filter tabs', () => {
        render(<TransactionList />);

        // Default 'all' has both
        expect(screen.getByText('Supermarket weekly grocery run')).toBeInTheDocument();
        expect(screen.getByText('Client payment')).toBeInTheDocument();

        // Switch to 'Приходи'
        fireEvent.click(screen.getByRole('button', { name: 'Приходи' }));
        expect(screen.queryByText('Supermarket weekly grocery run')).not.toBeInTheDocument();
        expect(screen.getByText('Client payment')).toBeInTheDocument();

        // Switch to 'Разходи'
        fireEvent.click(screen.getByRole('button', { name: 'Разходи' }));
        expect(screen.getByText('Supermarket weekly grocery run')).toBeInTheDocument();
        expect(screen.queryByText('Client payment')).not.toBeInTheDocument();
    });
});
