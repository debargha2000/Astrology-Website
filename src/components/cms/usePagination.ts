import { useState, useMemo } from 'react';

export function usePagination<T>(items: T[], defaultPerPage: number = 10) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, safePage, perPage]);

  const setPerPageAndReset = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  return {
    page: safePage,
    setPage,
    perPage,
    setPerPage: setPerPageAndReset,
    paginated,
    totalPages,
    total: items.length,
  };
}
