import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import { ASPECT_MEANINGS } from '../../lib/interpretations';
import type { TransitAspect } from '../../types';

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌',
  opposition: '☍',
  trine: '△',
  square: '□',
  sextile: '⚹',
  inconjunct: '⚻',
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: 'text-[#C5A880]',
  opposition: 'text-[#EF4444]',
  trine: 'text-[#3B82F6]',
  square: 'text-[#F97316]',
  sextile: 'text-[#10B981]',
  inconjunct: 'text-[#A6A18F]',
};

const ASPECT_KEY_MAP: Record<string, string> = {
  conjunction: 'Conjunction',
  opposition: 'Opposition',
  trine: 'Trine',
  square: 'Square',
  sextile: 'Sextile',
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface TransitListProps {
  transits: TransitAspect[];
  className?: string;
}

export function TransitList({ transits, className = '' }: TransitListProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  if (transits.length === 0) {
    return (
      <div className={`bg-[#1C1A18] border border-white/5 rounded-xl p-4 ${className}`}>
        <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold block mb-2">
          Current Transits
        </span>
        <p className="text-xs text-[#FAF8F5]/50 font-light">No active transits detected.</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#1C1A18] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-white/5">
        <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold">
          Active Transits
        </span>
      </div>
      <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto">
        {transits.map((t, i) => {
          const aspectKey = ASPECT_KEY_MAP[t.aspect] || capitalize(t.aspect);
          const meaning =
            ASPECT_MEANINGS[`${t.natalPlanet}-${aspectKey}`] ||
            ASPECT_MEANINGS[`${t.transitPlanet}-${aspectKey}`];
          const isOpen = expanded.has(i);
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => meaning && toggle(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${meaning ? 'hover:bg-white/[0.02] cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`text-base w-6 text-center ${ASPECT_COLORS[t.aspect] || 'text-[#A6A18F]'}`}
                >
                  {ASPECT_SYMBOLS[t.aspect] || '•'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-serif text-[#FAF8F5]/90">
                    {t.natalPlanet} — {t.transitPlanet}
                  </div>
                  <div className="text-[10px] font-mono text-[#A6A18F]">
                    {t.aspect} {t.orb.toFixed(1)}° orb
                  </div>
                </div>
                <span
                  className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    t.aspect === 'conjunction'
                      ? 'bg-[#C5A880]/20 text-[#C5A880]'
                      : t.aspect === 'opposition'
                        ? 'bg-[#EF4444]/20 text-[#EF4444]'
                        : t.aspect === 'trine'
                          ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                          : t.aspect === 'square'
                            ? 'bg-[#F97316]/20 text-[#F97316]'
                            : 'bg-[#10B981]/20 text-[#10B981]'
                  }`}
                >
                  {t.aspect}
                </span>
                {meaning &&
                  (isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-[#A6A18F] flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-[#A6A18F]/50 flex-shrink-0" />
                  ))}
              </button>
              {isOpen && meaning && (
                <div className="px-4 pb-3 pl-12 -mt-1">
                  <p className="text-[11px] text-[#FAF8F5]/80 leading-relaxed font-light">
                    {meaning}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
