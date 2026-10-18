'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Search01Icon,
    Cancel01Icon,
    Briefcase01Icon,
    FavouriteIcon,
    User02Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
import {
    EXPENSE_CATEGORIES,
    CHART_COLORS,
    CATEGORY_BG_MAP,
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';
import {
    ExpenseCategory,
    FilterScope,
    TransactionFilters,
    TransactionFilterType,
} from '@/types';

interface TransactionFilterBarProps {
    readonly filters: TransactionFilters;
    readonly selectedDate: string;
    readonly totalMatchingCount: number;
    readonly filteredIncomeTotal: number;
    readonly filteredExpenseTotal: number;
    readonly hasActiveFilters: boolean;
    readonly onUpdateFilters: (updates: Partial<TransactionFilters>) => void;
    readonly onResetFilters: () => void;
}

const SCOPE_OPTIONS: ReadonlyArray<{ value: FilterScope; label: string }> = [
    { value: 'day', label: 'Ден' },
    { value: 'month', label: 'Месец' },
    { value: 'year', label: 'Година' },
];

const TYPE_OPTIONS: ReadonlyArray<{
    value: TransactionFilterType;
    label: string;
    activeClass: string;
}> = [
    { value: 'all', label: 'Всички', activeClass: 'bg-white text-stone-900 shadow-xs ring-1 ring-black/5' },
    { value: 'income', label: 'Приходи', activeClass: 'bg-white text-emerald-700 shadow-xs ring-1 ring-black/5' },
    { value: 'expenses', label: 'Разходи', activeClass: 'bg-white text-rose-700 shadow-xs ring-1 ring-black/5' },
];

const getCategoryDotColor = (category: ExpenseCategory | 'Останали'): string => {
    if (category === 'Останали') return '#94A3B8';
    const idx = EXPENSE_CATEGORIES.indexOf(category);
    return idx >= 0 ? CHART_COLORS[idx] : '#A1A1AA';
};

const formatAmount = (amount: number, date?: string): string =>
    `${getCurrencySymbol(date)}${amount.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}`;

/** Apple-style 3 decreasing horizontal bars filter icon (SF Symbol line.3.horizontal.decrease). */
const FilterLinesIcon = (): React.ReactElement => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
);

export const TransactionFilterBar = ({
    filters,
    selectedDate,
    totalMatchingCount,
    filteredIncomeTotal,
    filteredExpenseTotal,
    hasActiveFilters,
    onUpdateFilters,
    onResetFilters,
}: TransactionFilterBarProps): React.ReactElement => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close popover on outside click
    useEffect(() => {
        if (!isPopoverOpen) return;

        const handleClickOutside = (e: MouseEvent): void => {
            const target = e.target as Node;
            if (
                popoverRef.current &&
                !popoverRef.current.contains(target) &&
                triggerRef.current &&
                !triggerRef.current.contains(target)
            ) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPopoverOpen]);

    // Close popover on Escape
    useEffect(() => {
        if (!isPopoverOpen) return;

        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                setIsPopoverOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isPopoverOpen]);

    // Count active non-search filter dimensions for the icon badge
    const activeMenuFilterCount =
        (filters.scope !== 'day' ? 1 : 0) +
        (filters.type !== 'all' ? 1 : 0) +
        (filters.isWork ? 1 : 0) +
        (filters.isKami ? 1 : 0) +
        (filters.isShared ? 1 : 0) +
        (filters.category !== null ? 1 : 0);

    const showActiveStrip =
        hasActiveFilters || filters.scope !== 'day' || filters.type !== 'all';

    const categoryLabel =
        filters.category === 'Останали'
            ? 'Останали категории'
            : filters.category
              ? (CATEGORY_BG_MAP[filters.category] ?? filters.category)
              : null;

    return (
        <div className="relative flex flex-col gap-2 mb-3">
            {/* Row 1: Spotlight Search Input + Icon-Only Filter Popover Button */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 flex items-center">
                        <AppIcon icon={Search01Icon} size={14} />
                    </span>
                    <input
                        type="search"
                        value={filters.searchQuery}
                        onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
                        placeholder="Търси описание, категория, сума..."
                        aria-label="Търси транзакции"
                        className="w-full pl-8 pr-7 py-2 text-xs text-stone-800 placeholder-stone-400 bg-stone-50/90 border border-stone-200/80 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    {filters.searchQuery.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onUpdateFilters({ searchQuery: '' })}
                            aria-label="Изчисти търсенето"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                        >
                            <AppIcon icon={Cancel01Icon} size={13} />
                        </button>
                    )}
                </div>

                {/* Icon-only 3-dashes filter button */}
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setIsPopoverOpen((prev) => !prev)}
                    aria-label="Филтри"
                    aria-expanded={isPopoverOpen}
                    aria-haspopup="dialog"
                    className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-150 active:scale-[0.96] cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
                        isPopoverOpen || activeMenuFilterCount > 0
                            ? 'bg-emerald-50/80 border-emerald-300/80 text-emerald-700 shadow-2xs'
                            : 'bg-white border-stone-200/80 text-stone-600 hover:bg-stone-50 hover:border-stone-300 hover:text-stone-900 shadow-2xs'
                    }`}
                >
                    <FilterLinesIcon />
                    {activeMenuFilterCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs tabular-nums"
                        >
                            {activeMenuFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Floating Popover Menu */}
            {isPopoverOpen && (
                <div
                    ref={popoverRef}
                    role="dialog"
                    aria-label="Меню с филтри"
                    className="absolute right-0 top-11 z-40 w-72 sm:w-80 origin-top-right bg-white rounded-2xl shadow-xl border border-stone-200/80 p-3.5 flex flex-col gap-3 animate-[fadeSlideIn_150ms_cubic-bezier(0.23,1,0.32,1)]"
                >
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                            Филтри
                        </span>
                        {showActiveStrip && (
                            <button
                                type="button"
                                onClick={() => {
                                    onResetFilters();
                                }}
                                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors"
                            >
                                Нулирай
                            </button>
                        )}
                    </div>

                    {/* Section 1: Период */}
                    <div>
                        <p className="text-[11px] font-semibold text-stone-500 mb-1.5">Период</p>
                        <div
                            role="group"
                            aria-label="Период на транзакциите"
                            className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl"
                        >
                            {SCOPE_OPTIONS.map((opt) => {
                                const active = filters.scope === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => onUpdateFilters({ scope: opt.value })}
                                        className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                                            active
                                                ? 'bg-white text-stone-900 shadow-xs ring-1 ring-black/5'
                                                : 'text-stone-500 hover:text-stone-800'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 2: Тип */}
                    <div>
                        <p className="text-[11px] font-semibold text-stone-500 mb-1.5">Тип</p>
                        <div
                            role="group"
                            aria-label="Тип транзакции"
                            className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl"
                        >
                            {TYPE_OPTIONS.map((tab) => {
                                const active = filters.type === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => onUpdateFilters({ type: tab.value })}
                                        className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                                            active ? tab.activeClass : 'text-stone-500 hover:text-stone-800'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 3: Тагове */}
                    <div>
                        <p className="text-[11px] font-semibold text-stone-500 mb-1.5">Тагове</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                type="button"
                                aria-pressed={filters.isWork}
                                onClick={() => onUpdateFilters({ isWork: !filters.isWork })}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer select-none ${
                                    filters.isWork
                                        ? 'bg-amber-500/10 border-amber-400/50 text-amber-800 shadow-2xs'
                                        : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                            >
                                <AppIcon
                                    icon={Briefcase01Icon}
                                    size={12}
                                    className={filters.isWork ? 'text-amber-600' : 'text-stone-400'}
                                />
                                <span>Работни</span>
                            </button>

                            <button
                                type="button"
                                aria-pressed={filters.isKami}
                                onClick={() => onUpdateFilters({ isKami: !filters.isKami })}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer select-none ${
                                    filters.isKami
                                        ? 'bg-pink-500/10 border-pink-400/50 text-pink-800 shadow-2xs'
                                        : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                            >
                                <AppIcon
                                    icon={FavouriteIcon}
                                    size={12}
                                    className={filters.isKami ? 'text-pink-600' : 'text-stone-400'}
                                />
                                <span>Kami ❤️</span>
                            </button>

                            <button
                                type="button"
                                aria-pressed={filters.isShared}
                                onClick={() => onUpdateFilters({ isShared: !filters.isShared })}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer select-none ${
                                    filters.isShared
                                        ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-800 shadow-2xs'
                                        : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-100/60'
                                }`}
                            >
                                <AppIcon
                                    icon={User02Icon}
                                    size={12}
                                    className={filters.isShared ? 'text-emerald-600' : 'text-stone-400'}
                                />
                                <span>С Други</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filter Pills + Live Summary Strip (Only visible when filtering or non-day scope) */}
            {showActiveStrip && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex flex-col gap-1.5 px-3 py-2 rounded-xl bg-stone-50/90 border border-stone-200/70 text-xs"
                >
                    {/* Removable Active Chips (when popover is closed or category/flags are set) */}
                    {activeMenuFilterCount > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {filters.scope !== 'day' && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ scope: 'day' })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                >
                                    <span>Период: {filters.scope === 'month' ? 'Месец' : 'Година'}</span>
                                    <AppIcon icon={Cancel01Icon} size={10} className="text-stone-400" />
                                </button>
                            )}
                            {filters.type !== 'all' && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ type: 'all' })}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                                        filters.type === 'income'
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}
                                >
                                    <span>{filters.type === 'income' ? 'Приходи' : 'Разходи'}</span>
                                    <AppIcon icon={Cancel01Icon} size={10} />
                                </button>
                            )}
                            {filters.isWork && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ isWork: false })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100/70 transition-colors cursor-pointer"
                                >
                                    <span>Работни</span>
                                    <AppIcon icon={Cancel01Icon} size={10} />
                                </button>
                            )}
                            {filters.isKami && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ isKami: false })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-50 border border-pink-200 text-pink-800 hover:bg-pink-100/70 transition-colors cursor-pointer"
                                >
                                    <span>Kami ❤️</span>
                                    <AppIcon icon={Cancel01Icon} size={10} />
                                </button>
                            )}
                            {filters.isShared && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ isShared: false })}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70 transition-colors cursor-pointer"
                                >
                                    <span>С Други</span>
                                    <AppIcon icon={Cancel01Icon} size={10} />
                                </button>
                            )}
                            {filters.category && categoryLabel && (
                                <button
                                    type="button"
                                    onClick={() => onUpdateFilters({ category: null })}
                                    aria-label={`Премахни филтър категория ${categoryLabel}`}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-stone-300/80 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: getCategoryDotColor(filters.category) }}
                                    />
                                    <span className="truncate max-w-[130px]">{categoryLabel}</span>
                                    <AppIcon icon={Cancel01Icon} size={10} className="text-stone-400" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Live Count & Totals Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2.5 tabular-nums">
                            <span className="text-[11px] font-semibold text-stone-500">
                                Намерени:{' '}
                                <strong className="text-stone-800">{totalMatchingCount}</strong>
                            </span>
                            {filteredIncomeTotal > 0 && (
                                <span className="text-[11px] font-bold text-emerald-600">
                                    +{formatAmount(filteredIncomeTotal, selectedDate)}
                                </span>
                            )}
                            {filteredExpenseTotal > 0 && (
                                <span className="text-[11px] font-bold text-rose-600">
                                    -{formatAmount(filteredExpenseTotal, selectedDate)}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 underline decoration-stone-300 underline-offset-2 cursor-pointer transition-colors"
                        >
                            Изчисти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
