import { useState, useMemo } from 'react';

type SortDir = 'asc' | 'desc';

export function useSort<T>(items: T[], defaultKey?: keyof T, defaultDir: SortDir = 'asc') {
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultKey || null);
  const [sortDir, setSortDir] = useState<SortDir>(defaultDir);

  const requestSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return items;

    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [items, sortKey, sortDir]);

  return { sorted, sortKey, sortDir, requestSort };
}
