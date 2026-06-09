import { describe, it, expect, vi, beforeEach } from 'vitest';

import { api, ApiError } from '../../lib/api';
import { authService } from '../authService';

vi.mock('../../lib/api', () => ({
  api: {
    post: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(
      message: string,
      public status: number,
      public data?: unknown
    ) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('googleLogin', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = { token: 'jwt-token', role: 'admin', username: 'test@test.com' };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.googleLogin({
        email: 'test@test.com',
        uid: 'uid-123',
        displayName: 'Test User',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw on authentication failure', async () => {
      vi.mocked(api.post).mockRejectedValue(
        new ApiError('Access Denied', 403, { error: 'Access Denied' })
      );

      await expect(
        authService.googleLogin({ email: 'bad@test.com', uid: 'uid', displayName: 'Bad' })
      ).rejects.toThrow('Access Denied');
    });
  });
});
