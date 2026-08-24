'use client';

import React, { useState } from 'react';
import { Table, CheckCircle, Loader2 } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';

/** Brief duration (ms) the success state is shown after export. */
const SUCCESS_DISPLAY_MS = 2500;

/**
 * Button that exports the full year of transactions as a formatted Excel (.xlsx) file.
 * Opens natively with colors & tabs in Google Sheets and Excel.
 */
export const ExportButton = (): React.ReactElement => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);
    const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
    const currentYear = new Date().getFullYear();

    const handleExport = async (): Promise<void> => {
        if (state === 'loading') return;
        setState('loading');

        try {
            const { exportToExcel } = await import('@/lib/excelExport');
            await exportToExcel(incomeEntries, expenseEntries, currentYear);
            setState('done');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        } catch (err) {
            console.error('Excel export failed:', err);
            setState('error');
            setTimeout(() => setState('idle'), SUCCESS_DISPLAY_MS);
        }
    };

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                onClick={handleExport}
                disabled={state === 'loading'}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                    state === 'done'
                        ? 'border-emerald-300 text-emerald-600 bg-emerald-50'
                        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400 hover:text-gray-800'
                }`}
            >
                {state === 'loading' ? (
                    <>
                        <Loader2 size={15} className="animate-spin text-gray-400" />
                        Генериране…
                    </>
                ) : state === 'done' ? (
                    <>
                        <CheckCircle size={15} />
                        Изтеглен!
                    </>
                ) : (
                    <>
                        <Table size={15} />
                        Експортирай в Google Sheets (.xlsx)
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400">
                Изтегля цветен Excel с месечни раздели за{' '}
                <span className="font-medium text-gray-500">
                    {currentYear} г. (Google Sheets › File › Import)
                </span>
            </p>
        </div>
    );
};
