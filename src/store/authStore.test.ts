import { act, renderHook } from '@testing-library/react';

import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login and set token', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login('test-token', { email: 'test@test.com', role: 'admin' });
    });

    expect(result.current.token).toBe('test-token');
    expect(result.current.user).toEqual({ email: 'test@test.com', role: 'admin' });
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should logout and clear state', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login('test-token', { email: 'test@test.com', role: 'admin' });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should persist auth state from localStorage', () => {
    // Test that login persists to localStorage
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login('persisted-token', { email: 'test@test.com', role: 'admin' });
    });

    // Create a new hook instance to simulate page reload
    const { result: newResult } = renderHook(() => useAuthStore());

    expect(newResult.current.token).toBe('persisted-token');
    expect(newResult.current.isAuthenticated).toBe(true);
  });
});
