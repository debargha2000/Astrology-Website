import React from 'react';
import type { PlanetPosition } from '../../types';

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

const PLANET_LABELS: Record<string, string> = {
  Sun: 'Sun (Surya)',
  Moon: 'Moon (Chandra)',
  Mercury: 'Mercury (Budha)',
  Venus: 'Venus (Shukra)',
  Mars: 'Mars (Mangala)',
  Jupiter: 'Jupiter (Guru)',
  Saturn: 'Saturn (Shani)',
  Rahu: 'North Node (Rahu)',
  Ketu: 'South Node (Ketu)',
};

interface PlanetRow {
  name: string;
  pos: PlanetPosition;
  retrograde?: boolean;
}

interface PlanetTableProps {
  planets: PlanetRow[];
  className?: string;
}

export function PlanetTable({ planets, className = '' }: PlanetTableProps) {
  return (
    <div className={`bg-[#1C1A18] border border-white/5 rounded-xl overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-white/5">
        <span className="text-[10px] font-mono text-[#A6A18F] uppercase tracking-widest font-bold">
          Planetary Positions
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {planets.map((row) => (
          <div key={row.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
            <span className="text-base w-6 text-center" title={row.name}>{PLANET_GLYPHS[row.name]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif text-[#FAF8F5]/90">{PLANET_LABELS[row.name] || row.name}</span>
                {row.retrograde && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444]">
                    RETRO
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-[#A6A18F]">
                {row.pos.sign} {row.pos.degree.toFixed(1)}°
                {row.pos.house && <span className="text-[#C5A880]"> • House {row.pos.house}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
