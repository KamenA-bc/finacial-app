import React from 'react';
import { HugeiconsIcon, HugeiconsIconProps, IconSvgElement } from '@hugeicons/react';

export interface AppIconProps extends Omit<HugeiconsIconProps, 'icon'> {
    icon: IconSvgElement;
    size?: number;
    strokeWidth?: number;
    className?: string;
    color?: string;
}

/**
 * Reusable icon component standardizing Hugeicons across the application
 * with uniform stroke weight, crisp optical centering, and color inheritance.
 */
export function AppIcon({
    icon,
    size = 15,
    strokeWidth = 1.5,
    className = '',
    color = 'currentColor',
    ...props
}: AppIconProps) {
    return (
        <HugeiconsIcon
            icon={icon}
            size={size}
            strokeWidth={strokeWidth}
            color={color}
            className={className}
            {...props}
        />
    );
}

export interface IconSquircleProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Emil Kowalski craft-inspired squircle badge.
 * Provides micro-depth with inner top specular highlight, subtle hairline border,
 * and snappy tactile press physics.
 */
export function IconSquircle({
    children,
    className = '',
    size = 'md',
    ...props
}: IconSquircleProps) {
    const sizeClasses = {
        sm: 'w-7 h-7 rounded-[8px]',
        md: 'w-8 h-8 rounded-[10px]',
        lg: 'w-9 h-9 rounded-[12px]',
    }[size];

    return (
        <div
            className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-150 active:scale-[0.96] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] border ${sizeClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
