import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

import { EXPENSE_CATEGORIES } from './seedData';
import type { Expense } from './types';

interface Props {
  expense: Expense;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Expense>) => Promise<void>;
}

export function EditExpenseModal({ expense, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [notes, setNotes] = useState(expense.notes);

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
            <h3 className="font-serif text-lg text-ink">Edit Expense</h3>
            <button onClick={onClose} className="text-clay hover:text-ink p-2 leading-none">
              ✕
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit(expense.id, {
                title,
                category,
                amount: parseFloat(amount) || 0,
                notes,
              });
              onClose();
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Expenditure Descriptor
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-medium"
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-bold"
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-medium resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-ink hover:bg-shadow text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-stone/20 mt-4 shadow-md"
            >
              Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
