/**
 * Client-side Real-User Web Vitals & Performance Telemetry.
 *
 * Captures Core Web Vitals (LCP, INP, CLS, FCP, TTFB) and evaluates them
 * against Google's official Core Web Vitals thresholds.
 */

export type MetricRating = 'good' | 'needs-improvement' | 'poor';

export interface PerformanceMetricEvent {
    id: string;
    name: string;
    value: number;
    delta: number;
    rating: MetricRating;
    navigationType?: string;
    sessionId: string;
    timestamp: number;
}

let activeSessionId: string | null = null;

/**
 * Returns a consistent session ID across page navigations in the current browser tab.
 */
export function getTelemetrySessionId(): string {
    if (activeSessionId) return activeSessionId;
    if (typeof window === 'undefined') return 'server';

    try {
        const stored = sessionStorage.getItem('perf_session_id');
        if (stored) {
            activeSessionId = stored;
            return stored;
        }
        const newId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem('perf_session_id', newId);
        activeSessionId = newId;
        return newId;
    } catch {
        return `fallback_${Date.now()}`;
    }
}

/**
 * Evaluates metric values against Google's official Core Web Vitals thresholds.
 */
export function calculateMetricRating(name: string, value: number): MetricRating {
    switch (name.toUpperCase()) {
        case 'CLS':
            return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        case 'LCP':
            return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        case 'INP':
            return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
        case 'FCP':
            return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        case 'TTFB':
            return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        default:
            return 'good';
    }
}

/**
 * Dispatches or logs a Web Vital performance event.
 */
export function recordWebVital(metric: {
    id: string;
    name: string;
    value: number;
    delta: number;
    navigationType?: string;
}): PerformanceMetricEvent {
    const rating = calculateMetricRating(metric.name, metric.value);
    const event: PerformanceMetricEvent = {
        id: metric.id,
        name: metric.name,
        value: Math.round(metric.value * 100) / 100,
        delta: Math.round(metric.delta * 100) / 100,
        rating,
        navigationType: metric.navigationType,
        sessionId: getTelemetrySessionId(),
        timestamp: Date.now(),
    };

    if (process.env.NODE_ENV !== 'production') {
        const ratingColor =
            rating === 'good' ? '\x1b[32m' : rating === 'needs-improvement' ? '\x1b[33m' : '\x1b[31m';
        console.debug(
            `[Web-Vitals] ${event.name}: ${event.value} (${ratingColor}${event.rating}\x1b[0m)`,
            event
        );
    }

    return event;
}
