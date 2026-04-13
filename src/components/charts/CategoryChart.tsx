'use client';

import React, { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Calendar } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useFinancialStore } from '@/store/transactionStore';
import { CHART_COLORS, CURRENCY_SYMBOL, NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS, CATEGORY_BG_MAP } from '@/lib/constants';
import { getMonthName } from '@/lib/dateUtils';

const formatTooltipValue = (value: number): string =>
    `${CURRENCY_SYMBOL}${value.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}`;

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number }>;
}

const CustomTooltip = ({
    active,
    payload,
}: CustomTooltipProps): React.ReactElement | null => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
        <div className="bg-white border border-gray-100 shadow-md rounded-lg px-3 py-2 text-xs">
            <p className="font-bold text-gray-800 mb-1">{name}</p>
            <p className="text-emerald-600 font-medium">{formatTooltipValue(value)}</p>
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

    const translatedBreakdown = chartData.map((entry) => ({
        ...entry,
        name: CATEGORY_BG_MAP[entry.name as keyof typeof CATEGORY_BG_MAP] ?? entry.name,
    }));

    return (
        <div className="flex flex-col h-full">
            {/* Header with Tab Switcher & Label */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PieIcon size={16} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            Анализ на разходите
                        </span>
                    </div>

                    <div className="flex p-0.5 bg-gray-100 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                                activeTab === 'monthly'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            МЕСЕЦ
                        </button>
                        <button
                            onClick={() => setActiveTab('yearly')}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                                activeTab === 'yearly'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            ГОДИНА
                        </button>
                    </div>
                </div>

                {/* Status Label */}
                <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 flex items-center gap-2 self-start">
                    <Calendar size={12} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-600">
                        Преглеждате: <span className="text-gray-900 font-bold">{timeframeLabel}</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 min-h-[260px] relative">
                {!hasData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-300">
                        <PieIcon size={44} strokeWidth={1} className="opacity-50" />
                        <p className="text-sm font-medium">Няма данни за избрания период</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={translatedBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={105}
                                paddingAngle={4}
                                dataKey="value"
                                animationDuration={800}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '15px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
