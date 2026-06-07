/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useCartStore } from '../store/cartStore';
import { Product } from '../types';

const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  originalPrice: 1000,
  salePrice: 800,
  rating: 4.5,
  reviewsCount: 100,
  description: 'Test',
  shortDescription: 'Short',
  benefits: ['Benefit'],
  crystalsUsed: ['Crystal'],
  imageUrl: 'https://example.com/image.jpg',
  category: 'bracelet',
  stockStatus: 'in-stock',
  isBestSeller: true,
  specifications: { beadSize: '8mm' },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Cart Store Integration', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore(), { wrapper: createWrapper() });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]!.product.id).toBe('test-1');
  });

  it('should update cart when adding same product', () => {
    const { result } = renderHook(() => useCartStore(), { wrapper: createWrapper() });

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]!.quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore(), { wrapper: createWrapper() });

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.removeItem('test-1');
    });

    expect(result.current.items).toHaveLength(0);
  });
});
