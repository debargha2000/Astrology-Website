import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  vendorSchema,
  vendorCreateSchema,
  type Vendor,
  type VendorCreate,
  type VendorUpdate,
} from '../schemas';

const VENDORS_KEY = ['vendors'] as const;

export function useVendors() {
  return useQuery({
    queryKey: VENDORS_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/vendors');
      return data.map((item) => vendorSchema.parse(item)) as Vendor[];
    },
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vendor: VendorCreate) => {
      const validated = vendorCreateSchema.parse(vendor);
      const data = await api.post<unknown>('/api/vendors', validated);
      return vendorSchema.parse(data) as Vendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_KEY });
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: VendorUpdate }) => {
      const data = await api.put<unknown>(`/api/vendors/${id}`, updates);
      return vendorSchema.parse(data) as Vendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_KEY });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/vendors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_KEY });
    },
  });
}

export function useBatchCreateVendors() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: VendorCreate[]) => {
      const data = await api.post<{ count: number; items: unknown[] }>('/api/vendors/batch', {
        items,
      });
      return data.items.map((item) => vendorSchema.parse(item)) as Vendor[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_KEY });
    },
  });
}
