'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import { addDays, formatDisplayDate, isToday, isAtPastLimit } from '@/lib/dateUtils';

/** Day-by-day date navigation with a 30-day past limit. */
export const DateNavigator = (): React.ReactElement => {
    const selectedDate = useFinancialStore((s) => s.selectedDate);
    const setSelectedDate = useFinancialStore((s) => s.setSelectedDate);

    const handlePrev = (): void => {
        if (!isAtPastLimit(selectedDate)) {
            setSelectedDate(addDays(selectedDate, -1));
        }
    };

    const handleNext = (): void => {
        if (!isToday(selectedDate)) {
            setSelectedDate(addDays(selectedDate, 1));
        }
    };

    const atLimit = isAtPastLimit(selectedDate);
    const atToday = isToday(selectedDate);

    return (
        <div className="flex items-center justify-between gap-4 py-3 px-1">
            <button
                onClick={handlePrev}
                disabled={atLimit}
                aria-label="Previous day"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 text-gray-700">
                <CalendarDays size={16} className="text-gray-400" />
                <span className="text-sm font-medium tracking-wide">
                    {formatDisplayDate(selectedDate)}
                </span>
                {atToday && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Today
                    </span>
                )}
            </div>

            <button
                onClick={handleNext}
                disabled={atToday}
                aria-label="Next day"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};
