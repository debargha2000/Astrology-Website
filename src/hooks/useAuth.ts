import { useMutation } from '@tanstack/react-query';

import { api, ApiError } from '../lib/api';
import {
  googleLoginSchema,
  authResponseSchema,
  type GoogleLogin,
  type AuthResponse,
} from '../schemas';
import { useAuthStore } from '../store/authStore';

export function useGoogleLogin() {
  const login = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: async (credentials: GoogleLogin) => {
      const validated = googleLoginSchema.parse(credentials);
      const data = await api.post<unknown>('/api/auth/google-login', validated);
      return authResponseSchema.parse(data) as AuthResponse;
    },
    onSuccess: (data) => {
      login(data.token, { email: data.username, role: data.role });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        throw new Error(error.data?.error || error.message);
      }
      throw error;
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: async () => {
      logout();
    },
  });
}

export function useAuth() {
  const { token, user, isAuthenticated } = useAuthStore();
  return { token, user, isAuthenticated };
}
