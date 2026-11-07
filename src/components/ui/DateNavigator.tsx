'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar01Icon,
} from '@hugeicons/core-free-icons';
import { AppIcon } from '@/components/ui/AppIcon';
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
    const [manualDate, setManualDate] = useState('');
    const [manualError, setManualError] = useState('');

    // Calendar view state (which month/year the popup shows)
    const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
    const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());
    const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());

    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const closeCalendar = useCallback((): void => {
        setCalendarOpen(false);
        setManualDate('');
        setManualError('');
    }, []);

    // Reset view to selected date's month when opening
    const openCalendar = useCallback((): void => {
        const d = new Date(`${selectedDate}T00:00:00`);
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
        setCalendarOpen(true);
    }, [selectedDate, setViewMonth, setViewYear]);

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
                closeCalendar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [calendarOpen, closeCalendar]);

    // Close on Escape key
    useEffect(() => {
        if (!calendarOpen) return;

        const handleEsc = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') closeCalendar();
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [calendarOpen, closeCalendar]);

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

        if (viewMonth === 0) {
            setViewYear((y) => y - 1);
            setViewMonth(11);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goToNextMonth = (): void => {
        const now = new Date();
        const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
        const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

        if (nextYear > now.getFullYear() || (nextYear === now.getFullYear() && nextMonth > now.getMonth())) {
            return;
        }

        if (viewMonth === 11) {
            setViewYear((y) => y + 1);
            setViewMonth(0);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const handleDayClick = (day: CalendarDay): void => {
        if (!day.isSelectable) return;
        setSelectedDate(day.date);
        closeCalendar();
    };

    const handleTodayClick = (): void => {
        setSelectedDate(todayString());
        closeCalendar();
    };

    const handleManualSubmit = (): void => {
        setManualError('');
        const trimmed = manualDate.trim();
        if (!trimmed) return;

        const parts = trimmed.split('/');
        if (parts.length !== 3) {
            setManualError('Формат: ДД/ММ/ГГГГ');
            return;
        }

        const [d, m, y] = parts;
        const day = parseInt(d, 10);
        const month = parseInt(m, 10) - 1; // 0-indexed
        let year = parseInt(y, 10);

        if (year > 0 && year < 100) year += 2000;

        const dateObj = new Date(year, month, day);
        if (isNaN(dateObj.getTime()) || dateObj.getDate() !== day || dateObj.getMonth() !== month) {
            setManualError('Невалидна дата');
            return;
        }

        const iso = toISODateString(dateObj);
        const today = todayString();
        const minDate = daysAgoString(MAX_PAST_DAYS);

        if (iso > today) {
            setManualError('Не може да е в бъдещето');
            return;
        }

        if (iso < minDate) {
            setManualError(`Максимум 2 години назад`);
            return;
        }

        setSelectedDate(iso);
        closeCalendar();
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
                className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-100/70 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
            >
                <AppIcon icon={ArrowLeft01Icon} size={18} />
            </button>

            {/* Date label – clickable to open calendar */}
            <button
                ref={triggerRef}
                onClick={() => (calendarOpen ? closeCalendar() : openCalendar())}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100/60 transition-transform duration-150 active:scale-[0.98] cursor-pointer group focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                aria-label="Отвори календар"
                aria-expanded={calendarOpen}
                id="date-navigator-trigger"
            >
                <AppIcon
                    icon={Calendar01Icon}
                    size={16}
                    className="text-stone-400 group-hover:text-emerald-600 transition-colors"
                />
                <span className="text-sm font-semibold tracking-tight tabular-nums underline decoration-dashed decoration-stone-300 underline-offset-4 group-hover:decoration-emerald-400 transition-colors">
                    {formatDisplayDate(selectedDate)}
                </span>
                {atToday && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                        Днес
                    </span>
                )}
            </button>

            {/* → Next day */}
            <button
                onClick={handleNext}
                disabled={atToday}
                aria-label="Следващ ден"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-100/70 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
            >
                <AppIcon icon={ArrowRight01Icon} size={18} />
            </button>

            {/* ── Calendar Popover ────────────────────────────────────────── */}
            {calendarOpen && (
                <div
                    ref={popoverRef}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 origin-top bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 w-[300px] animate-[fadeSlideIn_150ms_cubic-bezier(0.23,1,0.32,1)]"
                    role="dialog"
                    aria-label="Избор на дата"
                    id="date-navigator-calendar"
                >
                    {/* Month/year header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={goToPrevMonth}
                            disabled={!canGoPrevMonth}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-transform duration-150 active:scale-[0.97] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                            aria-label="Предишен месец"
                        >
                            <AppIcon icon={ArrowLeft01Icon} size={16} />
                        </button>
                        <span className="text-sm font-semibold text-stone-800 tabular-nums">
                            {MONTH_NAMES_SHORT[viewMonth]} {viewYear}
                        </span>
                        <button
                            onClick={goToNextMonth}
                            disabled={!canGoNextMonth}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-transform duration-150 active:scale-[0.97] cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                            aria-label="Следващ месец"
                        >
                            <AppIcon icon={ArrowRight01Icon} size={16} />
                        </button>
                    </div>

                    {/* Weekday header */}
                    <div className="grid grid-cols-7 gap-0 mb-1">
                        {WEEKDAY_LABELS.map((day) => (
                            <div
                                key={day}
                                className="text-center text-[10px] font-semibold text-stone-400 uppercase tracking-wider py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-0">
                        {calendarGrid.map((day) => {
                            const base = 'flex items-center justify-center w-9 h-9 rounded-full text-xs tabular-nums transition-transform duration-100 active:scale-[0.96] mx-auto focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none';

                            let classes = base;

                            if (day.isSelected) {
                                classes += ' bg-stone-900 text-white font-semibold shadow-2xs';
                            } else if (day.isToday) {
                                classes += ' border-2 border-emerald-400 text-emerald-700 font-semibold';
                            } else if (day.isSelectable && day.isCurrentMonth) {
                                classes += ' text-stone-700 hover:bg-stone-100 cursor-pointer font-medium';
                            } else if (day.isSelectable && !day.isCurrentMonth) {
                                classes += ' text-stone-300 hover:bg-stone-50 cursor-pointer';
                            } else if (!day.isSelectable && day.isCurrentMonth) {
                                classes += ' text-stone-200 cursor-not-allowed';
                            } else {
                                classes += ' text-stone-200 cursor-not-allowed opacity-40';
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

                    {/* Manual Input Footer */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                        <label
                            htmlFor="date-navigator-manual-input"
                            className="block text-xs text-stone-400 font-medium mb-1.5 px-1"
                        >
                            Въведете дата (ДД/ММ/ГГГГ)
                        </label>
                        <div className="flex gap-2 items-center px-1">
                            <input
                                id="date-navigator-manual-input"
                                type="text"
                                placeholder="напр. 25/12/2023"
                                value={manualDate}
                                onChange={(e) => setManualDate(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                                className="flex-1 w-full px-2.5 py-1.5 text-xs text-stone-800 placeholder-stone-400 bg-stone-50/70 border border-stone-200 rounded-lg focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 tabular-nums transition-all"
                            />
                            <button
                                onClick={handleManualSubmit}
                                className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-transform duration-150 active:scale-[0.97] cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                            >
                                Отиди
                            </button>
                        </div>
                        {manualError && (
                            <p className="text-[10px] text-rose-500 mt-1.5 px-1 font-medium">
                                {manualError}
                            </p>
                        )}
                    </div>

                    {/* Footer: Today button */}
                    <div className="mt-2 pt-2 border-t border-stone-100 flex justify-center">
                        <button
                            onClick={handleTodayClick}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-transform duration-150 active:scale-[0.98] cursor-pointer w-full focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                        >
                            Отиди на Днес
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
