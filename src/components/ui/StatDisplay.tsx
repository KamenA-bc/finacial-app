'use client';

import React from 'react';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface StatDisplayProps {
    label: string;
    value: number;
    /** e.g. "Today" or "Last 30 days" */
    period: string;
    /** Optional date to determine currency symbol */
    date?: string;
}

const formatCurrency = (amount: number, date?: string): string =>
    `${getCurrencySymbol(date)}${Math.abs(amount).toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

/**
 * Large, typographic profit/loss display.
 * No solid coloured card backgrounds – purely typographic with text accents.
 */
export const StatDisplay = ({
    label,
    value,
    period,
    date,
}: StatDisplayProps): React.ReactElement => {
    const isPositive = value >= 0;
    const valueClass = isPositive ? 'text-emerald-700' : 'text-rose-600';
    const sign = isPositive ? '+' : '−';

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <span
                    className={`inline-block w-2 h-2 rounded-full ${
                        isPositive ? 'bg-emerald-500 ring-2 ring-emerald-100' : 'bg-rose-500 ring-2 ring-rose-100'
                    }`}
                />
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {label}
                </p>
            </div>
            <p className={`text-3xl font-extrabold tracking-tight tabular-nums ${valueClass}`}>
                {sign}
                {formatCurrency(value, date)}
            </p>
            <p className="text-xs text-stone-500 font-medium">{period}</p>
        </div>
    );
};
