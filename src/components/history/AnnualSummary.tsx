/**
 * AnnualSummary – full-year income, expenses, and profit overview.
 * Reuses StatDisplay for visual consistency with the dashboard.
 */
'use client';

import React from 'react';
import {
    TrendingUpIcon,
    TrendingDownIcon,
    Analytics01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface AnnualSummaryProps {
    year: number;
    totalIncome: number;
    totalExpenses: number;
    totalProfit: number;
}

const formatCurrency = (amount: number, year: number): string => {
    const symbol = getCurrencySymbol(`${year}-01-01`);
    const num = Math.abs(amount).toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

export const AnnualSummary = ({
    year,
    totalIncome,
    totalExpenses,
    totalProfit,
}: AnnualSummaryProps): React.ReactElement => {
    const profitClass = totalProfit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const profitSign = totalProfit >= 0 ? '+' : '−';

    return (
        <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-6">
            <div className="flex items-center gap-2.5 mb-5">
                <IconSquircle
                    size="sm"
                    className="bg-stone-100 text-stone-700 border-stone-200/70"
                >
                    <AppIcon icon={Analytics01Icon} size={14} />
                </IconSquircle>
                <div>
                    <h2 className="text-xs sm:text-sm font-semibold text-stone-800 tracking-tight">
                        {year}&nbsp;г. Годишен преглед
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                        Общ баланс на приходи и разходи за годината
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 sm:divide-x sm:divide-stone-100">
                {/* Total Income */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
                        <AppIcon icon={TrendingUpIcon} size={13} className="text-emerald-500" />
                        <span>Общ приход</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 tabular-nums tracking-tight">
                        +{formatCurrency(totalIncome, year)}
                    </p>
                </div>

                {/* Total Expenses */}
                <div className="flex flex-col gap-1 sm:pl-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
                        <AppIcon icon={TrendingDownIcon} size={13} className="text-rose-400" />
                        <span>Общи разходи</span>
                    </div>
                    <p className="text-2xl font-bold text-rose-500 tabular-nums tracking-tight">
                        −{formatCurrency(totalExpenses, year)}
                    </p>
                </div>

                {/* Net Profit */}
                <div className="flex flex-col gap-1 sm:pl-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
                        <AppIcon icon={Analytics01Icon} size={13} className={profitClass} />
                        <span>Нетна печалба</span>
                    </div>
                    <p className={`text-2xl font-bold tabular-nums tracking-tight ${profitClass}`}>
                        {profitSign}{formatCurrency(totalProfit, year)}
                    </p>
                </div>
            </div>
        </div>
    );
};
