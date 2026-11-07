'use client';

import React, { useEffect } from 'react';
import { AlertDiamondIcon, RefreshIcon } from '@hugeicons/core-free-icons';
import { AppIcon, IconSquircle } from '@/components/ui/AppIcon';
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
            <body className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4 font-sans antialiased text-stone-900">
                <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 text-center flex flex-col items-center">
                    <IconSquircle
                        size="lg"
                        className="bg-rose-50 text-rose-600 border-rose-200/70 mb-3"
                    >
                        <AppIcon icon={AlertDiamondIcon} size={20} />
                    </IconSquircle>
                    <h1 className="text-base font-bold text-stone-900 mb-1 text-balance">
                        Критичен проблем
                    </h1>
                    <p className="text-xs text-stone-500 mb-5 leading-relaxed text-pretty">
                        Неуспешно зареждане на основната структура на приложението.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-xs w-full focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <AppIcon icon={RefreshIcon} size={13} />
                        <span>Рестартирай приложението</span>
                    </button>
                </div>
            </body>
        </html>
    );
}
