import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useCallback } from 'react';

import { api, ApiError } from '../../lib/api';
import { handleFirestoreError, OperationType } from '../../lib/firebase';

import { getAdminToken } from './types';
import type {
  ProductForm,
  Invoice,
  Vendor,
  Expense,
  Task,
  SiteForm,
  AstroContent,
  AstroContentType,
} from './types';
import { firestoreDb } from './useCmsState';
import type { CmsState } from './useCmsState';

const TOKEN_HEADER = () => ({ Authorization: `Bearer ${getAdminToken()}` });

async function authedFetch<T>(path: string, init: Parameters<typeof api.raw>[1] = {}): Promise<T> {
  return api.raw<T>(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...TOKEN_HEADER(),
    },
  });
}

export type ToastFn = (message: string, type?: 'success' | 'error' | 'info') => void;

export function useCmsHandlers(state: CmsState, toast?: ToastFn) {
  const { setIsLoading, setTerminalLog, useFirestoreSource, googleUser, loadData } = state;

  const notify = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      if (toast) toast(message, type);
    },
    [toast]
  );

  const addTerminalLog = useCallback(
    async (msg: string) => {
      if (!getAdminToken()) return;
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLog((prev) => [{ timestamp, message: msg }, ...prev]);
    },
    [setTerminalLog]
  );

  const requireGoogle = useCallback((): boolean => {
    if (!googleUser) {
      notify('Please sign in with Google first to perform Firestore operations.', 'error');
      return false;
    }
    return true;
  }, [googleUser, notify]);

  const saveProduct = useCallback(
    async (productData: ProductForm) => {
      const token = getAdminToken();
      if (!token) return;
      try {
        setIsLoading(true);
        const cleanProduct = {
          ...productData,
          originalPrice: Number(productData.originalPrice),
          salePrice: Number(productData.salePrice),
          rating: Number(productData.rating) || 5,
          reviewsCount: Number(productData.reviewsCount) || 1,
          benefits: Array.isArray(productData.benefits)
            ? productData.benefits
            : String(productData.benefits)
                .split('\n')
                .map((b) => b.trim())
                .filter(Boolean),
          crystalsUsed: Array.isArray(productData.crystalsUsed)
            ? productData.crystalsUsed
            : String(productData.crystalsUsed)
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
          zodiacConnection: Array.isArray(productData.zodiacConnection)
            ? productData.zodiacConnection
            : String(productData.zodiacConnection)
                .split(',')
                .map((z) => z.trim())
                .filter(Boolean),
        };
        await authedFetch('/api/products', {
          method: 'POST',
          body: cleanProduct,
        });
        await authedFetch('/api/website/checkpoints', {
          method: 'POST',
          body: { title: `AutoBackup: Updated product "${cleanProduct.name}"` },
        });
        notify(`Product "${cleanProduct.name}" synchronized and backup created.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Error saving product: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Save error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const deleteProduct = useCallback(
    async (id: string, name: string) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/products/${id}`, { method: 'DELETE' });
        await authedFetch('/api/website/checkpoints', {
          method: 'POST',
          body: { title: `AutoBackup: Deleted product "${name}"` },
        });
        notify(`Product "${name}" deleted.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to delete product: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Delete error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const updateWebsite = useCallback(
    async (next: SiteForm) => {
      try {
        setIsLoading(true);
        await authedFetch('/api/website/content', {
          method: 'POST',
          body: next,
        });
        await authedFetch('/api/website/checkpoints', {
          method: 'POST',
          body: { title: 'AutoBackup: Website customization settings updated' },
        });
        notify('Website settings synchronized live and backed up!');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to update website customization: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Update error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const createManualCheckpoint = useCallback(async () => {
    const title = prompt('Enter a description title for this backup checkpoint:');
    if (!title) return;
    try {
      setIsLoading(true);
      await authedFetch('/api/website/checkpoints', {
        method: 'POST',
        body: { title },
      });
      notify('Manual checkpoint saved!');
      await loadData();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        notify(`Failed to create checkpoint: ${e.data?.error || e.message}`, 'error');
      } else {
        notify(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadData, setIsLoading, notify]);

  const rollbackTo = useCallback(
    async (id: string, title: string) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/website/checkpoints/${id}/rollback`, {
          method: 'POST',
        });
        notify(`Rollback succeeded! Reverted to: ${title}`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to execute system rollback: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const createInvoice = useCallback(
    async (form: {
      client: string;
      item: string;
      amount: string;
      alignment: string;
      status: Invoice['status'];
    }) => {
      if (!form.client || !form.amount) return;
      const customId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const today = new Date().toISOString().split('T')[0]!;
      const payload: Invoice = {
        id: customId,
        client: form.client,
        date: today,
        item: form.item || 'Planetary Crystal Alignment Package',
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        alignment: form.alignment || 'Universal Alignment',
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'invoices', customId), payload).catch((err) =>
            handleFirestoreError(err, OperationType.CREATE, `invoices/${customId}`)
          );
          const logId = `log-${Date.now()}`;
          await setDoc(doc(firestoreDb, 'logs', logId), {
            id: logId,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            message: `Created High-Precision Invoice ${customId} for ${payload.client} (₹${payload.amount}) via Firestore.`,
          });
          notify(`Invoice created for ${payload.client}.`);
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }

      await authedFetch('/api/invoices', {
        method: 'POST',
        body: payload,
      });
      notify(`Invoice created for ${payload.client}.`);
      await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource, notify]
  );

  const updateInvoice = useCallback(
    async (id: string, updates: Partial<Invoice>) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/invoices/${id}`, {
          method: 'PUT',
          body: updates,
        });
        notify('Invoice updated.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to update invoice: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Update error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const createVendor = useCallback(
    async (form: {
      name: string;
      contact: string;
      origin: string;
      category: string;
      leadTime: string;
      leadGems: string;
    }) => {
      if (!form.name || !form.contact) return;
      const customId = `VND-${Math.floor(Math.random() * 90 + 300)}`;
      const payload: Vendor = {
        id: customId,
        name: form.name,
        contact: form.contact,
        origin: form.origin || 'Kashmir Basin, India',
        category: form.category || 'Raw Geodes',
        leadTime: form.leadTime || '5 Days',
        leadGems: form.leadGems || 'Natural Crystal Beads',
        rating: 5,
        status: 'Approved',
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'vendors', customId), payload).catch((err) =>
            handleFirestoreError(err, OperationType.CREATE, `vendors/${customId}`)
          );
          notify(`Vendor "${payload.name}" onboarded.`);
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }

      await authedFetch('/api/vendors', {
        method: 'POST',
        body: payload,
      });
      notify(`Vendor "${payload.name}" onboarded.`);
      await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource, notify]
  );

  const updateVendor = useCallback(
    async (id: string, updates: Partial<Vendor>) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/vendors/${id}`, {
          method: 'PUT',
          body: updates,
        });
        notify('Vendor updated.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to update vendor: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Update error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const createExpense = useCallback(
    async (form: { title: string; category: string; amount: string; notes: string }) => {
      if (!form.title || !form.amount) return;
      const customId = `EXP-${Math.floor(Math.random() * 90 + 100)}`;
      const today = new Date().toISOString().split('T')[0]!;
      const payload: Expense = {
        id: customId,
        title: form.title,
        category: form.category,
        amount: parseFloat(form.amount) || 0,
        date: today,
        notes: form.notes || '',
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'expenses', customId), payload).catch((err) =>
            handleFirestoreError(err, OperationType.CREATE, `expenses/${customId}`)
          );
          notify(`Expense "${payload.title}" logged.`);
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }

      await authedFetch('/api/expenses', {
        method: 'POST',
        body: payload,
      });
      notify(`Expense "${payload.title}" logged.`);
      await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource, notify]
  );

  const updateExpense = useCallback(
    async (id: string, updates: Partial<Expense>) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/expenses/${id}`, {
          method: 'PUT',
          body: updates,
        });
        notify('Expense updated.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to update expense: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Update error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const createTask = useCallback(
    async (form: {
      title: string;
      status: Task['status'];
      priority: Task['priority'];
      assignee: string;
      daysLeft: string;
    }) => {
      if (!form.title || !form.assignee) return;
      const customId = `TSK-${Math.floor(Math.random() * 90 + 500)}`;
      const payload: Task = {
        id: customId,
        title: form.title,
        status: form.status,
        priority: form.priority,
        assignee: form.assignee,
        daysLeft: parseInt(form.daysLeft) || 3,
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'tasks', customId), payload).catch((err) =>
            handleFirestoreError(err, OperationType.CREATE, `tasks/${customId}`)
          );
          notify(`Task created for ${payload.assignee}.`);
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }

      await authedFetch('/api/tasks', {
        method: 'POST',
        body: payload,
      });
      notify(`Task created for ${payload.assignee}.`);
      await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource, notify]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/tasks/${id}`, {
          method: 'PUT',
          body: updates,
        });
        notify('Task updated.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to update task: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Update error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const moveTask = useCallback(
    async (taskId: string, direction: 'forward' | 'backward') => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const statuses: Task['status'][] = [
        'Backlog',
        'Water Cleanse',
        'Moon Bath Bathing',
        'Sealed / Composed',
      ];
      const currentIdx = statuses.indexOf(task.status);
      let nextIdx = currentIdx;
      if (direction === 'forward' && currentIdx < statuses.length - 1) nextIdx += 1;
      else if (direction === 'backward' && currentIdx > 0) nextIdx -= 1;
      if (nextIdx === currentIdx) return;
      const nextStatus = statuses[nextIdx];

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await updateDoc(doc(firestoreDb, 'tasks', taskId), { status: nextStatus }).catch((err) =>
            handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`)
          );
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }

      await authedFetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        body: { status: nextStatus },
      });
      await loadData();
    },
    [loadData, requireGoogle, state.tasks, useFirestoreSource]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await authedFetch(`/api/tasks/${id}`, { method: 'DELETE' });
        notify('Task deleted.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to delete task: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Delete error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading, notify]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await deleteDoc(doc(firestoreDb, 'expenses', id)).catch((err) =>
            handleFirestoreError(err, OperationType.DELETE, `expenses/${id}`)
          );
          notify('Expense removed.');
          await loadData();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
        return;
      }
      try {
        await authedFetch(`/api/expenses/${id}`, { method: 'DELETE' });
        notify('Expense removed.');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to remove expense: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Delete error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      }
    },
    [loadData, requireGoogle, useFirestoreSource, notify]
  );

  const syncLocalToFirestore = useCallback(async () => {
    if (!googleUser) return;
    try {
      setIsLoading(true);
      const [dataInvoices, dataVendors, dataExpenses, dataTasks] = await Promise.all([
        authedFetch<typeof state.invoices>('/api/invoices'),
        authedFetch<typeof state.vendors>('/api/vendors'),
        authedFetch<typeof state.expenses>('/api/expenses'),
        authedFetch<typeof state.tasks>('/api/tasks'),
      ]);
      for (const inv of dataInvoices) {
        await setDoc(doc(firestoreDb, 'invoices', inv.id), inv).catch((err) =>
          handleFirestoreError(err, OperationType.CREATE, `invoices/${inv.id}`)
        );
      }
      for (const ven of dataVendors) {
        await setDoc(doc(firestoreDb, 'vendors', ven.id), ven).catch((err) =>
          handleFirestoreError(err, OperationType.CREATE, `vendors/${ven.id}`)
        );
      }
      for (const exp of dataExpenses) {
        await setDoc(doc(firestoreDb, 'expenses', exp.id), exp).catch((err) =>
          handleFirestoreError(err, OperationType.CREATE, `expenses/${exp.id}`)
        );
      }
      for (const tsk of dataTasks) {
        await setDoc(doc(firestoreDb, 'tasks', tsk.id), tsk).catch((err) =>
          handleFirestoreError(err, OperationType.CREATE, `tasks/${tsk.id}`)
        );
      }
      const logId = `log-${Date.now()}`;
      await setDoc(doc(firestoreDb, 'logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        message: `DATABASE SYNCHRONIZATION: Local flat-files synchronized to Firestore by ${googleUser.email}`,
      });
      state.setFirestoreSyncSuccess(
        'Successfully synchronized e-commerce ledger collections to Firestore.'
      );
      state.setUseFirestoreSource(true);
      notify('Firestore sync complete!');
      await loadData();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Data Sync Error:', err);
      notify('Sync failed. Check console for details.', 'error');
    } finally {
      setIsLoading(false);
      state.setFirestoreSyncLoading(false);
    }
  }, [googleUser, loadData, setIsLoading, state, notify]);

  const importInvoices = useCallback(
    async (rows: Record<string, string>[]) => {
      const items = rows.map((r) => ({
        client: r.Client || r.client || r['PATRON VOYAGER'] || 'Unknown',
        item:
          r.Item ||
          r.item ||
          r['ASTRONOMICAL ALIGNMENT ITEM'] ||
          'Planetary Crystal Alignment Package',
        amount: parseFloat(r.Amount || r.amount || r['LEDGER CHARGE'] || '0') || 0,
        status: r.Status || r.status || 'Sent',
        alignment: r.Alignment || r.alignment || 'Universal Alignment',
      }));
      try {
        const data = await authedFetch<{ count: number }>('/api/invoices/batch', {
          method: 'POST',
          body: { items },
        });
        notify(`Imported ${data.count} invoices.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to import invoices: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to import invoices.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const importExpenses = useCallback(
    async (rows: Record<string, string>[]) => {
      const items = rows.map((r) => ({
        title: r.Title || r.title || r['PURIFYING WORK DESCRIPTOR'] || 'Unknown',
        category: r.Category || r.category || 'Ritual Consecration',
        amount: parseFloat(r.Amount || r.amount || r['COST (INR)'] || '0') || 0,
        notes: r.Notes || r.notes || '',
      }));
      try {
        const data = await authedFetch<{ count: number }>('/api/expenses/batch', {
          method: 'POST',
          body: { items },
        });
        notify(`Imported ${data.count} expenses.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to import expenses: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to import expenses.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const importVendors = useCallback(
    async (rows: Record<string, string>[]) => {
      const items = rows.map((r) => ({
        name: r.Name || r.name || 'Unknown',
        contact: r.Contact || r.contact || 'Unknown',
        origin: r.Origin || r.origin || 'Himalayan Foothills',
        category: r.Category || r.category || 'Raw Crystals',
        leadTime: r['Lead Time'] || r.leadTime || '5 Days',
        leadGems: r['Lead Gems'] || r.leadGems || 'Crystalline beads',
      }));
      try {
        const data = await authedFetch<{ count: number }>('/api/vendors/batch', {
          method: 'POST',
          body: { items },
        });
        notify(`Imported ${data.count} vendors.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to import vendors: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to import vendors.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const bulkDeleteInvoices = useCallback(
    async (ids: string[]) => {
      try {
        const data = await authedFetch<{ deleted: number }>('/api/invoices/batch', {
          method: 'DELETE',
          body: { ids },
        });
        notify(`Deleted ${data.deleted} invoices.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to batch delete invoices: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to batch delete invoices.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const bulkDeleteExpenses = useCallback(
    async (ids: string[]) => {
      try {
        const data = await authedFetch<{ deleted: number }>('/api/expenses/batch', {
          method: 'DELETE',
          body: { ids },
        });
        notify(`Deleted ${data.deleted} expenses.`);
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to batch delete expenses: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to batch delete expenses.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const saveAstroEntry = useCallback(
    async (entry: {
      id?: string;
      type: AstroContentType;
      key: string;
      title: string;
      interpretation: string;
    }) => {
      const updatedBy = state.googleUser?.email || 'admin';
      const url = entry.id ? `/api/astro-content/${entry.id}` : '/api/astro-content';
      const method = entry.id ? 'PUT' : 'POST';
      try {
        const data = await authedFetch<AstroContent>(url, {
          method,
          body: { ...entry, updatedBy },
        });
        notify(`Saved "${data.title}".`, 'success');
        await loadData();
        return data;
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Error: ${e.data?.error || e.message}`, 'error');
        } else {
          notify(`Error: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
        return null;
      }
    },
    [loadData, notify, state.googleUser]
  );

  const deleteAstroEntry = useCallback(
    async (id: string, title: string) => {
      try {
        await authedFetch(`/api/astro-content/${id}`, { method: 'DELETE' });
        notify(`Deleted "${title}".`, 'success');
        await loadData();
      } catch (e: unknown) {
        if (e instanceof ApiError) {
          notify(`Failed to delete entry: ${e.data?.error || e.message}`, 'error');
        } else {
          notify('Failed to delete entry.', 'error');
        }
      }
    },
    [loadData, notify]
  );

  const seedAstroDefaults = useCallback(async () => {
    try {
      const data = await authedFetch<{ created: number }>('/api/astro-content/bulk-seed', {
        method: 'POST',
      });
      notify(`Seeded ${data.created} default interpretations.`, 'success');
      await loadData();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        notify(`Failed to seed defaults: ${e.data?.error || e.message}`, 'error');
      } else {
        notify('Failed to seed defaults.', 'error');
      }
    }
  }, [loadData, notify]);

  return {
    addTerminalLog,
    saveProduct,
    deleteProduct,
    updateWebsite,
    createManualCheckpoint,
    rollbackTo,
    createInvoice,
    updateInvoice,
    createVendor,
    updateVendor,
    createExpense,
    updateExpense,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    deleteExpense,
    syncLocalToFirestore,
    importInvoices,
    importExpenses,
    importVendors,
    bulkDeleteInvoices,
    bulkDeleteExpenses,
    saveAstroEntry,
    deleteAstroEntry,
    seedAstroDefaults,
  };
}

export type CmsHandlers = ReturnType<typeof useCmsHandlers>;
