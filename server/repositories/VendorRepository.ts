import { logger } from '../middleware/logging.js';
import type { Vendor } from '../schemas/vendor.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'vendors';

export const vendorRepository = {
  async findAll() {
    return getRepository<Vendor>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<Vendor>(COLLECTION).findById(id);
  },

  async create(data: Partial<Vendor>) {
    const vendor = {
      ...data,
      id: data.id || `VND-${Math.floor(Math.random() * 90 + 300)}`,
      rating: data.rating || 5,
      status: data.status || 'Approved',
    } as Vendor;
    const created = await getRepository<Vendor>(COLLECTION).create(vendor);
    logger.info({ vendorId: created.id, name: created.name }, 'Vendor created');
    return created;
  },

  async update(id: string, data: Partial<Vendor>) {
    const updated = await getRepository<Vendor>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ vendorId: id }, 'Vendor updated');
    }
    return updated;
  },

  async delete(id: string) {
    const result = await getRepository<Vendor>(COLLECTION).delete(id);
    if (result) {
      logger.info({ vendorId: id }, 'Vendor deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<Vendor>[]) {
    const vendors = items.map((item) => ({
      ...item,
      id: item.id || `VND-${Math.floor(Math.random() * 90 + 300)}`,
      rating: item.rating || 5,
      status: item.status || 'Approved',
    })) as Vendor[];
    const created = await getRepository<Vendor>(COLLECTION).bulkCreate(vendors);
    logger.info({ count: created.length }, 'Bulk vendors created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<Vendor>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk vendors deleted');
    return deleted;
  },
};
