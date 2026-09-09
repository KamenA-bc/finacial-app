import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { Loader2 } from 'lucide-react';

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
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-stone-300" />
          </div>
        }
      >
        <DashboardClient />
      </Suspense>
    </DashboardLayout>
  );
}
