/**
 * OverviewCards – top-level KPI summary for the statistics page.
 * Shows total income, expenses, net profit, and savings rate.
 */
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Percent } from 'lucide-react';
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
            icon: <TrendingUp size={14} className="text-emerald-500" />,
        },
        {
            label: 'Общи разходи',
            value: `−${fmt(totalExpenses, year)}`,
            valueClass: 'text-rose-500',
            icon: <TrendingDown size={14} className="text-rose-400" />,
        },
        {
            label: 'Нетна печалба',
            value: `${profitSign}${fmt(netProfit, year)}`,
            valueClass: profitClass,
            icon: <BarChart3 size={14} className={profitClass} />,
        },
        {
            label: 'Спестявания',
            value: `${savingsRate >= 0 ? '' : '−'}${Math.abs(savingsRate).toFixed(1)}%`,
            valueClass: savingsClass,
            icon: <Percent size={14} className={savingsClass} />,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-1.5"
                >
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        {card.icon}
                        {card.label}
                    </div>
                    <p className={`text-2xl font-bold tabular-nums ${card.valueClass}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>
    );
};
