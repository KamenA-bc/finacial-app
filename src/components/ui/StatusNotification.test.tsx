import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusNotification } from './StatusNotification';
import { useToastStore } from '@/store/toastStore';

describe('StatusNotification', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useToastStore.setState({ isOpen: false, message: 'Успешно добавено', id: 0 });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders nothing when closed', () => {
        const { container } = render(<StatusNotification />);
        expect(container.firstChild).toBeNull();
    });

    it('renders "Успешно добавено" and accessibility attributes when opened', () => {
        useToastStore.setState({ isOpen: true, message: 'Успешно добавено', id: 1 });
        render(<StatusNotification />);

        const toast = screen.getByRole('status');
        expect(toast).toBeInTheDocument();
        expect(toast).toHaveTextContent('Успешно добавено');
        expect(toast).toHaveAttribute('aria-live', 'polite');

        act(() => {
            vi.runOnlyPendingTimers();
        });
    });

    it('starts exit animation at 2000ms and completely unmounts after exit transition', () => {
        render(<StatusNotification />);

        act(() => {
            useToastStore.getState().showToast('Успешно добавено');
        });

        const toast = screen.getByRole('status');
        expect(toast).toHaveClass('animate-toast-in');

        // At 2000ms, exit animation starts
        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(toast).toHaveClass('animate-toast-out');

        // After exit transition (260ms), it is unmounted
        act(() => {
            vi.advanceTimersByTime(260);
        });
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('triggers exit animation and dismisses on click', () => {
        render(<StatusNotification />);

        act(() => {
            useToastStore.getState().showToast('Успешно добавено');
        });

        const toast = screen.getByRole('status');
        expect(toast).toBeInTheDocument();

        act(() => {
            fireEvent.click(toast);
        });
        expect(toast).toHaveClass('animate-toast-out');

        act(() => {
            vi.advanceTimersByTime(260);
        });

        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(useToastStore.getState().isOpen).toBe(false);
    });
});
