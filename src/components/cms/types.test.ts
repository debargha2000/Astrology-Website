import { describe, it, expect, beforeEach } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() {
      return Object.keys(store).length;
    }
  };
})();

(globalThis as any).localStorage = localStorageMock;

import {
  ADMIN_EMAIL,
  ADMIN_TOKEN_KEY,
  LEGACY_ADMIN_TOKEN_KEYS,
  getAdminToken,
  setAdminToken,
  clearAdminToken
} from './types';

describe('CMS auth token storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('uses an Aura & Stone branded localStorage key', () => {
    expect(ADMIN_TOKEN_KEY).toBe('aura_stone_admin_token');
    expect(ADMIN_TOKEN_KEY).not.toMatch(/signtific/i);
  });

  it('exports the expected admin email', () => {
    expect(ADMIN_EMAIL).toBe('debarghapakhira@gmail.com');
  });

  it('migrates any legacy Signtific India token to the new key', () => {
    const legacy = LEGACY_ADMIN_TOKEN_KEYS[0];
    localStorage.setItem(legacy, 'legacy-jwt');
    expect(getAdminToken()).toBe('legacy-jwt');
    expect(localStorage.getItem(ADMIN_TOKEN_KEY)).toBe('legacy-jwt');
    expect(localStorage.getItem(legacy)).toBeNull();
  });

  it('round-trips via set/get/clear', () => {
    setAdminToken('test-jwt');
    expect(getAdminToken()).toBe('test-jwt');
    clearAdminToken();
    expect(getAdminToken()).toBeNull();
  });

  it('clears both new and legacy keys', () => {
    const legacy = LEGACY_ADMIN_TOKEN_KEYS[0];
    localStorage.setItem(ADMIN_TOKEN_KEY, 'a');
    localStorage.setItem(legacy, 'b');
    clearAdminToken();
    expect(localStorage.getItem(ADMIN_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(legacy)).toBeNull();
  });
});
