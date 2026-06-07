import { DEFAULT_WEBSITE_CONTENT } from '../../src/data.js';
import { logger } from '../middleware/logging.js';
import type { WebsiteContent } from '../schemas/websiteContent.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'websiteContent';

type WebsiteContentDoc = WebsiteContent & { id: string };

export const websiteContentRepository = {
  async findAll() {
    const repo = getRepository<WebsiteContentDoc>(COLLECTION);
    const content = await repo.findAll();
    return (content[0] as WebsiteContentDoc) || DEFAULT_WEBSITE_CONTENT;
  },

  async findById(id: string) {
    return getRepository<WebsiteContentDoc>(COLLECTION).findById(id);
  },

  async create(data: Partial<WebsiteContent>) {
    const created = await getRepository<WebsiteContentDoc>(COLLECTION).create({
      ...data,
      id: 'homepage',
    } as WebsiteContentDoc);
    logger.info('Website content created');
    return created;
  },

  async update(id: string, data: Partial<WebsiteContent>) {
    const updated = await getRepository<WebsiteContentDoc>(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ contentId: id }, 'Website content updated');
    }
    return updated;
  },

  async save(data: Partial<WebsiteContent>) {
    const repo = getRepository<WebsiteContentDoc>(COLLECTION);
    const existing = await repo.findAll();
    if (existing && existing[0]?.id) {
      return repo.update(existing[0].id, data);
    }
    return repo.create({ ...data, id: 'homepage' } as WebsiteContentDoc);
  },
};
