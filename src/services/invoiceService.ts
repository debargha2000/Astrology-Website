/**
 * Invoice API module
 * Handles all invoice-related backend operations
 */
import { api, ApiError } from '../lib/api';

import type { Invoice } from './types';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    try {
      return await api.get<Invoice[]>('/api/invoices');
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async create(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    return api.post<Invoice>('/api/invoices', invoice);
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/invoices/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },
};
