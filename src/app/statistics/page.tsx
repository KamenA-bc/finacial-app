/**
 * Statistics page – comprehensive financial statistics and insights.
 * Shows yearly KPIs, records, category breakdowns, trends, and fun facts.
 * Follows the same auth/loading pattern as the History page.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OverviewCards } from '@/components/statistics/OverviewCards';
import { RecordHighlights } from '@/components/statistics/RecordHighlights';
import { MonthlyTrendsChart } from '@/components/statistics/MonthlyTrendsChart';
import { SpendingHabits } from '@/components/statistics/SpendingHabits';
import { IncomeBreakdown } from '@/components/statistics/IncomeBreakdown';
import { FunFacts } from '@/components/statistics/FunFacts';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFinancialStore } from '@/store/transactionStore';

export default function StatisticsPage(): React.ReactElement {
    const currentYear = new Date().getFullYear();
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

    const stats = useStatisticsData(year);

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

            {/* ── Content ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5">
                {/* Section 1: Overview KPIs */}
                <OverviewCards
                    year={year}
                    totalIncome={stats.totalIncome}
                    totalExpenses={stats.totalExpenses}
                    netProfit={stats.netProfit}
                    savingsRate={stats.savingsRate}
                />

                {/* Section 2: Records */}
                <RecordHighlights
                    year={year}
                    biggestEarningMonth={stats.biggestEarningMonth}
                    biggestSpendingMonth={stats.biggestSpendingMonth}
                    mostProfitableMonth={stats.mostProfitableMonth}
                    worstMonth={stats.worstMonth}
                />

                {/* Section 3: Monthly Trends Chart */}
                <MonthlyTrendsChart
                    year={year}
                    data={stats.monthlyTrends}
                    hasData={stats.hasData}
                />

                {/* Section 4 + 5: Spending Habits & Income Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <SpendingHabits
                        year={year}
                        topCategory={stats.topCategory}
                        categoryRanking={stats.categoryRanking}
                        avgExpensePerTransaction={stats.avgExpensePerTransaction}
                        totalTransactionCount={stats.totalTransactionCount}
                        incomeTransactionCount={stats.incomeTransactionCount}
                        expenseTransactionCount={stats.expenseTransactionCount}
                    />
                    <IncomeBreakdown
                        year={year}
                        workIncome={stats.workIncome}
                        personalIncome={stats.personalIncome}
                        workExpenses={stats.workExpenses}
                        personalExpenses={stats.personalExpenses}
                    />
                </div>

                {/* Section 6: Fun Facts */}
                <FunFacts
                    year={year}
                    biggestSpendingDay={stats.biggestSpendingDay}
                    biggestEarningDay={stats.biggestEarningDay}
                    avgDailyExpense={stats.avgDailyExpense}
                    activeDays={stats.activeDays}
                    kamiSpending={stats.kamiSpending}
                />
            </div>
        </DashboardLayout>
    );
}
