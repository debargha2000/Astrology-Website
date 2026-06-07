import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  astroContentSchema,
  astroContentCreateSchema,
  type AstroContent,
  type AstroContentCreate,
  type AstroContentUpdate,
} from '../schemas';

const ASTRO_CONTENT_KEY = ['astroContent'] as const;

export function useAstroContent() {
  return useQuery({
    queryKey: ASTRO_CONTENT_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/astro-content');
      return data.map((item) => astroContentSchema.parse(item)) as AstroContent[];
    },
  });
}

export function useCreateAstroContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: AstroContentCreate) => {
      const validated = astroContentCreateSchema.parse(content);
      const data = await api.post<unknown>('/api/astro-content', validated);
      return astroContentSchema.parse(data) as AstroContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASTRO_CONTENT_KEY });
    },
  });
}

export function useUpdateAstroContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AstroContentUpdate }) => {
      const data = await api.put<unknown>(`/api/astro-content/${id}`, updates);
      return astroContentSchema.parse(data) as AstroContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASTRO_CONTENT_KEY });
    },
  });
}

export function useDeleteAstroContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/astro-content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASTRO_CONTENT_KEY });
    },
  });
}

export function useBulkCreateAstroContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entries: AstroContentCreate[]) => {
      const data = await api.post<unknown[]>('/api/astro-content/bulk', { entries });
      return data.map((item) => astroContentSchema.parse(item)) as AstroContent[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASTRO_CONTENT_KEY });
    },
  });
}
