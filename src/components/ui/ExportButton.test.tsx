import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportButton } from './ExportButton';
import { exportToExcel } from '@/lib/excelExport';
import { logError } from '@/lib/errorLogger';

vi.mock('@/lib/excelExport', () => ({
    exportToExcel: vi.fn(),
}));

vi.mock('@/lib/errorLogger', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/errorLogger')>();
    return {
        ...actual,
        logError: vi.fn(),
    };
});

// Mock Zustand store
vi.mock('@/store/transactionStore', () => ({
    useFinancialStore: vi.fn((selector) => selector({
        incomeEntries: [],
        expenseEntries: [],
    })),
}));

describe('ExportButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('displays error feedback and logs when export fails', async () => {
        (exportToExcel as any).mockRejectedValueOnce(new Error('Excel failed'));

        render(<ExportButton />);
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(logError).toHaveBeenCalledWith('exportExcel', expect.any(Error), expect.any(Object));
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Excel failed'));
        });
    });
});
