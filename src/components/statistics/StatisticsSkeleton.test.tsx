import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatisticsSkeleton } from './StatisticsSkeleton';

describe('StatisticsSkeleton', () => {
  it('renders with appropriate ARIA accessibility attributes', () => {
    const { container } = render(<StatisticsSkeleton />);
    const root = container.firstChild as HTMLElement;

    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Зареждане на статистика...');
  });

  it('renders pulsing skeleton elements across all 6 statistics sections', () => {
    const { container } = render(<StatisticsSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');

    // Should have multiple pulse elements matching KPI cards, records, chart bars, spending habits, etc.
    expect(pulseElements.length).toBeGreaterThan(20);
  });
});
