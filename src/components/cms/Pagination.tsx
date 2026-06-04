import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  perPage: number;
  total: number;
  onChange: (page: number) => void;
  onPerPageChange: (n: number) => void;
}

export function Pagination({ page, totalPages, perPage, total, onChange, onPerPageChange }: Props) {
  if (total === 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-cream font-mono text-xs">
      <div className="flex items-center gap-2 text-clay">
        <span>Showing</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="bg-cream border border-stone rounded-lg px-2 py-1 text-xs font-mono outline-none cursor-pointer"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>of {total} entries</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-stone hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-1.5 text-clay">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`min-w-[28px] h-7 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                p === page ? 'bg-ink text-white border-ink' : 'border-stone hover:bg-cream text-ink'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-stone hover:bg-cream disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
