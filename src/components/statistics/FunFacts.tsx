/**
 * FunFacts – key financial records and insights for the year.
 * Shows Kami spending, biggest spending day, and average daily expense.
 * Stacks vertically on mobile, side-by-side on tablet+.
 */
'use client';

import React from 'react';
import { Flame, TrendingDown, Calculator, Heart } from 'lucide-react';
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
    avgDailyExpense: number;
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
    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 ${iconBg}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className={`text-lg font-bold tabular-nums ${valueClass}`}>
                {value}
            </p>
            {subtext && (
                <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>
            )}
        </div>
    </div>
);

export const FunFacts = ({
    year,
    biggestSpendingDay,
    avgDailyExpense,
    kamiSpending,
}: FunFactsProps): React.ReactElement => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-orange-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Интересни факти
            </h2>
        </div>

        <div className="flex flex-col gap-3">
            {/* Row 1: Kami + Worst Day — stacked on mobile, side-by-side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FactCard
                    label="❤️"
                    value={kamiSpending > 0 ? `−${fmt(kamiSpending, year)}` : '—'}
                    subtext={kamiSpending > 0 ? 'общо за годината' : 'Няма маркирани'}
                    icon={<Heart size={15} className="text-pink-500" />}
                    iconBg="bg-pink-50"
                    valueClass={kamiSpending > 0 ? 'text-pink-500' : 'text-gray-300'}
                />
                <FactCard
                    label="Най-скъп ден"
                    value={biggestSpendingDay ? `−${fmt(biggestSpendingDay.amount, year)}` : '—'}
                    subtext={biggestSpendingDay ? formatDisplayDate(biggestSpendingDay.date) : undefined}
                    icon={<TrendingDown size={15} className="text-rose-400" />}
                    iconBg="bg-rose-50"
                    valueClass="text-rose-500"
                />
            </div>

            {/* Row 2: Average daily expense – always full width */}
            <FactCard
                label="Среден дневен разход"
                value={fmt(avgDailyExpense, year)}
                icon={<Calculator size={15} className="text-blue-500" />}
                iconBg="bg-blue-50"
                valueClass="text-gray-700"
            />
        </div>
    </div>
);
