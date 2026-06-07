import { create } from 'zustand';

import type { Product } from '../types';

interface UIState {
  isCartOpen: boolean;
  isReviewModalOpen: boolean;
  selectedProduct: Product | null;
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  setSelectedProduct: (product: Product | null) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isReviewModalOpen: false,
  selectedProduct: null,
  toasts: [],

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openReviewModal: () => set({ isReviewModalOpen: true }),
  closeReviewModal: () => set({ isReviewModalOpen: false }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
