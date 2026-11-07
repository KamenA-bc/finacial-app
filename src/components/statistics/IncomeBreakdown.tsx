/**
 * IncomeBreakdown – work vs. personal income/expense split.
 * Visual progress bars with percentage labels.
 */
'use client';

import React from 'react';
import { Briefcase01Icon, User02Icon } from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
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

const fmt = (amount: number, year: number): string => {
    const symbol = getCurrencySymbol(`${year}-01-01`);
    const num = amount.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS);
    return symbol === '€' ? `€${num}` : `${num}\u00A0${symbol}`;
};

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
        <div className="flex flex-col gap-2.5 p-3.5 sm:p-4 bg-stone-50/70 rounded-xl border border-stone-200/60">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    {label}
                </p>
                {total > 0 && (
                    <span className="text-xs font-bold text-stone-700 tabular-nums">
                        {fmt(total, year)}
                    </span>
                )}
            </div>

            {total === 0 ? (
                <p className="text-xs text-stone-400">Няма данни</p>
            ) : (
                <>
                    {/* Progress bar */}
                    <div className="flex h-3 rounded-full overflow-hidden bg-stone-200/70">
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
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5">
                            <AppIcon icon={Briefcase01Icon} size={13} className={workColor} />
                            <span className="text-xs text-stone-600">
                                Работни:{' '}
                                <span className={`font-bold tabular-nums ${workColor}`}>
                                    {fmt(workAmount, year)}
                                </span>
                                <span className="text-stone-400 ml-1 tabular-nums">
                                    ({workPercent.toFixed(0)}%)
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <AppIcon icon={User02Icon} size={13} className={personalColor} />
                            <span className="text-xs text-stone-600">
                                Лични:{' '}
                                <span className={`font-bold tabular-nums ${personalColor}`}>
                                    {fmt(personalAmount, year)}
                                </span>
                                <span className="text-stone-400 ml-1 tabular-nums">
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
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] border border-stone-200/70 p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
            <IconSquircle size="sm" className="bg-stone-100 text-stone-700 border-stone-200/70">
                <AppIcon icon={Briefcase01Icon} size={14} />
            </IconSquircle>
            <div>
                <h2 className="text-xs sm:text-sm font-semibold text-stone-800 tracking-tight">
                    Работни / Лични
                </h2>
                <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                    Съотношение на потоците за {year}
                </p>
            </div>
        </div>

        <div className="flex flex-col gap-3.5">
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
