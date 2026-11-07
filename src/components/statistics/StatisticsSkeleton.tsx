import React from 'react';

/**
 * High-performance instant skeleton for the Statistics page.
 * Replicates the exact responsive multi-column grid layouts of KPIs, Records,
 * Trends Chart, Spending Habits, and Fun Facts to eliminate layout shifts (CLS).
 */
export function StatisticsSkeleton(): React.ReactElement {
  return (
    <div className="w-full select-none" aria-busy="true" aria-label="Зареждане на статистика...">
      {/* ── Year Selector Skeleton ─────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200/60 animate-pulse" />
        <div className="w-16 h-7 rounded-lg bg-stone-100 animate-pulse" />
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200/60 animate-pulse" />
      </div>

      <div className="flex flex-col gap-5">
        {/* ── Section 1: Overview KPI Cards Skeleton (4 columns) ──── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-4 sm:p-5 min-h-[100px] flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
                <div className="w-16 sm:w-20 h-3 rounded bg-stone-100 animate-pulse" />
              </div>
              <div className="w-24 sm:w-32 h-6 sm:h-7 rounded-md bg-stone-100 animate-pulse mt-2.5" />
            </div>
          ))}
        </div>

        {/* ── Section 2: Records Highlights Skeleton (Parent Card + 2x2 Grid) ──── */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-3.5 rounded bg-stone-100 animate-pulse" />
              <div className="w-40 h-2.5 rounded bg-stone-100/70 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse flex-shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="w-24 h-2.5 rounded bg-stone-100/80 animate-pulse" />
                  <div className="w-20 h-3.5 rounded bg-stone-100 animate-pulse" />
                  <div className="w-28 h-5 rounded bg-stone-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Monthly Trends Chart Skeleton ────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-4 sm:p-5 min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="w-36 h-3.5 rounded bg-stone-100 animate-pulse" />
                <div className="w-44 h-2.5 rounded bg-stone-100/70 animate-pulse" />
              </div>
            </div>
          </div>
          {/* Simulated chart bars across months */}
          <div className="h-[240px] flex items-end justify-between pt-6 px-2 sm:px-6 gap-1.5 sm:gap-3 border-b border-stone-100 pb-2">
            {[45, 75, 60, 90, 50, 80, 65, 95, 70, 85, 55, 68].map((heightPct, i) => (
              <div key={i} className="flex-1 flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                <div
                  className="w-full max-w-[8px] sm:max-w-[12px] bg-emerald-100/60 rounded-t animate-pulse"
                  style={{ height: `${heightPct}%` }}
                />
                <div
                  className="w-full max-w-[8px] sm:max-w-[12px] bg-rose-100/60 rounded-t animate-pulse"
                  style={{ height: `${Math.max(20, heightPct - 25)}%` }}
                />
                <div
                  className="w-full max-w-[8px] sm:max-w-[12px] bg-blue-100/60 rounded-t animate-pulse"
                  style={{ height: `${Math.max(15, heightPct - 40)}%` }}
                />
              </div>
            ))}
          </div>
          {/* X-axis simulated labels */}
          <div className="flex justify-between px-2 sm:px-6 pt-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-4 sm:w-6 h-2.5 rounded bg-stone-100 animate-pulse" />
            ))}
          </div>
        </div>

        {/* ── Section 4 + 5: Spending Habits & Income Breakdown ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Spending Habits Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-3.5 sm:p-5 min-h-[280px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="w-32 h-3.5 rounded bg-stone-100 animate-pulse" />
                <div className="w-40 h-2.5 rounded bg-stone-100/70 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
                    <div className="w-24 sm:w-32 h-3.5 rounded bg-stone-100 animate-pulse" />
                  </div>
                  <div className="w-16 h-3.5 rounded bg-stone-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Income Breakdown Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-3.5 sm:p-5 min-h-[280px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="w-32 h-3.5 rounded bg-stone-100 animate-pulse" />
                <div className="w-40 h-2.5 rounded bg-stone-100/70 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-xl bg-stone-50/70 border border-stone-200/60">
                  <div className="flex items-center justify-between">
                    <div className="w-20 h-3 rounded bg-stone-100 animate-pulse" />
                    <div className="w-16 h-3 rounded bg-stone-100 animate-pulse" />
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200/60 animate-pulse" />
                  <div className="flex items-center justify-between">
                    <div className="w-28 h-2.5 rounded bg-stone-100 animate-pulse" />
                    <div className="w-28 h-2.5 rounded bg-stone-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 6: Fun Facts Skeleton (Parent Card + 2+1 Grid) ──────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/70 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-stone-100 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-32 h-3.5 rounded bg-stone-100 animate-pulse" />
              <div className="w-44 h-2.5 rounded bg-stone-100/70 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse flex-shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-20 h-2.5 rounded bg-stone-100/80 animate-pulse" />
                    <div className="w-28 h-5 rounded bg-stone-100 animate-pulse" />
                    <div className="w-24 h-2.5 rounded bg-stone-100/60 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-stone-50/70 rounded-xl border border-stone-200/60 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-32 h-2.5 rounded bg-stone-100/80 animate-pulse" />
                <div className="w-28 h-5 rounded bg-stone-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
