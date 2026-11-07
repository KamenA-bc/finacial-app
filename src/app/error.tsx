'use client';

import React, { useEffect } from 'react';
import { Alert02Icon, RefreshIcon, Home01Icon } from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
import Link from 'next/link';
import { logError } from '@/lib/errorLogger';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Root Error Boundary for the Next.js App Router.
 * Catches unhandled runtime exceptions within route segments.
 */
export default function ErrorPage({ error, reset }: ErrorProps): React.ReactElement {
    useEffect(() => {
        logError('RootErrorPage', error, { digest: error.digest }, 'error');
    }, [error]);

    return (
        <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col items-center text-center">
                <IconSquircle
                    size="lg"
                    className="bg-rose-50 text-rose-500 border-rose-200/70 mb-3"
                >
                    <AppIcon icon={Alert02Icon} size={20} />
                </IconSquircle>
                <h1 className="text-base font-semibold text-stone-900 mb-1.5 text-balance">
                    Възникна неочаквана грешка
                </h1>
                <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed text-pretty">
                    Приложението срещна неочакван проблем при зареждането на тази страница. Данните Ви
                    в базата са защитени.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                    <button
                        type="button"
                        onClick={reset}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <AppIcon icon={RefreshIcon} size={14} />
                        <span>Презареди страницата</span>
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-transform duration-150 active:scale-[0.97] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <AppIcon icon={Home01Icon} size={14} />
                        <span>Към началото</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
