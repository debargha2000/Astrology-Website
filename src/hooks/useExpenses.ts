import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  expenseSchema,
  expenseCreateSchema,
  type Expense,
  type ExpenseCreate,
  type ExpenseUpdate,
} from '../schemas';

const EXPENSES_KEY = ['expenses'] as const;

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/expenses');
      return data.map((item) => expenseSchema.parse(item)) as Expense[];
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: ExpenseCreate) => {
      const validated = expenseCreateSchema.parse(expense);
      const data = await api.post<unknown>('/api/expenses', validated);
      return expenseSchema.parse(data) as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ExpenseUpdate }) => {
      const data = await api.put<unknown>(`/api/expenses/${id}`, updates);
      return expenseSchema.parse(data) as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useBatchCreateExpenses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: ExpenseCreate[]) => {
      const data = await api.post<{ count: number; items: unknown[] }>('/api/expenses/batch', {
        items,
      });
      return data.items.map((item) => expenseSchema.parse(item)) as Expense[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}

export function useBatchDeleteExpenses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/api/expenses/batch', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_KEY });
    },
  });
}
