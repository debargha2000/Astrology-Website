import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { logger } from '../../middleware/logging.js';
import { getRepository, getFirestoreDB } from '../RepositoryFactory.js';

const COLLECTION = 'logs';

export interface TerminalLog {
  id: string;
  timestamp: string;
  message: string;
}

export const logService = {
  async findAll(): Promise<TerminalLog[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection(COLLECTION).orderBy('id', 'desc').limit(10).get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as TerminalLog);
      } catch (e) {
        logger.error({ err: e }, 'Firestore getLogs failure, falling back to local');
      }
    }
    const repo = getRepository<TerminalLog>(COLLECTION);
    return repo.findAll();
  },

  async create(message: string): Promise<TerminalLog> {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const logId = `log-${Date.now()}`;
    const newLog: TerminalLog = { id: logId, timestamp, message };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION).doc(logId).set(newLog);
        return newLog;
      } catch (e) {
        logger.error({ err: e }, 'Firestore addLog failure, falling back to local');
      }
    }

    const repo = getRepository<TerminalLog>(COLLECTION);
    await repo.create(newLog);
    return newLog;
  },
};
