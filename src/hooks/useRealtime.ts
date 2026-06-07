import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  doc as docRef,
  writeBatch,
  getDocs,
  updateDoc,
  type WhereFilterOp,
} from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';

import { db } from '../lib/firebase';

export function useRealtimeCollection<T>(
  collectionName: string,
  constraints: Array<{ field: string; operator: string; value: unknown }> = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
      setTimeout(() => {
        setError(new Error('Firestore not initialized'));
        setLoading(false);
      }, 0);
      return;
    }

    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    let q: ReturnType<typeof collection> | ReturnType<typeof query> = collection(
      db,
      collectionName
    );

    constraints.forEach((c) => {
      q = query(q, where(c.field, c.operator as WhereFilterOp, c.value));
    });

    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...(docData as Record<string, unknown>),
          } as T;
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(constraints), orderByField, orderDirection, limitCount]);

  return { data, loading, error };
}

export function useRealtimeDocument<T>(collectionName: string, documentId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId || !db) {
      setTimeout(() => {
        setData(null);
        setLoading(false);
      }, 0);
      return;
    }

    setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    const unsubscribe = onSnapshot(
      docRef(db, collectionName, documentId),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading, error };
}

export function useOrderStatus(orderId: string | null) {
  return useRealtimeDocument<{
    id: string;
    status: string;
    updatedAt: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  }>('orders', orderId);
}

export function useProductAvailability(productId: string | null) {
  return useRealtimeDocument<{
    id: string;
    stockStatus: 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';
    quantity: number;
    lastUpdated: string;
  }>('product_availability', productId);
}

export function useRealtimeNotifications(userId: string | null, limitCount = 20) {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      createdAt: string;
      actionUrl?: string;
    }>
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId || !db) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as typeof notifications;
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [userId, limitCount]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!db) return;
    await updateDoc(docRef(db, 'notifications', notificationId), { read: true });
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!db || !userId) return;
    const batch = writeBatch(db);
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((docSnap) => batch.update(docSnap.ref, { read: true }));
    await batch.commit();
  }, [userId]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}

export function useRealtimeCart(userId: string | null) {
  const [cart, setCart] = useState<
    Array<{
      id: string;
      productId: string;
      quantity: number;
      size: string;
      personalizedCertification: boolean;
      birthDetails?: { name: string; birthDate: string; birthTime?: string; birthPlace?: string };
      updatedAt: string;
    }>
  >([]);

  useEffect(() => {
    if (!userId || !db) return;

    const q = query(collection(db, 'carts'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.flatMap((docSnap) =>
        (docSnap.data().items || []).map((item: Record<string, unknown>) => ({
          id: (item.id as string) || docSnap.id,
          ...item,
        }))
      );
      setCart(items);
    });

    return () => unsubscribe();
  }, [userId]);

  return cart;
}
