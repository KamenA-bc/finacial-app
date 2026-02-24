/**
 * Date utility helpers – all date logic lives here.
 * No magic numbers: use constants from constants.ts.
 */

import { MAX_PAST_DAYS } from '@/lib/constants';

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
    return d.toLocaleDateString('en-US', {
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
