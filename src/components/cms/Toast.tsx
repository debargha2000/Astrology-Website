import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from './useToast';

interface Props {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const ICONS: Record<ToastType['type'], React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-700" />,
  error: <XCircle className="h-4 w-4 text-red-700" />,
  info: <Info className="h-4 w-4 text-blue-700" />,
};

const BG: Record<ToastType['type'], string> = {
  success: 'bg-emerald-50 border-emerald-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
};

export function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${BG[t.type]}`}
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
            <p className="flex-1 text-xs font-sans text-ink leading-snug">{t.message}</p>
            <button
              onClick={() => onRemove(t.id)}
              className="shrink-0 text-clay hover:text-ink p-0.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
