/**
 * FunFacts – streaks, records, and interesting financial facts for the year.
 * Includes biggest spending/earning day, average daily expense, active days,
 * and Kami spending total.
 */
'use client';

import React from 'react';
import {
    Flame,
    Calendar,
    TrendingUp,
    TrendingDown,
    Calculator,
    Heart,
} from 'lucide-react';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';
import { formatDisplayDate } from '@/lib/dateUtils';

interface DayRecord {
    date: string;
    amount: number;
}

interface FunFactsProps {
    year: number;
    biggestSpendingDay: DayRecord | null;
    biggestEarningDay: DayRecord | null;
    avgDailyExpense: number;
    activeDays: number;
    kamiSpending: number;
}

const fmt = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

interface FactCardProps {
    label: string;
    value: string;
    subtext?: string;
    icon: React.ReactElement;
    iconBg: string;
    valueClass?: string;
}

const FactCard = ({
    label,
    value,
    subtext,
    icon,
    iconBg,
    valueClass = 'text-gray-700',
}: FactCardProps): React.ReactElement => (
    <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${iconBg}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className={`text-base font-bold tabular-nums ${valueClass}`}>
                {value}
            </p>
            {subtext && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{subtext}</p>
            )}
        </div>
    </div>
);

export const FunFacts = ({
    year,
    biggestSpendingDay,
    biggestEarningDay,
    avgDailyExpense,
    activeDays,
    kamiSpending,
}: FunFactsProps): React.ReactElement => {
    const facts: FactCardProps[] = [
        {
            label: 'Най-скъп ден',
            value: biggestSpendingDay ? `−${fmt(biggestSpendingDay.amount, year)}` : '—',
            subtext: biggestSpendingDay ? formatDisplayDate(biggestSpendingDay.date) : undefined,
            icon: <TrendingDown size={14} className="text-rose-400" />,
            iconBg: 'bg-rose-50',
            valueClass: 'text-rose-500',
        },
        {
            label: 'Най-доходен ден',
            value: biggestEarningDay ? `+${fmt(biggestEarningDay.amount, year)}` : '—',
            subtext: biggestEarningDay ? formatDisplayDate(biggestEarningDay.date) : undefined,
            icon: <TrendingUp size={14} className="text-emerald-500" />,
            iconBg: 'bg-emerald-50',
            valueClass: 'text-emerald-600',
        },
        {
            label: 'Ср. дневен разход',
            value: fmt(avgDailyExpense, year),
            icon: <Calculator size={14} className="text-blue-500" />,
            iconBg: 'bg-blue-50',
        },
        {
            label: 'Активни дни',
            value: String(activeDays),
            icon: <Calendar size={14} className="text-purple-500" />,
            iconBg: 'bg-purple-50',
            valueClass: 'text-purple-600',
        },
        {
            label: 'Разход с Ками',
            value: kamiSpending > 0 ? `−${fmt(kamiSpending, year)}` : '—',
            subtext: kamiSpending > 0 ? 'от описания с "Ками"' : 'Няма съвпадения',
            icon: <Heart size={14} className="text-pink-500" />,
            iconBg: 'bg-pink-50',
            valueClass: kamiSpending > 0 ? 'text-pink-500' : 'text-gray-300',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-orange-400" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Интересни факти
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {facts.map((fact) => (
                    <FactCard key={fact.label} {...fact} />
                ))}
            </div>
        </div>
    );
};
