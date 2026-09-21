import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Tooltip } from './Tooltip';

describe('Tooltip component', () => {
    it('renders trigger element and keeps content hidden initially', () => {
        render(
            <Tooltip content="Helper explanation">
                <span>Trigger Label</span>
            </Tooltip>
        );

        expect(screen.getByText('Trigger Label')).toBeInTheDocument();
        expect(screen.queryByText('Helper explanation')).not.toBeInTheDocument();
    });

    // BUG REGRESSION TEST: Real browsers fire pointerDown -> focus -> click in sequence.
    // The previous implementation had a bug where focus opened the tooltip and the subsequent
    // click immediately inverted the state to closed, forcing users to click twice.
    it('opens on the FIRST click/tap when browser dispatches pointerDown -> focus -> click', () => {
        render(
            <Tooltip content="First click explanation">
                <span>Metric Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');

        // Simulate exact mobile browser tap / desktop click event cascade
        fireEvent.pointerDown(button);
        fireEvent.focus(button);
        fireEvent.click(button);

        // MUST be visible on the very first click
        expect(screen.getByText('First click explanation')).toBeInTheDocument();

        // Second click closes it
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.queryByText('First click explanation')).not.toBeInTheDocument();
    });

    it('opens on the FIRST tap when browser dispatches touchStart -> focus -> click (mobile fallback)', () => {
        render(
            <Tooltip content="Touch explanation">
                <span>Touch Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');

        // Simulate mobile touch event sequence
        fireEvent.touchStart(button);
        fireEvent.focus(button);
        fireEvent.click(button);

        expect(screen.getByText('Touch explanation')).toBeInTheDocument();

        // Second tap closes it
        fireEvent.touchStart(button);
        fireEvent.click(button);
        expect(screen.queryByText('Touch explanation')).not.toBeInTheDocument();
    });

    it('supports rapid multiple click toggles consistently', () => {
        render(
            <Tooltip content="Rapid toggle explanation">
                <span>Toggle Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');

        // 1st click -> Open
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.getByText('Rapid toggle explanation')).toBeInTheDocument();

        // 2nd click -> Close
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.queryByText('Rapid toggle explanation')).not.toBeInTheDocument();

        // 3rd click -> Open
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.getByText('Rapid toggle explanation')).toBeInTheDocument();

        // 4th click -> Close
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.queryByText('Rapid toggle explanation')).not.toBeInTheDocument();
    });

    it('shows on desktop mouse hover and hides on mouse leave', () => {
        render(
            <Tooltip content="Hover explanation">
                <span>Hover Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');
        const container = button.parentElement!;

        // Pointer enter with mouse pointerType
        fireEvent.pointerEnter(container, { pointerType: 'mouse' });
        expect(screen.getByText('Hover explanation')).toBeInTheDocument();

        // Pointer leave with mouse pointerType
        fireEvent.pointerLeave(container, { pointerType: 'mouse' });
        expect(screen.queryByText('Hover explanation')).not.toBeInTheDocument();
    });

    it('does NOT trigger hover state on touch pointerEnter events', () => {
        render(
            <Tooltip content="Touch hover should not trigger">
                <span>Touch Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');
        const container = button.parentElement!;

        // Emulate mobile browser firing pointerEnter during touch
        fireEvent.pointerEnter(container, { pointerType: 'touch' });
        expect(screen.queryByText('Touch hover should not trigger')).not.toBeInTheDocument();
    });

    it('shows on keyboard focus (Tab) and hides on blur (Shift+Tab / Tab away)', () => {
        render(
            <Tooltip content="Keyboard accessible explanation">
                <span>Keyboard Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');

        // Pure keyboard navigation: focus without pointerDown
        fireEvent.focus(button);
        expect(screen.getByText('Keyboard accessible explanation')).toBeInTheDocument();

        // Tab away: blur hides it
        fireEvent.blur(button);
        expect(screen.queryByText('Keyboard accessible explanation')).not.toBeInTheDocument();
    });

    it('toggles via Enter key and Space key for keyboard users', () => {
        render(
            <Tooltip content="Key toggle explanation">
                <span>Key Toggle Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');

        // Press Enter to open
        fireEvent.keyDown(button, { key: 'Enter' });
        expect(screen.getByText('Key toggle explanation')).toBeInTheDocument();

        // Press Enter to close
        fireEvent.keyDown(button, { key: 'Enter' });
        expect(screen.queryByText('Key toggle explanation')).not.toBeInTheDocument();

        // Press Space to open
        fireEvent.keyDown(button, { key: ' ' });
        expect(screen.getByText('Key toggle explanation')).toBeInTheDocument();

        // Press Space to close
        fireEvent.keyDown(button, { key: ' ' });
        expect(screen.queryByText('Key toggle explanation')).not.toBeInTheDocument();
    });

    it('dismisses tooltip on click outside via pointerDown, mouseDown, and touchStart', () => {
        render(
            <div>
                <span data-testid="outside">Outside area</span>
                <Tooltip content="Dismissible text">
                    <span>Inspect</span>
                </Tooltip>
            </div>
        );

        const button = screen.getByRole('button');
        const outside = screen.getByTestId('outside');

        // Open with click
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.getByText('Dismissible text')).toBeInTheDocument();

        // PointerDown outside dismisses
        fireEvent.pointerDown(outside);
        expect(screen.queryByText('Dismissible text')).not.toBeInTheDocument();

        // Re-open with click
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.getByText('Dismissible text')).toBeInTheDocument();

        // TouchStart outside dismisses
        fireEvent.touchStart(outside);
        expect(screen.queryByText('Dismissible text')).not.toBeInTheDocument();
    });

    it('dismisses tooltip on Escape key', () => {
        render(
            <Tooltip content="Key dismiss text">
                <span>Key Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');
        fireEvent.pointerDown(button);
        fireEvent.click(button);
        expect(screen.getByText('Key dismiss text')).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('Key dismiss text')).not.toBeInTheDocument();
    });

    it('renders with custom triggerClassName and triggerAriaLabel for expanded touch targets', () => {
        render(
            <Tooltip
                content="Extended touch content"
                triggerClassName="w-full h-full p-4 custom-class"
                triggerAriaLabel="Custom touch label"
            >
                <div>Cell Content</div>
            </Tooltip>
        );

        const button = screen.getByRole('button', { name: 'Custom touch label' });
        expect(button).toBeInTheDocument();
        expect(button.className).toContain('w-full');
        expect(button.className).toContain('custom-class');
    });
});
