import { logger } from '../middleware/logging.js';
import type { Product } from '../schemas/product.js';
import type { WebsiteContent } from '../schemas/websiteContent.js';
import { getRepository } from '../services/RepositoryFactory.js';

import { productRepository } from './ProductRepository.js';
import { websiteContentRepository } from './WebsiteContentRepository.js';

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

export const checkpointRepository = {
  async findAll() {
    return getRepository<Checkpoint>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<Checkpoint>(COLLECTION).findById(id);
  },

  async create(title: string, user: string) {
    const websiteContent = await websiteContentRepository.findAll();
    const products = await productRepository.findAll();

    const checkpoint: Checkpoint = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: title || 'Periodic Operational Checkpoint',
      user,
      websiteContent,
      products,
    };

    const created = await getRepository<Checkpoint>(COLLECTION).create(checkpoint);

    // Clean up old checkpoints
    await this.cleanupOldCheckpoints();

    logger.info({ checkpointId: created.id, title: created.title }, 'Checkpoint created');
    return created;
  },

  async rollback(id: string) {
    const checkpoint = await this.findById(id);
    if (!checkpoint) {
      throw new Error(`Checkpoint with ID "${id}" not found`);
    }

    // Restore website content
    await websiteContentRepository.save(checkpoint.websiteContent);

    // Restore products
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

  async cleanupOldCheckpoints() {
    const checkpoints = await this.findAll();
    if (checkpoints.length > MAX_CHECKPOINTS) {
      const toDelete = checkpoints.slice(MAX_CHECKPOINTS).map((c) => c.id);
      await getRepository<Checkpoint>(COLLECTION).bulkDelete(toDelete);
    }
  },

  async delete(id: string) {
    return getRepository<Checkpoint>(COLLECTION).delete(id);
  },
};
