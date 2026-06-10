import { logger } from '../../middleware/logging.js';
import type { Expense } from '../../schemas/index.js';
import { getRepository } from '../RepositoryFactory.js';

const COLLECTION = 'expenses';

export const expenseService = {
  async findAll(): Promise<Expense[]> {
    return getRepository<Expense>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<Expense | null> {
    return getRepository<Expense>(COLLECTION).findById(id);
  },

  async create(data: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const created = await getRepository<Expense>(COLLECTION).create({
      ...data,
      date: new Date().toISOString().split('T')[0],
    } as Expense);
    logger.info(
      { expenseId: created.id, title: created.title, amount: created.amount },
      'Expense created'
    );
    return created;
  },

  async update(id: string, data: Partial<Expense>): Promise<Expense | null> {
    const updated = await getRepository<Expense>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ expenseId: id, title: updated.title }, 'Expense updated');
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepository<Expense>(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ expenseId: id, title: existing?.title }, 'Expense deleted');
    }
    return deleted;
  },

  async bulkCreate(items: Omit<Expense, 'id' | 'date'>[]): Promise<Expense[]> {
    const created = await getRepository<Expense>(COLLECTION).bulkCreate(
      items.map((item) => ({ ...item, date: new Date().toISOString().split('T')[0] }) as Expense)
    );
    logger.info({ count: created.length }, 'Expenses bulk created');
    return created;
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const deleted = await getRepository<Expense>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Expenses bulk deleted');
    return deleted;
  },
};
