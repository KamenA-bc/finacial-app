/**
 * Main dashboard page.
 * Composes all components into a responsive two-column layout on desktop.
 * Business logic is delegated entirely to useFinancialData().
 */
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DateNavigator } from '@/components/ui/DateNavigator';
import { StatDisplay } from '@/components/ui/StatDisplay';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { ExportButton } from '@/components/ui/ExportButton';
import { useFinancialData } from '@/hooks/useFinancialData';

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
  const {
    dailyProfit,
    monthlyProfit,
    dailyIncome,
    dailyExpenses,
    monthlyIncome,
    monthlyExpenses,
  } = useFinancialData();

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
              label="Daily Profit"
              value={dailyProfit}
              period="For the selected day"
            />
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>
                Income:{' '}
                <span className="text-emerald-600 font-medium">
                  ${dailyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </span>
              <span>
                Spent:{' '}
                <span className="text-rose-400 font-medium">
                  ${dailyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </span>
            </div>
          </div>

          <StatDivider />

          {/* Monthly */}
          <div className="sm:pl-8 flex-1">
            <StatDisplay
              label="Monthly Profit"
              value={monthlyProfit}
              period="Last 30 days"
            />
            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>
                Income:{' '}
                <span className="text-emerald-600 font-medium">
                  ${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </span>
              <span>
                Spent:{' '}
                <span className="text-rose-400 font-medium">
                  ${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
          <SectionCard title="Spending Breakdown">
            <CategoryChart />
          </SectionCard>
          <SectionCard title="Today's Transactions">
            <TransactionList />
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
