import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import {
  productSchema,
  productCreateSchema,
  type Product,
  type ProductCreate,
  type ProductUpdate,
} from '../schemas';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const data = await api.get<unknown[]>('/api/products');
      return data.map((item) => productSchema.parse(item)) as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn: async () => {
      const data = await api.get<unknown>(`/api/products/${id}`);
      return productSchema.parse(data) as Product;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductCreate) => {
      const validated = productCreateSchema.parse(product);
      const data = await api.post<unknown>('/api/products', validated);
      return productSchema.parse(data) as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const data = await api.put<unknown>(`/api/products/${id}`, updates);
      return productSchema.parse(data) as Product;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: [...PRODUCTS_KEY, id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
