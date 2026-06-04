import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

import type { Invoice } from './types';

interface Props {
  onClose: () => void;
  onSubmit: (form: {
    client: string;
    item: string;
    amount: string;
    alignment: string;
    status: Invoice['status'];
  }) => Promise<void>;
}

export function AddInvoiceModal({ onClose, onSubmit }: Props) {
  const [client, setClient] = useState('');
  const [item, setItem] = useState('');
  const [alignment, setAlignment] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<Invoice['status']>('Sent');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 cursor-pointer"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white border border-stone rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-cream pb-4 mb-6">
            <h3 className="font-serif text-lg text-ink">Generate Client Invoice</h3>
            <button onClick={onClose} className="text-clay hover:text-ink p-2 leading-none">
              ✕
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit({ client, item, amount, alignment, status });
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Patron Voyager Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohini Roy"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-medium"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Attunement Selection Item
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Master Prosperity Wealth Bracelet"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-medium"
              />
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Astrological Crystal Grid Align
              </label>
              <input
                type="text"
                placeholder="e.g. Money Magnet (Green Aventurine + Citrine)"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Cost (INR)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5900"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Invoice['status'])}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-bold"
                >
                  <option value="Sent">Sent (Unpaid)</option>
                  <option value="Paid">Paid</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-ink hover:bg-shadow text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-stone/20 mt-4 shadow-md"
            >
              Add Invoice Record
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
