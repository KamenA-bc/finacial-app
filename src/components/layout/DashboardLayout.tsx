'use client';

import React from 'react';
import { Wallet, LogOut, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

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
        { href: '/', label: 'Dashboard' },
        { href: '/history', label: 'History', icon: <History size={14} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2.5">
                    {/* Logo */}
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900">
                        <Wallet size={14} className="text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 tracking-tight">
                        Finance Tracker
                    </span>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 ml-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: user + sign out */}
                    <div className="ml-auto flex items-center gap-3">
                        {user && (
                            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[160px]">
                                {user.email}
                            </span>
                        )}
                        <button
                            onClick={signOut}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            aria-label="Sign out"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Page body */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
};
