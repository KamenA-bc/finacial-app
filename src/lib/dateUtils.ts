/**
 * Date utility helpers – all date logic lives here.
 * No magic numbers: use constants from constants.ts.
 */

import { MAX_PAST_DAYS, MONTH_NAMES_BG } from '@/lib/constants';

/** Convert a Date object to a local ISO date string: YYYY-MM-DD.
 *  Uses local date accessors (not toISOString which is always UTC).
 */
export const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/** Return today's date as an ISO date string. */
export const todayString = (): string => toISODateString(new Date());

/** Return the ISO date string for the date N days ago from today. */
export const daysAgoString = (n: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return toISODateString(d);
};

/** Increment an ISO date string by one day. */
export const addDays = (dateStr: string, delta: number): string => {
    const d = new Date(`${dateStr}T00:00:00`);
    d.setDate(d.getDate() + delta);
    return toISODateString(d);
};

/** Format an ISO date string for human display (e.g. "Tuesday, Feb 24"). */
export const formatDisplayDate = (dateStr: string): string => {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString('bg-BG', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });
};

/** Return true if the given ISO date string is today. */
export const isToday = (dateStr: string): boolean =>
    dateStr === todayString();

/** Return true if navigating back one more day would exceed the limit. */
export const isAtPastLimit = (dateStr: string): boolean => {
    const limit = daysAgoString(MAX_PAST_DAYS);
    return dateStr <= limit;
};

// ── History-page helpers ─────────────────────────────────────────────────────

/** Return the full name of a month (0-indexed). */
export const getMonthName = (month: number): string => MONTH_NAMES_BG[month];

/** Return the number of days in a given month (1-indexed month). */
export const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month, 0).getDate();

/**
 * Return the first and last ISO date strings for a calendar month.
 * @param year - Full year, e.g. 2026
 * @param month - 0-indexed month (0 = January, 11 = December)
 */
export const getMonthRange = (
    year: number,
    month: number
): { start: string; end: string } => {
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { start, end };
};

/**
 * Get the calendar month range for a given ISO date string.
 * Returns { start: 'YYYY-MM-01', end: 'YYYY-MM-DD' }.
 */
export const getCalendarMonthRange = (
    dateStr: string
): { start: string; end: string } => {
    const d = new Date(`${dateStr}T00:00:00`);
    return getMonthRange(d.getFullYear(), d.getMonth());
};

/**
 * Get the calendar year range for a given ISO date string.
 * Returns { start: 'YYYY-01-01', end: 'YYYY-12-31' }.
 */
export const getCalendarYearRange = (
    dateStr: string
): { start: string; end: string } => {
    const d = new Date(`${dateStr}T00:00:00`);
    const year = d.getFullYear();
    return {
        start: `${year}-01-01`,
        end: `${year}-12-31`,
    };
};
