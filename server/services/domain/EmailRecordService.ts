import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { logger } from '../../middleware/logging.js';
import { getRepository, getFirestoreDB } from '../RepositoryFactory.js';

const COLLECTION = 'emailRecords';

export interface EmailRecord {
  id: string;
  clientName: string;
  email: string;
  subject: string;
  dateStr: string;
}

export const emailRecordService = {
  async findAll(): Promise<EmailRecord[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection(COLLECTION).orderBy('id', 'desc').limit(50).get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as EmailRecord);
      } catch (e) {
        logger.error({ err: e }, 'Firestore getEmailRecords failure, falling back to local');
      }
    }
    const repo = getRepository<EmailRecord>(COLLECTION);
    return repo.findAll();
  },

  async create(data: Omit<EmailRecord, 'id'>): Promise<EmailRecord> {
    const id = `email-${Date.now()}`;
    const newRecord: EmailRecord = { ...data, id };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION).doc(id).set(newRecord);
        return newRecord;
      } catch (e) {
        logger.error({ err: e }, 'Firestore addEmailRecord failure, falling back to local');
      }
    }

    const repo = getRepository<EmailRecord>(COLLECTION);
    await repo.create(newRecord);
    return newRecord;
  },
};
