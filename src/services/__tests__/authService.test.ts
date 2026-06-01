import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';

vi.mock('../apiFetch', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '../apiFetch';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('googleLogin', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = { token: 'jwt-token', role: 'admin', username: 'test@test.com' };
      (apiFetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.googleLogin({
        email: 'test@test.com',
        uid: 'uid-123',
        displayName: 'Test User',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw on authentication failure', async () => {
      (apiFetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Access Denied' }),
      });

      await expect(
        authService.googleLogin({ email: 'bad@test.com', uid: 'uid', displayName: 'Bad' })
      ).rejects.toThrow('Access Denied');
    });
  });
});
