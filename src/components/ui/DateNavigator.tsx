'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
} from 'lucide-react';
import { useFinancialStore } from '@/store/transactionStore';
import {
    addDays,
    formatDisplayDate,
    isToday,
    isAtPastLimit,
    toISODateString,
    todayString,
    daysAgoString,
} from '@/lib/dateUtils';
import { MAX_PAST_DAYS } from '@/lib/constants';

// ── Constants ────────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;

const MONTH_NAMES_SHORT = [
    'Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни',
    'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек',
] as const;

// ── Calendar Grid Builder ────────────────────────────────────────────────────

interface CalendarDay {
    /** ISO date string YYYY-MM-DD */
    date: string;
    /** Day of the month number */
    dayNum: number;
    /** Whether this day belongs to the currently displayed month */
    isCurrentMonth: boolean;
    /** Whether this date is selectable (within allowed range) */
    isSelectable: boolean;
    /** Whether this is today's date */
    isToday: boolean;
    /** Whether this is the currently selected date */
    isSelected: boolean;
}

const buildCalendarGrid = (
    viewYear: number,
    viewMonth: number,
    selectedDate: string,
): CalendarDay[] => {
    const today = todayString();
    const minDate = daysAgoString(MAX_PAST_DAYS);

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDow = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Previous month fill
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const grid: CalendarDay[] = [];

    // Leading days from previous month
    for (let i = startDow - 1; i >= 0; i--) {
        const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
        const iso = toISODateString(d);
        grid.push({
            date: iso,
            dayNum: d.getDate(),
            isCurrentMonth: false,
            isSelectable: iso >= minDate && iso <= today,
            isToday: iso === today,
            isSelected: iso === selectedDate,
        });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(viewYear, viewMonth, day);
        const iso = toISODateString(d);
        grid.push({
            date: iso,
            dayNum: day,
            isCurrentMonth: true,
            isSelectable: iso >= minDate && iso <= today,
            isToday: iso === today,
            isSelected: iso === selectedDate,
        });
    }

    // Trailing days from next month to fill to 6 rows (42 cells)
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(viewYear, viewMonth + 1, i);
        const iso = toISODateString(d);
        grid.push({
            date: iso,
            dayNum: i,
            isCurrentMonth: false,
            isSelectable: iso >= minDate && iso <= today,
            isToday: iso === today,
            isSelected: iso === selectedDate,
        });
    }

    return grid;
};

// ── Component ────────────────────────────────────────────────────────────────

/** Day-by-day date navigation with a clickable calendar popup. */
export const DateNavigator = (): React.ReactElement => {
    const selectedDate = useFinancialStore((s) => s.selectedDate);
    const setSelectedDate = useFinancialStore((s) => s.setSelectedDate);

    const [calendarOpen, setCalendarOpen] = useState(false);

    // Calendar view state (which month/year the popup shows)
    const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
    const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());
    const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());

    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Reset view to selected date's month when opening
    const openCalendar = useCallback((): void => {
        const d = new Date(`${selectedDate}T00:00:00`);
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
        setCalendarOpen(true);
    }, [selectedDate]);

    // Close on click outside
    useEffect(() => {
        if (!calendarOpen) return;

        const handleClickOutside = (e: MouseEvent): void => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [calendarOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!calendarOpen) return;

        const handleEsc = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') setCalendarOpen(false);
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [calendarOpen]);

    // ── Arrow navigation ────────────────────────────────────────────────────

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

    // ── Calendar month navigation ───────────────────────────────────────────

    const goToPrevMonth = (): void => {
        const minDateStr = daysAgoString(MAX_PAST_DAYS);
        const minDateObj = new Date(`${minDateStr}T00:00:00`);
        const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
        const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;

        if (prevYear < minDateObj.getFullYear() || (prevYear === minDateObj.getFullYear() && prevMonth < minDateObj.getMonth())) {
            return;
        }

        setViewMonth((prev) => {
            if (prev === 0) {
                setViewYear((y) => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const goToNextMonth = (): void => {
        const now = new Date();
        const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
        const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
        // Don't go past current month
        if (nextYear > now.getFullYear() || (nextYear === now.getFullYear() && nextMonth > now.getMonth())) {
            return;
        }
        setViewMonth(nextMonth);
        if (viewMonth === 11) setViewYear((y) => y + 1);
    };

    const handleDayClick = (day: CalendarDay): void => {
        if (!day.isSelectable) return;
        setSelectedDate(day.date);
        setCalendarOpen(false);
    };

    const handleTodayClick = (): void => {
        setSelectedDate(todayString());
        setCalendarOpen(false);
    };

    // ── Derived state ───────────────────────────────────────────────────────

    const atLimit = isAtPastLimit(selectedDate);
    const atToday = isToday(selectedDate);

    const now = new Date();
    const canGoNextMonth = !(
        viewYear > now.getFullYear() ||
        (viewYear === now.getFullYear() && viewMonth >= now.getMonth())
    );

    const minDateStr = daysAgoString(MAX_PAST_DAYS);
    const minDateObj = new Date(`${minDateStr}T00:00:00`);
    const canGoPrevMonth = !(
        viewYear < minDateObj.getFullYear() ||
        (viewYear === minDateObj.getFullYear() && viewMonth <= minDateObj.getMonth())
    );

    const calendarGrid = calendarOpen
        ? buildCalendarGrid(viewYear, viewMonth, selectedDate)
        : [];

    return (
        <div className="relative flex items-center justify-between gap-4 py-3 px-1">
            {/* ← Previous day */}
            <button
                onClick={handlePrev}
                disabled={atLimit}
                aria-label="Предишен ден"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Date label – clickable to open calendar */}
            <button
                ref={triggerRef}
                onClick={() => (calendarOpen ? setCalendarOpen(false) : openCalendar())}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer group"
                aria-label="Отвори календар"
                aria-expanded={calendarOpen}
                id="date-navigator-trigger"
            >
                <CalendarDays
                    size={16}
                    className="text-gray-400 group-hover:text-emerald-500 transition-colors"
                />
                <span className="text-sm font-medium tracking-wide underline decoration-dashed decoration-gray-300 underline-offset-4 group-hover:decoration-emerald-400 transition-colors">
                    {formatDisplayDate(selectedDate)}
                </span>
                {atToday && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Днес
                    </span>
                )}
            </button>

            {/* → Next day */}
            <button
                onClick={handleNext}
                disabled={atToday}
                aria-label="Следващ ден"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={18} />
            </button>

            {/* ── Calendar Popover ────────────────────────────────────────── */}
            {calendarOpen && (
                <div
                    ref={popoverRef}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-[300px] animate-[fadeSlideIn_150ms_ease-out]"
                    role="dialog"
                    aria-label="Избор на дата"
                    id="date-navigator-calendar"
                >
                    {/* Month/year header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={goToPrevMonth}
                            disabled={!canGoPrevMonth}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Предишен месец"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-semibold text-gray-700 tabular-nums">
                            {MONTH_NAMES_SHORT[viewMonth]} {viewYear}
                        </span>
                        <button
                            onClick={goToNextMonth}
                            disabled={!canGoNextMonth}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Следващ месец"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Weekday header */}
                    <div className="grid grid-cols-7 gap-0 mb-1">
                        {WEEKDAY_LABELS.map((day) => (
                            <div
                                key={day}
                                className="text-center text-[10px] font-medium text-gray-400 uppercase tracking-wider py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-0">
                        {calendarGrid.map((day) => {
                            const base = 'flex items-center justify-center w-9 h-9 rounded-full text-xs transition-all duration-100 mx-auto';

                            let classes = base;

                            if (day.isSelected) {
                                classes += ' bg-gray-900 text-white font-semibold';
                            } else if (day.isToday) {
                                classes += ' border-2 border-emerald-400 text-emerald-600 font-semibold';
                            } else if (day.isSelectable && day.isCurrentMonth) {
                                classes += ' text-gray-700 hover:bg-gray-100 cursor-pointer font-medium';
                            } else if (day.isSelectable && !day.isCurrentMonth) {
                                classes += ' text-gray-300 hover:bg-gray-50 cursor-pointer';
                            } else if (!day.isSelectable && day.isCurrentMonth) {
                                classes += ' text-gray-200 cursor-not-allowed';
                            } else {
                                classes += ' text-gray-150 cursor-not-allowed opacity-40';
                            }

                            return (
                                <button
                                    key={day.date}
                                    onClick={() => handleDayClick(day)}
                                    disabled={!day.isSelectable}
                                    className={classes}
                                    aria-label={day.date}
                                >
                                    {day.dayNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer: Today button */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={handleTodayClick}
                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                            Отиди на Днес
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
