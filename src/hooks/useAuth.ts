import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  googleLoginSchema,
  authResponseSchema,
  type GoogleLogin,
  type AuthResponse,
} from '../schemas';

const AUTH_KEY = ['auth'] as const;

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: GoogleLogin) => {
      const validated = googleLoginSchema.parse(credentials);
      const data = await api.post<unknown>('/api/auth/google-login', validated);
      return authResponseSchema.parse(data) as AuthResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEY, data);
      localStorage.setItem('auth_token', data.token);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('auth_token');
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear();
    },
  });
}

export function useAuth() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => {
      const token = localStorage.getItem('auth_token');
      return token ? { token } : null;
    },
    initialData: () => {
      const token = localStorage.getItem('auth_token');
      return token ? { token } : null;
    },
    staleTime: Infinity,
  });
}
