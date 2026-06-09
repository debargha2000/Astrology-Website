/**
 * Task API module
 * Handles all task-related backend operations
 */
import { api, ApiError } from '../lib/api';

import type { Task } from './types';

export const taskService = {
  async getAll(): Promise<Task[]> {
    try {
      return await api.get<Task[]>('/api/tasks');
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      return await api.post<Task>('/api/tasks', task);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    try {
      return await api.put<Task>(`/api/tasks/${id}/status`, { status });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },
};
