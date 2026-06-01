import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('JWT secret enforcement', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.JWT_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('throws when JWT_SECRET is missing', async () => {
    const { getJwtSecret } = await import('./_probe');
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it('throws when JWT_SECRET is too short', async () => {
    process.env.JWT_SECRET = 'short';
    const { getJwtSecret } = await import('./_probe');
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it('returns the secret when long enough', async () => {
    process.env.JWT_SECRET = 'a'.repeat(48);
    const { getJwtSecret } = await import('./_probe');
    expect(getJwtSecret()).toBe('a'.repeat(48));
  });
});
