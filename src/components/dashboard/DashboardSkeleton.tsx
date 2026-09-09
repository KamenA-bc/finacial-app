import React from 'react';

/**
 * High-performance instant skeleton for the dashboard.
 * Renders the structural visual layout immediately on SSR and initial mobile page load,
 * eliminating the blank-screen spinner delay.
 */
export function DashboardSkeleton(): React.ReactElement {
  return (
    <div className="w-full select-none" aria-busy="true" aria-label="Зареждане на данни...">
      {/* ── Top Bar Skeleton ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Date navigator outline */}
        <div className="h-10 w-full sm:w-64 bg-white rounded-xl border border-stone-200/70 shadow-2xs flex items-center justify-between px-3">
          <div className="w-5 h-5 rounded-md bg-stone-100 animate-pulse" />
          <div className="w-28 h-4 rounded bg-stone-100 animate-pulse" />
          <div className="w-5 h-5 rounded-md bg-stone-100 animate-pulse" />
        </div>
        {/* Export button outline */}
        <div className="h-10 w-28 self-end sm:self-auto bg-white rounded-xl border border-stone-200/70 shadow-2xs flex items-center justify-center gap-2 px-3">
          <div className="w-4 h-4 rounded bg-stone-100 animate-pulse" />
          <div className="w-12 h-3.5 rounded bg-stone-100 animate-pulse" />
        </div>
      </div>

      {/* ── Profit Counters Card Skeleton ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0 sm:divide-x sm:divide-stone-100">
          {/* Daily Stat */}
          <div className="sm:pr-8 flex-1">
            <div className="h-3 w-24 bg-stone-100 rounded animate-pulse mb-2.5" />
            <div className="h-8 w-40 bg-stone-100 rounded-lg animate-pulse mb-3.5" />
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-24 bg-emerald-50/60 rounded-md border border-emerald-100 animate-pulse" />
              <div className="h-6 w-24 bg-rose-50/60 rounded-md border border-rose-100 animate-pulse" />
            </div>
          </div>

          {/* Monthly Stat */}
          <div className="sm:pl-8 flex-1">
            <div className="h-3 w-28 bg-stone-100 rounded animate-pulse mb-2.5" />
            <div className="h-8 w-44 bg-stone-100 rounded-lg animate-pulse mb-3.5" />
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-24 bg-emerald-50/60 rounded-md border border-emerald-100 animate-pulse" />
              <div className="h-6 w-24 bg-rose-50/60 rounded-md border border-rose-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid Skeleton ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Form Card */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-5">
            <div className="h-3.5 w-32 bg-stone-100 rounded animate-pulse mb-4" />
            {/* Tabs */}
            <div className="h-10 w-full bg-stone-100/70 rounded-xl p-1 flex gap-1 mb-4">
              <div className="flex-1 bg-white rounded-lg shadow-2xs" />
              <div className="flex-1 bg-transparent rounded-lg" />
            </div>
            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <div className="h-10 w-full bg-stone-50 rounded-xl border border-stone-200/60 animate-pulse" />
              <div className="h-10 w-full bg-stone-50 rounded-xl border border-stone-200/60 animate-pulse" />
              <div className="h-10 w-full bg-stone-900/10 rounded-xl animate-pulse mt-1" />
            </div>
          </div>
        </div>

        {/* Right: Chart & Transaction List Cards */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Chart card */}
          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-5 min-h-[260px] flex flex-col items-center justify-center">
            <div className="w-36 h-36 rounded-full border-[10px] border-stone-100 animate-pulse flex items-center justify-center">
              <div className="w-16 h-3 rounded bg-stone-100" />
            </div>
            <div className="w-24 h-3 rounded bg-stone-100 animate-pulse mt-4" />
          </div>

          {/* List card */}
          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col gap-2.5">
            <div className="h-3.5 w-36 bg-stone-100 rounded animate-pulse mb-2" />
            <div className="h-12 w-full bg-stone-50 rounded-xl border border-stone-100 animate-pulse" />
            <div className="h-12 w-full bg-stone-50 rounded-xl border border-stone-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
