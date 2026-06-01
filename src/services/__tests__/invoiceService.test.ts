import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { invoiceService } from '../invoiceService';

vi.mock('../apiFetch', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '../apiFetch';

describe('invoiceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all invoices successfully', async () => {
      const mockInvoices = [
        { id: 'INV-1', client: 'Test Client', amount: 1000, status: 'Paid' },
      ];
      (apiFetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockInvoices,
      });

      const result = await invoiceService.getAll();
      expect(result).toEqual(mockInvoices);
      expect(apiFetch).toHaveBeenCalledWith('/api/invoices');
    });

    it('should throw error when fetch fails', async () => {
      (apiFetch as any).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(invoiceService.getAll()).rejects.toThrow('Failed to fetch invoices: 500');
    });
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const newInvoice = { client: 'Test', amount: 500, item: 'Crystal', status: 'Sent' as const, date: '2026-01-01', alignment: 'Test' };
      const created = { ...newInvoice, id: 'INV-NEW' };
      (apiFetch as any).mockResolvedValue({
        ok: true,
        json: async () => created,
      });

      const result = await invoiceService.create(newInvoice);
      expect(result).toEqual(created);
      expect(apiFetch).toHaveBeenCalledWith('/api/invoices', {
        method: 'POST',
        body: newInvoice,
      });
    });
  });

  describe('delete', () => {
    it('should delete an invoice', async () => {
      (apiFetch as any).mockResolvedValue({ ok: true });

      await invoiceService.delete('INV-1');
      expect(apiFetch).toHaveBeenCalledWith('/api/invoices/INV-1', { method: 'DELETE' });
    });

    it('should throw on delete failure', async () => {
      (apiFetch as any).mockResolvedValue({ ok: false, status: 404 });
      await expect(invoiceService.delete('INV-1')).rejects.toThrow('Failed to delete invoice: 404');
    });
  });
});
