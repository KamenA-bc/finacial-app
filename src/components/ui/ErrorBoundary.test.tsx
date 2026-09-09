import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from './ErrorBoundary';
import * as errorLogger from '@/lib/errorLogger';

// Component that intentionally throws
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }): React.ReactElement => {
    if (shouldThrow) {
        throw new Error('Crashing chart render');
    }
    return <div>Normal Content</div>;
};

describe('ErrorBoundary', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Suppress React's internal console.error during deliberate error boundary tests
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(errorLogger, 'logError').mockImplementation(() => {});
    });

    it('renders child content normally when no error occurs', () => {
        render(
            <ErrorBoundary>
                <BuggyComponent shouldThrow={false} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Normal Content')).toBeInTheDocument();
    });

    it('catches render errors, displays fallback UI, and logs to errorLogger', () => {
        render(
            <ErrorBoundary fallbackTitle="Срив в графиката" actionName="ChartBoundaryTest">
                <BuggyComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Срив в графиката')).toBeInTheDocument();
        expect(screen.getByText('Crashing chart render')).toBeInTheDocument();
        expect(screen.getByText('Опитай отново')).toBeInTheDocument();

        expect(errorLogger.logError).toHaveBeenCalledWith(
            'ChartBoundaryTest',
            expect.any(Error),
            expect.objectContaining({
                componentStack: expect.any(String),
            }),
            'error'
        );
    });

    it('supports custom function fallback', () => {
        render(
            <ErrorBoundary
                fallback={({ error, reset }) => (
                    <div>
                        <span>Custom Error: {error.message}</span>
                        <button onClick={reset}>Custom Reset</button>
                    </div>
                )}
            >
                <BuggyComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom Error: Crashing chart render')).toBeInTheDocument();
        expect(screen.getByText('Custom Reset')).toBeInTheDocument();
    });

    it('re-renders children when reset button is clicked', () => {
        let throwFlag = true;
        const DynamicComponent = () => {
            if (throwFlag) throw new Error('First crash');
            return <div>Recovered Content</div>;
        };

        render(
            <ErrorBoundary>
                <DynamicComponent />
            </ErrorBoundary>
        );

        expect(screen.getByRole('alert')).toBeInTheDocument();

        // Fix the condition before clicking reset
        throwFlag = false;
        fireEvent.click(screen.getByText('Опитай отново'));

        expect(screen.getByText('Recovered Content')).toBeInTheDocument();
    });
});
