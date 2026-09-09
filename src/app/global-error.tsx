'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { logError } from '@/lib/errorLogger';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/**
 * Root Layout Global Error Boundary.
 * Replaces the entire document when the root layout itself fails.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps): React.ReactElement {
    useEffect(() => {
        logError('GlobalRootLayoutError', error, { digest: error.digest }, 'error');
    }, [error]);

    return (
        <html lang="bg">
            <body className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans antialiased text-stone-900">
                <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-300/80 shadow-md p-6 text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
                        <AlertOctagon size={24} />
                    </div>
                    <h1 className="text-base font-bold text-stone-900 mb-1">
                        Критичен проблем
                    </h1>
                    <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                        Неуспешно зареждане на основната структура на приложението.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-[0.99] transition-all cursor-pointer shadow-xs w-full"
                    >
                        <RefreshCw size={13} />
                        <span>Рестартирай приложението</span>
                    </button>
                </div>
            </body>
        </html>
    );
}
