import { DEFAULT_WEBSITE_CONTENT } from '../../../src/data/index.js';
import { logger } from '../../middleware/logging.js';
import type { WebsiteContent } from '../../schemas/index.js';
import { getRepository, getFirestoreDB } from '../RepositoryFactory.js';

const COLLECTION = 'websiteContent';

export const websiteContentService = {
  async findAll(): Promise<WebsiteContent> {
    const repo = getRepository<WebsiteContent & { id: string }>(COLLECTION);
    const content = await repo.findAll();
    return (content[0] as WebsiteContent & { id: string }) || DEFAULT_WEBSITE_CONTENT;
  },

  async findById(id: string): Promise<WebsiteContent | null> {
    return getRepository<WebsiteContent & { id: string }>(COLLECTION).findById(id);
  },

  async create(data: Partial<WebsiteContent>): Promise<WebsiteContent & { id: string }> {
    const created = await getRepository<WebsiteContent & { id: string }>(COLLECTION).create({
      ...DEFAULT_WEBSITE_CONTENT,
      ...data,
      id: 'homepage',
    });
    logger.info('Website content created');
    return created;
  },

  async update(id: string, data: Partial<WebsiteContent>): Promise<WebsiteContent | null> {
    const updated = await getRepository<WebsiteContent & { id: string }>(COLLECTION).update(
      id,
      data
    );
    if (updated) {
      logger.info({ contentId: id }, 'Website content updated');
    }
    return updated;
  },

  async save(data: Partial<WebsiteContent>): Promise<WebsiteContent> {
    const fullData = { ...DEFAULT_WEBSITE_CONTENT, ...data } as WebsiteContent;
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION).doc('homepage').set(fullData);
        logger.info('Website content saved to Firestore');
        return fullData;
      } catch (e) {
        logger.error({ err: e }, 'Firestore saveWebsiteContent error, falling back to local');
      }
    }

    const repo = getRepository<WebsiteContent & { id: string }>(COLLECTION);
    const existing = await repo.findAll();
    if (existing && existing[0]?.id) {
      return repo.update(existing[0].id, fullData) as Promise<WebsiteContent>;
    }
    return repo.create({ ...fullData, id: 'homepage' } as WebsiteContent & { id: string });
  },
};
