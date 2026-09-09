'use client';

import React, { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon, Calendar } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useFinancialStore } from '@/store/transactionStore';
import { CHART_COLORS, getCurrencySymbol, NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS, CATEGORY_BG_MAP } from '@/lib/constants';
import { getMonthName } from '@/lib/dateUtils';

const formatTooltipValue = (value: number, date?: string): string =>
    `${getCurrencySymbol(date)}${value.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}`;

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
    date?: string;
}

const CustomTooltip = ({
    active,
    payload,
    date,
}: CustomTooltipProps): React.ReactElement | null => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-white/95 backdrop-blur-xs border border-stone-200/80 shadow-md rounded-xl px-3 py-2 text-xs">
            <p className="font-medium text-stone-700 mb-0.5">{name}</p>
            <p className="text-rose-600 font-bold tabular-nums">{formatTooltipValue(value, date)}</p>
        </div>
    );
};

type TabType = 'monthly' | 'yearly';

/** Interactive chart component with Monthly and Yearly Category breakdowns. */
export const CategoryChart = (): React.ReactElement => {
    const [activeTab, setActiveTab] = useState<TabType>('monthly');
    const { monthlyCategoryBreakdown, yearlyCategoryBreakdown } = useFinancialData();
    const selectedDate = useFinancialStore((s) => s.selectedDate);

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

    const translatedBreakdown = chartData.map((entry) => ({
        ...entry,
        name: CATEGORY_BG_MAP[entry.name as keyof typeof CATEGORY_BG_MAP] ?? entry.name,
    }));

    return (
        <div className="flex flex-col h-full">
            {/* Header with Tab Switcher & Label */}
            <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieIcon size={15} className="text-stone-400" />
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
                            Разпределение на разходите
                        </span>
                    </div>

                    <div className="flex p-0.5 bg-stone-100 rounded-lg border border-stone-200/70">
                        <button
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

                {/* Status Label */}
                <div className="bg-stone-50 rounded-lg px-2.5 py-1.5 border border-stone-100 flex items-center gap-1.5 self-start">
                    <Calendar size={12} className="text-emerald-600" />
                    <span className="text-[11px] font-medium text-stone-600">
                        Период: <span className="text-stone-900 font-semibold">{timeframeLabel}</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 relative">
                {!hasData ? (
                    <div className="min-h-[240px] flex flex-col items-center justify-center gap-2.5 text-stone-300">
                        <PieIcon size={40} strokeWidth={1.2} className="opacity-40" />
                        <p className="text-xs font-medium text-stone-400">Няма регистрирани разходи за периода</p>
                    </div>
                ) : (
                    <>
                        <div className="relative" style={{ width: '100%', height: 240 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={translatedBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={68}
                                        outerRadius={98}
                                        paddingAngle={3}
                                        dataKey="value"
                                        animationDuration={700}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                                strokeWidth={0}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip date={contextDate} />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Metric */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                    Общо разход
                                </span>
                                <span className="text-base sm:text-lg font-bold text-stone-800 tabular-nums">
                                    {formatTooltipValue(totalPeriodExpense, contextDate)}
                                </span>
                            </div>
                        </div>

                        {/* Custom legend rendered outside the chart to prevent overlap */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-2 px-2">
                            {translatedBreakdown.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-1.5">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                    />
                                    <span className="text-[11px] text-stone-600 whitespace-nowrap">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
