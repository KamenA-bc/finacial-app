/**
 * Main dashboard page.
 * Composes all components into a responsive two-column layout on desktop.
 * Business logic is delegated entirely to useFinancialData().
 * Fetches transactions from Supabase on mount when user is authenticated.
 */
'use client';

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DateNavigator } from '@/components/ui/DateNavigator';
import { StatDisplay } from '@/components/ui/StatDisplay';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { ExportButton } from '@/components/ui/ExportButton';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFinancialStore } from '@/store/transactionStore';
import { Loader2 } from 'lucide-react';
import { getMonthName, getCalendarMonthRange } from '@/lib/dateUtils';
import { NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS } from '@/lib/constants';

/** Thin section card wrapper – clean white with gentle shadow. */
const SectionCard = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    {title && (
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        {title}
      </h2>
    )}
    {children}
  </div>
);

/** Divider between stat displays. */
const StatDivider = (): React.ReactElement => (
  <div className="w-px bg-gray-100 self-stretch hidden sm:block" />
);

export default function DashboardPage(): React.ReactElement {
  const { user, loading: authLoading } = useAuth();
  const fetchTransactions = useFinancialStore((s) => s.fetchTransactions);
  const setUserId = useFinancialStore((s) => s.setUserId);
  const isLoading = useFinancialStore((s) => s.isLoading);
  const selectedDate = useFinancialStore((s) => s.selectedDate);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchTransactions(user.id);
    }
  }, [user, setUserId, fetchTransactions]);

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
      {/* ── Date Navigator ───────────────────────────────────────────── */}
      <div className="mb-5">
        <DateNavigator />
      </div>

      {/* ── Profit Counters ──────────────────────────────────────────── */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0 sm:divide-x sm:divide-gray-100">
          {/* Daily */}
          <div className="sm:pr-8 flex-1">
            <StatDisplay
              label="Дневна печалба"
              value={dailyProfit}
              period="За избрания ден"
            />
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>
                Приход:{' '}
                <span className="text-emerald-600 font-medium">
                  €{dailyIncome.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
              <span>
                Разход:{' '}
                <span className="text-rose-400 font-medium">
                  €{dailyExpenses.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
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
            />
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>
                Приход:{' '}
                <span className="text-emerald-600 font-medium">
                  €{monthlyIncome.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
              <span>
                Разход:{' '}
                <span className="text-rose-400 font-medium">
                  €{monthlyExpenses.toLocaleString(NUMBER_LOCALE, CURRENCY_FORMAT_OPTIONS)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Export ───────────────────────────────────────────────────── */}
      <div className="mt-4">
        <ExportButton />
      </div>

      {/* ── Main Grid: Forms + Chart/List ────────────────────────────── */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Input forms (2/5 width on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <SectionCard>
            <IncomeForm />
          </SectionCard>
          <SectionCard>
            <ExpenseForm />
          </SectionCard>
        </div>

        {/* RIGHT: Chart + Transaction list (3/5 width on desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <SectionCard title="Анализ на разходите">
            <CategoryChart />
          </SectionCard>
          <SectionCard title="Днешни транзакции">
            <TransactionList />
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
