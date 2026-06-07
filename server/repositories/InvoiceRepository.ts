import { logger } from '../middleware/logging.js';
import type { Invoice } from '../schemas/invoice.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'invoices';

export const invoiceRepository = {
  async findAll() {
    return getRepository<Invoice>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<Invoice>(COLLECTION).findById(id);
  },

  async create(data: Partial<Invoice>) {
    const invoice = {
      ...data,
      id: data.id || `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'Sent',
      alignment: data.alignment || 'Universal Alignment',
    } as Invoice;
    const created = await getRepository<Invoice>(COLLECTION).create(invoice);
    logger.info(
      { invoiceId: created.id, client: created.client, amount: created.amount },
      'Invoice created'
    );
    return created;
  },

  async update(id: string, data: Partial<Invoice>) {
    const updated = await getRepository<Invoice>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ invoiceId: id }, 'Invoice updated');
    }
    return updated;
  },

  async delete(id: string) {
    const result = await getRepository<Invoice>(COLLECTION).delete(id);
    if (result) {
      logger.info({ invoiceId: id }, 'Invoice deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<Invoice>[]) {
    const invoices = items.map((item) => ({
      ...item,
      id: item.id || `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      date: item.date || new Date().toISOString().split('T')[0],
      status: item.status || 'Sent',
      alignment: item.alignment || 'Universal Alignment',
    })) as Invoice[];
    const created = await getRepository<Invoice>(COLLECTION).bulkCreate(invoices);
    logger.info({ count: created.length }, 'Bulk invoices created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<Invoice>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk invoices deleted');
    return deleted;
  },
};
