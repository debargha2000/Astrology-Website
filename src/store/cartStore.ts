import { create } from 'zustand';

import { CartItem, Product, BirthDetails } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSize: (productId: string, size: CartItem['size']) => void;
  updatePersonalization: (productId: string, enabled: boolean, birthDetails?: BirthDetails) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

function createCartItem(product: Product, overrides: Partial<CartItem> = {}): CartItem {
  const birthDetails = overrides.birthDetails !== undefined ? overrides.birthDetails : undefined;
  const quantity = overrides.quantity !== undefined ? overrides.quantity : 1;
  const size = overrides.size !== undefined ? overrides.size : 'standard-unisex';
  const personalizedCertification =
    overrides.personalizedCertification !== undefined ? overrides.personalizedCertification : false;
  return {
    product,
    quantity,
    size,
    personalizedCertification,
    birthDetails,
  } satisfies CartItem;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: Product) => {
    set((state) => {
      const existingIdx = state.items.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...state.items];
        const existingItem = updated[existingIdx]!;
        updated[existingIdx] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        return { items: updated };
      }
      return {
        items: [...state.items, createCartItem(product)],
      };
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.product.id !== productId) };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  },

  updateSize: (productId: string, size: CartItem['size']) => {
    set((state) => ({
      items: state.items.map((item) => (item.product.id === productId ? { ...item, size } : item)),
    }));
  },

  updatePersonalization: (productId: string, enabled: boolean, birthDetails?: BirthDetails) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              personalizedCertification: enabled,
              birthDetails: birthDetails ?? item.birthDetails,
            }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  getSubtotal: () =>
    get().items.reduce((acc, item) => acc + item.product.salePrice * item.quantity, 0),
}));
