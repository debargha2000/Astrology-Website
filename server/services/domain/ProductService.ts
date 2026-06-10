import { PRODUCTS } from '../../../src/data/index.js';
import { logger } from '../../middleware/logging.js';
import type { Product } from '../../schemas/index.js';
import { getRepository, getFirestoreDB } from '../RepositoryFactory.js';

const COLLECTION = 'products';

export const productService = {
  async findAll(): Promise<Product[]> {
    const repo = getRepository<Product>(COLLECTION);
    const products = await repo.findAll();
    if (products.length === 0) {
      for (const p of PRODUCTS) {
        await repo.create(p);
      }
      return PRODUCTS;
    }
    return products;
  },

  async findById(id: string): Promise<Product | null> {
    return getRepository<Product>(COLLECTION).findById(id);
  },

  async create(data: Product): Promise<Product> {
    const repo = getRepository<Product>(COLLECTION);
    const existing = await repo.findById(data.id);
    if (existing) {
      return repo.update(data.id, data) as Promise<Product>;
    }
    const created = await repo.create(data);
    logger.info({ productId: created.id, name: created.name }, 'Product created');
    return created;
  },

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const updated = await getRepository<Product>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ productId: id, name: updated.name }, 'Product updated');
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const repo = getRepository<Product>(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ productId: id, name: existing?.name }, 'Product deleted');
    }
    return deleted;
  },

  async save(product: Product): Promise<Product> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION).doc(product.id).set(product);
        logger.info({ productId: product.id, name: product.name }, 'Product saved to Firestore');
        return product;
      } catch (e) {
        logger.error(
          { err: e, productId: product.id },
          'Firestore saveProduct error, falling back to local'
        );
      }
    }

    const repo = getRepository<Product>(COLLECTION);
    const existing = await repo.findById(product.id);
    if (existing) {
      return repo.update(product.id, product) as Promise<Product>;
    }
    return repo.create(product);
  },
};
