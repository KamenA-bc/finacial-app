/**
 * AnnualSummary – full-year income, expenses, and profit overview.
 * Reuses StatDisplay for visual consistency with the dashboard.
 */
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
    CURRENCY_SYMBOL,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface AnnualSummaryProps {
    year: number;
    totalIncome: number;
    totalExpenses: number;
    totalProfit: number;
}

const formatCurrency = (amount: number): string =>
    `${CURRENCY_SYMBOL}${Math.abs(amount).toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

export const AnnualSummary = ({
    year,
    totalIncome,
    totalExpenses,
    totalProfit,
}: AnnualSummaryProps): React.ReactElement => {
    const profitClass = totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const profitSign = totalProfit >= 0 ? '+' : '−';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={18} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    {year} Annual Review
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Income */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        <TrendingUp size={12} className="text-emerald-500" />
                        Total Income
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 tabular-nums">
                        +{formatCurrency(totalIncome)}
                    </p>
                </div>

                {/* Total Expenses */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        <TrendingDown size={12} className="text-rose-400" />
                        Total Expenses
                    </div>
                    <p className="text-2xl font-bold text-rose-500 tabular-nums">
                        −{formatCurrency(totalExpenses)}
                    </p>
                </div>

                {/* Net Profit */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        <BarChart3 size={12} className={profitClass} />
                        Net Profit
                    </div>
                    <p className={`text-2xl font-bold tabular-nums ${profitClass}`}>
                        {profitSign}{formatCurrency(totalProfit)}
                    </p>
                </div>
            </div>
        </div>
    );
};
