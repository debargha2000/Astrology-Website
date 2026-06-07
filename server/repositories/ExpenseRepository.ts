import { logger } from '../middleware/logging.js';
import type { Expense } from '../schemas/expense.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'expenses';

export const expenseRepository = {
  async findAll() {
    return getRepository<Expense>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<Expense>(COLLECTION).findById(id);
  },

  async create(data: Partial<Expense>) {
    const expense = {
      ...data,
      id: data.id || `EXP-${Math.floor(Math.random() * 90 + 100)}`,
      date: data.date || new Date().toISOString().split('T')[0],
    } as Expense;
    const created = await getRepository<Expense>(COLLECTION).create(expense);
    logger.info(
      { expenseId: created.id, title: created.title, amount: created.amount },
      'Expense created'
    );
    return created;
  },

  async update(id: string, data: Partial<Expense>) {
    const updated = await getRepository<Expense>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ expenseId: id }, 'Expense updated');
    }
    return updated;
  },

  async delete(id: string) {
    const result = await getRepository<Expense>(COLLECTION).delete(id);
    if (result) {
      logger.info({ expenseId: id }, 'Expense deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<Expense>[]) {
    const expenses = items.map((item) => ({
      ...item,
      id: item.id || `EXP-${Math.floor(Math.random() * 90 + 100)}`,
      date: item.date || new Date().toISOString().split('T')[0],
    })) as Expense[];
    const created = await getRepository<Expense>(COLLECTION).bulkCreate(expenses);
    logger.info({ count: created.length }, 'Bulk expenses created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<Expense>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk expenses deleted');
    return deleted;
  },
};
