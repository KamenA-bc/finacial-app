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
            if (
                filename.includes('/api/log-error') ||
                msg.includes('/api/log-error') ||
                filename.startsWith('chrome-extension://') ||
                filename.startsWith('moz-extension://') ||
                filename.startsWith('safari-extension://') ||
                msg.includes('ResizeObserver loop')
            ) {
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

            // 1. Ignore empty rejections (reason === undefined | null) which provide no diagnostics
            if (reason === undefined || reason === null) {
                return;
            }

            const msg = typeof reason === 'string' ? reason : reason?.message || '';
            const stack =
                typeof reason === 'object' && reason !== null && 'stack' in reason
                    ? String((reason as { stack: unknown }).stack || '')
                    : '';

            // 2. Guard against cyclic recursion from telemetry logging
            if (msg.includes('/api/log-error')) {
                return;
            }

            // 3. Filter out browser extension noise and benign DOM notifications
            if (
                stack.includes('chrome-extension://') ||
                stack.includes('moz-extension://') ||
                stack.includes('safari-extension://') ||
                msg.includes('ResizeObserver loop')
            ) {
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
