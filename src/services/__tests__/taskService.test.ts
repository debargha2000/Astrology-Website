import { describe, it, expect, vi, beforeEach } from 'vitest';

import { api } from '../../lib/api';
import { taskService } from '../taskService';

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
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

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [
        {
          id: 'T-1',
          title: 'Test',
          status: 'Backlog' as const,
          priority: 'High' as const,
          assignee: 'A',
          daysLeft: 1,
        },
      ];
      vi.mocked(api.get).mockResolvedValue(mockTasks);
      const result = await taskService.getAll();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('updateStatus', () => {
    it('should update a task status', async () => {
      const updatedTask = {
        id: 'T-1',
        title: 'Test',
        status: 'Water Cleanse' as const,
        priority: 'High' as const,
        assignee: 'A',
        daysLeft: 1,
      };
      vi.mocked(api.put).mockResolvedValue(updatedTask);
      const result = await taskService.updateStatus('T-1', 'Water Cleanse');
      expect(result.status).toBe('Water Cleanse');
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      vi.mocked(api.delete).mockResolvedValue(undefined);
      await taskService.delete('T-1');
      expect(api.delete).toHaveBeenCalledWith('/api/tasks/T-1');
    });
  });
});
