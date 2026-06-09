import { logger } from '../../middleware/logging.js';
import type { AstroContent } from '../../schemas/astroContent.js';
import { getRepository } from '../RepositoryFactory.js';

const COLLECTION = 'astroContent';

export const astroContentService = {
  async findAll(): Promise<AstroContent[]> {
    return getRepository<AstroContent>(COLLECTION).findAll();
  },

  async findById(id: string): Promise<AstroContent | null> {
    return getRepository<AstroContent>(COLLECTION).findById(id);
  },

  async create(
    data: Omit<AstroContent, 'id' | 'updatedAt' | 'updatedBy'> & { updatedBy: string }
  ): Promise<AstroContent> {
    const created = await getRepository<AstroContent>(COLLECTION).create({
      ...data,
      id: `astro-${data.type}-${data.key}-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
    logger.info(
      { astroContentId: created.id, type: created.type, key: created.key },
      'Astro content created'
    );
    return created;
  },

  async update(id: string, data: Partial<AstroContent>): Promise<AstroContent | null> {
    const updated = await getRepository<AstroContent>(COLLECTION).update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    if (updated) {
      logger.info({ astroContentId: id }, 'Astro content updated');
    }
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await getRepository<AstroContent>(COLLECTION).delete(id);
    if (deleted) {
      logger.info({ astroContentId: id }, 'Astro content deleted');
    }
    return deleted;
  },

  async bulkCreate(
    entries: (Omit<AstroContent, 'id' | 'updatedAt' | 'updatedBy'> & { updatedBy: string })[]
  ): Promise<AstroContent[]> {
    const created = await getRepository<AstroContent>(COLLECTION).bulkCreate(
      entries.map((entry) => ({
        ...entry,
        id: `astro-${entry.type}-${entry.key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        updatedAt: new Date().toISOString(),
      }))
    );
    logger.info({ count: created.length }, 'Astro content bulk created');
    return created;
  },
};
