'use client';

import React, { useState, useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    PieChart01Icon,
    Calendar01Icon,
    ArrowDown01Icon,
    ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useFinancialStore } from '@/store/transactionStore';
import {
    EXPENSE_CATEGORIES,
    CHART_COLORS,
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
    CATEGORY_BG_MAP,
} from '@/lib/constants';
import { ExpenseCategory } from '@/types';
import { getMonthName } from '@/lib/dateUtils';

const formatTooltipValue = (value: number, date?: string): string =>
    `${getCurrencySymbol(date)}${value.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}`;

/** Resolves consistent signature color for each category from EXPENSE_CATEGORIES */
const getCategoryColor = (categoryName: string): string => {
    if (categoryName === 'Останали') return '#94A3B8'; // Neutral Slate-400 for aggregated remainder
    const idx = EXPENSE_CATEGORIES.indexOf(categoryName as ExpenseCategory);
    return idx >= 0 ? CHART_COLORS[idx] : '#A1A1AA';
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload?: { displayName?: string; percentage?: number } }>;
    date?: string;
}

const CustomTooltip = ({
    active,
    payload,
    date,
}: CustomTooltipProps): React.ReactElement | null => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const name = item.payload?.displayName ?? item.name;
    const value = item.value;
    const percentage = item.payload?.percentage;

    return (
        <div className="bg-white/95 backdrop-blur-xs border border-stone-200/80 shadow-md rounded-xl px-3 py-2 text-xs">
            <p className="font-medium text-stone-700 mb-0.5">{name}</p>
            <div className="flex items-center gap-1.5">
                <span className="text-rose-600 font-bold tabular-nums">
                    {formatTooltipValue(value, date)}
                </span>
                {percentage !== undefined && (
                    <span className="text-[10px] text-stone-400 font-semibold tabular-nums">
                        ({percentage.toFixed(1)}%)
                    </span>
                )}
            </div>
        </div>
    );
};

type TabType = 'monthly' | 'yearly';

/**
 * Mobile-first Category Spending Chart:
 * - Solves 14-slice overcrowding via Pareto Top 5 + "Останали" aggregation
 * - Touch-first interactive center display (zero hover tooltip dependency on mobile)
 * - Ranked metric breakdown list with proportional progress tracks & expand/collapse
 */
export const CategoryChart = (): React.ReactElement => {
    const [activeTab, setActiveTab] = useState<TabType>('monthly');
    const [selection, setSelection] = useState<{ key: string; name: string | null }>({
        key: '',
        name: null,
    });
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { monthlyCategoryBreakdown, yearlyCategoryBreakdown } = useFinancialData();
    const selectedDate = useFinancialStore((s) => s.selectedDate);

    // Derived selected category name (automatically resets when activeTab or selectedDate changes)
    const currentViewKey = `${activeTab}-${selectedDate}`;
    const selectedCategoryName = selection.key === currentViewKey ? selection.name : null;

    // Derived label for the current view
    const dateParts = selectedDate.split('-');
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const timeframeLabel = activeTab === 'monthly'
        ? `${getMonthName(monthIndex)} ${year}`
        : `Цялата ${year} г.`;

    const chartData = activeTab === 'monthly' ? monthlyCategoryBreakdown : yearlyCategoryBreakdown;
    const hasData = chartData.length > 0;
    const totalPeriodExpense = chartData.reduce((acc, curr) => acc + curr.value, 0);

    // Use current date for monthly view, first day of year for yearly view to determine currency
    const contextDate = activeTab === 'monthly' ? selectedDate : `${year}-01-01`;

    // ── 1. Ranked Categories (Highest spend to lowest spend) ───────────────────
    const sortedCategories = useMemo(() => {
        return [...chartData]
            .filter((c) => c.value > 0)
            .sort((a, b) => b.value - a.value)
            .map((c) => ({
                name: c.name,
                displayName: CATEGORY_BG_MAP[c.name as ExpenseCategory] ?? c.name,
                value: c.value,
                percentage: totalPeriodExpense > 0 ? (c.value / totalPeriodExpense) * 100 : 0,
                color: getCategoryColor(c.name),
            }));
    }, [chartData, totalPeriodExpense]);

    // ── 2. Pareto Chart Slices: Top 5 + "Останали" if > 5 categories ──────────
    const chartSlices = useMemo(() => {
        if (sortedCategories.length <= 5) {
            return sortedCategories.map((c) => ({
                ...c,
                isOther: false,
            }));
        }

        const top5 = sortedCategories.slice(0, 5);
        const others = sortedCategories.slice(5);
        const othersValue = others.reduce((acc, curr) => acc + curr.value, 0);
        const othersPercentage = totalPeriodExpense > 0 ? (othersValue / totalPeriodExpense) * 100 : 0;

        return [
            ...top5.map((c) => ({ ...c, isOther: false })),
            {
                name: 'Останали',
                displayName: 'Останали',
                value: othersValue,
                percentage: othersPercentage,
                color: '#94A3B8',
                isOther: true,
                subCategoriesCount: others.length,
            },
        ];
    }, [sortedCategories, totalPeriodExpense]);

    // ── 3. Active Selection Resolution ────────────────────────────────────────
    const selectedItem = useMemo(() => {
        if (!selectedCategoryName) return null;
        const inSlices = chartSlices.find((s) => s.name === selectedCategoryName);
        if (inSlices) return inSlices;
        return sortedCategories.find((c) => c.name === selectedCategoryName) ?? null;
    }, [selectedCategoryName, chartSlices, sortedCategories]);

    const handleCategoryToggle = (name: string) => {
        setSelection((prev) => ({
            key: currentViewKey,
            name: prev.key === currentViewKey && prev.name === name ? null : name,
        }));
    };

    // Categories to display in the list (Top 4 collapsed, all when expanded)
    const visibleCategories = isExpanded ? sortedCategories : sortedCategories.slice(0, 4);
    const remainingCategories = sortedCategories.slice(4);
    const remainingPercentage = remainingCategories.reduce((acc, curr) => acc + curr.percentage, 0);

    return (
        <div className="flex flex-col h-full">
            {/* Header with Tab Switcher & Label */}
            <div className="flex flex-col gap-2.5 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <AppIcon icon={PieChart01Icon} size={15} className="text-stone-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-stone-700">
                            Разпределение по категории
                        </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                        <div className="bg-stone-50 rounded-lg px-2.5 py-1 border border-stone-200/60 flex items-center gap-1.5 flex-shrink-0">
                            <AppIcon icon={Calendar01Icon} size={13} className="text-emerald-600" />
                            <span className="text-[11px] font-medium text-stone-600">
                                {timeframeLabel}
                            </span>
                        </div>

                        <div className="flex p-0.5 bg-stone-100 rounded-lg border border-stone-200/70 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab('monthly')}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                    activeTab === 'monthly'
                                        ? 'bg-white text-stone-900 shadow-xs'
                                        : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                МЕСЕЦ
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('yearly')}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                                    activeTab === 'yearly'
                                        ? 'bg-white text-stone-900 shadow-xs'
                                        : 'text-stone-500 hover:text-stone-800'
                                }`}
                            >
                                ГОДИНА
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                {!hasData ? (
                    <div className="min-h-[240px] flex flex-col items-center justify-center gap-2.5 text-stone-300">
                        <AppIcon icon={PieChart01Icon} size={36} className="opacity-40" />
                        <p className="text-xs font-medium text-stone-400">Няма регистрирани разходи за периода</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* ── Donut Chart with Interactive Center ─────────────────── */}
                        <div className="relative" style={{ width: '100%', height: 210 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartSlices}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={64}
                                        outerRadius={selectedCategoryName ? 92 : 88}
                                        paddingAngle={2.5}
                                        dataKey="value"
                                        animationDuration={600}
                                        onClick={(data) => {
                                            if (data && data.name) {
                                                handleCategoryToggle(data.name);
                                            }
                                        }}
                                        cursor="pointer"
                                    >
                                        {chartSlices.map((entry) => {
                                            const isSelected = selectedCategoryName === entry.name;
                                            const isAnySelected = selectedCategoryName !== null;
                                            const isChildOfOther =
                                                entry.isOther &&
                                                sortedCategories
                                                    .slice(5)
                                                    .some((c) => c.name === selectedCategoryName);

                                            const active = isSelected || isChildOfOther;
                                            const opacity = isAnySelected ? (active ? 1 : 0.35) : 1;

                                            return (
                                                <Cell
                                                    key={entry.name}
                                                    fill={entry.color}
                                                    opacity={opacity}
                                                    stroke={active ? '#ffffff' : 'transparent'}
                                                    strokeWidth={active ? 2 : 0}
                                                    style={{
                                                        outline: 'none',
                                                        transition: 'opacity 200ms ease',
                                                    }}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip date={contextDate} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* ── Center Readout (Touch-friendly, zero hover dependency) ── */}
                            <button
                                type="button"
                                onClick={() => setSelection({ key: currentViewKey, name: null })}
                                className="absolute inset-0 flex flex-col items-center justify-center select-none text-center px-4 cursor-pointer group focus:outline-none"
                                title={selectedItem ? 'Натиснете за връщане към общата сума' : undefined}
                                aria-label={
                                    selectedItem
                                        ? `${selectedItem.displayName}: ${formatTooltipValue(selectedItem.value, contextDate)}`
                                        : `Общо разход: ${formatTooltipValue(totalPeriodExpense, contextDate)}`
                                }
                            >
                                {selectedItem ? (
                                    <>
                                        <span className="text-[11px] font-semibold text-stone-700 truncate max-w-[130px] transition-colors">
                                            {selectedItem.displayName}
                                        </span>
                                        <span className="text-base sm:text-lg font-bold text-rose-600 tabular-nums">
                                            {formatTooltipValue(selectedItem.value, contextDate)}
                                        </span>
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums bg-rose-50 text-rose-600 mt-0.5">
                                            {selectedItem.percentage.toFixed(1)}%
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                            Общо разход
                                        </span>
                                        <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                                            {formatTooltipValue(totalPeriodExpense, contextDate)}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-medium mt-0.5 tabular-nums">
                                            {sortedCategories.length}{' '}
                                            {sortedCategories.length === 1 ? 'категория' : 'категории'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* ── Ranked Metric List (Readable, Scannable, Mobile-Optimized) ── */}
                        <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-stone-100">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 px-1 mb-0.5">
                                <span>Категория</span>
                                <span>Сума / Дял</span>
                            </div>

                            {visibleCategories.map((cat) => {
                                const isSelected = selectedCategoryName === cat.name;

                                return (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        onClick={() => handleCategoryToggle(cat.name)}
                                        className={`w-full flex flex-col gap-1 px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer active:scale-[0.99] ${
                                            isSelected
                                                ? 'bg-stone-100 ring-1 ring-stone-300/80'
                                                : 'hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <span className="text-xs font-semibold text-stone-800 truncate">
                                                    {cat.displayName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-xs font-bold text-stone-900 tabular-nums">
                                                    {formatTooltipValue(cat.value, contextDate)}
                                                </span>
                                                <span className="text-[11px] font-semibold text-stone-500 tabular-nums min-w-[38px] text-right">
                                                    {cat.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Proportional Progress Track */}
                                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.max(2, cat.percentage)}%`,
                                                    backgroundColor: cat.color,
                                                }}
                                            />
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Expand / Collapse Button if > 4 categories */}
                            {sortedCategories.length > 4 && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded((prev) => !prev)}
                                    className="flex items-center justify-center gap-1.5 py-2 px-3 mt-1 rounded-lg text-xs font-semibold text-stone-600 bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/60 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <span>
                                        {isExpanded
                                            ? 'Скрий останалите категории'
                                            : `Покажи още ${remainingCategories.length} ${
                                                  remainingCategories.length === 1 ? 'категория' : 'категории'
                                              } (${remainingPercentage.toFixed(1)}%)`}
                                    </span>
                                    <AppIcon icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon} size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
