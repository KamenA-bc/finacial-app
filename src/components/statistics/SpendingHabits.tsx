/**
 * SpendingHabits – category ranking, habit spotlight, and spend distribution.
 * Compact mobile-first design: single-row 3-column habit strip, streamlined
 * high-density category list, and sleek expander.
 */
'use client';

import React, { useState } from 'react';
import {
    ShoppingBasket01Icon,
    Restaurant01Icon,
    Fuel01Icon,
    Bus01Icon,
    Medicine02Icon,
    SparklesIcon,
    Home01Icon,
    ShoppingBag01Icon,
    Film01Icon,
    Airplane01Icon,
    Invoice01Icon,
    Briefcase01Icon,
    GiftIcon,
    MoreHorizontalIcon,
    ArrowDown01Icon,
    ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { Tooltip } from '@/components/ui/Tooltip';
import { ExpenseCategory } from '@/types';
import { CategoryRankEntry } from '@/hooks/useStatisticsData';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

// ── Category Icon & Color Mappings ───────────────────────────────────────────

const CATEGORY_ICONS: Record<ExpenseCategory, React.ComponentProps<typeof AppIcon>['icon']> = {
    'Магазини (Храна/Вода)': ShoppingBasket01Icon,
    'Eating out': Restaurant01Icon,
    'Гориво': Fuel01Icon,
    'Градски транспорт': Bus01Icon,
    'Health/Аптека': Medicine02Icon,
    'Beauty': SparklesIcon,
    'Home': Home01Icon,
    'Shopping': ShoppingBag01Icon,
    'Entertainment': Film01Icon,
    'Пътуване': Airplane01Icon,
    'Сметки/Разходи': Invoice01Icon,
    'Фирмени разходи': Briefcase01Icon,
    'Подаръци': GiftIcon,
    'Други': MoreHorizontalIcon,
};

const CATEGORY_SQUIRCLE_CLASSES: Record<ExpenseCategory, string> = {
    'Магазини (Храна/Вода)': 'bg-emerald-50 text-emerald-600 border-emerald-200/70',
    'Eating out': 'bg-rose-50 text-rose-500 border-rose-200/70',
    'Гориво': 'bg-orange-50 text-orange-500 border-orange-200/70',
    'Градски транспорт': 'bg-blue-50 text-blue-500 border-blue-200/70',
    'Health/Аптека': 'bg-pink-50 text-pink-500 border-pink-200/70',
    'Beauty': 'bg-purple-50 text-purple-500 border-purple-200/70',
    'Home': 'bg-indigo-50 text-indigo-500 border-indigo-200/70',
    'Shopping': 'bg-violet-50 text-violet-500 border-violet-200/70',
    'Entertainment': 'bg-amber-50 text-amber-500 border-amber-200/70',
    'Пътуване': 'bg-cyan-50 text-cyan-500 border-cyan-200/70',
    'Сметки/Разходи': 'bg-red-50 text-red-500 border-red-200/70',
    'Фирмени разходи': 'bg-indigo-50 text-indigo-500 border-indigo-200/70',
    'Подаръци': 'bg-teal-50 text-teal-500 border-teal-200/70',
    'Други': 'bg-stone-100 text-stone-600 border-stone-200/70',
};

const CATEGORY_BAR_BG: Record<ExpenseCategory, string> = {
    'Магазини (Храна/Вода)': 'bg-emerald-500',
    'Eating out': 'bg-rose-500',
    'Гориво': 'bg-orange-500',
    'Градски транспорт': 'bg-blue-500',
    'Health/Аптека': 'bg-pink-500',
    'Beauty': 'bg-purple-500',
    'Home': 'bg-indigo-500',
    'Shopping': 'bg-violet-500',
    'Entertainment': 'bg-amber-500',
    'Пътуване': 'bg-cyan-500',
    'Сметки/Разходи': 'bg-red-500',
    'Фирмени разходи': 'bg-indigo-500',
    'Подаръци': 'bg-teal-500',
    'Други': 'bg-stone-400',
};

// ── Props ────────────────────────────────────────────────────────────────────

export interface SpendingHabitsProps {
    year: number;
    topCategory: CategoryRankEntry | null;
    categoryRanking: CategoryRankEntry[];
    allCategories?: CategoryRankEntry[];
    mostFrequentCategory?: CategoryRankEntry | null;
    avgExpensePerTransaction: number;
    totalExpenses?: number;
    totalTransactionCount: number;
    incomeTransactionCount?: number;
    expenseTransactionCount: number;
}

const fmt = (amount: number, year: number): string => {
    const symbol = getCurrencySymbol(`${year}-01-01`);
    const num = amount.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

export const SpendingHabits = ({
    year,
    topCategory,
    categoryRanking,
    allCategories,
    mostFrequentCategory,
    avgExpensePerTransaction,
    expenseTransactionCount,
}: SpendingHabitsProps): React.ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasExpenses = categoryRanking.length > 0;
    const activeCount = categoryRanking.length;
    const fullList = allCategories && allCategories.length > 0 ? allCategories : categoryRanking;

    // Display top 5 when collapsed, or all categories when expanded
    const displayedCategories = isExpanded ? fullList : categoryRanking.slice(0, 5);
    const canExpand = fullList.length > 5;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                    <IconSquircle
                        className="bg-stone-100 text-stone-700 border-stone-200/70"
                        size="sm"
                    >
                        <AppIcon icon={ShoppingBag01Icon} size={14} />
                    </IconSquircle>
                    <div>
                        <h2 className="text-xs sm:text-sm font-semibold text-stone-800 tracking-tight">
                            Навици за харчене
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                            {activeCount > 0
                                ? `${activeCount} активни категории през ${year}`
                                : `Няма активност за ${year}`}
                        </p>
                    </div>
                </div>

                {activeCount > 0 && (
                    <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 bg-stone-100/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-stone-200/60 tabular-nums">
                        {isExpanded ? `Всички ${fullList.length}` : `Топ ${Math.min(5, activeCount)}`}
                    </span>
                )}
            </div>

            {!hasExpenses ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                    <IconSquircle
                        className="bg-stone-50 text-stone-400 border-stone-200/60 mb-1"
                        size="md"
                    >
                        <AppIcon icon={ShoppingBag01Icon} size={16} />
                    </IconSquircle>
                    <p className="text-xs sm:text-sm font-medium text-stone-600">Няма записани разходи</p>
                    <p className="text-[11px] text-stone-400">
                        Добавете разход за {year}&nbsp;г., за да видите навиците си за харчене.
                    </p>
                </div>
            ) : (
                <>
                    {/* Unified 3-Column Stats Strip with Subtle Context Tooltips */}
                    <div className="grid grid-cols-3 divide-x divide-stone-200/70 bg-stone-50/70 rounded-xl border border-stone-200/60 p-1 sm:p-1.5 text-center">
                        {/* 1. Avg ticket size */}
                        <div className="px-0.5 sm:px-1 flex flex-col items-center justify-between min-w-0">
                            <Tooltip
                                content="Среден размер на една покупка (общо разходи разделени на броя покупки)."
                                align="start"
                                className="w-full"
                                triggerClassName="w-full h-full p-1 sm:p-1.5 flex flex-col items-center justify-between min-w-0 hover:bg-stone-100/80 active:bg-stone-200/60 active:scale-[0.98] transition-all rounded-lg"
                            >
                                <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap border-b border-dotted border-stone-300 transition-colors">
                                    Ср. разход
                                </span>
                                <p className="text-xs sm:text-sm font-bold text-stone-800 tabular-nums truncate max-w-full my-0.5">
                                    {fmt(avgExpensePerTransaction, year)}
                                </p>
                                <span className="text-[10px] text-stone-400 tabular-nums truncate max-w-full">
                                    {expenseTransactionCount} {expenseTransactionCount === 1 ? 'покупка' : 'покупки'}
                                </span>
                            </Tooltip>
                        </div>

                        {/* 2. Most frequent category */}
                        <div className="px-0.5 sm:px-1 flex flex-col items-center justify-between min-w-0">
                            <Tooltip
                                content="Категорията с най-много отделни покупки през избраната година."
                                align="center"
                                className="w-full"
                                triggerClassName="w-full h-full p-1 sm:p-1.5 flex flex-col items-center justify-between min-w-0 hover:bg-stone-100/80 active:bg-stone-200/60 active:scale-[0.98] transition-all rounded-lg"
                            >
                                <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap border-b border-dotted border-stone-300 transition-colors">
                                    Най-чест
                                </span>
                                <p
                                    className="text-xs sm:text-sm font-bold text-stone-800 truncate max-w-full my-0.5"
                                    title={mostFrequentCategory?.displayName}
                                >
                                    {mostFrequentCategory
                                        ? mostFrequentCategory.displayName.replace(/\s*\(.*?\)/, '')
                                        : '—'}
                                </p>
                                <span className="text-[10px] text-stone-400 tabular-nums truncate max-w-full">
                                    {mostFrequentCategory
                                        ? `${mostFrequentCategory.transactionCount ?? 0} покупки`
                                        : '—'}
                                </span>
                            </Tooltip>
                        </div>

                        {/* 3. Top category by spend */}
                        <div className="px-0.5 sm:px-1 flex flex-col items-center justify-between min-w-0">
                            <Tooltip
                                content="Категорията с най-голяма обща похарчена сума и нейният дял от годишния бюджет."
                                align="end"
                                className="w-full"
                                triggerClassName="w-full h-full p-1 sm:p-1.5 flex flex-col items-center justify-between min-w-0 hover:bg-stone-100/80 active:bg-stone-200/60 active:scale-[0.98] transition-all rounded-lg"
                            >
                                <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap border-b border-dotted border-stone-300 transition-colors">
                                    Топ разход
                                </span>
                                <p className="text-xs sm:text-sm font-bold text-stone-800 tabular-nums truncate max-w-full my-0.5">
                                    {topCategory ? `−${fmt(topCategory.amount, year)}` : '—'}
                                </p>
                                <span className="text-[10px] text-rose-500 font-semibold tabular-nums truncate max-w-full">
                                    {topCategory ? `${(topCategory.percentage ?? 0).toFixed(0)}% от общо` : '—'}
                                </span>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Streamlined Category Breakdown List */}
                    <div className="flex flex-col divide-y divide-stone-100/90 pt-0.5">
                        {displayedCategories.map((cat) => {
                            const isCategoryActive = cat.amount > 0;
                            const categoryIcon = CATEGORY_ICONS[cat.name as ExpenseCategory] ?? MoreHorizontalIcon;
                            const squircleClass = CATEGORY_SQUIRCLE_CLASSES[cat.name as ExpenseCategory] ?? 'bg-stone-100 text-stone-600 border-stone-200/70';
                            const barBg = CATEGORY_BAR_BG[cat.name as ExpenseCategory] ?? 'bg-stone-400';
                            const count = cat.transactionCount ?? 0;
                            const pct = cat.percentage ?? 0;
                            const avgTicket = cat.avgPerTransaction ?? 0;

                            return (
                                <div
                                    key={cat.name}
                                    className={`py-2 sm:py-2.5 px-0.5 sm:px-1.5 flex flex-col gap-1.5 transition-colors ${
                                        isCategoryActive
                                            ? 'hover:bg-stone-50/50 rounded-lg'
                                            : 'opacity-40'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2.5">
                                        {/* Category info */}
                                        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                            <IconSquircle
                                                className={squircleClass}
                                                size="sm"
                                            >
                                                <AppIcon icon={categoryIcon} size={13} />
                                            </IconSquircle>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs sm:text-sm font-semibold text-stone-800 truncate tracking-tight">
                                                    {cat.displayName}
                                                </p>
                                                <p className="text-[10px] sm:text-[11px] text-stone-400 tabular-nums truncate">
                                                    {isCategoryActive
                                                        ? `${count} ${
                                                              count === 1 ? 'покупка' : 'покупки'
                                                          } • ср. ~${fmt(avgTicket, year)}`
                                                        : 'Няма разходи'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Amount & percentage */}
                                        <div className="text-right flex-shrink-0">
                                            <p
                                                className={`text-xs sm:text-sm font-bold tabular-nums ${
                                                    isCategoryActive ? 'text-stone-800' : 'text-stone-400'
                                                }`}
                                            >
                                                {isCategoryActive ? `−${fmt(cat.amount, year)}` : fmt(0, year)}
                                            </p>
                                            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-400 tabular-nums">
                                                {pct.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Slim Proportional Bar */}
                                    <div className="w-full h-1 sm:h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                                            style={{
                                                width: `${Math.max(pct, isCategoryActive ? 2 : 0)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Compact Expander Button */}
                    {canExpand && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="w-full py-2 px-3 rounded-xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-100/80 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                        >
                            <span>
                                {isExpanded
                                    ? 'Покажи само топ 5'
                                    : `Покажи всички (${fullList.length}) категории`}
                            </span>
                            <AppIcon
                                icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                                size={13}
                            />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
