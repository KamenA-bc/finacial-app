'use client';

import React from 'react';
import { Wallet, LogOut, History, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { StatusNotification } from '@/components/ui/StatusNotification';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

/**
 * Responsive shell for the dashboard.
 * Includes navigation links, user email display, and sign-out button.
 */
export const DashboardLayout = ({
    children,
}: DashboardLayoutProps): React.ReactElement => {
    const { user, signOut } = useAuth();
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Табло' },
        { href: '/history', label: 'История', icon: <History size={14} /> },
        { href: '/statistics', label: 'Статистика', icon: <BarChart3 size={14} /> },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-stone-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2">
                    {/* Logo */}
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 shadow-xs flex-shrink-0">
                        <Wallet size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-stone-900 tracking-tight hidden sm:block">
                        Finance Tracker
                    </span>

                    {/* Navigation */}
                    <nav className="flex items-center gap-0.5 sm:gap-1 ml-2 sm:ml-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                        isActive
                                            ? 'bg-stone-100 text-stone-900 shadow-2xs ring-1 ring-black/5'
                                            : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: user + sign out */}
                    <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                        {user && (
                            <span className="text-xs text-stone-500 hidden sm:block truncate max-w-[180px]">
                                {user.email}
                            </span>
                        )}
                        <button
                            onClick={signOut}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 transition-colors cursor-pointer"
                            aria-label="Изход"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline">Изход</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Global Status Notification */}
            <StatusNotification />

            {/* Page body */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
};
