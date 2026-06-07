import { logger } from '../middleware/logging.js';

import { getFirestoreDB, isFirebaseActive } from './FirestoreService.js';
import { localFileService } from './LocalFileService.js';

export type StorageBackend = 'firestore' | 'local';

let currentBackend: StorageBackend = 'local';

export function getStorageBackend(): StorageBackend {
  if (isFirebaseActive()) {
    currentBackend = 'firestore';
  } else {
    currentBackend = 'local';
  }
  return currentBackend;
}

interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id'> & { id?: string }): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  bulkCreate(items: (Omit<T, 'id'> & { id?: string })[]): Promise<T[]>;
  bulkDelete(ids: string[]): Promise<number>;
}

function generateId(collectionName: string): string {
  const prefixes: Record<string, string> = {
    invoices: 'INV',
    vendors: 'VND',
    expenses: 'EXP',
    tasks: 'TSK',
    products: 'PROD',
    astro_content: 'ASTRO',
    checkpoints: 'CHK',
    terminalLog: 'LOG',
    emailRecords: 'EMAIL',
  };
  const prefix = prefixes[collectionName] || 'ID';
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createFirestoreRepository<T extends { id: string }>(
  collectionName: string
): Repository<T> {
  const db = getFirestoreDB();
  if (!db) {
    logger.warn('Firestore not available, falling back to local');
    return createLocalRepository<T>(collectionName);
  }

  const collection = db.collection(collectionName);

  return {
    async findAll(): Promise<T[]> {
      const snapshot = await collection.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    },
    async findById(id: string): Promise<T | null> {
      const doc = await collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() } as T;
    },
    async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
      const id =
        ((data as Record<string, unknown>).id as string | undefined) || generateId(collectionName);
      const newData = { ...data, id };
      await collection.doc(id).set(newData);
      return newData as T;
    },
    async update(id: string, data: Partial<T>): Promise<T | null> {
      const docRef = collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return null;
      await docRef.update(data);
      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() } as T;
    },
    async delete(id: string): Promise<boolean> {
      const docRef = collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    },
    async bulkCreate(items: (Omit<T, 'id'> & { id?: string })[]): Promise<T[]> {
      const batch = db.batch();
      const results: T[] = [];
      for (const item of items) {
        const id =
          ((item as Record<string, unknown>).id as string | undefined) ||
          generateId(collectionName);
        const newItem = { ...item, id } as T;
        batch.set(collection.doc(id), newItem);
        results.push(newItem);
      }
      await batch.commit();
      return results;
    },
    async bulkDelete(ids: string[]): Promise<number> {
      const batch = db.batch();
      for (const id of ids) {
        batch.delete(collection.doc(id));
      }
      await batch.commit();
      return ids.length;
    },
  };
}

function createLocalRepository<T extends { id: string }>(collectionName: string): Repository<T> {
  return {
    async findAll(): Promise<T[]> {
      return localFileService.getCollection<T>(
        collectionName as Parameters<typeof localFileService.getCollection>[0]
      );
    },
    async findById(id: string): Promise<T | null> {
      return localFileService.findById<T>(
        collectionName as Parameters<typeof localFileService.findById>[0],
        id
      );
    },
    async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
      return localFileService.create<T>(
        collectionName as Parameters<typeof localFileService.create>[0],
        data as T
      );
    },
    async update(id: string, data: Partial<T>): Promise<T | null> {
      return localFileService.update<T>(
        collectionName as Parameters<typeof localFileService.update>[0],
        id,
        data
      );
    },
    async delete(id: string): Promise<boolean> {
      return localFileService.delete(
        collectionName as Parameters<typeof localFileService.delete>[0],
        id
      );
    },
    async bulkCreate(items: (Omit<T, 'id'> & { id?: string })[]): Promise<T[]> {
      return localFileService.bulkCreate<T>(
        collectionName as Parameters<typeof localFileService.bulkCreate>[0],
        items as T[]
      );
    },
    async bulkDelete(ids: string[]): Promise<number> {
      return localFileService.bulkDelete(
        collectionName as Parameters<typeof localFileService.bulkDelete>[0],
        ids
      );
    },
  };
}

export function getRepository<T extends { id: string }>(collectionName: string): Repository<T> {
  const backend = getStorageBackend();
  logger.debug({ collectionName, backend }, 'Using storage backend');

  if (backend === 'firestore') {
    return createFirestoreRepository<T>(collectionName);
  }
  return createLocalRepository<T>(collectionName);
}
