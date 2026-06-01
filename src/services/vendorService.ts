/**
 * Vendor API module
 * Handles all vendor-related backend operations
 */
import { apiFetch } from './apiFetch';
import type { Vendor } from './types';

export const vendorService = {
  async getAll(): Promise<Vendor[]> {
    const response = await apiFetch('/api/vendors');
    if (!response.ok) throw new Error(`Failed to fetch vendors: ${response.status}`);
    return response.json();
  },

  async create(vendor: Omit<Vendor, 'id' | 'rating' | 'status'>): Promise<Vendor> {
    const response = await apiFetch('/api/vendors', {
      method: 'POST',
      body: vendor,
    });
    if (!response.ok) throw new Error(`Failed to create vendor: ${response.status}`);
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await apiFetch(`/api/vendors/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete vendor: ${response.status}`);
  },
};
