'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToastStore } from '@/store/toastStore';

const TOAST_DURATION_MS = 2000;
const EXIT_ANIMATION_MS = 220;

/**
 * Ultra-clean, soft muted sage status notification indicator (Option 2).
 * Displays "Успешно добавено" with a rich emerald shrinking timer line.
 * Appears seamlessly from the top, and dismisses smoothly to the bottom.
 */
export const StatusNotification = (): React.ReactElement | null => {
    const { isOpen, message, id, hideToast } = useToastStore();
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

        // 1. Start exit animation after the 2s timer line drains
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

    return (
        <aside
            role="status"
            aria-live="polite"
            onClick={handleDismiss}
            title="Кликнете за затваряне"
            className={`fixed top-16 right-3 sm:top-18 sm:right-6 md:right-8 z-50 flex flex-col bg-emerald-50/95 backdrop-blur-md text-emerald-900 shadow-md shadow-emerald-950/5 border border-emerald-200/90 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer hover:bg-emerald-100/90 transition-colors select-none min-w-[170px] sm:min-w-[200px] ${
                isExiting ? 'animate-toast-out' : 'animate-toast-in'
            }`}
        >
            <div className="px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium tracking-wide text-emerald-900">
                    {message}
                </span>
            </div>

            {/* Emerald 2s shrinking progress timer line */}
            <div
                key={id}
                className="h-[2px] sm:h-[2.5px] w-full bg-emerald-500 animate-drain"
                aria-hidden="true"
            />
        </aside>
    );
};
