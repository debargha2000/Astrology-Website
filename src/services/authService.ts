/**
 * Authentication API module
 * Handles user authentication operations
 */
import { apiFetch } from './apiFetch';
import type { AuthResponse } from './types';

export const authService = {
  async googleLogin(credentials: {
    email: string;
    uid: string;
    displayName: string;
  }): Promise<AuthResponse> {
    const response = await apiFetch('/api/auth/google-login', {
      method: 'POST',
      body: credentials,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }
    return response.json();
  },
};
