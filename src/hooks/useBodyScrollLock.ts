import { useEffect } from 'react';

/**
 * Locks background document scrolling and touch actions when a modal or dialog is open.
 * Restores original overflow and touchAction styles when unmounted or closed.
 */
export const useBodyScrollLock = (isLocked: boolean): void => {
    useEffect(() => {
        if (!isLocked) return;

        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isLocked]);
};
