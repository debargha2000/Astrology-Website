import {
  Search,
  Plus,
  ExternalLink,
  Pencil,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useState, useMemo } from 'react';

import { AddInvoiceModal } from './AddInvoiceModal';
import { BulkActions } from './BulkActions';
import { ConfirmDialog } from './ConfirmDialog';
import { CsvImport } from './CsvImport';
import { EditInvoiceModal } from './EditInvoiceModal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { Pagination } from './Pagination';
import { INVOICE_STATUSES } from './seedData';
import type { Invoice } from './types';
import { useBulkSelect } from './useBulkSelect';
import type { CmsHandlers } from './useCmsHandlers';
import type { CmsState } from './useCmsState';
import { useCsvExport } from './useCsvExport';
import { usePagination } from './usePagination';
import { useSearchFilter } from './useSearchFilter';
import { useSort } from './useSort';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

export function InvoicesTab({ state, handlers }: Props) {
  const { invoices } = state;
  const { createInvoice, updateInvoice, importInvoices, bulkDeleteInvoices } = handlers;
  const { exportInvoices } = useCsvExport();
  const {
    search,
    setSearch,
    filter,
    setFilter,
    results: searched,
  } = useSearchFilter(invoices, {
    searchFields: ['client', 'item', 'id'],
    filterField: 'status',
    filterOptions: ['All', ...INVOICE_STATUSES],
    defaultFilter: 'All',
  });
  const { sorted, sortKey, sortDir, requestSort } = useSort(searched);
  const { page, setPage, perPage, setPerPage, paginated, totalPages, total } =
    usePagination(sorted);
  const {
    selectedIds,
    isSelected,
    toggleSelect,
    selectAll,
    clearSelection,
    count: bulkCount,
  } = useBulkSelect(paginated);
  const [preview, setPreview] = useState<Invoice | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'Paid').reduce((a, c) => a + c.amount, 0);
    const pending = invoices
      .filter((i) => i.status === 'Sent' || i.status === 'Draft')
      .reduce((a, c) => a + c.amount, 0);
    const overdue = invoices
      .filter((i) => i.status === 'Overdue')
      .reduce((a, c) => a + c.amount, 0);
    return { paid, pending, overdue, total: invoices.reduce((a, c) => a + c.amount, 0) };
  }, [invoices]);

  const STATUS_COLORS: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-800 border border-emerald-200/25',
    Sent: 'bg-blue-50 text-blue-800 border border-blue-200/25',
    Overdue: 'bg-red-50 text-red-800 border border-red-200/25 font-bold animate-pulse',
    Draft: 'bg-gray-100 text-gray-500 border border-gray-200',
  };

  const nextStatus: Record<string, Invoice['status']> = {
    Draft: 'Sent',
    Sent: 'Paid',
    Paid: 'Paid',
    Overdue: 'Sent',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gold-muted" />
            <input
              type="text"
              placeholder="Query clients or serial number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 bg-white border border-stone rounded-xl py-2 px-3 text-xs outline-none focus:border-ink"
            />
          </div>
          <div className="flex bg-cream border border-stone p-1 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider">
            {['All', ...INVOICE_STATUSES].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg transition-all ${
                  filter === status ? 'bg-white text-ink shadow-sm' : 'text-clay hover:text-ink'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportInvoices(invoices)}
            className="cursor-pointer w-full sm:w-auto bg-white hover:bg-cream border border-stone text-ink px-4 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gold-muted" /> Export CSV
          </button>
          <CsvImport
            entityLabel="invoices"
            requiredFields={['Client', 'Amount']}
            onImport={importInvoices}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="cursor-pointer w-full sm:w-auto bg-ink hover:bg-shadow text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-stone/20 transition-transform active:scale-98"
          >
            <Plus className="h-4 w-4 text-gold-muted" /> Create Client Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-cream/40 border border-stone rounded-2xl p-4 text-center">
        <div className="py-2">
          <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold tracking-widest">
            Revenue Realized
          </span>
          <span className="text-xl font-serif font-semibold text-emerald-800">
            ₹{totals.paid.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="py-2 border-l border-stone/40">
          <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold tracking-widest">
            Aura Block (Unpaid)
          </span>
          <span className="text-xl font-serif font-semibold text-amber-700">
            ₹{totals.pending.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="py-2 border-l border-stone/40">
          <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold tracking-widest">
            Planetary Deficit (Overdue)
          </span>
          <span className="text-xl font-serif font-semibold text-red-800 font-bold">
            ₹{totals.overdue.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="py-2 border-l border-stone/40">
          <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold tracking-widest">
            Total Invoice Registry
          </span>
          <span className="text-xl font-serif font-semibold text-ink">
            ₹{totals.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="bg-white border border-stone rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead className="bg-cream/80 border-b border-stone text-[9.5px] font-mono text-gold-muted uppercase tracking-widest">
              <tr>
                <th className="p-4 md:p-5 w-10">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && paginated.every((i) => isSelected(i.id))}
                    onChange={() => {
                      if (paginated.every((i) => isSelected(i.id))) {
                        clearSelection();
                      } else {
                        selectAll();
                      }
                    }}
                    className="cursor-pointer accent-ink"
                  />
                </th>
                {[
                  { key: 'id' as const, label: 'SERIAL ID' },
                  { key: 'client' as const, label: 'PATRON VOYAGER' },
                  { key: 'item' as const, label: 'ASTRONOMICAL ALIGNMENT ITEM' },
                  { key: 'amount' as const, label: 'LEDGER CHARGE', align: 'right' as const },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => requestSort(col.key)}
                    className={`p-4 md:p-5 font-bold cursor-pointer hover:text-ink transition-colors select-none ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </span>
                  </th>
                ))}
                <th className="p-4 md:p-5 font-bold text-center">STATUS</th>
                <th className="p-4 md:p-5 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center font-mono text-xs text-clay uppercase tracking-wide"
                  >
                    No invoices logged matching filters or searches.
                  </td>
                </tr>
              ) : (
                paginated.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`hover:bg-cream/25 transition-colors ${isSelected(inv.id) ? 'bg-cream/40' : ''}`}
                  >
                    <td className="p-4 md:p-5">
                      <input
                        type="checkbox"
                        checked={isSelected(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                        className="cursor-pointer accent-ink"
                      />
                    </td>
                    <td className="p-4 md:p-5 font-mono text-gold-muted font-bold">{inv.id}</td>
                    <td className="p-4 md:p-5 font-serif font-medium text-ink">{inv.client}</td>
                    <td className="p-4 md:p-5 space-y-0.5">
                      <span className="block font-medium text-ink">{inv.item}</span>
                      <span className="text-[10px] text-gold-muted font-mono uppercase">
                        {inv.alignment}
                      </span>
                    </td>
                    <td className="p-4 md:p-5 text-right font-mono font-bold text-ink">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 md:p-5 text-center">
                      <button
                        onClick={() => updateInvoice(inv.id, { status: nextStatus[inv.status] })}
                        className={`cursor-pointer inline-block font-mono text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-md font-bold transition-all hover:opacity-80 ${STATUS_COLORS[inv.status] || ''}`}
                        title={`Click to change to ${nextStatus[inv.status]}`}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-4 md:p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(inv)}
                          className="cursor-pointer bg-cream hover:bg-mist/50 border border-stone text-ink p-2 rounded-lg font-mono text-[10px] tracking-wider uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                          title="Edit invoice"
                        >
                          <Pencil className="h-3 w-3 text-gold-muted" /> Edit
                        </button>
                        <button
                          onClick={() => setPreview(inv)}
                          className="cursor-pointer bg-cream hover:bg-mist/50 border border-stone text-ink p-2 rounded-lg font-mono text-[10px] tracking-wider uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 text-gold-muted" /> PDF
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

      {preview && <InvoicePreviewModal invoice={preview} onClose={() => setPreview(null)} />}
      {showAdd && (
        <AddInvoiceModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (form) => {
            await createInvoice(form);
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <EditInvoiceModal
          invoice={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (id, updates) => {
            await updateInvoice(id, updates);
          }}
        />
      )}
      <BulkActions
        count={bulkCount}
        onClear={clearSelection}
        onDelete={() => setBulkDeleting(true)}
        entityLabel="invoices"
      />
      <ConfirmDialog
        open={bulkDeleting}
        title="Delete Invoices"
        message={`Permanently delete ${bulkCount} selected invoices? This action cannot be undone.`}
        confirmLabel={`Delete ${bulkCount}`}
        variant="danger"
        onConfirm={async () => {
          await bulkDeleteInvoices(Array.from(selectedIds));
          clearSelection();
          setBulkDeleting(false);
        }}
        onCancel={() => setBulkDeleting(false)}
      />
    </div>
  );
}
