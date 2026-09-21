/**
 * Tooltip – accessible, micro-animated context popover.
 * Supports hover/focus on desktop and tap-to-inspect on touch devices
 * with automatic tap-outside dismissal and viewport alignment.
 */
'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    position?: 'top' | 'bottom';
    className?: string;
}

export function Tooltip({
    children,
    content,
    align = 'center',
    position = 'top',
    className = '',
}: TooltipProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipId = useId();

    // Tap-outside & Escape key dismissal for mobile / keyboard ergonomics
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Alignment classes for positioning the floating bubble
    const alignClasses = {
        start: 'left-0 translate-x-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0 translate-x-0',
    }[align];

    // Arrow alignment matching container positioning
    const arrowAlignClasses = {
        start: 'left-4 -translate-x-1/2',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-4 translate-x-1/2',
    }[align];

    const isTop = position === 'top';
    const positionClasses = isTop
        ? 'bottom-full mb-2 origin-bottom'
        : 'top-full mt-2 origin-top';

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center justify-center ${className}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                role="button"
                tabIndex={0}
                aria-describedby={isOpen ? tooltipId : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen((prev) => !prev);
                    }
                }}
                className="inline-flex items-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded"
            >
                {children}
            </div>

            {/* Floating Bubble */}
            {isOpen && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    className={`absolute ${positionClasses} ${alignClasses} z-50 w-max max-w-[220px] pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95`}
                >
                    <div className="bg-stone-900/95 text-stone-100 text-[11px] font-medium leading-snug px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md border border-stone-800/90 text-center">
                        {content}
                    </div>

                    {/* Arrow / Beak */}
                    <div
                        className={`absolute ${
                            isTop
                                ? 'top-full border-t-stone-900/95 border-b-transparent'
                                : 'bottom-full border-b-stone-900/95 border-t-transparent'
                        } ${arrowAlignClasses} border-4 border-l-transparent border-r-transparent w-0 h-0`}
                    />
                </div>
            )}
        </div>
    );
}
