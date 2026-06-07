import { create } from 'zustand';

import { Product } from '../types';

interface ProductState {
  products: Product[];
  filters: {
    category: 'all' | 'bracelet' | 'ring' | 'combo' | 'zodiac';
    sort: 'rating' | 'price-low' | 'price-high';
  };
  setProducts: (products: Product[]) => void;
  setCategory: (category: ProductState['filters']['category']) => void;
  setSort: (sort: ProductState['filters']['sort']) => void;
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filters: {
    category: 'all',
    sort: 'rating',
  },

  setProducts: (products) => set({ products }),

  setCategory: (category) => set((state) => ({ filters: { ...state.filters, category } })),

  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),

  getFilteredProducts: () => {
    const { products, filters } = get();
    return products
      .filter((p) => (filters.category === 'all' ? true : p.category === filters.category))
      .sort((a, b) => {
        if (filters.sort === 'rating') return b.rating - a.rating;
        if (filters.sort === 'price-low') return a.salePrice - b.salePrice;
        return b.salePrice - a.salePrice;
      });
  },
}));
