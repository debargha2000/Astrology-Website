import { useCallback, useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import {
  db as firestoreDb,
  auth as firebaseAuth,
  googleSignIn,
  signInForGmail,
  logout as firebaseLogout,
  initAuth,
  getAccessToken,
  handleFirestoreError,
  OperationType
} from '../../lib/firebase';
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
  type SiteForm
} from './types';
import { DEFAULT_SITE_FORM } from './seedData';
import { apiFetch } from '../../services/apiFetch';

export function useCmsAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const exchangeForJwt = useCallback(
    async (user: { email: string | null; uid: string; displayName: string | null }) => {
      const response = await apiFetch('/api/auth/google-login', {
        method: 'POST',
        body: { email: user.email, uid: user.uid, displayName: user.displayName }
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
            await exchangeForJwt({ email: user.email, uid: user.uid, displayName: user.displayName });
            setIsAuthenticated(true);
          } catch (e) {
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
        setAuthError(`Access Restricted: Only ${ADMIN_EMAIL} is authorized. Logged in as ${user.email}`);
        await firebaseLogout();
        return;
      }
      await exchangeForJwt({ email: user.email, uid: user.uid, displayName: user.displayName });
      setIsAuthenticated(true);
      setGoogleUser(user);
    } catch (err: any) {
      console.error('Google alignment login failure:', err);
      setAuthError('Connection anomaly or authentication error occurred during Google verification.');
    } finally {
      setIsAuthLoading(false);
    }
  }, [exchangeForJwt]);

  const requestGmailAuthorization = useCallback(async () => {
    try {
      const result = await signInForGmail();
      return result;
    } catch (e: any) {
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
    requestGmailAuthorization
  };
}

export function useCmsData() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [checkpointsList, setCheckpointsList] = useState<Checkpoint[]>([]);
  const [siteForm, setSiteForm] = useState<SiteForm>(DEFAULT_SITE_FORM);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useFirestoreSource, setUseFirestoreSource] = useState<boolean>(false);
  const [firestoreSyncLoading, setFirestoreSyncLoading] = useState<boolean>(false);
  const [firestoreSyncSuccess, setFirestoreSyncSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (useFirestoreSource) {
      setIsLoading(true);
      try {
        const [invSnap, venSnap, expSnap, tskSnap, logSnap] = await Promise.all([
          getDocs(collection(firestoreDb, 'invoices')).catch((err) => handleFirestoreError(err, OperationType.GET, 'invoices')),
          getDocs(collection(firestoreDb, 'vendors')).catch((err) => handleFirestoreError(err, OperationType.GET, 'vendors')),
          getDocs(collection(firestoreDb, 'expenses')).catch((err) => handleFirestoreError(err, OperationType.GET, 'expenses')),
          getDocs(collection(firestoreDb, 'tasks')).catch((err) => handleFirestoreError(err, OperationType.GET, 'tasks')),
          getDocs(collection(firestoreDb, 'logs')).catch((err) => handleFirestoreError(err, OperationType.GET, 'logs'))
        ]);

        setInvoices(invSnap.docs.map((d) => d.data() as Invoice));
        setVendors(venSnap.docs.map((d) => d.data() as Vendor));
        setExpenses(expSnap.docs.map((d) => d.data() as Expense));
        setTasks(tskSnap.docs.map((d) => d.data() as Task));

        const dataLogs = logSnap.docs.map((d) => d.data());
        const sortedLogs = [...dataLogs].sort((a: any, b: any) => b.id.localeCompare(a.id));
        setTerminalLog(sortedLogs.map((l: any) => `[${l.timestamp}] ${l.message}`));
      } catch (err) {
        console.error('Firestore alignment sync failure', err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const token = getAdminToken();
    if (!token) return;
    setIsLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resInvoices, resVendors, resExpenses, resTasks, resLogs, resProducts, resContent, resCheckpoints] = await Promise.all([
        apiFetch('/api/invoices', { headers }),
        apiFetch('/api/vendors', { headers }),
        apiFetch('/api/expenses', { headers }),
        apiFetch('/api/tasks', { headers }),
        apiFetch('/api/logs', { headers }),
        apiFetch('/api/products', { headers }),
        apiFetch('/api/website/content', { headers }),
        apiFetch('/api/website/checkpoints', { headers })
      ]);

      if (resInvoices.status === 401 || resInvoices.status === 403) {
        clearAdminToken();
        return;
      }

      const [dataInvoices, dataVendors, dataExpenses, dataTasks, dataLogs, dataProducts, dataContent, dataCheckpoints] = await Promise.all([
        resInvoices.json(),
        resVendors.json(),
        resExpenses.json(),
        resTasks.json(),
        resLogs.json(),
        resProducts.json(),
        resContent.json(),
        resCheckpoints.json()
      ]);

      setInvoices(dataInvoices || []);
      setVendors(dataVendors || []);
      setExpenses(dataExpenses || []);
      setTasks(dataTasks || []);
      setProductsList(dataProducts || []);
      setSiteForm({ ...DEFAULT_SITE_FORM, ...(dataContent || {}) });
      setCheckpointsList(dataCheckpoints || []);
      setTerminalLog((dataLogs || []).map((l: any) => `[${l.timestamp}] ${l.message}`));
    } catch (err) {
      console.error('Failed to align temple records', err);
    } finally {
      setIsLoading(false);
    }
  }, [useFirestoreSource]);

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
    isLoading,
    setIsLoading,
    useFirestoreSource,
    setUseFirestoreSource,
    firestoreSyncLoading,
    setFirestoreSyncLoading,
    firestoreSyncSuccess,
    setFirestoreSyncSuccess,
    loadData
  };
}

export { firestoreDb, firebaseAuth, getAccessToken };

export type CmsDataApi = ReturnType<typeof useCmsData>;
export type CmsAuthApi = ReturnType<typeof useCmsAuth>;

export type CmsState = CmsDataApi & CmsAuthApi;
