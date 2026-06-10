import { logger } from '../../middleware/logging.js';
import type { Product, WebsiteContent } from '../../schemas/index.js';
import { getRepository } from '../RepositoryFactory.js';

import { productService } from './ProductService.js';
import { websiteContentService } from './WebsiteContentService.js';

const COLLECTION = 'checkpoints';
const MAX_CHECKPOINTS = 25;

type Checkpoint = {
  id: string;
  timestamp: string;
  title: string;
  user: string;
  websiteContent: WebsiteContent;
  products: Product[];
};

export const checkpointService = {
  async findAll(): Promise<Checkpoint[]> {
    return getRepository<Checkpoint>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<Checkpoint | null> {
    return getRepository<Checkpoint>(COLLECTION).findById(id);
  },

  async create(title: string, user: string): Promise<Checkpoint> {
    const websiteContent = await websiteContentService.findAll();
    const products = await productService.findAll();

    const checkpoint: Checkpoint = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: title || 'Periodic Operational Checkpoint',
      user,
      websiteContent,
      products,
    };

    const created = await getRepository<Checkpoint>(COLLECTION).create(checkpoint);
    await this.cleanupOldCheckpoints();
    logger.info({ checkpointId: created.id, title: created.title }, 'Checkpoint created');
    return created;
  },

  async rollback(id: string): Promise<boolean> {
    const checkpoint = await this.findById(id);
    if (!checkpoint) {
      throw new Error(`Checkpoint with ID "${id}" not found`);
    }

    await websiteContentService.save(checkpoint.websiteContent);

    const repo = getRepository<Product>('products');
    const existingProducts = await repo.findAll();
    for (const product of existingProducts) {
      await repo.delete(product.id);
    }
    for (const product of checkpoint.products) {
      await repo.create(product);
    }

    logger.info({ checkpointId: id, title: checkpoint.title }, 'Rollback completed');
    return true;
  },

  async cleanupOldCheckpoints(): Promise<void> {
    const checkpoints = await this.findAll();
    if (checkpoints.length > MAX_CHECKPOINTS) {
      const toDelete = checkpoints.slice(MAX_CHECKPOINTS).map((c) => c.id);
      await getRepository<Checkpoint>(COLLECTION).bulkDelete(toDelete);
    }
  },

  async delete(id: string): Promise<boolean> {
    return getRepository<Checkpoint>(COLLECTION).delete(id);
  },
};
