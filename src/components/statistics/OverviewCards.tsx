/**
 * OverviewCards – top-level KPI summary for the statistics page.
 * Shows total income, expenses, net profit, and savings rate.
 * Cards are uniform height on mobile with auto-scaling text.
 */
'use client';

import React from 'react';
import {
    TrendingUpIcon,
    TrendingDownIcon,
    Analytics01Icon,
    PercentIcon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface OverviewCardsProps {
    year: number;
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    savingsRate: number;
}

const fmt = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${Math.abs(amount).toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

export const OverviewCards = ({
    year,
    totalIncome,
    totalExpenses,
    netProfit,
    savingsRate,
}: OverviewCardsProps): React.ReactElement => {
    const profitClass = netProfit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const profitSign = netProfit >= 0 ? '+' : '−';
    const savingsClass = savingsRate >= 0 ? 'text-emerald-600' : 'text-rose-500';

    const cards = [
        {
            label: 'Общ приход',
            value: `+${fmt(totalIncome, year)}`,
            valueClass: 'text-emerald-600',
            icon: <AppIcon icon={TrendingUpIcon} size={15} className="text-emerald-500" />,
        },
        {
            label: 'Общи разходи',
            value: `−${fmt(totalExpenses, year)}`,
            valueClass: 'text-rose-500',
            icon: <AppIcon icon={TrendingDownIcon} size={15} className="text-rose-400" />,
        },
        {
            label: 'Нетна печалба',
            value: `${profitSign}${fmt(netProfit, year)}`,
            valueClass: profitClass,
            icon: <AppIcon icon={Analytics01Icon} size={15} className={profitClass} />,
        },
        {
            label: 'Спестявания',
            value: `${savingsRate >= 0 ? '' : '−'}${Math.abs(savingsRate).toFixed(1)}%`,
            valueClass: savingsClass,
            icon: <AppIcon icon={PercentIcon} size={15} className={savingsClass} />,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col justify-between min-h-[100px]"
                >
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-widest mb-2">
                        {card.icon}
                        <span className="leading-tight">{card.label}</span>
                    </div>
                    <p className={`text-xl sm:text-2xl font-bold tabular-nums break-all ${card.valueClass}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};
