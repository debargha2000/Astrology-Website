import { AlertTriangle, Info, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG = {
  danger: {
    icon: <Trash2 className="h-5 w-5 text-red-600" />,
    bg: 'bg-red-50 border-red-200',
    btn: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    bg: 'bg-amber-50 border-amber-200',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  const v = VARIANT_CONFIG[variant];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onConfirm, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 cursor-pointer"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white border border-stone rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`shrink-0 p-2.5 rounded-xl border ${v.bg}`}>{v.icon}</div>
              <div className="space-y-2 min-w-0">
                <h3 className="font-serif text-lg text-ink font-semibold">{title}</h3>
                <p className="text-xs text-clay leading-relaxed font-sans">{message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest border border-stone text-clay hover:text-ink hover:bg-cream/50 transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest border border-transparent shadow-md transition-all cursor-pointer ${v.btn}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
