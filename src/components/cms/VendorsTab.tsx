import { Search, Plus, Pencil, Download } from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { AddVendorModal } from './AddVendorModal';
import { CsvImport } from './CsvImport';
import { EditVendorModal } from './EditVendorModal';
import type { Vendor } from './types';
import type { CmsHandlers } from './useCmsHandlers';
import type { CmsState } from './useCmsState';
import { useCsvExport } from './useCsvExport';
import { useSearchFilter } from './useSearchFilter';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

export function VendorsTab({ state, handlers }: Props) {
  const { vendors } = state;
  const { createVendor, updateVendor, addTerminalLog, importVendors } = handlers;
  const { exportVendors } = useCsvExport();
  const {
    search,
    setSearch,
    results: searched,
  } = useSearchFilter(vendors, {
    searchFields: ['name', 'leadGems', 'origin', 'contact', 'category'],
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  const STATUS_STYLES: Record<string, string> = {
    Approved: 'bg-emerald-50 text-emerald-800 border border-emerald-200/25',
    'Under Review': 'bg-amber-50 text-amber-800 border border-amber-200/25',
    Suspended: 'bg-red-50 text-red-800 border border-red-200/25',
  };

  const nextStatus: Record<string, Vendor['status']> = {
    Approved: 'Under Review',
    'Under Review': 'Suspended',
    Suspended: 'Approved',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64 max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gold-muted" />
          <input
            type="text"
            placeholder="Search mineral artisans or mines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 bg-white border border-stone rounded-xl py-2 px-3 text-xs outline-none focus:border-ink"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportVendors(vendors)}
            className="cursor-pointer w-full sm:w-auto bg-white hover:bg-cream border border-stone text-ink px-4 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gold-muted" /> Export CSV
          </button>
          <CsvImport
            entityLabel="vendors"
            requiredFields={['Name', 'Contact']}
            onImport={importVendors}
          />
          <button
            onClick={() => setShowAdd(true)}
            className="cursor-pointer w-full sm:w-auto bg-ink hover:bg-shadow text-white px-5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md border border-stone/20 transition-transform active:scale-98"
          >
            <Plus className="h-4 w-4 text-gold-muted" /> Onboard Sourcing Partner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {searched.length === 0 ? (
          <div className="col-span-full bg-white border border-stone p-12 text-center text-xs font-mono text-clay uppercase tracking-wider rounded-3xl">
            No onboarded artisans or miners found matching query context.
          </div>
        ) : (
          searched.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border border-stone rounded-3xl p-6 space-y-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between border-b border-cream pb-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-clay font-bold uppercase tracking-wider leading-none block">
                    {vendor.id} • {vendor.category}
                  </span>
                  <h4 className="font-serif text-lg font-light text-ink tracking-normal leading-snug">
                    {vendor.name}
                  </h4>
                </div>
                <button
                  onClick={() => updateVendor(vendor.id, { status: nextStatus[vendor.status] })}
                  className={`cursor-pointer font-mono text-[9.5px] uppercase tracking-wide px-3 py-1 rounded-full font-bold transition-all hover:opacity-80 ${STATUS_STYLES[vendor.status] || ''}`}
                  title={`Click to change to ${nextStatus[vendor.status]}`}
                >
                  {vendor.status}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-sans text-ink/70">
                <div>
                  <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold leading-none mb-1">
                    Representative
                  </span>
                  <strong className="text-ink">{vendor.contact}</strong>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold leading-none mb-1">
                    Origin Basin
                  </span>
                  <strong className="text-ink">{vendor.origin}</strong>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold leading-none mb-1">
                    Flagship Crystals Sourced
                  </span>
                  <strong className="text-ink">{vendor.leadGems}</strong>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-gold-muted uppercase font-bold leading-none mb-1">
                    Lead Time
                  </span>
                  <strong className="text-ink">{vendor.leadTime}</strong>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-cream font-mono text-[10px]">
                <div className="flex items-center gap-1.5 text-xs text-ink">
                  <span className="text-gold-muted font-semibold text-[10px]">
                    PLANETARY SCORE:
                  </span>
                  <div className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[13px] leading-none">
                        {i < vendor.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(vendor)}
                    className="cursor-pointer bg-cream hover:bg-mist/50 border border-stone text-ink text-[9.5px] px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      addTerminalLog(
                        `Simulated supply chain audit of mineral reserves at: ${vendor.name}`
                      );
                    }}
                    className="cursor-pointer bg-cream hover:bg-mist/50 border border-stone text-ink text-[9.5px] px-3 py-1.5 rounded-lg uppercase tracking-wider font-bold"
                  >
                    Audit Supply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <AddVendorModal
          onClose={() => setShowAdd(false)}
          onSubmit={async (form) => {
            await createVendor(form);
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <EditVendorModal
          vendor={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (id, updates) => {
            await updateVendor(id, updates);
          }}
        />
      )}
    </div>
  );
}
