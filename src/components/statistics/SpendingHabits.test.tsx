import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { SpendingHabits } from './SpendingHabits';
import { CategoryRankEntry } from '@/hooks/useStatisticsData';

describe('SpendingHabits Component', () => {
    const mockCategoryRanking: CategoryRankEntry[] = [
        {
            name: 'Магазини (Храна/Вода)',
            displayName: 'Магазини (Храна/Вода)',
            amount: 1200,
            percentage: 40,
            transactionCount: 25,
            avgPerTransaction: 48,
        },
        {
            name: 'Eating out',
            displayName: 'Eating out',
            amount: 600,
            percentage: 20,
            transactionCount: 15,
            avgPerTransaction: 40,
        },
        {
            name: 'Гориво',
            displayName: 'Гориво',
            amount: 450,
            percentage: 15,
            transactionCount: 6,
            avgPerTransaction: 75,
        },
        {
            name: 'Сметки/Разходи',
            displayName: 'Сметки/Разходи',
            amount: 300,
            percentage: 10,
            transactionCount: 3,
            avgPerTransaction: 100,
        },
        {
            name: 'Entertainment',
            displayName: 'Entertainment',
            amount: 150,
            percentage: 5,
            transactionCount: 5,
            avgPerTransaction: 30,
        },
        {
            name: 'Beauty',
            displayName: 'Beauty',
            amount: 100,
            percentage: 3.3,
            transactionCount: 2,
            avgPerTransaction: 50,
        },
        {
            name: 'Други',
            displayName: 'Други',
            amount: 50,
            percentage: 1.7,
            transactionCount: 1,
            avgPerTransaction: 50,
        },
    ];

    const defaultProps = {
        year: 2026,
        topCategory: mockCategoryRanking[0],
        categoryRanking: mockCategoryRanking,
        allCategories: mockCategoryRanking,
        mostFrequentCategory: mockCategoryRanking[0],
        avgExpensePerTransaction: 48.5,
        totalExpenses: 3000,
        totalTransactionCount: 60,
        incomeTransactionCount: 3,
        expenseTransactionCount: 57,
    };

    it('renders empty state placeholder when there are no expenses', () => {
        render(
            <SpendingHabits
                {...defaultProps}
                topCategory={null}
                categoryRanking={[]}
                allCategories={[]}
                mostFrequentCategory={null}
                totalExpenses={0}
                expenseTransactionCount={0}
            />
        );

        expect(screen.getByText('Няма записани разходи')).toBeInTheDocument();
        expect(
            screen.getByText(/Добавете разход за 2026.*за да видите навиците си за харчене/i)
        ).toBeInTheDocument();
    });

    it('renders header, 3-column stats strip, and category ranking list', () => {
        render(<SpendingHabits {...defaultProps} />);

        // Header
        expect(screen.getByText('Навици за харчене')).toBeInTheDocument();
        expect(screen.getByText(/7 активни категории през 2026/)).toBeInTheDocument();

        // 3-Column Stats Strip labels
        expect(screen.getByText('Ср. разход')).toBeInTheDocument();
        expect(screen.getByText('Най-чест')).toBeInTheDocument();
        expect(screen.getByText('Топ разход')).toBeInTheDocument();

        // Top 5 categories initially shown
        expect(screen.getByText('Магазини (Храна/Вода)')).toBeInTheDocument();
        expect(screen.getByText('Eating out')).toBeInTheDocument();
        expect(screen.getByText('Гориво')).toBeInTheDocument();
        expect(screen.getByText('Сметки/Разходи')).toBeInTheDocument();
        expect(screen.getByText('Entertainment')).toBeInTheDocument();

        // 6th and 7th category hidden before expansion
        expect(screen.queryByText('Beauty')).not.toBeInTheDocument();
        expect(screen.queryByText('Други')).not.toBeInTheDocument();
    });

    it('displays interactive tooltips on the 3 stats strip metric buttons without throwing', () => {
        render(<SpendingHabits {...defaultProps} />);

        const buttons = screen.getAllByRole('button');
        // Find the stats strip buttons (3 tooltips + 1 expander)
        expect(buttons.length).toBeGreaterThanOrEqual(4);

        // Click the first tooltip ("Ср. разход")
        const avgTicketButton = buttons[0];
        fireEvent.pointerDown(avgTicketButton);
        fireEvent.click(avgTicketButton);

        expect(
            screen.getByText(/Среден размер на една покупка/i)
        ).toBeInTheDocument();

        // Click second tooltip ("Най-чест")
        const mostFrequentButton = buttons[1];
        fireEvent.pointerDown(mostFrequentButton);
        fireEvent.click(mostFrequentButton);

        expect(
            screen.getByText(/Категорията с най-много отделни покупки/i)
        ).toBeInTheDocument();

        // Click third tooltip ("Топ разход")
        const topSpendButton = buttons[2];
        fireEvent.pointerDown(topSpendButton);
        fireEvent.click(topSpendButton);

        expect(
            screen.getByText(/Категорията с най-голяма обща похарчена сума/i)
        ).toBeInTheDocument();
    });

    it('expands and collapses the category list when clicking the expander button', () => {
        render(<SpendingHabits {...defaultProps} />);

        const expandButton = screen.getByRole('button', { name: /Покажи всички \(7\) категории/i });
        expect(expandButton).toBeInTheDocument();

        // Expand
        fireEvent.click(expandButton);
        expect(screen.getByText('Beauty')).toBeInTheDocument();
        expect(screen.getByText('Други')).toBeInTheDocument();
        expect(screen.getByText(/Покажи само топ 5/i)).toBeInTheDocument();

        // Collapse
        fireEvent.click(screen.getByRole('button', { name: /Покажи само топ 5/i }));
        expect(screen.queryByText('Beauty')).not.toBeInTheDocument();
        expect(screen.queryByText('Други')).not.toBeInTheDocument();
    });
});
