/**
 * MonthCard – expandable card for a single month's financial summary.
 * Shows income/expenses/profit and toggles a daily breakdown table.
 */
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { MonthlySummary, DailySummary } from '@/hooks/useHistoryData';
import {
    CURRENCY_SYMBOL,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface MonthCardProps {
    data: MonthlySummary;
    isFuture: boolean;
}

const fmt = (n: number): string =>
    `${CURRENCY_SYMBOL}${Math.abs(n).toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}`;

const formatDayDate = (dateStr: string): string => {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

const DailyRow = ({ day }: { day: DailySummary }): React.ReactElement => {
    const profitClass = day.profit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const sign = day.profit >= 0 ? '+' : '−';

    return (
        <tr className="border-b border-gray-50 last:border-0">
            <td className="py-2 pr-4 text-xs text-gray-500">{formatDayDate(day.date)}</td>
            <td className="py-2 pr-4 text-xs text-emerald-600 tabular-nums text-right">
                +{fmt(day.income)}
            </td>
            <td className="py-2 pr-4 text-xs text-rose-400 tabular-nums text-right">
                −{fmt(day.expenses)}
            </td>
            <td className={`py-2 text-xs font-medium tabular-nums text-right ${profitClass}`}>
                {sign}{fmt(day.profit)}
            </td>
        </tr>
    );
};

export const MonthCard = ({
    data,
    isFuture,
}: MonthCardProps): React.ReactElement => {
    const [expanded, setExpanded] = useState(false);

    const profitClass = data.profit >= 0 ? 'text-emerald-600' : 'text-rose-500';
    const profitSign = data.profit >= 0 ? '+' : '−';
    const opacity = isFuture ? 'opacity-40' : '';
    const dateRange = `${data.startDate.slice(8)}–${data.endDate.slice(8)}`;

    return (
        <div
            className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all ${opacity} ${
                data.hasData ? 'hover:shadow-md' : ''
            }`}
        >
            {/* Header – always visible */}
            <button
                onClick={() => data.hasData && setExpanded(!expanded)}
                disabled={!data.hasData || isFuture}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">
                        <Calendar size={14} className="text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                            {data.monthName}
                        </h3>
                        <p className="text-xs text-gray-400">{dateRange}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Summary stats */}
                    <div className="hidden sm:flex items-center gap-4 text-xs">
                        <span className="text-emerald-600 tabular-nums">
                            +{fmt(data.income)}
                        </span>
                        <span className="text-rose-400 tabular-nums">
                            −{fmt(data.expenses)}
                        </span>
                        <span className={`font-semibold tabular-nums ${profitClass}`}>
                            {profitSign}{fmt(data.profit)}
                        </span>
                    </div>

                    {data.hasData && !isFuture && (
                        expanded ? (
                            <ChevronUp size={16} className="text-gray-300" />
                        ) : (
                            <ChevronDown size={16} className="text-gray-300" />
                        )
                    )}
                </div>
            </button>

            {/* Mobile summary (visible on small screens only) */}
            {data.hasData && (
                <div className="sm:hidden flex items-center gap-4 px-5 pb-3 text-xs">
                    <span className="text-emerald-600 tabular-nums">
                        +{fmt(data.income)}
                    </span>
                    <span className="text-rose-400 tabular-nums">
                        −{fmt(data.expenses)}
                    </span>
                    <span className={`font-semibold tabular-nums ${profitClass}`}>
                        {profitSign}{fmt(data.profit)}
                    </span>
                </div>
            )}

            {!data.hasData && !isFuture && (
                <p className="px-5 pb-4 text-xs text-gray-300">
                    No transactions
                </p>
            )}

            {/* Expanded: daily breakdown */}
            {expanded && data.dailyBreakdown.length > 0 && (
                <div className="border-t border-gray-100 px-5 pb-5 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                        Daily Breakdown
                    </p>
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gray-400 uppercase tracking-wider">
                                <th className="text-left pb-2 font-medium">Day</th>
                                <th className="text-right pb-2 font-medium pr-4">Income</th>
                                <th className="text-right pb-2 font-medium pr-4">Expenses</th>
                                <th className="text-right pb-2 font-medium">Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.dailyBreakdown.map((day) => (
                                <DailyRow key={day.date} day={day} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
