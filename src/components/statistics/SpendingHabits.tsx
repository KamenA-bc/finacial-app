/**
 * SpendingHabits – category ranking and average spend stats.
 * Shows top spending category, horizontal bar chart, and transaction metrics.
 */
'use client';

import React from 'react';
import { ShoppingBag, Hash, Receipt } from 'lucide-react';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
    CHART_COLORS,
} from '@/lib/constants';

interface CategoryRankEntry {
    name: string;
    displayName: string;
    amount: number;
}

interface SpendingHabitsProps {
    year: number;
    topCategory: CategoryRankEntry | null;
    categoryRanking: CategoryRankEntry[];
    avgExpensePerTransaction: number;
    totalTransactionCount: number;
    incomeTransactionCount: number;
    expenseTransactionCount: number;
}

const fmt = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

export const SpendingHabits = ({
    year,
    topCategory,
    categoryRanking,
    avgExpensePerTransaction,
    totalTransactionCount,
    incomeTransactionCount,
    expenseTransactionCount,
}: SpendingHabitsProps): React.ReactElement => {
    const maxAmount = categoryRanking.length > 0 ? categoryRanking[0].amount : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={16} className="text-gray-400" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Навици за харчене
                </h2>
            </div>

            {categoryRanking.length === 0 ? (
                <p className="text-sm text-gray-300 text-center py-6">
                    Няма разходи за тази година
                </p>
            ) : (
                <>
                    {/* Top category highlight */}
                    {topCategory && (
                        <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-4 mb-4 flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50">
                                <ShoppingBag size={16} className="text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    Топ категория
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                    {topCategory.displayName}
                                </p>
                                <p className="text-lg font-bold text-rose-500 tabular-nums">
                                    −{fmt(topCategory.amount, year)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Horizontal bar chart */}
                    <div className="flex flex-col gap-2.5 mb-5">
                        {categoryRanking.map((cat, index) => {
                            const widthPercent = maxAmount > 0
                                ? (cat.amount / maxAmount) * 100
                                : 0;

                            return (
                                <div key={cat.name} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 w-[120px] sm:w-[160px] truncate flex-shrink-0">
                                        {cat.displayName}
                                    </span>
                                    <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.max(widthPercent, 2)}%`,
                                                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 tabular-nums font-medium w-[80px] text-right flex-shrink-0">
                                        {fmt(cat.amount, year)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Receipt size={11} />
                                Ср. разход
                            </div>
                            <p className="text-sm font-bold text-gray-700 tabular-nums">
                                {fmt(avgExpensePerTransaction, year)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Hash size={11} />
                                Всички
                            </div>
                            <p className="text-sm font-bold text-gray-700 tabular-nums">
                                {totalTransactionCount}
                            </p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Hash size={11} />
                                Приходи
                            </div>
                            <p className="text-sm font-bold text-emerald-600 tabular-nums">
                                {incomeTransactionCount}
                            </p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Hash size={11} />
                                Разходи
                            </div>
                            <p className="text-sm font-bold text-rose-500 tabular-nums">
                                {expenseTransactionCount}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
