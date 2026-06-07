import { describe, it, expect, vi, beforeEach } from 'vitest';

import { apiFetch } from '../apiFetch';
import { authService } from '../authService';

vi.mock('../apiFetch', () => ({
  apiFetch: vi.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('googleLogin', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = { token: 'jwt-token', role: 'admin', username: 'test@test.com' };
      vi.mocked(apiFetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authService.googleLogin({
        email: 'test@test.com',
        uid: 'uid-123',
        displayName: 'Test User',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw on authentication failure', async () => {
      vi.mocked(apiFetch).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Access Denied' }),
      } as Response);

      await expect(
        authService.googleLogin({ email: 'bad@test.com', uid: 'uid', displayName: 'Bad' })
      ).rejects.toThrow('Access Denied');
    });
  });
});
