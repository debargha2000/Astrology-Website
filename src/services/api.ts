/**
 * Centralized API service aggregator
 * Re-exports all domain-specific services for backward compatibility
 */
import { Product, WebsiteContent } from '../types';

import { apiFetch } from './apiFetch';
import { authService } from './authService';
import { expenseService } from './expenseService';
import { invoiceService } from './invoiceService';
import { logService } from './logService';
import { taskService } from './taskService';
import { vendorService } from './vendorService';

export { invoiceService, vendorService, expenseService, taskService, authService, logService };

export const apiService = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await apiFetch('/api/products');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  async saveProduct(product: Product): Promise<Product> {
    try {
      const response = await apiFetch('/api/products', {
        method: 'POST',
        body: product as unknown as Record<string, unknown>,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // Website Content
  async getWebsiteContent(): Promise<WebsiteContent> {
    try {
      const response = await apiFetch('/api/website/content');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch website content:', error);
      throw error;
    }
  },

  async saveWebsiteContent(content: WebsiteContent): Promise<WebsiteContent> {
    try {
      const response = await apiFetch('/api/website/content', {
        method: 'POST',
        body: content as unknown as Record<string, unknown>,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save website content:', error);
      throw error;
    }
  },
};

export type { Invoice, Vendor, Expense, Task, TerminalLog, AuthResponse } from './types';
