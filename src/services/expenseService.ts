/**
 * Expense API module
 * Handles all expense-related backend operations
 */
import { apiFetch } from './apiFetch';
import type { Expense } from './types';

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    const response = await apiFetch('/api/expenses');
    if (!response.ok) throw new Error(`Failed to fetch expenses: ${response.status}`);
    return response.json();
  },

  async create(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const response = await apiFetch('/api/expenses', {
      method: 'POST',
      body: expense,
    });
    if (!response.ok) throw new Error(`Failed to create expense: ${response.status}`);
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await apiFetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete expense: ${response.status}`);
  },
};
