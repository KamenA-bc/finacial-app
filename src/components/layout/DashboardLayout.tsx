'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Responsive shell for the dashboard.
 * Mobile: single column stack.
 * Desktop (lg+): persistent header + two-column main grid.
 */
export const DashboardLayout = ({
    children,
}: DashboardLayoutProps): React.ReactElement => (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900">
                    <Wallet size={14} className="text-white" />
                </div>
                <span className="font-semibold text-gray-900 tracking-tight">
                    Finance Tracker
                </span>
            </div>
        </header>

        {/* Page body */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {children}
        </main>
    </div>
);
