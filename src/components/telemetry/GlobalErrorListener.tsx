'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/errorLogger';

/**
 * Global Level-1 Browser Runtime Error & Unhandled Rejection Interceptor.
 *
 * Catches:
 * 1. Uncaught script exceptions and errors inside event handlers (which bypass React Error Boundaries).
 * 2. Unhandled Promise rejections from un-awaited background promises.
 *
 * Guards against cyclic recursion by ignoring failures originating from the error-logging pipeline itself.
 */
export function GlobalErrorListener(): null {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleError = (event: ErrorEvent): void => {
            // Guard against cyclic recursion if the log-error endpoint or logger fails
            const filename = event.filename || '';
            const msg = event.message || '';
            if (filename.includes('/api/log-error') || msg.includes('/api/log-error')) {
                return;
            }

            logError(
                'WindowError',
                event.error ?? event.message,
                {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                },
                'error'
            );
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
            const reason = event.reason;
            const msg = typeof reason === 'string' ? reason : reason?.message || '';

            if (msg.includes('/api/log-error')) {
                return;
            }

            logError('UnhandledPromiseRejection', reason, {}, 'error');
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);

    return null;
}
