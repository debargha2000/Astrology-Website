import { create } from 'zustand';

import { PRODUCTS, DEFAULT_WEBSITE_CONTENT } from './data';
import { Product, CartItem, WebsiteContent } from './types';

interface AppState {
  products: Product[];
  cartItems: CartItem[];
  websiteContent: WebsiteContent;
  isCartOpen: boolean;
  selectedProduct: Product | null;
  currentPage:
    | 'home'
    | 'shop'
    | 'zodiac-calculator'
    | 'charging-station'
    | 'encyclopedia'
    | 'about'
    | 'checkout'
    | 'cms';

  // Actions
  setProducts: (products: Product[]) => void;
  setCartItems: (cartItems: CartItem[]) => void;
  setWebsiteContent: (content: WebsiteContent) => void;
  toggleCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setCurrentPage: (page: AppState['currentPage']) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  products: PRODUCTS,
  cartItems: [],
  websiteContent: DEFAULT_WEBSITE_CONTENT,
  isCartOpen: false,
  selectedProduct: null,
  currentPage: 'home',

  setProducts: (products) => set({ products }),
  setCartItems: (cartItems) => set({ cartItems }),
  setWebsiteContent: (content) => set({ websiteContent: content }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setIsCartOpen: (open) =>
    set((state) => (state.isCartOpen === open ? state : { isCartOpen: open })),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setCurrentPage: (page) => set({ currentPage: page }),

  addToCart: (product) => {
    const { cartItems } = get();
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({
        cartItems: [
          ...cartItems,
          {
            product,
            quantity: 1,
            size: 'standard-unisex',
            personalizedCertification: false,
          },
        ],
      });
    }
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter((item) => item.product.id !== productId),
    });
  },

  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      get().removeFromCart(productId);
    } else {
      set({
        cartItems: get().cartItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },
}));
