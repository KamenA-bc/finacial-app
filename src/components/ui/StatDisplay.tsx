'use client';

import React from 'react';
import {
    CURRENCY_SYMBOL,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface StatDisplayProps {
    label: string;
    value: number;
    /** e.g. "Today" or "Last 30 days" */
    period: string;
}

const formatCurrency = (amount: number): string =>
    `${CURRENCY_SYMBOL}${Math.abs(amount).toLocaleString(
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
}: StatDisplayProps): React.ReactElement => {
    const isPositive = value >= 0;
    const valueClass = isPositive ? 'text-emerald-600' : 'text-rose-500';
    const sign = isPositive ? '+' : '−';

    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {label}
            </p>
            <p className={`text-3xl font-bold tabular-nums ${valueClass}`}>
                {sign}
                {formatCurrency(value)}
            </p>
            <p className="text-xs text-gray-400">{period}</p>
        </div>
    );
};
