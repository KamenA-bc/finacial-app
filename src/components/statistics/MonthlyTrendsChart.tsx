/**
 * MonthlyTrendsChart – grouped bar chart showing income, expenses, and profit
 * for each month of the year. Uses Recharts BarChart.
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
} from 'recharts';
import { BarChart3 } from 'lucide-react';
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

const formatValue = (value: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${value.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

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
        <div className="bg-white border border-gray-100 shadow-md rounded-lg px-3 py-2.5 text-xs">
            <p className="font-bold text-gray-700 mb-1.5">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 py-0.5">
                    <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-500">{LABEL_MAP[entry.name] ?? entry.name}:</span>
                    <span className="font-medium text-gray-800 tabular-nums ml-auto">
                        {formatValue(entry.value, year)}
                    </span>
                </div>
            ))}
        </div>
    );
};

export const MonthlyTrendsChart = ({
    year,
    data,
    hasData,
}: MonthlyTrendsChartProps): React.ReactElement => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Месечни тенденции
            </h2>
        </div>

        {!hasData ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-300">
                <BarChart3 size={44} strokeWidth={1} className="opacity-50" />
                <p className="text-sm font-medium">Няма данни за тази година</p>
            </div>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        tickFormatter={(v: number) =>
                            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                        }
                    />
                    <Tooltip content={<CustomTooltip year={year} />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '10px' }}
                        formatter={(value: string) => LABEL_MAP[value] ?? value}
                    />
                    <Bar dataKey="income" fill="#6ee7b7" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" fill="#fda4af" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="profit" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        )}
    </div>
);
