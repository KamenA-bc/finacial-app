'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
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
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3">
                    <AlertTriangle size={24} />
                </div>
                <h1 className="text-base font-semibold text-stone-900 mb-1.5">
                    Възникна неочаквана грешка
                </h1>
                <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
                    Приложението срещна неочакван проблем при зареждането на тази страница. Данните Ви
                    в базата са защитени.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                    <button
                        type="button"
                        onClick={reset}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                    >
                        <RefreshCw size={14} />
                        <span>Презареди страницата</span>
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 active:scale-[0.99] transition-all cursor-pointer"
                    >
                        <Home size={14} />
                        <span>Към началото</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
