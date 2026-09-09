import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'Табло | Finance Tracker',
  description: 'Персонално табло за приходи и разходи с анализ в реално време',
};

/**
 * Main dashboard page – Server Component (RSC).
 * Renders the structural page frame on the server and streams the interactive
 * client dashboard component with React Suspense.
 */
export default function DashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardClient />
      </Suspense>
    </DashboardLayout>
  );
}
