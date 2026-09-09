'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToastStore } from '@/store/toastStore';

const TOAST_DURATION_MS = 3000;
const EXIT_ANIMATION_MS = 260;

/**
 * Ultra-clean, soft muted sage status notification indicator (Option 2).
 * Displays "Успешно добавено" with a rich emerald shrinking timer line.
 * Appears seamlessly from the top, and dismisses smoothly to the bottom.
 */
export const StatusNotification = (): React.ReactElement | null => {
    const { isOpen, message, variant, id, hideToast } = useToastStore();
    const [isExiting, setIsExiting] = useState(false);
    const timersRef = useRef<NodeJS.Timeout[]>([]);

    const clearActiveTimers = useCallback(() => {
        timersRef.current.forEach((t) => clearTimeout(t));
        timersRef.current = [];
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsExiting(false);
            clearActiveTimers();
            return;
        }

        setIsExiting(false);
        clearActiveTimers();

        // 1. Start exit animation after the 3s timer line drains
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, TOAST_DURATION_MS);

        // 2. Hide from store after exit animation completes
        const hideTimer = setTimeout(() => {
            hideToast();
            setIsExiting(false);
        }, TOAST_DURATION_MS + EXIT_ANIMATION_MS);

        timersRef.current = [exitTimer, hideTimer];

        return clearActiveTimers;
    }, [isOpen, id, hideToast, clearActiveTimers]);

    const handleDismiss = (): void => {
        if (isExiting) return;
        setIsExiting(true);
        clearActiveTimers();
        const hideTimer = setTimeout(() => {
            hideToast();
            setIsExiting(false);
        }, EXIT_ANIMATION_MS);
        timersRef.current = [hideTimer];
    };

    if (!isOpen) {
        return null;
    }

    const isError = variant === 'error';
    const containerClasses = isError
        ? 'bg-rose-50/95 text-rose-900 border-rose-200/90 hover:bg-rose-100/90 shadow-rose-950/5'
        : 'bg-emerald-50/95 text-emerald-900 border-emerald-200/90 hover:bg-emerald-100/90 shadow-emerald-950/5';
    const timerLineClasses = isError ? 'bg-rose-500' : 'bg-emerald-500';

    return (
        <aside
            role="status"
            aria-live="polite"
            onClick={handleDismiss}
            title="Кликнете за затваряне"
            className={`fixed top-16 right-3 sm:top-18 sm:right-6 md:right-8 z-50 flex flex-col backdrop-blur-md shadow-md border rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-colors select-none min-w-[170px] sm:min-w-[200px] ${containerClasses} ${
                isExiting ? 'animate-toast-out' : 'animate-toast-in'
            }`}
        >
            <div className="px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                    {message}
                </span>
            </div>

            {/* Shrinking progress timer line */}
            <div
                key={id}
                className={`h-[2px] sm:h-[2.5px] w-full animate-drain ${timerLineClasses}`}
                aria-hidden="true"
            />
        </aside>
    );
};
