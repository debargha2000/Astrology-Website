import { logger } from '../middleware/logging.js';
import type { Task } from '../schemas/task.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'tasks';

export const taskRepository = {
  async findAll() {
    return getRepository<Task>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<Task>(COLLECTION).findById(id);
  },

  async create(data: Partial<Task>) {
    const task = {
      ...data,
      id: data.id || `TSK-${Math.floor(Math.random() * 90 + 500)}`,
    } as Task;
    const created = await getRepository<Task>(COLLECTION).create(task);
    logger.info(
      { taskId: created.id, title: created.title, assignee: created.assignee },
      'Task created'
    );
    return created;
  },

  async update(id: string, data: Partial<Task>) {
    const updated = await getRepository<Task>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ taskId: id }, 'Task updated');
    }
    return updated;
  },

  async updateStatus(id: string, status: Task['status']) {
    return this.update(id, { status });
  },

  async delete(id: string) {
    const result = await getRepository<Task>(COLLECTION).delete(id);
    if (result) {
      logger.info({ taskId: id }, 'Task deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<Task>[]) {
    const tasks = items.map((item) => ({
      ...item,
      id: item.id || `TSK-${Math.floor(Math.random() * 90 + 500)}`,
    })) as Task[];
    const created = await getRepository<Task>(COLLECTION).bulkCreate(tasks);
    logger.info({ count: created.length }, 'Bulk tasks created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<Task>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk tasks deleted');
    return deleted;
  },
};
