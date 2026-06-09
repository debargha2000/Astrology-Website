import { logger } from '../../middleware/logging.js';
import type { Vendor } from '../../schemas/vendor.js';
import { getRepository } from '../RepositoryFactory.js';

const COLLECTION = 'vendors';

export const vendorService = {
  async findAll(): Promise<Vendor[]> {
    return getRepository<Vendor>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<Vendor | null> {
    return getRepository<Vendor>(COLLECTION).findById(id);
  },

  async create(data: Omit<Vendor, 'id' | 'rating' | 'status'>): Promise<Vendor> {
    const created = await getRepository<Vendor>(COLLECTION).create({
      ...data,
      rating: 5,
      status: 'Approved',
    } as Vendor);
    logger.info({ vendorId: created.id, name: created.name }, 'Vendor created');
    return created;
  },

  async update(id: string, data: Partial<Vendor>): Promise<Vendor | null> {
    const updated = await getRepository<Vendor>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ vendorId: id, name: updated.name }, 'Vendor updated');
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepository<Vendor>(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ vendorId: id, name: existing?.name }, 'Vendor deleted');
    }
    return deleted;
  },

  async bulkCreate(items: Omit<Vendor, 'id' | 'rating' | 'status'>[]): Promise<Vendor[]> {
    const created = await getRepository<Vendor>(COLLECTION).bulkCreate(
      items.map((item) => ({ ...item, rating: 5, status: 'Approved' }) as Vendor)
    );
    logger.info({ count: created.length }, 'Vendors bulk created');
    return created;
  },

  async bulkDelete(ids: string[]): Promise<number> {
    const deleted = await getRepository<Vendor>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Vendors bulk deleted');
    return deleted;
  },
};
