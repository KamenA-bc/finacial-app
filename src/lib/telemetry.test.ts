import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateMetricRating, recordWebVital, getTelemetrySessionId } from './telemetry';

describe('telemetry - Core Web Vitals & Real-User Monitoring', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('calculateMetricRating', () => {
        it('rates CLS correctly according to Google thresholds', () => {
            expect(calculateMetricRating('CLS', 0.05)).toBe('good');
            expect(calculateMetricRating('CLS', 0.1)).toBe('good');
            expect(calculateMetricRating('CLS', 0.15)).toBe('needs-improvement');
            expect(calculateMetricRating('CLS', 0.25)).toBe('needs-improvement');
            expect(calculateMetricRating('CLS', 0.35)).toBe('poor');
        });

        it('rates LCP correctly according to Google thresholds', () => {
            expect(calculateMetricRating('LCP', 2100)).toBe('good');
            expect(calculateMetricRating('LCP', 2500)).toBe('good');
            expect(calculateMetricRating('LCP', 3200)).toBe('needs-improvement');
            expect(calculateMetricRating('LCP', 4000)).toBe('needs-improvement');
            expect(calculateMetricRating('LCP', 4200)).toBe('poor');
        });

        it('rates INP correctly according to Google thresholds', () => {
            expect(calculateMetricRating('INP', 150)).toBe('good');
            expect(calculateMetricRating('INP', 200)).toBe('good');
            expect(calculateMetricRating('INP', 350)).toBe('needs-improvement');
            expect(calculateMetricRating('INP', 500)).toBe('needs-improvement');
            expect(calculateMetricRating('INP', 600)).toBe('poor');
        });

        it('rates FCP correctly', () => {
            expect(calculateMetricRating('FCP', 1200)).toBe('good');
            expect(calculateMetricRating('FCP', 2400)).toBe('needs-improvement');
            expect(calculateMetricRating('FCP', 3500)).toBe('poor');
        });

        it('rates TTFB correctly', () => {
            expect(calculateMetricRating('TTFB', 500)).toBe('good');
            expect(calculateMetricRating('TTFB', 1200)).toBe('needs-improvement');
            expect(calculateMetricRating('TTFB', 2200)).toBe('poor');
        });
    });

    describe('recordWebVital', () => {
        it('creates a structured event with rounded values and attached sessionId', () => {
            const event = recordWebVital({
                id: 'v4-test-1',
                name: 'LCP',
                value: 1234.5678,
                delta: 1234.5678,
                navigationType: 'navigate',
            });

            expect(event.id).toBe('v4-test-1');
            expect(event.name).toBe('LCP');
            expect(event.value).toBe(1234.57);
            expect(event.delta).toBe(1234.57);
            expect(event.rating).toBe('good');
            expect(event.sessionId).toBeDefined();
            expect(event.timestamp).toBeGreaterThan(0);
        });
    });

    describe('getTelemetrySessionId', () => {
        it('returns a non-empty string sessionId', () => {
            const sessionId = getTelemetrySessionId();
            expect(typeof sessionId).toBe('string');
            expect(sessionId.length).toBeGreaterThan(0);
        });
    });
});
