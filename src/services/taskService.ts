/**
 * Task API module
 * Handles all task-related backend operations
 */
import { apiFetch } from './apiFetch';
import type { Task } from './types';

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await apiFetch('/api/tasks');
    if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);
    return response.json();
  },

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await apiFetch('/api/tasks', {
      method: 'POST',
      body: task,
    });
    if (!response.ok) throw new Error(`Failed to create task: ${response.status}`);
    return response.json();
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await apiFetch(`/api/tasks/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
    if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete task: ${response.status}`);
  },
};
