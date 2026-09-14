import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatisticsSkeleton } from '@/components/statistics/StatisticsSkeleton';

/**
 * Next.js App Router streaming loading state for the Statistics page.
 * Instantly renders page layout and skeleton during route transitions.
 */
export default function StatisticsLoading(): React.ReactElement {
  return (
    <DashboardLayout>
      <StatisticsSkeleton />
    </DashboardLayout>
  );
}
