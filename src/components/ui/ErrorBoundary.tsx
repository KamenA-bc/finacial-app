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

    handleReload = (): void => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    isChunkLoadError = (): boolean => {
        const err = this.state.error;
        if (!err) return false;
        if (err.name === 'ChunkLoadError') return true;
        const msg = err.message || '';
        return (
            msg.includes('Failed to load chunk') ||
            msg.includes('Loading chunk') ||
            msg.includes('Failed to fetch dynamically imported module') ||
            msg.includes('error loading dynamically imported module')
        );
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

        const isChunkError = this.isChunkLoadError();
        const title = isChunkError
            ? 'Налична е нова версия на приложението'
            : this.props.fallbackTitle ?? 'Възникна грешка в този компонент';

        const description = isChunkError
            ? 'Компонентите на страницата бяха обновени. Моля, презаредете страницата, за да заредите най-новата версия.'
            : this.state.error?.message || 'Компонентът не можа да се зареди успешно.';

        return (
            <div
                role="alert"
                className="flex flex-col items-center justify-center p-6 bg-stone-50/80 border border-stone-200/80 rounded-2xl text-center my-2"
            >
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
                        isChunkError ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                    }`}
                >
                    {isChunkError ? <RefreshCw size={18} /> : <AlertCircle size={20} />}
                </div>
                <h3 className="text-xs font-semibold text-stone-800 mb-1">{title}</h3>
                <p className="text-[11px] text-stone-500 max-w-sm mb-3.5 leading-relaxed">
                    {description}
                </p>
                {isChunkError ? (
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium active:scale-[0.98] transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <RefreshCw size={12} className="text-emerald-100" />
                        <span>Обнови страницата</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none"
                    >
                        <RefreshCw size={12} className="text-stone-400" />
                        <span>Опитай отново</span>
                    </button>
                )}
            </div>
        );
    }
}
