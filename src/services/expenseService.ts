/**
 * Expense API module
 * Handles all expense-related backend operations
 */
import { api, ApiError } from '../lib/api';

import type { Expense } from './types';

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    try {
      return await api.get<Expense[]>('/api/expenses');
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async create(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    try {
      return await api.post<Expense>('/api/expenses', expense);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/expenses/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },
};
