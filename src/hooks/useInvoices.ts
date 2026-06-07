import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  invoiceSchema,
  invoiceCreateSchema,
  type Invoice,
  type InvoiceCreate,
  type InvoiceUpdate,
} from '../schemas';

const INVOICES_KEY = ['invoices'] as const;

export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/invoices');
      return data.map((item) => invoiceSchema.parse(item)) as Invoice[];
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice: InvoiceCreate) => {
      const validated = invoiceCreateSchema.parse(invoice);
      const data = await api.post<unknown>('/api/invoices', validated);
      return invoiceSchema.parse(data) as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InvoiceUpdate }) => {
      const data = await api.put<unknown>(`/api/invoices/${id}`, updates);
      return invoiceSchema.parse(data) as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
    },
  });
}

export function useBatchCreateInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: InvoiceCreate[]) => {
      const data = await api.post<{ count: number; items: unknown[] }>('/api/invoices/batch', {
        items,
      });
      return data.items.map((item) => invoiceSchema.parse(item)) as Invoice[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
    },
  });
}

export function useBatchDeleteInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/api/invoices/batch', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
    },
  });
}
