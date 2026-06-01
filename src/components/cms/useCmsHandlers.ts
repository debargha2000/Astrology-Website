import { useCallback } from 'react';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebase';
import { firestoreDb } from './useCmsState';
import { getAdminToken } from './types';
import { apiFetch } from '../../services/apiFetch';
import type { ProductForm } from './types';
import type { Invoice, Vendor, Expense, Task, SiteForm } from './types';
import type { CmsState } from './useCmsState';

const TOKEN_HEADER = () => ({ Authorization: `Bearer ${getAdminToken()}` });

async function authedFetch(path: string, init: Parameters<typeof apiFetch>[1] = {}): Promise<Response> {
  return apiFetch(path, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...TOKEN_HEADER()
    }
  });
}

export function useCmsHandlers(state: CmsState) {
  const {
    setInvoices,
    setVendors,
    setExpenses,
    setTasks,
    setProductsList,
    setSiteForm,
    setCheckpointsList,
    setIsLoading,
    setTerminalLog,
    useFirestoreSource,
    googleUser,
    setGoogleUser,
    setGoogleToken,
    loadData
  } = state;

  const addTerminalLog = useCallback(
    async (msg: string) => {
      if (!getAdminToken()) return;
      setTerminalLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    },
    [setTerminalLog]
  );

  const requireGoogle = useCallback((): boolean => {
    if (!googleUser) {
      alert('Please sign in with Google first to perform Firestore operations.');
      return false;
    }
    return true;
  }, [googleUser]);

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
            : String(productData.benefits).split('\n').map((b) => b.trim()).filter(Boolean),
          crystalsUsed: Array.isArray(productData.crystalsUsed)
            ? productData.crystalsUsed
            : String(productData.crystalsUsed).split(',').map((c) => c.trim()).filter(Boolean),
          zodiacConnection: Array.isArray(productData.zodiacConnection)
            ? productData.zodiacConnection
            : String(productData.zodiacConnection).split(',').map((z) => z.trim()).filter(Boolean)
        };
        const res = await authedFetch('/api/products', { method: 'POST', body: JSON.stringify(cleanProduct) });
        if (res.ok) {
          await authedFetch('/api/website/checkpoints', {
            method: 'POST',
            body: JSON.stringify({ title: `AutoBackup: Updated product "${cleanProduct.name}"` })
          });
          alert(`Product "${cleanProduct.name}" synchronized and automatic backup checkpoint registered!`);
          await loadData();
        } else {
          const err = await res.json();
          alert(`Error saving product: ${err.error}`);
        }
      } catch (e: any) {
        alert(`Save error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading]
  );

  const deleteProduct = useCallback(
    async (id: string, name: string) => {
      if (!confirm(`Delete product "${name}"? An auto-backup checkpoint will be captured.`)) return;
      try {
        setIsLoading(true);
        const res = await authedFetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          await authedFetch('/api/website/checkpoints', {
            method: 'POST',
            body: JSON.stringify({ title: `AutoBackup: Deleted product "${name}"` })
          });
          alert(`Product "${name}" deleted.`);
          await loadData();
        } else {
          alert('Failed to delete product.');
        }
      } catch (e: any) {
        alert(`Delete error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading]
  );

  const updateWebsite = useCallback(
    async (next: SiteForm) => {
      try {
        setIsLoading(true);
        const res = await authedFetch('/api/website/content', { method: 'POST', body: JSON.stringify(next) });
        if (res.ok) {
          await authedFetch('/api/website/checkpoints', {
            method: 'POST',
            body: JSON.stringify({ title: 'AutoBackup: Website customization settings updated' })
          });
          alert('Website copy and imagery adjustments synchronized live and fully backed up!');
          await loadData();
        } else {
          alert('Failed to update website customization.');
        }
      } catch (e: any) {
        alert(`Update error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading]
  );

  const createManualCheckpoint = useCallback(async () => {
    const title = prompt("Enter a description title for this backup checkpoint:");
    if (!title) return;
    try {
      setIsLoading(true);
      const res = await authedFetch('/api/website/checkpoints', { method: 'POST', body: JSON.stringify({ title }) });
      if (res.ok) {
        alert('Manual Checkpoint saved!');
        await loadData();
      } else {
        alert('Failed to create checkpoint.');
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [loadData, setIsLoading]);

  const rollbackTo = useCallback(
    async (id: string, title: string) => {
      if (
        !confirm(
          `WARNING: Rollback to "${title}"? This overwrites current live website content AND products with the values stored in this backup.`
        )
      )
        return;
      try {
        setIsLoading(true);
        const res = await authedFetch(`/api/website/checkpoints/${id}/rollback`, { method: 'POST' });
        if (res.ok) {
          alert(`Rollback succeeded! Reverted to: ${title}`);
          await loadData();
        } else {
          alert('Failed to execute system rollback.');
        }
      } catch (e: any) {
        alert(`Error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, setIsLoading]
  );

  const createInvoice = useCallback(
    async (form: { client: string; item: string; amount: string; alignment: string; status: Invoice['status'] }) => {
      if (!form.client || !form.amount) return;
      const customId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const payload: Invoice = {
        id: customId,
        client: form.client,
        date: new Date().toISOString().split('T')[0],
        item: form.item || 'Planetary Crystal Alignment Package',
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        alignment: form.alignment || 'Universal Alignment'
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'invoices', customId), payload)
            .catch((err) => handleFirestoreError(err, OperationType.CREATE, `invoices/${customId}`));
          const logId = `log-${Date.now()}`;
          await setDoc(doc(firestoreDb, 'logs', logId), {
            id: logId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            message: `Created High-Precision Invoice ${customId} for ${payload.client} (₹${payload.amount}) via Firestore.`
          });
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const res = await authedFetch('/api/invoices', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource]
  );

  const createVendor = useCallback(
    async (form: { name: string; contact: string; origin: string; category: string; leadTime: string; leadGems: string }) => {
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
        status: 'Approved'
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'vendors', customId), payload)
            .catch((err) => handleFirestoreError(err, OperationType.CREATE, `vendors/${customId}`));
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const res = await authedFetch('/api/vendors', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource]
  );

  const createExpense = useCallback(
    async (form: { title: string; category: string; amount: string; notes: string }) => {
      if (!form.title || !form.amount) return;
      const customId = `EXP-${Math.floor(Math.random() * 90 + 100)}`;
      const payload: Expense = {
        id: customId,
        title: form.title,
        category: form.category,
        amount: parseFloat(form.amount) || 0,
        date: new Date().toISOString().split('T')[0],
        notes: form.notes || ''
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'expenses', customId), payload)
            .catch((err) => handleFirestoreError(err, OperationType.CREATE, `expenses/${customId}`));
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const res = await authedFetch('/api/expenses', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource]
  );

  const createTask = useCallback(
    async (form: { title: string; status: Task['status']; priority: Task['priority']; assignee: string; daysLeft: string }) => {
      if (!form.title || !form.assignee) return;
      const customId = `TSK-${Math.floor(Math.random() * 90 + 500)}`;
      const payload: Task = {
        id: customId,
        title: form.title,
        status: form.status,
        priority: form.priority,
        assignee: form.assignee,
        daysLeft: parseInt(form.daysLeft) || 3
      };

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await setDoc(doc(firestoreDb, 'tasks', customId), payload)
            .catch((err) => handleFirestoreError(err, OperationType.CREATE, `tasks/${customId}`));
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const res = await authedFetch('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource]
  );

  const moveTask = useCallback(
    async (taskId: string, direction: 'forward' | 'backward') => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const statuses: Task['status'][] = ['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed'];
      const currentIdx = statuses.indexOf(task.status);
      let nextIdx = currentIdx;
      if (direction === 'forward' && currentIdx < statuses.length - 1) nextIdx += 1;
      else if (direction === 'backward' && currentIdx > 0) nextIdx -= 1;
      if (nextIdx === currentIdx) return;
      const nextStatus = statuses[nextIdx];

      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await updateDoc(doc(firestoreDb, 'tasks', taskId), { status: nextStatus })
            .catch((err) => handleFirestoreError(err, OperationType.UPDATE, `tasks/${taskId}`));
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }

      const res = await authedFetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, state.tasks, useFirestoreSource]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      if (useFirestoreSource) {
        if (!requireGoogle()) return;
        try {
          await deleteDoc(doc(firestoreDb, 'expenses', id))
            .catch((err) => handleFirestoreError(err, OperationType.DELETE, `expenses/${id}`));
          await loadData();
        } catch (err) {
          console.error(err);
        }
        return;
      }
      const res = await authedFetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) await loadData();
    },
    [loadData, requireGoogle, useFirestoreSource]
  );

  const syncLocalToFirestore = useCallback(async () => {
    if (!googleUser) return;
    try {
      setIsLoading(true);
      const headers = TOKEN_HEADER();
      const [resInvoices, resVendors, resExpenses, resTasks, resLogs] = await Promise.all([
        apiFetch('/api/invoices', { headers }),
        apiFetch('/api/vendors', { headers }),
        apiFetch('/api/expenses', { headers }),
        apiFetch('/api/tasks', { headers }),
        apiFetch('/api/logs', { headers })
      ]);
      const [dataInvoices, dataVendors, dataExpenses, dataTasks, dataLogs] = await Promise.all([
        resInvoices.json(),
        resVendors.json(),
        resExpenses.json(),
        resTasks.json(),
        resLogs.json()
      ]);
      for (const inv of dataInvoices) {
        await setDoc(doc(firestoreDb, 'invoices', inv.id), inv)
          .catch((err) => handleFirestoreError(err, OperationType.CREATE, `invoices/${inv.id}`));
      }
      for (const ven of dataVendors) {
        await setDoc(doc(firestoreDb, 'vendors', ven.id), ven)
          .catch((err) => handleFirestoreError(err, OperationType.CREATE, `vendors/${ven.id}`));
      }
      for (const exp of dataExpenses) {
        await setDoc(doc(firestoreDb, 'expenses', exp.id), exp)
          .catch((err) => handleFirestoreError(err, OperationType.CREATE, `expenses/${exp.id}`));
      }
      for (const tsk of dataTasks) {
        await setDoc(doc(firestoreDb, 'tasks', tsk.id), tsk)
          .catch((err) => handleFirestoreError(err, OperationType.CREATE, `tasks/${tsk.id}`));
      }
      const logId = `log-${Date.now()}`;
      await setDoc(doc(firestoreDb, 'logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: `DATABASE SYNCHRONIZATION: Local flat-files synchronized to Firestore by ${googleUser.email}`
      });
      state.setFirestoreSyncSuccess('Successfully synchronized e-commerce ledger collections to Firestore.');
      state.setUseFirestoreSource(true);
      await loadData();
    } catch (err) {
      console.error('Data Sync Error:', err);
      alert('Sync Failed: Check application console logs for rules details.');
    } finally {
      setIsLoading(false);
      state.setFirestoreSyncLoading(false);
    }
  }, [googleUser, loadData, setIsLoading, state]);

  return {
    addTerminalLog,
    saveProduct,
    deleteProduct,
    updateWebsite,
    createManualCheckpoint,
    rollbackTo,
    createInvoice,
    createVendor,
    createExpense,
    createTask,
    moveTask,
    deleteExpense,
    syncLocalToFirestore
  };
}

export type CmsHandlers = ReturnType<typeof useCmsHandlers>;
