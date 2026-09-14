import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HistorySkeleton } from '@/components/history/HistorySkeleton';

/**
 * Next.js App Router streaming loading state for the History page.
 * Instantly renders page layout and skeleton during route transitions.
 */
export default function HistoryLoading(): React.ReactElement {
  return (
    <DashboardLayout>
      <HistorySkeleton />
    </DashboardLayout>
  );
}
