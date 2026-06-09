/**
 * Vendor API module
 * Handles all vendor-related backend operations
 */
import { api, ApiError } from '../lib/api';

import type { Vendor } from './types';

export const vendorService = {
  async getAll(): Promise<Vendor[]> {
    try {
      return await api.get<Vendor[]>('/api/vendors');
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async create(vendor: Omit<Vendor, 'id' | 'rating' | 'status'>): Promise<Vendor> {
    try {
      return await api.post<Vendor>('/api/vendors', vendor);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/vendors/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },
};
