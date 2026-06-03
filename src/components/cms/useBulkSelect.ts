import { useState, useCallback } from 'react';

export function useBulkSelect<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selected = items.filter((i) => selectedIds.has(i.id));

  return {
    selectedIds,
    selected,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    hasSelection: selectedIds.size > 0,
    count: selectedIds.size,
  };
}
