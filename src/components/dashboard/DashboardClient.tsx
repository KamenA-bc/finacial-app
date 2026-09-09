'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DateNavigator } from '@/components/ui/DateNavigator';
import { StatDisplay } from '@/components/ui/StatDisplay';
import { QuickTransactionForm } from '@/components/forms/QuickTransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { ExportDropdown } from '@/components/ui/ExportDropdown';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFinancialStore } from '@/store/transactionStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { getMonthName, getCalendarMonthRange } from '@/lib/dateUtils';
import { NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS, getCurrencySymbol } from '@/lib/constants';

const CategoryChart = dynamic(
  () => import('@/components/charts/CategoryChart').then((mod) => mod.CategoryChart),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[260px] flex flex-col items-center justify-center gap-2 text-stone-300">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-[11px] text-stone-400 font-medium">Зареждане на графика...</span>
      </div>
    ),
  }
);

/** Elevated section card wrapper with soft border and subtle depth. */
const SectionCard = ({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}): React.ReactElement => (
  <div className={`bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-5 ${className}`}>
    {title && (
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-3.5">
        {title}
      </h2>
    )}
    {children}
  </div>
);

/** Divider between stat displays. */
const StatDivider = (): React.ReactElement => (
  <div className="w-px bg-stone-200/60 self-stretch hidden sm:block" />
);

export function DashboardClient(): React.ReactElement {
  const [mounted, setMounted] = React.useState(false);
  const { user, loading: authLoading } = useAuth();
  const fetchTransactions = useFinancialStore((s) => s.fetchTransactions);
  const setUserId = useFinancialStore((s) => s.setUserId);
  const isLoading = useFinancialStore((s) => s.isLoading);
  const loadedYears = useFinancialStore((s) => s.loadedYears);
  const selectedDate = useFinancialStore((s) => s.selectedDate);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = selectedDate && selectedDate.length >= 4
    ? parseInt(selectedDate.slice(0, 4), 10)
    : new Date().getFullYear();
  const isYearReady = loadedYears.includes(currentYear);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchTransactions(user.id, currentYear);
    }
  }, [user, currentYear, setUserId, fetchTransactions]);

  const {
    dailyProfit,
    monthlyProfit,
    dailyIncome,
    dailyExpenses,
    monthlyIncome,
    monthlyExpenses,
  } = useFinancialData();

  // Compute month label from selected date
  const selectedMonth = new Date(`${selectedDate}T00:00:00`);
  const { start: monthStart, end: monthEnd } = getCalendarMonthRange(selectedDate);
  const monthLabel = `${getMonthName(selectedMonth.getMonth())} ${monthStart.slice(8)}–${monthEnd.slice(8)}`;

  if (!mounted || authLoading || (!isYearReady && isLoading)) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      {/* ── Top Bar: Date Navigator + SaaS Export Action ────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex-1">
          <DateNavigator />
        </div>
        <div className="flex justify-end">
          <ExportDropdown />
        </div>
      </div>

      {/* ── Profit Counters ──────────────────────────────────────────── */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0 sm:divide-x sm:divide-stone-100">
          {/* Daily */}
          <div className="sm:pr-8 flex-1">
            <StatDisplay
              label="Дневна печалба"
              value={dailyProfit}
              period="За избрания ден"
              date={selectedDate}
            />
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Приход:{' '}
                <span className="text-emerald-700 font-semibold tabular-nums">
                  {getCurrencySymbol(selectedDate)}{dailyIncome.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                Разход:{' '}
                <span className="text-rose-700 font-semibold tabular-nums">
                  {getCurrencySymbol(selectedDate)}{dailyExpenses.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
            </div>
          </div>

          <StatDivider />

          {/* Monthly */}
          <div className="sm:pl-8 flex-1">
            <StatDisplay
              label="Месечна печалба"
              value={monthlyProfit}
              period={monthLabel}
              date={selectedDate}
            />
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Приход:{' '}
                <span className="text-emerald-700 font-semibold tabular-nums">
                  {getCurrencySymbol(selectedDate)}{monthlyIncome.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                Разход:{' '}
                <span className="text-rose-700 font-semibold tabular-nums">
                  {getCurrencySymbol(selectedDate)}{monthlyExpenses.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Main Grid: Unified Form + Chart/List ─────────────────────── */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Quick Transaction Logger (2/5 width on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <SectionCard title="Бързо въвеждане">
            <QuickTransactionForm />
          </SectionCard>
        </div>

        {/* RIGHT: Chart + Transaction list (3/5 width on desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <SectionCard title="Анализ на разходите">
            <ErrorBoundary fallbackTitle="Неуспешно зареждане на графиката" actionName="DashboardCategoryChart">
              <CategoryChart />
            </ErrorBoundary>
          </SectionCard>
          <SectionCard title="Днешни транзакции">
            <TransactionList />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
