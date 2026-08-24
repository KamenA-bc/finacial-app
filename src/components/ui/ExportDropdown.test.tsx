/**
 * Unit tests for the ExportDropdown component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportDropdown } from '@/components/ui/ExportDropdown';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/store/transactionStore', () => ({
    useFinancialStore: vi.fn((selector) =>
        selector({
            incomeEntries: [],
            expenseEntries: [],
        })
    ),
}));

vi.mock('@/hooks/useStatisticsData', () => ({
    useStatisticsData: vi.fn(() => ({
        hasData: true,
        totalIncome: 1000,
        totalExpenses: 500,
    })),
}));

vi.mock('@/lib/csvExport', () => ({
    exportToCsv: vi.fn(),
}));

import { exportToCsv } from '@/lib/csvExport';

describe('ExportDropdown Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders closed trigger button initially', () => {
        render(<ExportDropdown year={2026} />);

        const button = screen.getByRole('button', { name: /експортирай данни/i });
        expect(button).toBeDefined();
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens popover menu when trigger button is clicked', () => {
        render(<ExportDropdown year={2026} />);

        const button = screen.getByRole('button', { name: /експортирай данни/i });
        fireEvent.click(button);

        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(screen.getByText('Изберете формат')).toBeDefined();
        expect(screen.getByText('Годишен PDF отчет')).toBeDefined();
        expect(screen.getByText('Excel (.xlsx)')).toBeDefined();
        expect(screen.getByText('CSV Файл (.csv)')).toBeDefined();
    });

    it('triggers CSV export when CSV option is clicked', () => {
        render(<ExportDropdown year={2026} />);

        // Open menu
        fireEvent.click(screen.getByRole('button', { name: /експортирай данни/i }));

        // Click CSV
        const csvOption = screen.getByText('CSV Файл (.csv)');
        fireEvent.click(csvOption);

        expect(exportToCsv).toHaveBeenCalled();
    });
});
