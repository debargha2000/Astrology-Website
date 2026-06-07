import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (form: {
    name: string;
    contact: string;
    origin: string;
    category: string;
    leadTime: string;
    leadGems: string;
  }) => Promise<void>;
}

export function AddVendorModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [origin, setOrigin] = useState('');
  const [category, setCategory] = useState('');
  const [leadGems, setLeadGems] = useState('');
  const [leadTime, setLeadTime] = useState('');

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
            <h3 className="font-serif text-lg text-ink">Onboard Artisan & Sourcing Co.</h3>
            <button onClick={onClose} className="text-clay hover:text-ink p-2 leading-none">
              ✕
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await onSubmit({ name, contact, origin, category, leadTime, leadGems });
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Mine / Artisan Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ural Quartz Sourcing Ltd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Primary Contact
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Viktor Popov"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Origin Basin
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ural Mt. Basin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
                />
              </div>
            </div>
            <div>
              <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Crystalline Raw Geodes, Mountings"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Crystals Shipped
                </label>
                <input
                  type="text"
                  placeholder="e.g. High Grade Quartz beads"
                  value={leadGems}
                  onChange={(e) => setLeadGems(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
                />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase text-clay mb-1 font-semibold">
                  Lead Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 Days"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-cream/45 border border-stone rounded-xl px-4 py-3 text-xs outline-none focus:border-ink text-ink"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-ink hover:bg-shadow text-white py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-bold border border-stone/20 mt-4 shadow-md"
            >
              Onboard Sourcing Partner
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
