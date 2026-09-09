'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { recordWebVital } from '@/lib/telemetry';

/**
 * Headless client component that listens to Next.js Web Vitals
 * and reports them to the performance telemetry service.
 */
export function WebVitals(): null {
    useReportWebVitals((metric) => {
        recordWebVital(metric);
    });

    return null;
}
