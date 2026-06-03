import { useState, useMemo } from 'react';

interface SearchFilterConfig<T> {
  searchFields: (keyof T)[];
  filterField?: keyof T;
  filterOptions?: string[];
  defaultFilter?: string;
}

export function useSearchFilter<T>(
  items: T[],
  config: SearchFilterConfig<T>
) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(config.defaultFilter || 'All');

  const results = useMemo(() => {
    let output = items;

    if (search.trim()) {
      const q = search.toLowerCase();
      output = output.filter((item) =>
        config.searchFields.some((field) => {
          const val = item[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        })
      );
    }

    if (config.filterField && filter !== 'All') {
      output = output.filter((item) => item[config.filterField!] === filter);
    }

    return output;
  }, [items, search, filter, config.searchFields, config.filterField]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    results,
  };
}
