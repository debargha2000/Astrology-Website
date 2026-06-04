import React from 'react';

interface NakshatraBadgeProps {
  nakshatra: string;
  symbol?: string;
  className?: string;
}

export function NakshatraBadge({ nakshatra, symbol, className = '' }: NakshatraBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 text-[#C5A880] text-[10px] font-mono ${className}`}
    >
      {symbol && <span className="text-sm">{symbol}</span>}
      <span className="uppercase tracking-wider font-bold">{nakshatra}</span>
    </span>
  );
}
