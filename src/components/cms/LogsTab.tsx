import { Search, Terminal, Clock, Info } from 'lucide-react';
import { useState, useMemo } from 'react';

import type { CmsState } from './useCmsState';

interface Props {
  state: CmsState;
}

export function LogsTab({ state }: Props) {
  const { terminalLog } = state;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return terminalLog;
    const q = search.toLowerCase();
    return terminalLog.filter((line) => line.message.toLowerCase().includes(q));
  }, [terminalLog, search]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      <div className="bg-cream border border-stone p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="p-1 px-2.5 bg-ink text-amber-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold inline-flex items-center gap-1.5 shadow-xs">
            <Terminal className="h-3 w-3 text-gold" /> ACTIVITY AUDIT TRAIL
          </span>
          <h2 className="font-serif text-2xl font-light text-ink">
            System <span className="font-semibold text-gold-muted">Operations Log</span>
          </h2>
          <p className="text-xs text-ink/60 max-w-2xl leading-relaxed font-light">
            Real-time feed of all system activities, data mutations, and operational events across
            the CMS.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="pl-10 pr-4 py-2.5 bg-white border border-stone rounded-xl text-xs font-mono outline-none focus:border-ink w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white border border-stone rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-cream bg-cream/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-clay" />
            <span className="font-mono text-[10px] text-clay uppercase tracking-wider font-bold">
              {filtered.length} entries
            </span>
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="font-mono text-[10px] text-gold-muted hover:text-ink uppercase tracking-wider cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Info className="h-8 w-8 text-stone mx-auto mb-3" />
              <p className="font-mono text-xs text-clay uppercase tracking-wide">
                {terminalLog.length === 0
                  ? 'No log entries recorded yet.'
                  : 'No logs match your search.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream">
              {filtered.map((line, idx) => {
                return (
                  <div
                    key={idx}
                    className="px-5 py-3.5 hover:bg-cream/20 transition-colors flex items-start gap-3 font-mono text-xs"
                  >
                    <span className="text-gold-muted shrink-0 w-36 text-[10px] leading-relaxed">
                      {line.timestamp}
                    </span>
                    <span className="text-ink leading-relaxed break-words">{line.message}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
