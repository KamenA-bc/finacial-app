/**
 * History page – month-by-month financial summaries with daily breakdowns
 * and an overall annual review.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AnnualSummary } from '@/components/history/AnnualSummary';
import { MonthCard } from '@/components/history/MonthCard';
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

    useEffect(() => {
        if (user) {
            setUserId(user.id);
            fetchTransactions(user.id);
        }
    }, [user, setUserId, fetchTransactions]);

    const yearData = useHistoryData(year);

    if (authLoading || isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-gray-300" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* ── Year Selector ─────────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={() => setYear((y) => y - 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Предишна година"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="text-lg font-bold text-gray-800 tabular-nums min-w-[60px] text-center">
                    {year}
                </span>
                <button
                    onClick={() => setYear((y) => y + 1)}
                    disabled={year >= currentYear}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Следваща година"
                >
                    <ChevronRight size={18} />
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
