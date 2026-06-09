/**
 * Authentication API module
 * Handles user authentication operations
 */
import { api, ApiError } from '../lib/api';

import type { AuthResponse } from './types';

export const authService = {
  async googleLogin(credentials: {
    email: string;
    uid: string;
    displayName: string;
  }): Promise<AuthResponse> {
    try {
      return await api.post<AuthResponse>('/api/auth/google-login', credentials);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.data?.error || error.message);
      }
      throw error;
    }
  },
};
