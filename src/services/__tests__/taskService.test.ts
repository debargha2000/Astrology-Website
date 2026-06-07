import { describe, it, expect, vi, beforeEach } from 'vitest';

import { apiFetch } from '../apiFetch';
import { taskService } from '../taskService';

vi.mock('../apiFetch', () => ({
  apiFetch: vi.fn(),
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
      vi.mocked(apiFetch).mockResolvedValue({
        ok: true,
        json: async () => mockTasks,
      } as Response);
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
      vi.mocked(apiFetch).mockResolvedValue({
        ok: true,
        json: async () => updatedTask,
      } as Response);
      const result = await taskService.updateStatus('T-1', 'Water Cleanse');
      expect(result.status).toBe('Water Cleanse');
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      vi.mocked(apiFetch).mockResolvedValue({ ok: true } as Response);
      await taskService.delete('T-1');
      expect(apiFetch).toHaveBeenCalledWith('/api/tasks/T-1', { method: 'DELETE' });
    });
  });
});
