/**
 * Invoice API module
 * Handles all invoice-related backend operations
 */
import { apiFetch } from './apiFetch';
import type { Invoice } from './types';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    const response = await apiFetch('/api/invoices');
    if (!response.ok) throw new Error(`Failed to fetch invoices: ${response.status}`);
    return response.json();
  },

  async create(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const response = await apiFetch('/api/invoices', {
      method: 'POST',
      body: invoice,
    });
    if (!response.ok) throw new Error(`Failed to create invoice: ${response.status}`);
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await apiFetch(`/api/invoices/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete invoice: ${response.status}`);
  },
};
