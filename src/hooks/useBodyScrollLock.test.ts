import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    });

    afterEach(() => {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    });

    it('does not modify body styles when isLocked is false', () => {
        renderHook(() => useBodyScrollLock(false));

        expect(document.body.style.overflow).toBe('');
        expect(document.body.style.touchAction).toBe('');
    });

    it('sets overflow:hidden and touchAction:none when isLocked is true', () => {
        const { unmount } = renderHook(() => useBodyScrollLock(true));

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.touchAction).toBe('none');

        unmount();

        expect(document.body.style.overflow).toBe('');
        expect(document.body.style.touchAction).toBe('');
    });

    it('restores original pre-existing styles on unmount', () => {
        document.body.style.overflow = 'scroll';
        document.body.style.touchAction = 'pan-y';

        const { unmount } = renderHook(() => useBodyScrollLock(true));

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.touchAction).toBe('none');

        unmount();

        expect(document.body.style.overflow).toBe('scroll');
        expect(document.body.style.touchAction).toBe('pan-y');
    });
});
