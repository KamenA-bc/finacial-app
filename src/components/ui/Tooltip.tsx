/**
 * Tooltip – accessible, micro-animated context popover.
 * Supports hover/focus on desktop and tap-to-inspect on touch devices
 * with automatic tap-outside dismissal and viewport alignment.
 */
'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';

export interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    align?: 'start' | 'center' | 'end';
    position?: 'top' | 'bottom';
    className?: string;
    triggerClassName?: string;
    triggerAriaLabel?: string;
}

export function Tooltip({
    children,
    content,
    align = 'center',
    position = 'top',
    className = '',
    triggerClassName = '',
    triggerAriaLabel,
}: TooltipProps): React.ReactElement {
    const [isToggled, setIsToggled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isPointerDownRef = useRef(false);
    const tooltipId = useId();

    const isVisible = isToggled || isHovered || isFocused;

    const closeAll = useCallback(() => {
        setIsToggled(false);
        setIsHovered(false);
        setIsFocused(false);
    }, []);

    // Dismissal for outside clicks/taps & Escape key
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent | PointerEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                closeAll();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeAll();
            }
        };

        // Pointerdown catches taps/clicks before click handlers on outside elements
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, closeAll]);

    // Alignment classes for positioning the floating bubble
    const alignClasses = {
        start: 'left-0 translate-x-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0 translate-x-0',
    }[align];

    // Arrow alignment matching container positioning
    const arrowAlignClasses = {
        start: 'left-6 -translate-x-1/2',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-6 translate-x-1/2',
    }[align];

    const isTop = position === 'top';
    const positionClasses = isTop
        ? 'bottom-full mb-2 origin-bottom'
        : 'top-full mt-2 origin-top';

    const handlePointerDown = () => {
        isPointerDownRef.current = true;
    };

    const handlePointerUp = () => {
        // Reset after this tick's click handler has fired
        setTimeout(() => {
            isPointerDownRef.current = false;
        }, 0);
    };

    const handlePointerEnter = (e: React.PointerEvent) => {
        // Only trigger hover on real mouse/pen devices, never on touch devices
        if (e.pointerType !== 'touch') {
            setIsHovered(true);
        }
    };

    const handlePointerLeave = (e: React.PointerEvent) => {
        if (e.pointerType !== 'touch') {
            setIsHovered(false);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        isPointerDownRef.current = false;
        setIsToggled((prev) => !prev);
    };

    const handleFocus = () => {
        // Only show tooltip on focus if user navigated via keyboard (Tab), not click/tap
        if (!isPointerDownRef.current) {
            setIsFocused(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDownTrigger = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsToggled((prev) => !prev);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center justify-center ${className}`}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <div
                role="button"
                tabIndex={0}
                aria-label={triggerAriaLabel || (typeof content === 'string' ? content : undefined)}
                aria-expanded={isVisible}
                aria-describedby={isVisible ? tooltipId : undefined}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDownTrigger}
                className={`cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 rounded-lg ${triggerClassName || 'inline-flex items-center'}`}
            >
                {children}
            </div>

            {/* Floating Bubble */}
            {isVisible && (
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
