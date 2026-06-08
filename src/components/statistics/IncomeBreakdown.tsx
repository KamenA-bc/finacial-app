/**
 * IncomeBreakdown – work vs. personal income/expense split.
 * Visual progress bars with percentage labels.
 */
'use client';

import React from 'react';
import { Briefcase, User } from 'lucide-react';
import {
    getCurrencySymbol,
    NUMBER_LOCALE,
    CURRENCY_FORMAT_OPTIONS,
} from '@/lib/constants';

interface IncomeBreakdownProps {
    year: number;
    workIncome: number;
    personalIncome: number;
    workExpenses: number;
    personalExpenses: number;
}

const fmt = (amount: number, year: number): string =>
    `${getCurrencySymbol(`${year}-01-01`)}${amount.toLocaleString(
        NUMBER_LOCALE,
        CURRENCY_FORMAT_OPTIONS
    )}`;

interface SplitBarProps {
    label: string;
    workAmount: number;
    personalAmount: number;
    year: number;
    workColor: string;
    personalColor: string;
    workBgColor: string;
    personalBgColor: string;
}

const SplitBar = ({
    label,
    workAmount,
    personalAmount,
    year,
    workColor,
    personalColor,
    workBgColor,
    personalBgColor,
}: SplitBarProps): React.ReactElement => {
    const total = workAmount + personalAmount;
    const workPercent = total > 0 ? (workAmount / total) * 100 : 0;
    const personalPercent = total > 0 ? (personalAmount / total) * 100 : 0;

    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {label}
            </p>

            {total === 0 ? (
                <p className="text-xs text-gray-300">Няма данни</p>
            ) : (
                <>
                    {/* Progress bar */}
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                        {workPercent > 0 && (
                            <div
                                className={`${workBgColor} transition-all duration-500`}
                                style={{ width: `${workPercent}%` }}
                            />
                        )}
                        {personalPercent > 0 && (
                            <div
                                className={`${personalBgColor} transition-all duration-500`}
                                style={{ width: `${personalPercent}%` }}
                            />
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Briefcase size={12} className={workColor} />
                            <span className="text-xs text-gray-500">
                                Работни:{' '}
                                <span className={`font-bold ${workColor}`}>
                                    {fmt(workAmount, year)}
                                </span>
                                <span className="text-gray-300 ml-1">
                                    ({workPercent.toFixed(0)}%)
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={12} className={personalColor} />
                            <span className="text-xs text-gray-500">
                                Лични:{' '}
                                <span className={`font-bold ${personalColor}`}>
                                    {fmt(personalAmount, year)}
                                </span>
                                <span className="text-gray-300 ml-1">
                                    ({personalPercent.toFixed(0)}%)
                                </span>
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export const IncomeBreakdown = ({
    year,
    workIncome,
    personalIncome,
    workExpenses,
    personalExpenses,
}: IncomeBreakdownProps): React.ReactElement => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Работни / Лични
            </h2>
        </div>

        <div className="flex flex-col gap-5">
            <SplitBar
                label="Приходи"
                workAmount={workIncome}
                personalAmount={personalIncome}
                year={year}
                workColor="text-blue-600"
                personalColor="text-emerald-600"
                workBgColor="bg-blue-400"
                personalBgColor="bg-emerald-400"
            />
            <SplitBar
                label="Разходи"
                workAmount={workExpenses}
                personalAmount={personalExpenses}
                year={year}
                workColor="text-amber-600"
                personalColor="text-rose-500"
                workBgColor="bg-amber-400"
                personalBgColor="bg-rose-400"
            />
        </div>
    </div>
);
