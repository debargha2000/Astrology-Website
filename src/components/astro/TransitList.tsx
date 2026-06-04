import React from 'react';
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

interface TransitListProps {
  transits: TransitAspect[];
  className?: string;
}

export function TransitList({ transits, className = '' }: TransitListProps) {
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
      <div className="divide-y divide-white/5 max-h-[280px] overflow-y-auto">
        {transits.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
            <span className={`text-base w-6 text-center ${ASPECT_COLORS[t.aspect] || 'text-[#A6A18F]'}`}>
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
            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
              t.aspect === 'conjunction' ? 'bg-[#C5A880]/20 text-[#C5A880]' :
              t.aspect === 'opposition' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
              t.aspect === 'trine' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' :
              t.aspect === 'square' ? 'bg-[#F97316]/20 text-[#F97316]' :
              'bg-[#10B981]/20 text-[#10B981]'
            }`}>
              {t.aspect}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
