import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PdfExportButton } from './PdfExportButton';
import { exportToPdf } from '@/lib/pdfExport';
import { logError } from '@/lib/errorLogger';

vi.mock('@/lib/pdfExport', () => ({
    exportToPdf: vi.fn(),
}));

vi.mock('@/lib/errorLogger', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/errorLogger')>();
    return {
        ...actual,
        logError: vi.fn(),
    };
});

describe('PdfExportButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('displays error feedback and logs when export fails', async () => {
        (exportToPdf as any).mockRejectedValueOnce(new Error('PDF generation failed'));

        render(<PdfExportButton stats={{ hasData: true } as any} year={2026} />);
        
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(logError).toHaveBeenCalledWith('exportPdf', expect.any(Error), expect.any(Object));
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('PDF generation failed'));
        });
    });
});
