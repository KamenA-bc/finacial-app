'use client';

import React, { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { exportToCsv } from '@/lib/csvExport';

/** Brief duration (ms) the success state is shown after export. */
const SUCCESS_DISPLAY_MS = 2500;

/**
 * Button that exports the last 30 days of transactions as a CSV file.
 * The file can be imported into Google Sheets via File → Import.
 */
export const ExportButton = (): React.ReactElement => {
    const incomeEntries = useFinancialStore((s) => s.incomeEntries);
    const expenseEntries = useFinancialStore((s) => s.expenseEntries);
    const [exported, setExported] = useState(false);

    const handleExport = (): void => {
        exportToCsv(incomeEntries, expenseEntries);
        setExported(true);
        setTimeout(() => setExported(false), SUCCESS_DISPLAY_MS);
    };

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                onClick={handleExport}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${exported
                        ? 'border-emerald-300 text-emerald-600 bg-emerald-50'
                        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400 hover:text-gray-800'
                    }`}
            >
                {exported ? (
                    <>
                        <CheckCircle size={15} />
                        Downloaded!
                    </>
                ) : (
                    <>
                        <Download size={15} />
                        Export to Google Sheets
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400">
                Downloads last 30 days as .csv → import via{' '}
                <span className="font-medium text-gray-500">
                    Google Sheets › File › Import
                </span>
            </p>
        </div>
    );
};
