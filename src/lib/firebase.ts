import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, AppCheck } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC_66UiN2PZIlbGB3N_aL1QkXFbbse8mg8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aura-and-stone.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aura-and-stone",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aura-and-stone.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1044154610844",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1044154610844:web:f1e257ede905c15ad0e959",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

let appCheckInstance: AppCheck | null = null;
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY as string | undefined;

if (appCheckSiteKey) {
  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    console.warn('Firebase App Check failed to initialize. Continuing without attestation.', e);
  }
} else if (import.meta.env.PROD) {
  console.warn(
    'VITE_FIREBASE_APPCHECK_SITE_KEY is unset. ' +
    'Firebase services will run without App Check attestation in production.'
  );
}

export const appCheck = appCheckInstance;

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
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
  } catch (error: any) {
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
  await auth.signOut();
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore SEC_RULE Error: ', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}
