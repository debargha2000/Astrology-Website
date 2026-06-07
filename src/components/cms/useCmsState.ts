import type { User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  db as firestoreDb,
  auth as firebaseAuth,
  googleSignIn,
  signInForGmail,
  logout as firebaseLogout,
  initAuth,
  getAccessToken,
  handleFirestoreError,
  OperationType,
} from '../../lib/firebase';
import { apiFetch } from '../../services/apiFetch';
import type { Product } from '../../types';

import { DEFAULT_SITE_FORM } from './seedData';
import {
  ADMIN_EMAIL,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  type Invoice,
  type Vendor,
  type Expense,
  type Task,
  type Checkpoint,
  type SiteForm,
  type AstroContent,
} from './types';

export function useCmsAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const exchangeForJwt = useCallback(
    async (user: { email: string | null; uid: string; displayName: string | null }) => {
      const response = await apiFetch('/api/auth/google-login', {
        method: 'POST',
        body: { email: user.email, uid: user.uid, displayName: user.displayName },
      });
      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Server validation failed. Access denied.');
      }
      setAdminToken(data.token);
      return data.token as string;
    },
    []
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        if (user.email?.toLowerCase() === ADMIN_EMAIL && !getAdminToken()) {
          try {
            await exchangeForJwt({
              email: user.email,
              uid: user.uid,
              displayName: user.displayName,
            });
            setIsAuthenticated(true);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Auto-login token exchange failure:', e);
          }
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        clearAdminToken();
        setIsAuthenticated(false);
      }
    );
    return () => unsubscribe();
  }, [exchangeForJwt]);

  const login = useCallback(async () => {
    setAuthError('');
    setIsAuthLoading(true);
    try {
      const result = await googleSignIn();
      if (!result) {
        setAuthError('Google Sign-In was cancelled or failed.');
        return;
      }
      const { user } = result;
      if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
        setAuthError(
          `Access Restricted: Only ${ADMIN_EMAIL} is authorized. Logged in as ${user.email}`
        );
        await firebaseLogout();
        return;
      }
      await exchangeForJwt({ email: user.email, uid: user.uid, displayName: user.displayName });
      setIsAuthenticated(true);
      setGoogleUser(user);
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Google alignment login failure:', err);
      setAuthError(
        'Connection anomaly or authentication error occurred during Google verification.'
      );
    } finally {
      setIsAuthLoading(false);
    }
  }, [exchangeForJwt]);

  const requestGmailAuthorization = useCallback(async () => {
    try {
      const result = await signInForGmail();
      return result;
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error('Gmail OAuth escalation error:', e);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setGoogleUser(null);
    setGoogleToken(null);
    try {
      await firebaseLogout();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Logout sync anomaly:', e);
    }
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    authError,
    setAuthError,
    isAuthLoading,
    setIsAuthLoading,
    googleUser,
    setGoogleUser,
    googleToken,
    setGoogleToken,
    login,
    logout,
    requestGmailAuthorization,
  };
}

export function useCmsData() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [checkpointsList, setCheckpointsList] = useState<Checkpoint[]>([]);
  const [siteForm, setSiteForm] = useState<SiteForm>(DEFAULT_SITE_FORM);
  const [astroContent, setAstroContent] = useState<AstroContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useFirestoreSource, setUseFirestoreSource] = useState<boolean>(false);
  const [firestoreSyncLoading, setFirestoreSyncLoading] = useState<boolean>(false);
  const [firestoreSyncSuccess, setFirestoreSyncSuccess] = useState<string | null>(null);

  const unsubscribersRef = useRef<(() => void)[]>([]);

  const cleanupFirestoreListeners = useCallback(() => {
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];
  }, []);

  const setupFirestoreListeners = useCallback(() => {
    cleanupFirestoreListeners();

    const unsub1 = onSnapshot(
      collection(firestoreDb, 'invoices'),
      (snap) => setInvoices(snap.docs.map((d) => d.data() as Invoice)),
      (err) => handleFirestoreError(err, OperationType.GET, 'invoices')
    );
    const unsub2 = onSnapshot(
      collection(firestoreDb, 'vendors'),
      (snap) => setVendors(snap.docs.map((d) => d.data() as Vendor)),
      (err) => handleFirestoreError(err, OperationType.GET, 'vendors')
    );
    const unsub3 = onSnapshot(
      collection(firestoreDb, 'expenses'),
      (snap) => setExpenses(snap.docs.map((d) => d.data() as Expense)),
      (err) => handleFirestoreError(err, OperationType.GET, 'expenses')
    );
    const unsub4 = onSnapshot(
      collection(firestoreDb, 'tasks'),
      (snap) => setTasks(snap.docs.map((d) => d.data() as Task)),
      (err) => handleFirestoreError(err, OperationType.GET, 'tasks')
    );
    const unsub5 = onSnapshot(
      query(collection(firestoreDb, 'logs'), orderBy('id', 'desc'), limit(10)),
      (snap) => {
        const dataLogs = snap.docs.map((d) => d.data() as { timestamp: string; message: string });
        setTerminalLog(dataLogs.map((l) => `[${l.timestamp}] ${l.message}`));
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'logs')
    );
    const unsub6 = onSnapshot(
      collection(firestoreDb, 'email_records'),
      () => {},
      (err) => handleFirestoreError(err, OperationType.GET, 'email_records')
    );
    const unsub7 = onSnapshot(
      collection(firestoreDb, 'astro_content'),
      (snap) => setAstroContent(snap.docs.map((d) => d.data() as AstroContent)),
      (err) => handleFirestoreError(err, OperationType.GET, 'astro_content')
    );

    unsubscribersRef.current = [unsub1, unsub2, unsub3, unsub4, unsub5, unsub6, unsub7];
  }, [cleanupFirestoreListeners]);

  useEffect(() => {
    return () => cleanupFirestoreListeners();
  }, [cleanupFirestoreListeners]);

  const loadData = useCallback(async () => {
    if (useFirestoreSource) {
      setIsLoading(true);
      try {
        setupFirestoreListeners();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Firestore listener setup failure', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    cleanupFirestoreListeners();

    const token = getAdminToken();
    if (!token) return;
    setIsLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [
        resInvoices,
        resVendors,
        resExpenses,
        resTasks,
        resLogs,
        resProducts,
        resContent,
        resCheckpoints,
        resAstro,
      ] = await Promise.all([
        apiFetch('/api/invoices', { headers }),
        apiFetch('/api/vendors', { headers }),
        apiFetch('/api/expenses', { headers }),
        apiFetch('/api/tasks', { headers }),
        apiFetch('/api/logs', { headers }),
        apiFetch('/api/products', { headers }),
        apiFetch('/api/website/content', { headers }),
        apiFetch('/api/website/checkpoints', { headers }),
        apiFetch('/api/astro-content', { headers }),
      ]);

      if (resInvoices.status === 401 || resInvoices.status === 403) {
        clearAdminToken();
        return;
      }

      const [
        dataInvoices,
        dataVendors,
        dataExpenses,
        dataTasks,
        dataLogs,
        dataProducts,
        dataContent,
        dataCheckpoints,
        dataAstro,
      ] = await Promise.all([
        resInvoices.json(),
        resVendors.json(),
        resExpenses.json(),
        resTasks.json(),
        resLogs.json(),
        resProducts.json(),
        resContent.json(),
        resCheckpoints.json(),
        resAstro.json(),
      ]);

      setInvoices(dataInvoices || []);
      setVendors(dataVendors || []);
      setExpenses(dataExpenses || []);
      setTasks(dataTasks || []);
      setProductsList(dataProducts || []);
      setSiteForm({ ...DEFAULT_SITE_FORM, ...(dataContent || {}) });
      setCheckpointsList(dataCheckpoints || []);
      setAstroContent(dataAstro || []);
      setTerminalLog(
        (dataLogs || []).map(
          (l: { timestamp: string; message: string }) => `[${l.timestamp}] ${l.message}`
        )
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to align temple records', err);
    } finally {
      setIsLoading(false);
    }
  }, [useFirestoreSource, setupFirestoreListeners, cleanupFirestoreListeners]);

  return {
    invoices,
    setInvoices,
    vendors,
    setVendors,
    expenses,
    setExpenses,
    tasks,
    setTasks,
    terminalLog,
    setTerminalLog,
    productsList,
    setProductsList,
    checkpointsList,
    setCheckpointsList,
    siteForm,
    setSiteForm,
    astroContent,
    setAstroContent,
    isLoading,
    setIsLoading,
    useFirestoreSource,
    setUseFirestoreSource,
    firestoreSyncLoading,
    setFirestoreSyncLoading,
    firestoreSyncSuccess,
    setFirestoreSyncSuccess,
    loadData,
  };
}

export { firestoreDb, firebaseAuth, getAccessToken };

export type CmsDataApi = ReturnType<typeof useCmsData>;
export type CmsAuthApi = ReturnType<typeof useCmsAuth>;

export type CmsState = CmsDataApi & CmsAuthApi;
