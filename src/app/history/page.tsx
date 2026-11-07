/**
 * History page – month-by-month financial summaries with daily breakdowns
 * and an overall annual review.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnnualSummary } from '@/components/history/AnnualSummary';
import { MonthCard } from '@/components/history/MonthCard';
import { HistorySkeleton } from '@/components/history/HistorySkeleton';
import { useHistoryData } from '@/hooks/useHistoryData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFinancialStore } from '@/store/transactionStore';

export default function HistoryPage(): React.ReactElement {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const [year, setYear] = useState(currentYear);

    const { user, loading: authLoading } = useAuth();
    const fetchTransactions = useFinancialStore((s) => s.fetchTransactions);
    const setUserId = useFinancialStore((s) => s.setUserId);
    const isLoading = useFinancialStore((s) => s.isLoading);
    const loadedYears = useFinancialStore((s) => s.loadedYears);

    useEffect(() => {
        if (user) {
            setUserId(user.id);
            fetchTransactions(user.id, year);
        }
    }, [user, year, setUserId, fetchTransactions]);

    const isYearReady = loadedYears.includes(year);
    const yearData = useHistoryData(year);

    if (authLoading || (!isYearReady && isLoading)) {
        return (
            <DashboardLayout>
                <HistorySkeleton />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* ── Year Selector ─────────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={() => setYear((y) => y - 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-100/70 hover:text-stone-900 transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    aria-label="Предишна година"
                >
                    <AppIcon icon={ArrowLeft01Icon} size={18} />
                </button>
                <span className="text-lg font-bold text-stone-900 tabular-nums min-w-[60px] text-center tracking-tight">
                    {year}
                </span>
                <button
                    onClick={() => setYear((y) => y + 1)}
                    disabled={year >= currentYear}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-100/70 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    aria-label="Следваща година"
                >
                    <AppIcon icon={ArrowRight01Icon} size={18} />
                </button>
            </div>

            {/* ── Annual Summary ────────────────────────────────────────── */}
            <div className="mb-6">
                <AnnualSummary
                    year={yearData.year}
                    totalIncome={yearData.totalIncome}
                    totalExpenses={yearData.totalExpenses}
                    totalProfit={yearData.totalProfit}
                />
            </div>

            {/* ── Monthly Cards ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {yearData.months.map((monthData) => {
                    const isFuture =
                        year > currentYear ||
                        (year === currentYear && monthData.month > currentMonth);

                    return (
                        <MonthCard
                            key={monthData.month}
                            data={monthData}
                            isFuture={isFuture}
                        />
                    );
                })}
            </div>
        </DashboardLayout>
    );
}
