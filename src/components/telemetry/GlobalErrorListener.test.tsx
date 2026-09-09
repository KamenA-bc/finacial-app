import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { GlobalErrorListener } from './GlobalErrorListener';
import { logError } from '@/lib/errorLogger';

vi.mock('@/lib/errorLogger', () => ({
    logError: vi.fn(),
    extractErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

describe('GlobalErrorListener – Level 1 Browser Window Interceptors', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('catches uncaught window ErrorEvents and dispatches structured log', () => {
        const { unmount } = render(<GlobalErrorListener />);

        const error = new Error('Uncaught runtime TypeError in event handler');
        const errorEvent = new ErrorEvent('error', {
            error,
            message: error.message,
            filename: 'https://app.example.com/_next/static/chunks/main.js',
            lineno: 42,
            colno: 17,
        });

        window.dispatchEvent(errorEvent);

        expect(logError).toHaveBeenCalledWith(
            'WindowError',
            error,
            expect.objectContaining({
                filename: 'https://app.example.com/_next/static/chunks/main.js',
                lineno: 42,
                colno: 17,
            }),
            'error'
        );

        unmount();
    });

    it('catches unhandled promise rejections and logs with UnhandledPromiseRejection', () => {
        const { unmount } = render(<GlobalErrorListener />);

        const reason = new Error('Network timeout in un-awaited background task');
        const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
            promise: Promise.resolve(),
            reason,
        });

        window.dispatchEvent(rejectionEvent);

        expect(logError).toHaveBeenCalledWith(
            'UnhandledPromiseRejection',
            reason,
            {},
            'error'
        );

        unmount();
    });

    it('prevents cyclic logging by ignoring errors originating from the log-error endpoint', () => {
        const { unmount } = render(<GlobalErrorListener />);

        const recursiveError = new Error('Failed to fetch /api/log-error: 500');
        const errorEvent = new ErrorEvent('error', {
            error: recursiveError,
            message: recursiveError.message,
            filename: '/api/log-error',
        });

        window.dispatchEvent(errorEvent);

        // Must NOT log this to avoid infinite loop
        expect(logError).not.toHaveBeenCalled();

        unmount();
    });

    it('cleans up event listeners when unmounted', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = render(<GlobalErrorListener />);
        unmount();

        expect(removeSpy).toHaveBeenCalledWith('error', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });
});
