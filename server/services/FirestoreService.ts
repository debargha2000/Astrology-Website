import fs from 'fs';

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

import { logger } from '../middleware/logging.js';

const CONFIG_PATH = './firebase-applet-config.json';
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';

let projectId = 'aura-and-stone';
let firestoreDatabaseId: string | undefined = undefined;

try {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (config.projectId) projectId = config.projectId;
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      firestoreDatabaseId = config.firestoreDatabaseId;
    }
  }
} catch {
  // Config file missing or malformed, use defaults
}

let firestoreDb: admin.firestore.Firestore | null = null;
let useLocalFallback = false;

function getServiceAccount(): admin.ServiceAccount | null {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      return JSON.parse(envKey) as admin.ServiceAccount;
    } catch (err) {
      logger.warn({ err }, 'FIREBASE_SERVICE_ACCOUNT_KEY is set but invalid JSON');
    }
  }
  try {
    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      return JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8')) as admin.ServiceAccount;
    }
  } catch {
    // Service account file missing
  }
  return null;
}

export function getFirestoreDB() {
  if (useLocalFallback) return null;
  if (firestoreDb) return firestoreDb;

  try {
    if (admin.apps.length === 0) {
      const serviceAccount = getServiceAccount();
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId,
        });
      } else {
        admin.initializeApp({ projectId });
      }
    }
    const app = admin.app();
    firestoreDb = firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
    logger.info('Firestore initialized successfully');
    return firestoreDb;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.warn({ reason }, 'Firestore unavailable, falling back to local storage');
    useLocalFallback = true;
    return null;
  }
}

export function isFirebaseActive(): boolean {
  return getFirestoreDB() !== null;
}
