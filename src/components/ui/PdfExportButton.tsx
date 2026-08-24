/**
 * PdfExportButton – triggers a full-year PDF report download.
 * jsPDF is lazy-loaded only when the user clicks, keeping the initial bundle small.
 * Mirrors the UX pattern of the existing ExportButton (CSV).
 */
'use client';

import React, { useState } from 'react';
import { FileText, CheckCircle, Loader2 } from 'lucide-react';
import type { StatisticsData } from '@/hooks/useStatisticsData';

/** Duration (ms) the success indicator stays visible after export. */
const SUCCESS_DISPLAY_MS = 2500;

interface PdfExportButtonProps {
    stats: StatisticsData;
    year: number;
}

export const PdfExportButton = ({ stats, year }: PdfExportButtonProps): React.ReactElement => {
    const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    const handleExport = async (): Promise<void> => {
        if (state === 'loading') return;
        setState('loading');

        try {
            const { exportToPdf } = await import('@/lib/pdfExport');
            await exportToPdf(stats, year);
            setState('done');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        } catch (err) {
            console.error('PDF export failed:', err);
            setState('error');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        }
    };

    const buttonStyles: Record<typeof state, string> = {
        idle:    'border-gray-200 text-gray-600 bg-white hover:border-gray-400 hover:text-gray-800',
        loading: 'border-gray-200 text-gray-400 bg-gray-50 cursor-wait',
        done:    'border-emerald-300 text-emerald-600 bg-emerald-50',
        error:   'border-rose-300 text-rose-600 bg-rose-50',
    };

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                onClick={handleExport}
                disabled={state === 'loading' || !stats.hasData}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${buttonStyles[state]}`}
            >
                {state === 'loading' && (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Генериране…
                    </>
                )}
                {state === 'done' && (
                    <>
                        <CheckCircle size={15} />
                        Изтеглен!
                    </>
                )}
                {state === 'error' && (
                    <>
                        <FileText size={15} />
                        Грешка
                    </>
                )}
                {state === 'idle' && (
                    <>
                        <FileText size={15} />
                        Годишен отчет (PDF)
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400">
                Генерира PDF с графики и статистики за{' '}
                <span className="font-medium text-gray-500">{year} г.</span>
            </p>
        </div>
    );
};
