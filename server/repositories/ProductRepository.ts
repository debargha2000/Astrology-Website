import { PRODUCTS } from '../../src/data.js';
import { logger } from '../middleware/logging.js';
import type { Product } from '../schemas/product.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'products';

export const productRepository = {
  async findAll() {
    const repo = getRepository<Product>(COLLECTION);
    const products = await repo.findAll();
    if (products.length === 0) {
      // Seed products
      for (const p of PRODUCTS) {
        await repo.create(p);
      }
      return PRODUCTS;
    }
    return products;
  },

  async findById(id: string) {
    return getRepository<Product>(COLLECTION).findById(id);
  },

  async create(data: Partial<Product>) {
    const created = await getRepository<Product>(COLLECTION).create(
      data as Omit<Product, 'id'> & { id?: string }
    );
    logger.info({ productId: created.id, name: created.name }, 'Product created');
    return created;
  },

  async update(id: string, data: Partial<Product>) {
    const updated = await getRepository<Product>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ productId: id }, 'Product updated');
    }
    return updated;
  },

  async delete(id: string) {
    const result = await getRepository<Product>(COLLECTION).delete(id);
    if (result) {
      logger.info({ productId: id }, 'Product deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<Product>[]) {
    const created = await getRepository<Product>(COLLECTION).bulkCreate(items as Product[]);
    logger.info({ count: created.length }, 'Bulk products created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<Product>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk products deleted');
    return deleted;
  },
};
