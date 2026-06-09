import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { api, ApiError } from '../../lib/api';
import { invoiceService } from '../invoiceService';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(
      message: string,
      public status: number,
      public data?: unknown
    ) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

describe('invoiceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all invoices successfully', async () => {
      const mockInvoices = [{ id: 'INV-1', client: 'Test Client', amount: 1000, status: 'Paid' }];
      vi.mocked(api.get).mockResolvedValue(mockInvoices);

      const result = await invoiceService.getAll();
      expect(result).toEqual(mockInvoices);
      expect(api.get).toHaveBeenCalledWith('/api/invoices');
    });

    it('should throw error when fetch fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new ApiError('Failed to fetch invoices', 500));

      await expect(invoiceService.getAll()).rejects.toThrow('Failed to fetch invoices: 500');
    });
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const newInvoice = {
        client: 'Test',
        amount: 500,
        item: 'Crystal',
        status: 'Sent' as const,
        date: '2026-01-01',
        alignment: 'Test',
      };
      const created = { ...newInvoice, id: 'INV-NEW' };
      vi.mocked(api.post).mockResolvedValue(created);

      const result = await invoiceService.create(newInvoice);
      expect(result).toEqual(created);
      expect(api.post).toHaveBeenCalledWith('/api/invoices', newInvoice);
    });
  });

  describe('delete', () => {
    it('should delete an invoice', async () => {
      vi.mocked(api.delete).mockResolvedValue(undefined);

      await invoiceService.delete('INV-1');
      expect(api.delete).toHaveBeenCalledWith('/api/invoices/INV-1');
    });

    it('should throw on delete failure', async () => {
      vi.mocked(api.delete).mockRejectedValue(new ApiError('Failed to delete invoice', 404));
      await expect(invoiceService.delete('INV-1')).rejects.toThrow('Failed to delete invoice: 404');
    });
  });
});
