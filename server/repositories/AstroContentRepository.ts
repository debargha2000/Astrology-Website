import { logger } from '../middleware/logging.js';
import type { AstroContent } from '../schemas/astroContent.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'astro_content';

export const astroContentRepository = {
  async findAll() {
    return getRepository<AstroContent>(COLLECTION).findAll();
  },

  async findById(id: string) {
    return getRepository<AstroContent>(COLLECTION).findById(id);
  },

  async create(data: Partial<AstroContent>) {
    const astroContent = {
      ...data,
      id: data.id || `astro-${data.type}-${data.key}-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: data.updatedBy || 'system',
    } as AstroContent;
    const created = await getRepository<AstroContent>(COLLECTION).create(astroContent);
    logger.info({ astroContentId: created.id, type: created.type }, 'Astro content created');
    return created;
  },

  async update(id: string, data: Partial<AstroContent>) {
    const updated = await getRepository<AstroContent>(COLLECTION).update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    if (updated) {
      logger.info({ astroContentId: id }, 'Astro content updated');
    }
    return updated;
  },

  async delete(id: string) {
    const result = await getRepository<AstroContent>(COLLECTION).delete(id);
    if (result) {
      logger.info({ astroContentId: id }, 'Astro content deleted');
    }
    return result;
  },

  async bulkCreate(items: Partial<AstroContent>[]) {
    const contents = items.map((item) => ({
      ...item,
      id:
        item.id ||
        `astro-${item.type}-${item.key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      updatedAt: new Date().toISOString(),
      updatedBy: item.updatedBy || 'system',
    })) as AstroContent[];
    const created = await getRepository<AstroContent>(COLLECTION).bulkCreate(contents);
    logger.info({ count: created.length }, 'Bulk astro content created');
    return created;
  },

  async bulkDelete(ids: string[]) {
    const deleted = await getRepository<AstroContent>(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, 'Bulk astro content deleted');
    return deleted;
  },
};
