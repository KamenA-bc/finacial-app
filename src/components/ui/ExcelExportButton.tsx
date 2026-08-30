/**
 * ExcelExportButton – triggers full-year multi-tab formatted Excel (.xlsx) download.
 * ExcelJS is dynamically imported on click (zero impact on initial page bundle).
 */
'use client';

import React, { useState } from 'react';
import { Table, CheckCircle, Loader2 } from 'lucide-react';
import type { IncomeEntry, ExpenseEntry } from '@/types';
import { logError, extractErrorMessage } from '@/lib/errorLogger';

const SUCCESS_DISPLAY_MS = 2500;

interface ExcelExportButtonProps {
    incomeEntries: IncomeEntry[];
    expenseEntries: ExpenseEntry[];
    year: number;
}

export const ExcelExportButton = ({
    incomeEntries,
    expenseEntries,
    year,
}: ExcelExportButtonProps): React.ReactElement => {
    const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    const handleExport = async (): Promise<void> => {
        if (state === 'loading') return;
        setState('loading');

        try {
            const { exportToExcel } = await import('@/lib/excelExport');
            await exportToExcel(incomeEntries, expenseEntries, year);
            setState('done');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        } catch (err) {
            const message = extractErrorMessage(err);
            logError('exportExcel', err, { year });
            window.alert(`Грешка при експортиране: ${message}`);
            setState('error');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        }
    };

    const buttonStyles: Record<typeof state, string> = {
        idle:    'border-emerald-200 text-emerald-700 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100',
        loading: 'border-gray-200 text-gray-400 bg-gray-50 cursor-wait',
        done:    'border-emerald-300 text-emerald-600 bg-emerald-50',
        error:   'border-rose-300 text-rose-600 bg-rose-50',
    };

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                onClick={handleExport}
                disabled={state === 'loading'}
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
                        <Table size={15} />
                        Грешка
                    </>
                )}
                {state === 'idle' && (
                    <>
                        <Table size={15} />
                        Експортирай в Excel (.xlsx)
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400">
                12 месечни раздела + Общ преглед за{' '}
                <span className="font-medium text-gray-500">{year} г.</span> (Google Sheets & Excel)
            </p>
        </div>
    );
};
