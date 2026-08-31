import { create } from 'zustand';

interface ToastState {
    isOpen: boolean;
    message: string;
    /** Unique key to reset animations upon successive triggers */
    id: number;
    showToast: (message?: string) => void;
    hideToast: () => void;
}

const DEFAULT_TOAST_MESSAGE = 'Успешно добавено';

/**
 * Lightweight store to control the top-right minimal success indicator.
 */
export const useToastStore = create<ToastState>((set) => ({
    isOpen: false,
    message: DEFAULT_TOAST_MESSAGE,
    id: 0,

    showToast: (message: string = DEFAULT_TOAST_MESSAGE) => {
        set({
            isOpen: true,
            message,
            id: Date.now(),
        });
    },

    hideToast: () => {
        set({ isOpen: false });
    },
}));
