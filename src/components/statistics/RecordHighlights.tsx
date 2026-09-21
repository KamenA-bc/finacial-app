/**
 * RecordHighlights – best & worst month records for the year.
 * Displays a 2×2 grid of month records with trophy/alert icons.
 */
'use client';

import React from 'react';
import {
    TrophyIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    AlertDiamondIcon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface MonthRecord {
    month: string;
    amount: number;
}

interface RecordHighlightsProps {
    year: number;
    biggestEarningMonth: MonthRecord | null;
    biggestSpendingMonth: MonthRecord | null;
    mostProfitableMonth: MonthRecord | null;
    worstMonth: MonthRecord | null;
}

const fmt = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${Math.abs(amount).toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

interface RecordCardProps {
    label: string;
    icon: React.ReactElement;
    iconBg: string;
    month: string | null;
    value: string | null;
    valueClass: string;
}

const RecordCard = ({
    label,
    icon,
    iconBg,
    month,
    value,
    valueClass,
}: RecordCardProps): React.ReactElement => (
    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
        <IconSquircle size="lg" className={iconBg}>
            {icon}
        </IconSquircle>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            {month ? (
                <>
                    <p className="text-sm font-semibold text-gray-700 truncate">{month}</p>
                    <p className={`text-lg font-bold tabular-nums ${valueClass}`}>
                        {value}
                    </p>
                </>
            ) : (
                <p className="text-xs text-gray-300 mt-1">Няма данни</p>
            )}
        </div>
    </div>
);

export const RecordHighlights = ({
    year,
    biggestEarningMonth,
    biggestSpendingMonth,
    mostProfitableMonth,
    worstMonth,
}: RecordHighlightsProps): React.ReactElement => {
    const records = [
        {
            label: 'Най-печеливш месец',
            icon: <AppIcon icon={TrendingUpIcon} size={16} className="text-emerald-600" />,
            iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
            month: biggestEarningMonth?.month ?? null,
            value: biggestEarningMonth ? `+${fmt(biggestEarningMonth.amount, year)}` : null,
            valueClass: 'text-emerald-600',
        },
        {
            label: 'Най-разходен месец',
            icon: <AppIcon icon={TrendingDownIcon} size={16} className="text-rose-500" />,
            iconBg: 'bg-rose-50 text-rose-500 border-rose-200/70',
            month: biggestSpendingMonth?.month ?? null,
            value: biggestSpendingMonth ? `−${fmt(biggestSpendingMonth.amount, year)}` : null,
            valueClass: 'text-rose-500',
        },
        {
            label: 'Най-добър месец',
            icon: <AppIcon icon={TrophyIcon} size={16} className="text-amber-600" />,
            iconBg: 'bg-amber-50 text-amber-600 border-amber-200/70',
            month: mostProfitableMonth?.month ?? null,
            value: mostProfitableMonth
                ? `${mostProfitableMonth.amount >= 0 ? '+' : '−'}${fmt(mostProfitableMonth.amount, year)}`
                : null,
            valueClass: mostProfitableMonth && mostProfitableMonth.amount >= 0
                ? 'text-emerald-600'
                : 'text-rose-500',
        },
        {
            label: 'Най-лош месец',
            icon: <AppIcon icon={AlertDiamondIcon} size={16} className="text-stone-500" />,
            iconBg: 'bg-stone-100 text-stone-600 border-stone-200/70',
            month: worstMonth?.month ?? null,
            value: worstMonth
                ? `${worstMonth.amount >= 0 ? '+' : '−'}${fmt(worstMonth.amount, year)}`
                : null,
            valueClass: worstMonth && worstMonth.amount >= 0
                ? 'text-emerald-600'
                : 'text-rose-500',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
                <AppIcon icon={TrophyIcon} size={16} className="text-amber-500" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Рекорди
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {records.map((r) => (
                    <RecordCard key={r.label} {...r} />
                ))}
            </div>
        </div>
    );
};
