import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistorySkeleton } from './HistorySkeleton';

describe('HistorySkeleton', () => {
  it('renders with appropriate ARIA accessibility attributes', () => {
    const { container } = render(<HistorySkeleton />);
    const root = container.firstChild as HTMLElement;

    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Зареждане на история...');
  });

  it('renders pulsing skeleton elements for annual summary and month cards', () => {
    const { container } = render(<HistorySkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');

    // Should have multiple pulse elements matching year selector, annual summary, and 6 month cards
    expect(pulseElements.length).toBeGreaterThan(15);
  });
});
