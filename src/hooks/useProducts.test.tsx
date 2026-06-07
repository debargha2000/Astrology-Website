/// <reference types="vitest/globals" />
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

import { api } from '../lib/api';
import { Product } from '../types';

import { useProducts } from './useProducts';

vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockProducts: Product[] = [
  {
    id: 'test-1',
    name: 'Product 1',
    originalPrice: 1000,
    salePrice: 800,
    rating: 4.5,
    reviewsCount: 100,
    description: 'Description 1',
    shortDescription: 'Short 1',
    benefits: ['Benefit 1'],
    crystalsUsed: ['Crystal 1'],
    imageUrl: 'https://example.com/1.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Aries', 'Leo'],
    isBestSeller: true,
    specifications: {
      beadSize: '8mm',
      beadCount: 20,
      threadMaterial: 'Elastic',
      origin: 'India',
      chargeTime: '3 Nights',
    },
  },
  {
    id: 'test-2',
    name: 'Product 2',
    originalPrice: 2000,
    salePrice: 1500,
    rating: 4.0,
    reviewsCount: 50,
    description: 'Description 2',
    shortDescription: 'Short 2',
    benefits: ['Benefit 2'],
    crystalsUsed: ['Crystal 2'],
    imageUrl: 'https://example.com/2.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    category: 'ring',
    stockStatus: 'in-stock',
    zodiacConnection: ['Taurus'],
    isBestSeller: false,
    specifications: {
      beadSize: '10mm',
      beadCount: 18,
      threadMaterial: 'Silk',
      origin: 'Brazil',
      chargeTime: '2 Nights',
    },
  },
];

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

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch products', async () => {
    (api.get as Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProducts);
    expect(api.get).toHaveBeenCalledWith('/api/products');
  });

  it('should handle fetch error', async () => {
    (api.get as Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
