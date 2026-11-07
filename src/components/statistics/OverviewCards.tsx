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
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
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

const fmt = (amount: number, year: number): string => {
    const symbol = getCurrencySymbol(`${year}-01-01`);
    const num = Math.abs(amount).toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

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
            icon: <AppIcon icon={TrendingUpIcon} size={14} className="text-emerald-600" />,
            iconBg: 'bg-emerald-50 border-emerald-200/70',
        },
        {
            label: 'Общи разходи',
            value: `−${fmt(totalExpenses, year)}`,
            valueClass: 'text-rose-500',
            icon: <AppIcon icon={TrendingDownIcon} size={14} className="text-rose-500" />,
            iconBg: 'bg-rose-50 border-rose-200/70',
        },
        {
            label: 'Нетна печалба',
            value: `${profitSign}${fmt(netProfit, year)}`,
            valueClass: profitClass,
            icon: <AppIcon icon={Analytics01Icon} size={14} className={profitClass} />,
            iconBg: netProfit >= 0 ? 'bg-emerald-50 border-emerald-200/70' : 'bg-rose-50 border-rose-200/70',
        },
        {
            label: 'Спестявания',
            value: `${savingsRate >= 0 ? '' : '−'}${Math.abs(savingsRate).toFixed(1)}%`,
            valueClass: savingsClass,
            icon: <AppIcon icon={PercentIcon} size={14} className={savingsClass} />,
            iconBg: savingsRate >= 0 ? 'bg-emerald-50 border-emerald-200/70' : 'bg-rose-50 border-rose-200/70',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-4 sm:p-5 flex flex-col justify-between min-h-[100px]"
                >
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-widest mb-2.5">
                        <IconSquircle size="sm" className={card.iconBg}>
                            {card.icon}
                        </IconSquircle>
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
