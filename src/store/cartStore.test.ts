import { act, renderHook } from '@testing-library/react';

import { Product } from '../types';

import { useCartStore } from './cartStore';

const mockProduct: Product = {
  id: 'test-product',
  name: 'Test Product',
  originalPrice: 1000,
  salePrice: 800,
  rating: 4.5,
  reviewsCount: 100,
  description: 'Test description',
  shortDescription: 'Test short',
  benefits: ['Benefit 1', 'Benefit 2'],
  crystalsUsed: ['Crystal 1'],
  imageUrl: 'https://example.com/image.jpg',
  category: 'bracelet',
  stockStatus: 'in-stock',
  isBestSeller: true,
  specifications: {
    beadSize: '8mm',
    beadCount: 20,
    threadMaterial: 'Elastic',
    origin: 'India',
    chargeTime: '3 Nights',
  },
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]!.product.id).toBe('test-product');
    expect(result.current.items[0]!.quantity).toBe(1);
  });

  it('should increment quantity when adding same product', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]!.quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.removeItem('test-product');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product', 5);
    });

    expect(result.current.items[0]!.quantity).toBe(5);
  });

  it('should remove item when quantity set to 0', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update size', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateSize('test-product', 'petite');
    });

    expect(result.current.items[0]!.size).toBe('petite');
  });

  it('should update personalization', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updatePersonalization('test-product', true, {
        name: 'Test',
        birthDate: '2000-01-01',
      });
    });

    expect(result.current.items[0]!.personalizedCertification).toBe(true);
    expect(result.current.items[0]!.birthDetails?.name).toBe('Test');
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total items', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.getTotalItems()).toBe(2);
  });

  it('should calculate subtotal', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.getSubtotal()).toBe(800);
  });
});
