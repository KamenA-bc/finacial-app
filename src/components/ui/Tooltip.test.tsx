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

    it('shows tooltip content on mouse enter and hides on mouse leave', () => {
        render(
            <Tooltip content="Helper explanation">
                <span>Trigger Label</span>
            </Tooltip>
        );

        const trigger = screen.getByText('Trigger Label');
        fireEvent.mouseEnter(trigger.parentElement?.parentElement ?? trigger);

        expect(screen.getByText('Helper explanation')).toBeInTheDocument();

        fireEvent.mouseLeave(trigger.parentElement?.parentElement ?? trigger);
        expect(screen.queryByText('Helper explanation')).not.toBeInTheDocument();
    });

    it('toggles on click (tap-to-inspect for mobile users)', () => {
        render(
            <Tooltip content="Mobile explanation">
                <span>Mobile Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');
        
        // Tap to open
        fireEvent.click(button);
        expect(screen.getByText('Mobile explanation')).toBeInTheDocument();

        // Tap to close
        fireEvent.click(button);
        expect(screen.queryByText('Mobile explanation')).not.toBeInTheDocument();
    });

    it('dismisses tooltip on click outside', () => {
        render(
            <div>
                <span data-testid="outside">Outside area</span>
                <Tooltip content="Dismissible text">
                    <span>Inspect</span>
                </Tooltip>
            </div>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Dismissible text')).toBeInTheDocument();

        // Click outside
        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(screen.queryByText('Dismissible text')).not.toBeInTheDocument();
    });

    it('dismisses tooltip on Escape key', () => {
        render(
            <Tooltip content="Key dismiss text">
                <span>Key Trigger</span>
            </Tooltip>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Key dismiss text')).toBeInTheDocument();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('Key dismiss text')).not.toBeInTheDocument();
    });
});
