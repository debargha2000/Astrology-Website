import React from 'react';
import { Sparkles } from 'lucide-react';

export function AstroTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-[#C5A880]/10 rounded-xl text-[#C5A880]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-serif text-lg text-[#1A1A1A]">Astrology Content</h3>
          <p className="text-[10px] font-mono text-[#857F75] uppercase tracking-widest">
            Manage zodiac interpretations, nakshatras, and transit meanings
          </p>
        </div>
      </div>

      <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-2xl p-8 text-center">
        <Sparkles className="h-10 w-10 text-[#C5A880]/40 mx-auto mb-4" />
        <h4 className="font-serif text-lg text-[#1A1A1A] mb-2">Content Editor Coming in Phase 2</h4>
        <p className="text-xs text-[#857F75] max-w-md mx-auto">
          This tab will allow editing of planet interpretations, nakshatra descriptions,
          ascendant meanings, and transit interpretations. Currently using hard-coded defaults.
        </p>
      </div>
    </div>
  );
}
