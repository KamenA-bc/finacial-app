import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

/**
 * Root Next.js App Router streaming loading fallback.
 * Instantly renders page layout and skeleton during initial page requests and navigation.
 */
export default function RootLoading(): React.ReactElement {
  return (
    <DashboardLayout>
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
