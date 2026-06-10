import { logger } from '../../middleware/logging.js';
import type { Task } from '../../schemas/index.js';
import { getRepository } from '../RepositoryFactory.js';

const COLLECTION = 'tasks';

export const taskService = {
  async findAll(): Promise<Task[]> {
    return getRepository<Task>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<Task | null> {
    return getRepository<Task>(COLLECTION).findById(id);
  },

  async create(data: Omit<Task, 'id'>): Promise<Task> {
    const created = await getRepository<Task>(COLLECTION).create(data);
    logger.info(
      { taskId: created.id, title: created.title, assignee: created.assignee },
      'Task created'
    );
    return created;
  },

  async update(id: string, data: Partial<Task>): Promise<Task | null> {
    const updated = await getRepository<Task>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ taskId: id, title: updated.title }, 'Task updated');
    }
    return updated;
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task | null> {
    return this.update(id, { status });
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepository<Task>(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ taskId: id, title: existing?.title }, 'Task deleted');
    }
    return deleted;
  },

  async bulkCreate(items: Omit<Task, 'id'>[]): Promise<Task[]> {
    const created = await getRepository<Task>(COLLECTION).bulkCreate(items);
    logger.info({ count: created.length }, 'Tasks bulk created');
    return created;
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const deleted = await getRepository<Task>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Tasks bulk deleted');
    return deleted;
  },
};
