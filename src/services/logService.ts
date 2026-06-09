/**
 * Logs API module
 * Handles terminal logs operations
 */
import { api, ApiError } from '../lib/api';

import type { TerminalLog } from './types';

export const logService = {
  async getAll(): Promise<TerminalLog[]> {
    try {
      return await api.get<TerminalLog[]>('/api/logs');
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`${error.message}: ${error.status}`);
      }
      throw error;
    }
  },
};
