import { logger } from '../../middleware/logging.js';
import type { Invoice } from '../../schemas/index.js';
import { getRepository } from '../RepositoryFactory.js';

const COLLECTION = 'invoices';

export const invoiceService = {
  async findAll(): Promise<Invoice[]> {
    return getRepository<Invoice>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<Invoice | null> {
    return getRepository<Invoice>(COLLECTION).findById(id);
  },

  async create(data: Omit<Invoice, 'id'>): Promise<Invoice> {
    const created = await getRepository<Invoice>(COLLECTION).create(data);
    logger.info({ invoiceId: created.id, client: created.client }, 'Invoice created');
    return created;
  },

  async update(id: string, data: Partial<Invoice>): Promise<Invoice | null> {
    const updated = await getRepository<Invoice>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ invoiceId: id, client: updated.client }, 'Invoice updated');
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepository<Invoice>(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ invoiceId: id, client: existing?.client }, 'Invoice deleted');
    }
    return deleted;
  },

  async bulkCreate(items: Omit<Invoice, 'id'>[]): Promise<Invoice[]> {
    const created = await getRepository<Invoice>(COLLECTION).bulkCreate(items);
    logger.info({ count: created.length }, 'Invoices bulk created');
    return created;
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const deleted = await getRepository<Invoice>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Invoices bulk deleted');
    return deleted;
  },
};
