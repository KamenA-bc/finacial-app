import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoryChart } from './CategoryChart';
import { useFinancialStore } from '@/store/transactionStore';
import { ExpenseEntry } from '@/types';

// Mock recharts ResponsiveContainer and PieChart since jsdom has 0x0 size
vi.mock('recharts', async () => {
    const original = await vi.importActual<typeof import('recharts')>('recharts');
    return {
        ...original,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        PieChart: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="pie-chart">{children}</div>
        ),
        Pie: ({
            data,
            children,
            onClick,
        }: {
            data: Array<{ name: string; value: number }>;
            children: React.ReactNode;
            onClick?: (entry: { name: string; value: number }) => void;
        }) => (
            <div data-testid="pie">
                {data.map((entry) => (
                    <button
                        key={entry.name}
                        data-testid={`slice-${entry.name}`}
                        onClick={() => onClick?.(entry)}
                        aria-label={`slice-${entry.name}`}
                    />
                ))}
                {children}
            </div>
        ),
        Cell: () => <div data-testid="cell" />,
        Tooltip: () => null,
    };
});

describe('CategoryChart – Mobile-First Category Spending Breakdown', () => {
    beforeEach(() => {
        useFinancialStore.setState({
            incomeEntries: [],
            expenseEntries: [],
            selectedDate: '2026-03-15',
        });
    });

    it('renders empty state when there are no expenses for the period', () => {
        render(<CategoryChart />);
        expect(screen.getByText(/няма регистрирани разходи за периода/i)).toBeInTheDocument();
    });

    it('renders ranked categories and default center total when expenses exist', () => {
        const expenses: ExpenseEntry[] = [
            { id: '1', date: '2026-03-10', amount: 300, description: 'Groceries', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '2', date: '2026-03-12', amount: 100, description: 'Fuel', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ expenseEntries: expenses });

        render(<CategoryChart />);

        // Center total should be €400,00
        expect(screen.getByText(/общо разход/i)).toBeInTheDocument();
        expect(screen.getByText('€400,00')).toBeInTheDocument();
        expect(screen.getByText(/2 категории/i)).toBeInTheDocument();

        // Both categories should appear in the ranked list
        expect(screen.getByText('Магазини (Храна/Вода)')).toBeInTheDocument();
        expect(screen.getByText('Гориво')).toBeInTheDocument();
        expect(screen.getByText('75.0%')).toBeInTheDocument();
        expect(screen.getByText('25.0%')).toBeInTheDocument();
    });

    it('aggregates categories beyond top 5 into "Останали" on the donut chart', () => {
        // Create 7 distinct categories with decreasing amounts
        const expenses: ExpenseEntry[] = [
            { id: '1', date: '2026-03-01', amount: 1000, description: 'Cat 1', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '2', date: '2026-03-02', amount: 500, description: 'Cat 2', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '3', date: '2026-03-03', amount: 400, description: 'Cat 3', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '4', date: '2026-03-04', amount: 300, description: 'Cat 4', category: 'Health/Аптека', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '5', date: '2026-03-05', amount: 200, description: 'Cat 5', category: 'Beauty', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '6', date: '2026-03-06', amount: 100, description: 'Cat 6', category: 'Home', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '7', date: '2026-03-07', amount: 50, description: 'Cat 7', category: 'Shopping', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ expenseEntries: expenses });

        render(<CategoryChart />);

        // Top 5 slices should exist on donut
        expect(screen.getByTestId('slice-Магазини (Храна/Вода)')).toBeInTheDocument();
        expect(screen.getByTestId('slice-Eating out')).toBeInTheDocument();
        expect(screen.getByTestId('slice-Гориво')).toBeInTheDocument();
        expect(screen.getByTestId('slice-Health/Аптека')).toBeInTheDocument();
        expect(screen.getByTestId('slice-Beauty')).toBeInTheDocument();

        // 6th slice is "Останали" (aggregating Home 100 + Shopping 50 = 150)
        expect(screen.getByTestId('slice-Останали')).toBeInTheDocument();

        // Individual slice for 6th and 7th should NOT be on the donut
        expect(screen.queryByTestId('slice-Home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('slice-Shopping')).not.toBeInTheDocument();
    });

    it('expands and collapses remaining categories when toggle button is clicked', () => {
        const expenses: ExpenseEntry[] = [
            { id: '1', date: '2026-03-01', amount: 1000, description: 'Cat 1', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '2', date: '2026-03-02', amount: 500, description: 'Cat 2', category: 'Eating out', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '3', date: '2026-03-03', amount: 400, description: 'Cat 3', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '4', date: '2026-03-04', amount: 300, description: 'Cat 4', category: 'Health/Аптека', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '5', date: '2026-03-05', amount: 200, description: 'Cat 5', category: 'Beauty', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '6', date: '2026-03-06', amount: 100, description: 'Cat 6', category: 'Home', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ expenseEntries: expenses });

        render(<CategoryChart />);

        // Initially collapsed: top 4 visible in the list, 5th and 6th hidden from list
        expect(screen.getByRole('button', { name: /покажи още 2 категории/i })).toBeInTheDocument();
        expect(screen.queryByText('Home')).not.toBeInTheDocument();

        // Click expand
        fireEvent.click(screen.getByRole('button', { name: /покажи още 2 категории/i }));

        // Now all categories are visible in the list
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Beauty')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /скрий останалите категории/i })).toBeInTheDocument();

        // Click collapse
        fireEvent.click(screen.getByRole('button', { name: /скрий останалите категории/i }));
        expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('updates center readout on category slice or row selection, and resets on second click', () => {
        const expenses: ExpenseEntry[] = [
            { id: '1', date: '2026-03-01', amount: 300, description: 'Cat 1', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '2', date: '2026-03-02', amount: 100, description: 'Cat 2', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ expenseEntries: expenses });

        render(<CategoryChart />);

        // Click category slice in pie
        fireEvent.click(screen.getByTestId('slice-Магазини (Храна/Вода)'));

        // Center readout should now display category details
        expect(screen.getByLabelText(/магазини \(храна\/вода\): €300,00/i)).toBeInTheDocument();
        // 75.0% appears in center badge and in row
        expect(screen.getAllByText('75.0%').length).toBeGreaterThanOrEqual(1);

        // Click again to reset to total
        fireEvent.click(screen.getByTestId('slice-Магазини (Храна/Вода)'));
        expect(screen.getByText(/общо разход/i)).toBeInTheDocument();
        expect(screen.getByText('€400,00')).toBeInTheDocument();
    });

    it('resets selection and returns graph to normal when clicking away outside the chart', () => {
        const expenses: ExpenseEntry[] = [
            { id: '1', date: '2026-03-01', amount: 300, description: 'Cat 1', category: 'Магазини (Храна/Вода)', isWorkExpense: false, isWithKami: false, isWithOthers: false },
            { id: '2', date: '2026-03-02', amount: 100, description: 'Cat 2', category: 'Гориво', isWorkExpense: false, isWithKami: false, isWithOthers: false },
        ];

        useFinancialStore.setState({ expenseEntries: expenses });

        render(
            <div>
                <button data-testid="outside-element">Outside</button>
                <CategoryChart />
            </div>
        );

        // Click category slice in pie
        fireEvent.click(screen.getByTestId('slice-Магазини (Храна/Вода)'));
        expect(screen.getByLabelText(/магазини \(храна\/вода\): €300,00/i)).toBeInTheDocument();

        // Click outside element
        fireEvent.pointerDown(screen.getByTestId('outside-element'));

        // Center readout should reset back to total
        expect(screen.getByText(/общо разход/i)).toBeInTheDocument();
        expect(screen.getByText('€400,00')).toBeInTheDocument();
    });
});
