import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

function getEnv(key: string): string | undefined {
  return import.meta.env[key] as string | undefined;
}

const apiKey = getEnv('VITE_FIREBASE_API_KEY');
const authDomain = getEnv('VITE_FIREBASE_AUTH_DOMAIN');
const projectId = getEnv('VITE_FIREBASE_PROJECT_ID');
const storageBucket = getEnv('VITE_FIREBASE_STORAGE_BUCKET');
const messagingSenderId = getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID');
const appId = getEnv('VITE_FIREBASE_APP_ID');

const isConfigComplete = !!(
  apiKey &&
  authDomain &&
  projectId &&
  storageBucket &&
  messagingSenderId &&
  appId
);

let app: FirebaseApp | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

if (isConfigComplete) {
  try {
    app = initializeApp({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    });
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase SDK:', error);
  }
} else {
  // eslint-disable-next-line no-console
  console.warn(
    'Firebase environment variables are missing or incomplete. ' +
      'Some features (like real-time DB and Google Auth) will be disabled.'
  );
}

export { db, storage, auth };

let appCheckInstance: AppCheck | null = null;
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY as string | undefined;

if (app && appCheckSiteKey) {
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Firebase App Check failed to initialize. Continuing without attestation.', e);
  }
} else if (import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_FIREBASE_APPCHECK_SITE_KEY is missing in production. Firebase App Check is disabled.'
  );
}

export const appCheck = appCheckInstance;

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) {
      setTimeout(onAuthFailure, 0);
    }
    return () => {};
  }
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

function buildProvider(scopes: string[] = []): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  for (const scope of scopes) {
    provider.addScope(scope);
  }
  return provider;
}

export async function googleSignIn(
  scopes: string[] = []
): Promise<{ user: User; accessToken: string } | null> {
  if (!auth) {
    throw new Error(
      'Firebase Auth is not initialized. Please configure your Firebase environment variables.'
    );
  }
  try {
    isSigningIn = true;
    const provider = buildProvider(scopes);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain verified Google OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Google OAuth Handshake Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

export const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

export const signInForGmail = (): Promise<{ user: User; accessToken: string } | null> =>
  googleSignIn([GMAIL_SEND_SCOPE]);

export const getAccessToken = async (): Promise<string | null> => cachedAccessToken;

export const logout = async () => {
  if (auth) {
    await auth.signOut();
  }
  cachedAccessToken = null;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  // eslint-disable-next-line no-console
  console.error('Firestore SEC_RULE Error: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
