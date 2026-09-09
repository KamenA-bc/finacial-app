/**
 * Unit tests for the ExportDropdown component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

vi.mock('@/lib/errorLogger', () => ({
    logError: vi.fn(),
    extractErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

import { exportToCsv } from '@/lib/csvExport';
import { logError } from '@/lib/errorLogger';

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

    it('catches export failure, logs error, and notifies user with error toast', async () => {
        const { useToastStore } = await import('@/store/toastStore');

        vi.mocked(exportToCsv).mockImplementationOnce(() => {
            throw new Error('Disk write failure');
        });

        render(<ExportDropdown year={2026} />);
        fireEvent.click(screen.getByRole('button', { name: /експортирай данни/i }));
        fireEvent.click(screen.getByText('CSV Файл (.csv)'));

        expect(logError).toHaveBeenCalledWith('exportCsv', expect.anything());
        expect(useToastStore.getState().isOpen).toBe(true);
        expect(useToastStore.getState().variant).toBe('error');
    });
});

