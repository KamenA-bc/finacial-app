import { create } from 'zustand';

export type ToastVariant = 'success' | 'error';

interface ToastState {
    isOpen: boolean;
    message: string;
    variant: ToastVariant;
    /** Unique key to reset animations upon successive triggers */
    id: number;
    showToast: (message?: string, variant?: ToastVariant) => void;
    hideToast: () => void;
}

const DEFAULT_TOAST_MESSAGE = 'Успешно добавено';

/**
 * Lightweight store to control the minimal status indicator.
 */
export const useToastStore = create<ToastState>((set) => ({
    isOpen: false,
    message: DEFAULT_TOAST_MESSAGE,
    variant: 'success',
    id: 0,

    showToast: (message: string = DEFAULT_TOAST_MESSAGE, variant: ToastVariant = 'success') => {
        set({
            isOpen: true,
            message,
            variant,
            id: Date.now(),
        });
    },

    hideToast: () => {
        set({ isOpen: false });
    },
}));
