import { Sparkles, Clock, Plus, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from './ConfirmDialog';
import { ImageUpload } from './ImageUpload';
import type { Checkpoint, SiteForm } from './types';
import type { CmsHandlers } from './useCmsHandlers';
import type { CmsState } from './useCmsState';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

export function SiteTab({ state, handlers }: Props) {
  const { siteForm, setSiteForm, checkpointsList } = state;
  const { updateWebsite, createManualCheckpoint, rollbackTo } = handlers;

  const handle = (key: keyof SiteForm, value: string) => setSiteForm({ ...siteForm, [key]: value });
  const [rollingBack, setRollingBack] = useState<Checkpoint | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWebsite(siteForm);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans select-text pb-20">
      <div className="flex justify-between items-center border-b border-stone/50 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
            WEBSITE LAYOUT CUSTOMIZER & VERSIONING
          </span>
          <h2 className="font-serif text-2xl font-light text-ink">Vedic Live Copywriter Portal</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 bg-white border-2 border-stone p-6 sm:p-8 rounded-3xl shadow-md">
          <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100 mb-6">
            <Sparkles className="h-5 w-5 text-emerald-600 fill-current" />
            <h3 className="font-serif text-lg font-semibold text-ink">Section Blocks Editor</h3>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 text-xs text-sans">
            <div className="p-4 bg-cream border border-stone rounded-2xl space-y-4">
              <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                Block 1: Global Identity & Title Tags
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                    Core Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.brandName}
                    onChange={(e) => handle('brandName', e.target.value)}
                    className="w-full bg-white border border-stone p-2 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                    Global Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.brandSubtitle}
                    onChange={(e) => handle('brandSubtitle', e.target.value)}
                    className="w-full bg-white border border-stone p-2 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-cream border border-stone rounded-2xl space-y-4">
              <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                Block 2: Cinematic Hero Copy
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                    Hero Headline Prefix *
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.heroHeadline}
                    onChange={(e) => handle('heroHeadline', e.target.value)}
                    className="w-full bg-white border border-stone p-2 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                    Hero Highlight *
                  </label>
                  <input
                    type="text"
                    required
                    value={siteForm.heroHighlight}
                    onChange={(e) => handle('heroHighlight', e.target.value)}
                    className="w-full bg-white border border-stone p-2 rounded-lg font-bold text-gold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Hero Paragraph *
                </label>
                <textarea
                  required
                  rows={3}
                  value={siteForm.heroParagraph}
                  onChange={(e) => handle('heroParagraph', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <ImageUpload
                  value={siteForm.bannerImage}
                  onChange={(url) => handle('bannerImage', url)}
                  folder="banners"
                  label="Banner Image"
                />
              </div>
            </div>

            <div className="p-4 bg-cream border border-stone rounded-2xl space-y-4">
              <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                Block 3: Founders Quote
              </span>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Quote Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={siteForm.founderQuote}
                  onChange={(e) => handle('founderQuote', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg font-serif italic"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Author Attribution *
                </label>
                <input
                  type="text"
                  required
                  value={siteForm.founderQuoteSubtitle}
                  onChange={(e) => handle('founderQuoteSubtitle', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="p-4 bg-cream border border-stone rounded-2xl space-y-4">
              <span className="text-[9px] font-mono text-[#C5A880] font-bold uppercase block tracking-wider">
                Block 4: Heritage Story
              </span>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Headline *
                </label>
                <input
                  type="text"
                  required
                  value={siteForm.historyHeadline}
                  onChange={(e) => handle('historyHeadline', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg text-sm font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Paragraph 1 *
                </label>
                <textarea
                  required
                  rows={3}
                  value={siteForm.historyParagraph1}
                  onChange={(e) => handle('historyParagraph1', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-clay font-mono text-[9px] uppercase font-bold">
                  Paragraph 2 *
                </label>
                <textarea
                  required
                  rows={3}
                  value={siteForm.historyParagraph2}
                  onChange={(e) => handle('historyParagraph2', e.target.value)}
                  className="w-full bg-white border border-stone p-2 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-ink hover:bg-[#332F2B] text-white py-4 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              <span>Push Customization Live & Generate Backup Checkpoint</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cream border-2 border-stone p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-stone/40">
              <div className="p-1.5 rounded-lg bg-[#C5A880]/15 text-[#C5A880]">
                <Clock className="h-5 w-5 shrink-0" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-ink">
                  Historical Sync Records
                </h3>
                <p className="text-[10px] text-clay">Planetary Rollback Vault</p>
              </div>
            </div>

            <p className="text-xs text-clay leading-relaxed">
              Aura & Stone records up to <strong>25 operational backups</strong>. If layout
              modifications fail to satisfy your design eyes, or catalog records are mistakenly
              corrupted, you can revert the entire website to an earlier state instantly.
            </p>

            <button
              onClick={createManualCheckpoint}
              className="cursor-pointer w-full bg-white hover:bg-gray-50 text-ink font-mono font-bold uppercase tracking-widest py-3 px-4 rounded-xl border border-stone text-center transition-all flex items-center justify-center gap-1.5 shadow-3xs"
            >
              <Plus className="h-4 w-4 text-[#C5A880]" />
              <span>Capture Manual Checkpoint</span>
            </button>

            <div className="space-y-3.5 mt-4 pt-4 border-t border-dashed border-stone/50">
              <span className="text-[9px] font-mono font-bold text-clay uppercase block tracking-wider">
                Rolling Backup Timeline (Max 25 states)
              </span>
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {checkpointsList.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-mist/60 text-clay italic text-[11px]">
                    No checkpoint records captured. Save changes to trigger automatic backup arrays.
                  </div>
                ) : (
                  checkpointsList.map((chk: Checkpoint) => {
                    const localTime = new Date(chk.timestamp).toLocaleString();
                    return (
                      <div
                        key={chk.id}
                        className="p-3 bg-white rounded-xl border border-mist space-y-2 shadow-4xs hover:shadow-3xs transition-all text-[11px]"
                      >
                        <div className="flex justify-between items-start gap-1.5">
                          <span className="font-sans font-bold leading-tight block text-ink">
                            {chk.title}
                          </span>
                          <span className="text-[8.5px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded font-bold shrink-0 uppercase">
                            Secure
                          </span>
                        </div>
                        <div className="text-[9.5px] font-mono text-clay space-y-0.5">
                          <div>
                            Time: <span className="text-gray-900 font-medium">{localTime}</span>
                          </div>
                          <div>
                            ID:{' '}
                            <span className="font-sans text-[9px] tracking-tight">{chk.id}</span>
                          </div>
                          <div>
                            Author: <span className="text-gray-900 font-bold">{chk.user}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setRollingBack(chk)}
                          className="cursor-pointer w-full bg-white hover:bg-ink text-ink hover:text-white border border-stone font-mono text-[9px] font-bold uppercase py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 mt-1"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-[#C5A880]" />
                          <span>Rollback Website to this State</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={!!rollingBack}
        title="Rollback Website"
        message={`WARNING: Rollback to "${rollingBack?.title}"? This overwrites current live website content AND products with the values stored in this backup.`}
        confirmLabel="Rollback"
        variant="warning"
        onConfirm={async () => {
          if (rollingBack) {
            await rollbackTo(rollingBack.id, rollingBack.title);
            setRollingBack(null);
          }
        }}
        onCancel={() => setRollingBack(null)}
      />
    </div>
  );
}
