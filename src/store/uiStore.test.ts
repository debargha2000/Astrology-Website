import { act, renderHook } from '@testing-library/react';

import type { Product } from '../types';

import { useUIStore } from './uiStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      isCartOpen: false,
      isReviewModalOpen: false,
      selectedProduct: null,
      toasts: [],
    });
  });

  it('should open cart', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openCart();
    });

    expect(result.current.isCartOpen).toBe(true);
  });

  it('should close cart', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openCart();
      result.current.closeCart();
    });

    expect(result.current.isCartOpen).toBe(false);
  });

  it('should toggle cart', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isCartOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });

    expect(result.current.isCartOpen).toBe(false);
  });

  it('should open review modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openReviewModal();
    });

    expect(result.current.isReviewModalOpen).toBe(true);
  });

  it('should close review modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openReviewModal();
      result.current.closeReviewModal();
    });

    expect(result.current.isReviewModalOpen).toBe(false);
  });

  it('should set selected product', () => {
    const { result } = renderHook(() => useUIStore());
    const product = { id: 'test', name: 'Test' } as Product;

    act(() => {
      result.current.setSelectedProduct(product);
    });

    expect(result.current.selectedProduct).toEqual(product);
  });

  it('should add toast', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.addToast('Test message', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]!.message).toBe('Test message');
    expect(result.current.toasts[0]!.type).toBe('success');
  });

  it('should remove toast', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.addToast('Test message');
    });

    const toastId = result.current.toasts[0]!.id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
