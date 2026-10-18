import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MonthCard } from './MonthCard';
import { useFinancialStore } from '@/store/transactionStore';
import { MonthlySummary } from '@/hooks/useHistoryData';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

const SAMPLE_MONTH: MonthlySummary = {
    month: 9,
    monthName: 'Октомври',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    income: 1200,
    expenses: 300,
    profit: 900,
    incomeEntries: [],
    expenseEntries: [],
    dailyBreakdown: [
        { date: '2026-10-05', income: 1200, expenses: 100, profit: 1100 },
        { date: '2026-10-14', income: 0, expenses: 200, profit: -200 },
    ],
    categoryBreakdown: [],
    hasData: true,
};

describe('MonthCard – Accordion & Dashboard Drill-Down', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useFinancialStore.getState().resetTransactionFilters();
        useFinancialStore.setState({ selectedDate: '2026-10-18' });
    });

    it('expands daily breakdown when clicking the month header and navigates to / when clicking a DailyRow', () => {
        render(<MonthCard data={SAMPLE_MONTH} isFuture={false} />);

        // Expand accordion
        fireEvent.click(screen.getByText('Октомври'));
        expect(screen.getByText('Дневно разпределение')).toBeInTheDocument();

        // Click the second daily row (2026-10-14)
        const dayRows = screen.getAllByRole('button', { name: /отвори .* в таблото/i });
        // First button is the Month-level "Отвори Октомври в таблото", followed by the 2 DailyRows
        fireEvent.click(dayRows[2]);

        expect(useFinancialStore.getState().selectedDate).toBe('2026-10-14');
        expect(useFinancialStore.getState().transactionFilters.scope).toBe('day');
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('sets selectedDate to latest active day, sets scope to month, and navigates to / when clicking Към таблото', () => {
        render(<MonthCard data={SAMPLE_MONTH} isFuture={false} />);

        const goToDashboardBtn = screen.getByRole('button', {
            name: /отвори октомври в таблото/i,
        });
        fireEvent.click(goToDashboardBtn);

        expect(useFinancialStore.getState().selectedDate).toBe('2026-10-14');
        expect(useFinancialStore.getState().transactionFilters.scope).toBe('month');
        expect(mockPush).toHaveBeenCalledWith('/');
    });
});
