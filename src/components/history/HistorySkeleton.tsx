import React from 'react';

/**
 * High-performance instant skeleton for the History page.
 * Mirrors the exact geometry and responsive layout of the Year Selector,
 * AnnualSummary card, and MonthCard list to eliminate Cumulative Layout Shift (CLS).
 */
export function HistorySkeleton(): React.ReactElement {
  return (
    <div className="w-full select-none" aria-busy="true" aria-label="Зареждане на история...">
      {/* ── Year Selector Skeleton ─────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200/60 animate-pulse" />
        <div className="w-16 h-7 rounded-lg bg-stone-100 animate-pulse" />
        <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200/60 animate-pulse" />
      </div>

      {/* ── Annual Summary Card Skeleton ──────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-4 h-4 rounded bg-stone-200/70 animate-pulse" />
          <div className="w-48 h-4 rounded bg-stone-100 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Income */}
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3 rounded bg-stone-100 animate-pulse" />
            <div className="w-36 h-7 rounded-lg bg-emerald-50/70 border border-emerald-100/60 animate-pulse" />
          </div>
          {/* Expenses */}
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3 rounded bg-stone-100 animate-pulse" />
            <div className="w-36 h-7 rounded-lg bg-rose-50/70 border border-rose-100/60 animate-pulse" />
          </div>
          {/* Profit */}
          <div className="flex flex-col gap-2">
            <div className="w-24 h-3 rounded bg-stone-100 animate-pulse" />
            <div className="w-36 h-7 rounded-lg bg-stone-100 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Monthly Cards Skeleton List ───────────────────────────── */}
      <div className="flex flex-col gap-3">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-24 sm:w-28 h-4 rounded bg-stone-100 animate-pulse" />
                <div className="w-16 sm:w-20 h-3 rounded bg-stone-100/70 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <div className="w-16 h-4 rounded bg-emerald-50/70 border border-emerald-100/60 animate-pulse" />
                <div className="w-16 h-4 rounded bg-rose-50/70 border border-rose-100/60 animate-pulse" />
                <div className="w-16 h-4 rounded bg-stone-100 animate-pulse" />
              </div>
              <div className="w-4 h-4 rounded bg-stone-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
