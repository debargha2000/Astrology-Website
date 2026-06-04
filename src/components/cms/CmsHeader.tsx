import {
  LogOut,
  Compass,
  FileText,
  Users,
  DollarSign,
  CheckSquare,
  Send,
  Box,
  Sparkles,
  Terminal,
} from 'lucide-react';
import React from 'react';

import type { CmsSubTab } from './types';

const TABS: { key: CmsSubTab; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'dashboard', icon: <Compass className="h-3.5 w-3.5" /> },
  { key: 'invoices', label: 'invoices', icon: <FileText className="h-3.5 w-3.5" /> },
  { key: 'vendors', label: 'vendors', icon: <Users className="h-3.5 w-3.5" /> },
  { key: 'expenses', label: 'expenses', icon: <DollarSign className="h-3.5 w-3.5" /> },
  { key: 'tasks', label: 'tasks', icon: <CheckSquare className="h-3.5 w-3.5" /> },
  { key: 'gmail', label: 'Gmail', icon: <Send className="h-3.5 w-3.5 text-gold" /> },
  { key: 'products', label: 'Products', icon: <Box className="h-3.5 w-3.5 text-gold" /> },
  {
    key: 'site',
    label: 'Site builder',
    icon: <Sparkles className="h-3.5 w-3.5 text-emerald-600" />,
  },
  { key: 'logs', label: 'Logs', icon: <Terminal className="h-3.5 w-3.5" /> },
  { key: 'astro', label: 'Astrology', icon: <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" /> },
];

interface Props {
  googleUser: any;
  activeTab: CmsSubTab;
  onTabChange: (tab: CmsSubTab) => void;
  onLogout: () => void;
}

export function CmsHeader({ googleUser, activeTab, onTabChange, onLogout }: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-stone pb-6 gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 bg-ink text-paper font-mono text-[9px] uppercase tracking-widest rounded-md font-bold flex items-center gap-1.5 shadow-md">
            <Sparkles className="h-3 w-3 text-gold-muted" /> INTERNAL STAFF ONLY
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gold-muted font-bold uppercase tracking-wider">
            Operational Engine Live
          </span>
        </div>
        <h1 className="font-serif text-3xl font-light text-ink tracking-wide">
          Aura & Stone <span className="font-semibold text-gold-muted">CMS Portal</span>
        </h1>
        <p className="text-xs text-ink/60 max-w-2xl leading-relaxed font-light">
          An all-in-one content, commerce, and operations suite designed for business success.
          Program crystal batches, track mineral supply chains, record purifying expenses, and
          verify global Vedic invoices.
        </p>

        {googleUser && (
          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 bg-sand border border-stone/40 py-1.5 px-3 rounded-xl shadow-3xs">
              {googleUser.photoURL ? (
                <img
                  src={googleUser.photoURL}
                  alt="Operator"
                  className="h-5 w-5 rounded-full border border-stone"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-ink text-white flex items-center justify-center font-serif text-[10px] border border-stone">
                  {googleUser.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="font-bold text-ink tracking-wider">ADMINISTRATOR:</span>
                <span className="text-clay font-medium">{googleUser.email}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="cursor-pointer font-mono text-[10px] font-bold uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors py-1.5 px-3 rounded-xl flex items-center gap-1 border border-red-200/50 shadow-3xs"
              title="Authenticate Logout"
            >
              <LogOut className="h-3 w-3 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap lg:flex-nowrap bg-paper/80 border border-stone p-1.5 rounded-2xl shadow-sm gap-1 self-start lg:self-center items-center font-sans">
        {TABS.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all gap-1.5 flex items-center ${
                isActive
                  ? 'bg-ink text-white shadow-md border-b-2 border-gold-muted/40'
                  : 'text-clay hover:text-ink hover:bg-mist/50'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline text-[11px] font-bold">{t.label}</span>
            </button>
          );
        })}

        <div className="h-6 w-[1px] bg-stone mx-1 hidden sm:block" />

        <button
          onClick={onLogout}
          className="cursor-pointer px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest text-red-700 hover:text-red-900 hover:bg-red-50 transition-all flex items-center gap-1.5 border border-dashed border-red-200/40"
          title="Disconnect administrator session"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
