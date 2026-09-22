import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ViewTransactionModal } from './ViewTransactionModal';
import { ExpenseEntry, IncomeEntry } from '@/types';

describe('ViewTransactionModal', () => {
    const mockExpense: ExpenseEntry = {
        id: 'exp-1',
        amount: 150.75,
        date: '2026-09-22',
        description: 'Detailed supermarket grocery receipt with organic vegetables, milk, bread, cheese and olive oil',
        category: 'Магазини (Храна/Вода)',
        isWorkExpense: true,
        isWithKami: true,
        isWithOthers: false,
    };

    const mockIncome: IncomeEntry = {
        id: 'inc-1',
        amount: 2500,
        date: '2026-09-20',
        description: 'Monthly consulting retainer for frontend platform engineering',
        isWorkIncome: true,
        isWithKami: false,
    };

    it('renders null when closed or without transaction', () => {
        const { container: c1 } = render(
            <ViewTransactionModal isOpen={false} transaction={{ type: 'expense', entry: mockExpense }} onClose={vi.fn()} />
        );
        expect(c1.firstChild).toBeNull();

        const { container: c2 } = render(
            <ViewTransactionModal isOpen={true} transaction={null} onClose={vi.fn()} />
        );
        expect(c2.firstChild).toBeNull();
    });

    it('displays full un-truncated description and metadata for expense', () => {
        render(
            <ViewTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={vi.fn()}
            />
        );

        // Check full description text is present in DOM
        expect(
            screen.getByText('Detailed supermarket grocery receipt with organic vegetables, milk, bread, cheese and olive oil')
        ).toBeInTheDocument();

        // Check category title
        expect(screen.getByText('Магазини (Храна/Вода)')).toBeInTheDocument();

        // Check tags
        expect(screen.getByText('Работен разход')).toBeInTheDocument();
        expect(screen.getByText('Kami ❤️')).toBeInTheDocument();

        // Check amount is displayed
        expect(screen.getByText(/150,75/)).toBeInTheDocument();
    });

    it('displays income details and tags correctly', () => {
        render(
            <ViewTransactionModal
                isOpen={true}
                transaction={{ type: 'income', entry: mockIncome }}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByText('Monthly consulting retainer for frontend platform engineering')
        ).toBeInTheDocument();
        expect(screen.getByText('Работен приход')).toBeInTheDocument();
        expect(screen.getByText(/2\s?500,00/)).toBeInTheDocument();
    });

    it('triggers onClose when close button or backdrop is clicked', () => {
        const onClose = vi.fn();
        const { container } = render(
            <ViewTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={onClose}
            />
        );

        // Click X button
        const closeBtn = screen.getByLabelText('Затвори детайли');
        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledTimes(1);

        // Click backdrop
        const backdrop = container.querySelector('.bg-black\\/40');
        expect(backdrop).toBeInTheDocument();
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(onClose).toHaveBeenCalledTimes(2);
        }
    });

    it('does not render bottom close or edit buttons', () => {
        render(
            <ViewTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={vi.fn()}
            />
        );

        expect(screen.queryByRole('button', { name: 'Затвори' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Редактирай/ })).not.toBeInTheDocument();
    });

    it('closes on Escape key press', () => {
        const onClose = vi.fn();
        render(
            <ViewTransactionModal
                isOpen={true}
                transaction={{ type: 'expense', entry: mockExpense }}
                onClose={onClose}
            />
        );

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
