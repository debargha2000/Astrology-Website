import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'terminalLog';

export const logRepository = {
  async findAll(limit = 10) {
    const logs = await getRepository<{ id: string; timestamp: string; message: string }>(
      COLLECTION
    ).findAll();
    return logs.slice(0, limit);
  },

  async create(message: string) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const log = {
      id: `log-${Date.now()}`,
      timestamp,
      message,
    };
    const created = await getRepository<{ id: string; timestamp: string; message: string }>(
      COLLECTION
    ).create(log);
    return created;
  },

  async delete(id: string) {
    return getRepository<{ id: string; timestamp: string; message: string }>(COLLECTION).delete(id);
  },
};
