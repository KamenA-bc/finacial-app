'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { logError } from '@/lib/errorLogger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode);
    actionName?: string;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Reusable React Error Boundary.
 * Catches JavaScript runtime exceptions in child component subtrees,
 * logs them to the centralized error telemetry service, and presents a
 * graceful recovery UI instead of crashing the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logError(
            this.props.actionName ?? 'ErrorBoundary',
            error,
            { componentStack: errorInfo.componentStack ?? 'no-stack' },
            'error'
        );
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }

        if (typeof this.props.fallback === 'function') {
            return this.props.fallback({
                error: this.state.error ?? new Error('Unknown rendering error'),
                reset: this.handleReset,
            });
        }

        if (this.props.fallback) {
            return this.props.fallback;
        }

        const title = this.props.fallbackTitle ?? 'Възникна грешка в този компонент';

        return (
            <div
                role="alert"
                className="flex flex-col items-center justify-center p-6 bg-stone-50/80 border border-stone-200/80 rounded-2xl text-center my-2"
            >
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2.5">
                    <AlertCircle size={20} />
                </div>
                <h3 className="text-xs font-semibold text-stone-800 mb-1">{title}</h3>
                <p className="text-[11px] text-stone-500 max-w-sm mb-3.5">
                    {this.state.error?.message || 'Компонентът не можа да се зареди успешно.'}
                </p>
                <button
                    type="button"
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
                >
                    <RefreshCw size={12} className="text-stone-400" />
                    <span>Опитай отново</span>
                </button>
            </div>
        );
    }
}
