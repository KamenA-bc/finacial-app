/**
 * SpendingHabits – category ranking, habit spotlight, and spend distribution.
 * Redesigned with Top 5 Spotlight, habit badges, per-category ticket metrics,
 * and an expandable full category breakdown.
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
    ShoppingBag01Icon,
    Film01Icon,
    Airplane01Icon,
    Invoice01Icon,
    Briefcase01Icon,
    GiftIcon,
    MoreHorizontalIcon,
    ReceiptIcon,
    PieChart01Icon,
    Coins01Icon,
    ArrowDown01Icon,
    ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
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
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-5 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <IconSquircle
                        className="bg-stone-100 text-stone-700 border-stone-200/70"
                        size="sm"
                    >
                        <AppIcon icon={ShoppingBag01Icon} size={15} />
                    </IconSquircle>
                    <div>
                        <h2 className="text-sm font-semibold text-stone-800 tracking-tight">
                            Навици за харчене
                        </h2>
                        <p className="text-[11px] text-stone-400 font-medium">
                            {activeCount > 0
                                ? `${activeCount} активни категории през ${year}`
                                : `Няма активност за ${year}`}
                        </p>
                    </div>
                </div>

                {activeCount > 0 && (
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100/80 px-2.5 py-1 rounded-full border border-stone-200/60 tabular-nums">
                        {isExpanded ? `Всички ${fullList.length}` : `Топ ${Math.min(5, activeCount)}`}
                    </span>
                )}
            </div>

            {!hasExpenses ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                    <IconSquircle
                        className="bg-stone-50 text-stone-400 border-stone-200/60 mb-1"
                        size="md"
                    >
                        <AppIcon icon={ShoppingBag01Icon} size={18} />
                    </IconSquircle>
                    <p className="text-sm font-medium text-stone-600">Няма записани разходи</p>
                    <p className="text-xs text-stone-400">
                        Добавете разход за {year}&nbsp;г., за да видите навиците си за харчене.
                    </p>
                </div>
            ) : (
                <>
                    {/* Habit Highlight Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Avg ticket size */}
                        <div className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-3 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                    Ср. покупка
                                </span>
                                <IconSquircle
                                    className="bg-blue-50 text-blue-600 border-blue-200/70"
                                    size="sm"
                                >
                                    <AppIcon icon={ReceiptIcon} size={14} />
                                </IconSquircle>
                            </div>
                            <div>
                                <p className="text-base font-bold text-stone-800 tabular-nums">
                                    {fmt(avgExpensePerTransaction, year)}
                                </p>
                                <p className="text-[11px] text-stone-400 tabular-nums">
                                    {expenseTransactionCount} {expenseTransactionCount === 1 ? 'покупка' : 'покупки'}
                                </p>
                            </div>
                        </div>

                        {/* 2. Most frequent category */}
                        <div className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-3 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                    Най-чест разход
                                </span>
                                <IconSquircle
                                    className={
                                        mostFrequentCategory
                                            ? CATEGORY_SQUIRCLE_CLASSES[mostFrequentCategory.name as ExpenseCategory] ??
                                              'bg-emerald-50 text-emerald-600 border-emerald-200/70'
                                            : 'bg-stone-100 text-stone-600 border-stone-200/70'
                                    }
                                    size="sm"
                                >
                                    <AppIcon
                                        icon={
                                            mostFrequentCategory
                                                ? CATEGORY_ICONS[mostFrequentCategory.name as ExpenseCategory] ?? Coins01Icon
                                                : Coins01Icon
                                        }
                                        size={14}
                                    />
                                </IconSquircle>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-800 truncate" title={mostFrequentCategory?.displayName}>
                                    {mostFrequentCategory?.displayName ?? '—'}
                                </p>
                                <p className="text-[11px] text-stone-400 tabular-nums">
                                    {mostFrequentCategory
                                        ? `${mostFrequentCategory.transactionCount ?? 0} покупки (${(mostFrequentCategory.percentage ?? 0).toFixed(0)}% дял)`
                                        : '—'}
                                </p>
                            </div>
                        </div>

                        {/* 3. Top category by spend */}
                        <div className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-3 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
                                    Най-голям дял
                                </span>
                                <IconSquircle
                                    className="bg-rose-50 text-rose-500 border-rose-200/70"
                                    size="sm"
                                >
                                    <AppIcon icon={PieChart01Icon} size={14} />
                                </IconSquircle>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-stone-800 truncate" title={topCategory?.displayName}>
                                    {topCategory?.displayName ?? '—'}
                                </p>
                                <p className="text-[11px] text-rose-500 font-semibold tabular-nums">
                                    {topCategory ? `−${fmt(topCategory.amount, year)} (${(topCategory.percentage ?? 0).toFixed(0)}%)` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Spotlight Category Breakdown */}
                    <div className="flex flex-col gap-2 pt-1">
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
                                    className={`flex flex-col gap-2 p-2.5 rounded-xl border transition-colors ${
                                        isCategoryActive
                                            ? 'bg-stone-50/40 border-stone-200/50 hover:bg-stone-50/80 hover:border-stone-200'
                                            : 'bg-stone-50/20 border-transparent opacity-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Category info */}
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <IconSquircle
                                                className={squircleClass}
                                                size="sm"
                                            >
                                                <AppIcon icon={categoryIcon} size={14} />
                                            </IconSquircle>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                                                    {cat.displayName}
                                                </p>
                                                <p className="text-[11px] text-stone-400 tabular-nums">
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
                                            <span className="text-[11px] font-semibold text-stone-400 tabular-nums">
                                                {pct.toFixed(1)}% от разходите
                                            </span>
                                        </div>
                                    </div>

                                    {/* Proportional visual bar */}
                                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
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

                    {/* Expander Button */}
                    {canExpand && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="w-full py-2.5 px-4 rounded-xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-100/80 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                        >
                            <span>
                                {isExpanded
                                    ? 'Покажи само топ 5'
                                    : `Покажи всички (${fullList.length}) категории`}
                            </span>
                            <AppIcon
                                icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                                size={14}
                            />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
