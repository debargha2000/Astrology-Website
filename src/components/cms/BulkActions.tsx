import { Trash2, X, CheckSquare } from 'lucide-react';
import React from 'react';

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  entityLabel: string;
}

export function BulkActions({ count, onClear, onDelete, entityLabel }: Props) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-ink text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 font-mono text-xs animate-fadeIn">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-gold" />
        <span className="font-bold">{count}</span>
        <span className="text-white/70">{entityLabel} selected</span>
      </div>
      <div className="w-px h-5 bg-white/20" />
      <button
        onClick={onDelete}
        className="cursor-pointer flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
      <button
        onClick={onClear}
        className="cursor-pointer flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
