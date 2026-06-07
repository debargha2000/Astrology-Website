import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  taskSchema,
  taskCreateSchema,
  type Task,
  type TaskCreate,
  type TaskUpdate,
} from '../schemas';

const TASKS_KEY = ['tasks'] as const;

export function useTasks() {
  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/tasks');
      return data.map((item) => taskSchema.parse(item)) as Task[];
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: TaskCreate) => {
      const validated = taskCreateSchema.parse(task);
      const data = await api.post<unknown>('/api/tasks', validated);
      return taskSchema.parse(data) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const data = await api.put<unknown>(`/api/tasks/${id}`, updates);
      return taskSchema.parse(data) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
      const data = await api.put<unknown>(`/api/tasks/${id}/status`, { status });
      return taskSchema.parse(data) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}
