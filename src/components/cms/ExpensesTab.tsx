import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Pencil, Download, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { EXPENSE_CATEGORIES } from './seedData';
import { useCsvExport } from './useCsvExport';
import { useSearchFilter } from './useSearchFilter';
import { useSort } from './useSort';
import { usePagination } from './usePagination';
import { Pagination } from './Pagination';
import type { CmsState } from './useCmsState';
import type { CmsHandlers } from './useCmsHandlers';
import { AddExpenseModal } from './AddExpenseModal';
import { EditExpenseModal } from './EditExpenseModal';
import { ConfirmDialog } from './ConfirmDialog';
import type { Expense } from './types';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

export function ExpensesTab({ state, handlers }: Props) {
  const { expenses } = state;
  const { createExpense, updateExpense, deleteExpense } = handlers;
  const { exportExpenses } = useCsvExport();
  const { search, setSearch, filter, setFilter, results: searched } = useSearchFilter(expenses, {
    searchFields: ['title', 'notes', 'category'],
    filterField: 'category',
    filterOptions: ['All', ...EXPENSE_CATEGORIES],
    defaultFilter: 'All',
  });
  const { sorted, sortKey, sortDir, requestSort } = useSort(searched);
  const { page, setPage, perPage, setPerPage, paginated, totalPages, total } = usePagination(sorted);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  const totalOpex = expenses.reduce((a, c) => a + c.amount, 0);
  const categoryTotals: Record<string, number> = expenses.reduce<Record<string, number>>((acc, c) => {
    const prev = acc[c.category] ?? 0;
    acc[c.category] = prev + c.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gold-muted" />
            <input
              type="text"
              placeholder="Filter expenses list..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 bg-white border border-stone rounded-xl py-2 px-3 text-xs outline-none focus:border-ink"
            />
          </div>
          <div className="flex bg-cream border border-stone p-1 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider">
            {['All', ...EXPENSE_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                  filter === c ? 'bg-white text-ink shadow-sm' : 'text-clay hover:text-ink hover:bg-mist/30'
                }`}
              >
                {c === 'All' ? 'All' : c.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportExpenses(expenses)}
            className="cursor-pointer w-full sm:w-auto bg-white hover:bg-cream border border-stone text-ink px-4 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gold-muted" /> Export CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="cursor-pointer w-full sm:w-auto bg-ink hover:bg-shadow text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-stone/20 transition-transform active:scale-98"
          >
            <Plus className="h-4 w-4 text-gold-muted" /> Log Attunement Costs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-stone rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead className="bg-cream/80 border-b border-stone text-[9.5px] font-mono text-gold-muted uppercase tracking-widest">
                <tr>
                  {([
                    { key: 'id' as const, label: 'SERIAL ID' },
                    { key: 'title' as const, label: 'PURIFYING WORK DESCRIPTOR' },
                    { key: 'category' as const, label: 'CATEGORY' },
                    { key: 'amount' as const, label: 'COST (INR)', align: 'right' as const },
                  ]).map((col) => (
                    <th
                      key={col.key}
                      onClick={() => requestSort(col.key)}
                      className={`p-4 md:p-5 font-bold cursor-pointer hover:text-ink transition-colors select-none ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </span>
                    </th>
                  ))}
                  <th className="p-4 md:p-5 font-bold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center font-mono text-xs text-clay uppercase tracking-wide">
                      No logged consecration charges found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((exp) => (
                    <tr key={exp.id} className="hover:bg-cream/10 transition-all">
                      <td className="p-4 md:p-5 font-mono text-gold-muted font-bold">{exp.id}</td>
                      <td className="p-4 md:p-5 space-y-0.5">
                        <span className="block font-medium text-ink">{exp.title}</span>
                        <span className="text-[10px] text-clay font-light leading-snug">{exp.notes}</span>
                      </td>
                      <td className="p-4 md:p-5">
                        <span className="inline-block bg-cream text-clay border border-stone/45 font-mono text-[10px] tracking-wide px-2.5 py-0.5 rounded leading-normal">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-right font-mono font-bold text-ink">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 md:p-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditing(exp)}
                            className="cursor-pointer p-2 rounded-full text-clay hover:text-ink hover:bg-cream transition-colors"
                            title="Edit expense"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleting(exp)}
                            className="cursor-pointer p-2 rounded-full text-clay hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete log permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              total={total}
              onChange={setPage}
              onPerPageChange={setPerPage}
            />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-stone rounded-3xl p-6 space-y-6 shadow-sm self-start">
          <div className="border-b border-cream pb-4">
            <span className="text-[8px] font-mono tracking-[0.25em] text-gold-muted uppercase font-bold block">Integrity checks stats</span>
            <h3 className="font-serif text-base text-ink">Operational Allocations</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([cat, amount]) => {
              const pct = totalOpex > 0 ? Math.round((amount / totalOpex) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-ink font-medium uppercase font-sans tracking-wide leading-none">{cat}</span>
                    <span className="text-gold-muted font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-cream rounded-full overflow-hidden border border-stone/10">
                    <div className="h-full bg-ink rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="block text-[10px] text-gold-muted font-mono text-left">
                    ₹{amount.toLocaleString('en-IN')} logged in aggregate
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-cream/60 bg-cream/25 p-4 rounded-xl border border-dashed border-stone/50 text-center space-y-1">
            <span className="block text-[8px] font-mono text-gold-muted uppercase tracking-widest font-bold">Operating Budget lock</span>
            <p className="text-[10px] text-ink/75 leading-relaxed font-sans font-light">
              Aura purity investments are fully programmed within monthly profit constraints, ensuring robust high-fashion
              manufacturing success.
            </p>
          </div>
        </div>
      </div>

      {showAdd && (
        <AddExpenseModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (form) => {
            await createExpense(form);
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <EditExpenseModal
          expense={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (id, updates) => {
            await updateExpense(id, updates);
          }}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete Expense"
        message={`Permanently delete "${deleting?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleting) {
            await deleteExpense(deleting.id);
            setDeleting(null);
          }
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
