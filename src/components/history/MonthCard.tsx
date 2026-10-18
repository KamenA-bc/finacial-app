/**
 * MonthCard – expandable card for a single month's financial summary.
 * Shows income/expenses/profit and toggles a daily breakdown table.
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    ArrowRight01Icon,
    Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import { MonthlySummary, DailySummary } from '@/hooks/useHistoryData';
import { useFinancialStore } from '@/store/transactionStore';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface MonthCardProps {
    data: MonthlySummary;
    isFuture: boolean;
}

const fmt = (n: number, date?: string): string => {
    const symbol = getCurrencySymbol(date);
    const num = Math.abs(n).toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

const formatDayDate = (dateStr: string): string => {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('bg-BG', { weekday: 'short', day: 'numeric' });
};

interface DailyRowProps {
    day: DailySummary;
    onSelectDay: (date: string) => void;
}

const DailyRow = ({ day, onSelectDay }: DailyRowProps): React.ReactElement => {
    const profitClass = day.profit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const sign = day.profit >= 0 ? '+' : '−';
    const dayLabel = formatDayDate(day.date);

    return (
        <tr
            role="button"
            tabIndex={0}
            aria-label={`Отвори ${dayLabel} в таблото`}
            onClick={() => onSelectDay(day.date)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDay(day.date);
                }
            }}
            className="group border-b border-stone-100/80 last:border-0 hover:bg-stone-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-emerald-50/40"
        >
            <td className="py-2 pr-4 text-xs text-stone-600 group-hover:text-stone-900 font-medium tabular-nums">
                <span className="inline-flex items-center gap-1">
                    <span>{dayLabel}</span>
                    <AppIcon
                        icon={ArrowRight01Icon}
                        size={12}
                        className="text-stone-300 group-hover:text-emerald-600 transition-colors"
                    />
                </span>
            </td>
            <td className="py-2 pr-4 text-xs text-emerald-600 font-medium tabular-nums text-right">
                +{fmt(day.income, day.date)}
            </td>
            <td className="py-2 pr-4 text-xs text-rose-500 font-medium tabular-nums text-right">
                −{fmt(day.expenses, day.date)}
            </td>
            <td className={`py-2 text-xs font-semibold tabular-nums text-right ${profitClass}`}>
                {sign}{fmt(day.profit, day.date)}
            </td>
        </tr>
    );
};

export const MonthCard = ({
    data,
    isFuture,
}: MonthCardProps): React.ReactElement => {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const setSelectedDate = useFinancialStore((s) => s.setSelectedDate);
    const setTransactionFilters = useFinancialStore((s) => s.setTransactionFilters);

    const profitClass = data.profit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const profitSign = data.profit >= 0 ? '+' : '−';
    const opacity = isFuture ? 'opacity-40' : '';
    const dateRange = `${data.startDate.slice(8)}–${data.endDate.slice(8)}`;
    const isInteractive = data.hasData && !isFuture;

    const handleOpenMonthInDashboard = (): void => {
        if (!isInteractive) return;
        const latestActiveDate =
            data.dailyBreakdown[data.dailyBreakdown.length - 1]?.date ?? data.startDate;
        setSelectedDate(latestActiveDate);
        setTransactionFilters({
            scope: 'month',
            category: null,
            searchQuery: '',
            type: 'all',
            isWork: false,
            isKami: false,
            isShared: false,
        });
        router.push('/');
    };

    const handleSelectDay = (date: string): void => {
        setSelectedDate(date);
        setTransactionFilters({
            scope: 'day',
            category: null,
            searchQuery: '',
            type: 'all',
            isWork: false,
            isKami: false,
            isShared: false,
        });
        router.push('/');
    };

    return (
        <div
            className={`bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] transition-all ${opacity} ${
                isInteractive ? 'hover:border-stone-300/80' : ''
            }`}
        >
            {/* Header – always visible (accordion button + sibling dashboard action button) */}
            <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
                <button
                    type="button"
                    onClick={() => isInteractive && setExpanded(!expanded)}
                    disabled={!isInteractive}
                    aria-expanded={isInteractive ? expanded : undefined}
                    className={`flex-1 flex items-center justify-between min-w-0 text-left rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none ${
                        isInteractive
                            ? 'cursor-pointer transition-transform duration-150 active:scale-[0.99]'
                            : 'cursor-default'
                    }`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <IconSquircle
                            size="md"
                            className={
                                isInteractive
                                    ? 'bg-stone-100 text-stone-700 border-stone-200/70'
                                    : 'bg-stone-50 text-stone-400 border-stone-200/50'
                            }
                        >
                            <AppIcon icon={Calendar01Icon} size={14} />
                        </IconSquircle>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-stone-800 tracking-tight truncate">
                                {data.monthName}
                            </h3>
                            <p className="text-xs text-stone-400 tabular-nums">{dateRange}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                        {/* Summary stats */}
                        <div className="hidden sm:flex items-center gap-4 text-xs">
                            <span className="text-emerald-600 font-medium tabular-nums">
                                +{fmt(data.income, data.startDate)}
                            </span>
                            <span className="text-rose-500 font-medium tabular-nums">
                                −{fmt(data.expenses, data.startDate)}
                            </span>
                            <span className={`font-semibold tabular-nums ${profitClass}`}>
                                {profitSign}{fmt(data.profit, data.startDate)}
                            </span>
                        </div>

                        {isInteractive && (
                            <AppIcon
                                icon={expanded ? ArrowUp01Icon : ArrowDown01Icon}
                                size={16}
                                className="text-stone-400"
                            />
                        )}
                    </div>
                </button>

                {isInteractive && (
                    <button
                        type="button"
                        onClick={handleOpenMonthInDashboard}
                        aria-label={`Отвори ${data.monthName} в таблото`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-600 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200/80 hover:border-emerald-200 active:scale-[0.98] transition-all cursor-pointer flex-shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <span className="hidden sm:inline">Към таблото</span>
                        <AppIcon icon={ArrowRight01Icon} size={13} />
                    </button>
                )}
            </div>

            {/* Mobile summary (visible on small screens only) */}
            {data.hasData && (
                <div className="sm:hidden flex items-center gap-4 px-4 pb-3 text-xs">
                    <span className="text-emerald-600 font-medium tabular-nums">
                        +{fmt(data.income, data.startDate)}
                    </span>
                    <span className="text-rose-500 font-medium tabular-nums">
                        −{fmt(data.expenses, data.startDate)}
                    </span>
                    <span className={`font-semibold tabular-nums ${profitClass}`}>
                        {profitSign}{fmt(data.profit, data.startDate)}
                    </span>
                </div>
            )}

            {!data.hasData && !isFuture && (
                <p className="px-4 sm:px-5 pb-4 text-xs text-stone-400">
                    Няма транзакции
                </p>
            )}

            {/* Expanded: daily breakdown */}
            {expanded && data.dailyBreakdown.length > 0 && (
                <div className="border-t border-stone-100 px-4 sm:px-5 pb-5 pt-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                        Дневно разпределение
                    </p>
                    <table className="w-full">
                        <thead>
                            <tr className="text-[11px] text-stone-400 uppercase tracking-wider border-b border-stone-100">
                                <th className="text-left pb-2 font-semibold">Ден</th>
                                <th className="text-right pb-2 font-semibold pr-4">Приход</th>
                                <th className="text-right pb-2 font-semibold pr-4">Разход</th>
                                <th className="text-right pb-2 font-semibold">Печалба</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dailyBreakdown.map((day) => (
                                <DailyRow
                                    key={day.date}
                                    day={day}
                                    onSelectDay={handleSelectDay}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
