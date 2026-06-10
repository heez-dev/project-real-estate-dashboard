import { create } from 'zustand';

export type ToastVariant = 'error' | 'info' | 'success';

export type AppToast = {
  description?: string;
  id: string;
  title: string;
  variant: ToastVariant;
};

type ToastInput = Omit<AppToast, 'id'>;

type ToastState = {
  dismissToast: (id: string) => void;
  showToast: (toast: ToastInput) => string;
  toasts: AppToast[];
};

export const useToastStore = create<ToastState>((set) => ({
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  showToast: (toast) => {
    const id = `${Date.now()}-${crypto.randomUUID()}`;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }].slice(-3),
    }));

    return id;
  },
  toasts: [],
}));
