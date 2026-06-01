/**
 * Logs API module
 * Handles terminal logs operations
 */
import { apiFetch } from './apiFetch';
import type { TerminalLog } from './types';

export const logService = {
  async getAll(): Promise<TerminalLog[]> {
    const response = await apiFetch('/api/logs');
    if (!response.ok) throw new Error(`Failed to fetch logs: ${response.status}`);
    return response.json();
  },
};
