import { logger } from '../middleware/logging.js';
import { getRepository } from '../services/RepositoryFactory.js';

const COLLECTION = 'emailRecords';

type EmailRecord = {
  id: string;
  clientName: string;
  email: string;
  subject: string;
  dateStr: string;
};

export const emailRecordRepository = {
  async findAll(limit = 50) {
    const records = await getRepository<EmailRecord>(COLLECTION).findAll();
    return records.slice(0, limit);
  },

  async create(data: Partial<EmailRecord>) {
    const record = {
      ...data,
      id: data.id || `email-${Date.now()}`,
      dateStr:
        data.dateStr ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    } as EmailRecord;
    const created = await getRepository<EmailRecord>(COLLECTION).create(record);
    logger.info({ emailRecordId: created.id, email: created.email }, 'Email record created');
    return created;
  },

  async delete(id: string) {
    return getRepository<EmailRecord>(COLLECTION).delete(id);
  },
};
