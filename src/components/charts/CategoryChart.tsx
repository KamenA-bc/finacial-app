'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { CHART_COLORS, CURRENCY_SYMBOL, NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS, CATEGORY_BG_MAP } from '@/lib/constants';
import { CategoryDataPoint } from '@/types';

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
        <div className="bg-white border border-gray-100 shadow-sm rounded-md px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700">{name}</p>
            <p className="text-gray-500">{formatTooltipValue(value)}</p>
        </div>
    );
};

/** Muted donut chart showing expense breakdown for the selected day. */
export const CategoryChart = (): React.ReactElement => {
    const { categoryBreakdown } = useFinancialData();

    if (categoryBreakdown.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-300">
                <PieIcon size={40} strokeWidth={1.2} />
                <p className="text-sm">Няма добавени разходи днес</p>
            </div>
        );
    }

    const translatedBreakdown = categoryBreakdown.map((entry) => ({
        ...entry,
        name: CATEGORY_BG_MAP[entry.name as keyof typeof CATEGORY_BG_MAP] ?? entry.name,
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={translatedBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {categoryBreakdown.map((entry, index) => (
                        <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#6b7280' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};
