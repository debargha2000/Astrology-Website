import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import { checkpointSchema, type Checkpoint } from '../schemas';

const CHECKPOINTS_KEY = ['checkpoints'] as const;

export function useCheckpoints() {
  return useQuery({
    queryKey: CHECKPOINTS_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/website/checkpoints');
      return data.map((item) => checkpointSchema.parse(item)) as Checkpoint[];
    },
  });
}

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title?: string) => {
      const data = await api.post<unknown>('/api/website/checkpoints', { title });
      return checkpointSchema.parse(data) as Checkpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKPOINTS_KEY });
    },
  });
}

export function useRollbackCheckpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/api/website/checkpoints/${id}/rollback`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKPOINTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
