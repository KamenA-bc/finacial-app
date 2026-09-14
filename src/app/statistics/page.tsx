/**
 * Statistics page – comprehensive financial statistics and insights.
 * Shows yearly KPIs, records, category breakdowns, trends, and fun facts.
 * Follows the same auth/loading pattern as the History page.
 */
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OverviewCards } from '@/components/statistics/OverviewCards';
import { RecordHighlights } from '@/components/statistics/RecordHighlights';
import { SpendingHabits } from '@/components/statistics/SpendingHabits';
import { IncomeBreakdown } from '@/components/statistics/IncomeBreakdown';
import { FunFacts } from '@/components/statistics/FunFacts';
import { StatisticsSkeleton } from '@/components/statistics/StatisticsSkeleton';
import { useStatisticsData } from '@/hooks/useStatisticsData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFinancialStore } from '@/store/transactionStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const MonthlyTrendsChart = dynamic(
  () => import('@/components/statistics/MonthlyTrendsChart').then((m) => m.MonthlyTrendsChart),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 min-h-[340px] select-none" aria-busy="true">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded bg-stone-100 animate-pulse" />
          <div className="w-36 h-3.5 rounded bg-stone-100 animate-pulse" />
        </div>
        <div className="h-[240px] flex items-end justify-between pt-6 px-2 sm:px-6 gap-1.5 sm:gap-3 border-b border-stone-100 pb-2">
          {[45, 75, 60, 90, 50, 80, 65, 95, 70, 85, 55, 68].map((h, i) => (
            <div key={i} className="flex-1 flex items-end justify-center gap-0.5 sm:gap-1 h-full">
              <div
                className="w-full max-w-[8px] sm:max-w-[12px] bg-emerald-100/60 rounded-t animate-pulse"
                style={{ height: `${h}%` }}
              />
              <div
                className="w-full max-w-[8px] sm:max-w-[12px] bg-rose-100/60 rounded-t animate-pulse"
                style={{ height: `${Math.max(20, h - 25)}%` }}
              />
              <div
                className="w-full max-w-[8px] sm:max-w-[12px] bg-blue-100/60 rounded-t animate-pulse"
                style={{ height: `${Math.max(15, h - 40)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between px-2 sm:px-6 pt-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 sm:w-6 h-2.5 rounded bg-stone-100 animate-pulse" />
          ))}
        </div>
      </div>
    ),
  }
);

export default function StatisticsPage(): React.ReactElement {
    const currentYear = new Date().getFullYear();
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
    const stats = useStatisticsData(year);

    if (authLoading || (!isYearReady && isLoading)) {
        return (
            <DashboardLayout>
                <StatisticsSkeleton />
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
                <ErrorBoundary fallbackTitle="Неуспешно зареждане на годишната графика" actionName="StatisticsMonthlyTrendsChart">
                    <MonthlyTrendsChart
                        year={year}
                        data={stats.monthlyTrends}
                        hasData={stats.hasData}
                    />
                </ErrorBoundary>

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
                    avgDailyExpense={stats.avgDailyExpense}
                    kamiSpending={stats.kamiSpending}
                />
            </div>
        </DashboardLayout>
    );
}
