/**
 * MonthlyTrendsChart – grouped bar chart showing income, expenses, and profit
 * for each month of the year. Uses Recharts BarChart.
 *
 * Mobile: horizontally scrollable, no tooltip (avoids stuck-selection UX issues),
 * black dotted vertical separators between months.
 * Desktop: full-width responsive with hover tooltip.
 */
'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { Analytics01Icon } from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface MonthlyTrendPoint {
    month: string;
    income: number;
    expenses: number;
    profit: number;
}

interface MonthlyTrendsChartProps {
    year: number;
    data: MonthlyTrendPoint[];
    hasData: boolean;
}

const formatValue = (value: number, year: number): string => {
    const symbol = getCurrencySymbol(`${year}-01-01`);
    const num = value.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
    year: number;
}

const LABEL_MAP: Record<string, string> = {
    income: 'Приход',
    expenses: 'Разход',
    profit: 'Печалба',
};

const CustomTooltip = ({
    active,
    payload,
    label,
    year,
}: CustomTooltipProps): React.ReactElement | null => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white border border-stone-200/80 shadow-lg rounded-xl px-3.5 py-2.5 text-xs">
            <p className="font-bold text-stone-800 mb-1.5">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 py-0.5">
                    <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-stone-500">{LABEL_MAP[entry.name] ?? entry.name}:</span>
                    <span className="font-semibold text-stone-800 tabular-nums ml-auto">
                        {formatValue(entry.value, year)}
                    </span>
                </div>
            ))}
        </div>
    );
};

/** Shared chart internals. `showTooltip` controls whether tooltip is rendered. */
const ChartContent = ({
    year,
    data,
    showTooltip,
}: {
    year: number;
    data: MonthlyTrendPoint[];
    showTooltip: boolean;
}): React.ReactElement => (
    <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        barCategoryGap="35%"
    >
        {/* Subtle horizontal grid + warm stone dotted vertical month separators */}
        <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f5f5f4"
            horizontal={true}
            vertical={false}
        />
        <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#a8a29e' }}
            axisLine={{ stroke: '#e7e5e4' }}
            tickLine={{ stroke: '#78716c', strokeDasharray: '2 2' }}
        />
        <YAxis
            tick={{ fontSize: 11, fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
        />

        {/* Warm stone dotted vertical separators between each month */}
        {data.map((_, index) => (
            <ReferenceLine
                key={index}
                x={data[index].month}
                stroke="#d6d3d1"
                strokeDasharray="3 3"
                strokeWidth={0.75}
                strokeOpacity={0.6}
            />
        ))}

        {showTooltip && (
            <Tooltip content={<CustomTooltip year={year} />} />
        )}
        <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#78716c', paddingTop: '10px' }}
            formatter={(value: string) => LABEL_MAP[value] ?? value}
        />
        <Bar dataKey="income" fill="#6ee7b7" radius={[3, 3, 0, 0]} />
        <Bar dataKey="expenses" fill="#fda4af" radius={[3, 3, 0, 0]} />
        <Bar dataKey="profit" fill="#93c5fd" radius={[3, 3, 0, 0]} />
    </BarChart>
);

export const MonthlyTrendsChart = ({
    year,
    data,
    hasData,
}: MonthlyTrendsChartProps): React.ReactElement => (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
                <IconSquircle size="sm" className="bg-stone-100 text-stone-700 border-stone-200/70">
                    <AppIcon icon={Analytics01Icon} size={14} />
                </IconSquircle>
                <div>
                    <h2 className="text-xs sm:text-sm font-semibold text-stone-800 tracking-tight">
                        Месечни тенденции
                    </h2>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                        Приходи, разходи и печалба по месеци за {year}
                    </p>
                </div>
            </div>
            {hasData && (
                <span className="text-[10px] text-stone-400 font-medium sm:hidden">
                    ← плъзни →
                </span>
            )}
        </div>

        {!hasData ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
                <AppIcon icon={Analytics01Icon} size={44} className="opacity-50" />
                <p className="text-sm font-medium">Няма данни за тази година</p>
            </div>
        ) : (
            <>
                {/* Desktop: responsive chart with hover tooltip */}
                <div className="hidden sm:block">
                    <ResponsiveContainer width="100%" height={340}>
                        <ChartContent year={year} data={data} showTooltip={true} />
                    </ResponsiveContainer>
                </div>

                {/* Mobile: scrollable, taller, no tooltip (no stuck selections) */}
                <div className="sm:hidden overflow-x-auto -mx-2 px-2 pb-2">
                    <div style={{ width: 750, height: 340 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ChartContent year={year} data={data} showTooltip={false} />
                        </ResponsiveContainer>
                    </div>
                </div>
            </>
        )}
    </div>
);
