import React, { useState, useMemo } from 'react';
import { Sparkles, Search, Plus, Save, Trash2, Sun, Moon, Star, Compass, Database, X, Edit3 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './useToast';
import type { CmsState } from './useCmsState';
import type { CmsHandlers } from './useCmsHandlers';
import type { AstroContent, AstroContentType } from './types';

type Section = AstroContentType;

const SECTIONS: { id: Section; label: string; icon: typeof Sun }[] = [
  { id: 'planet', label: 'Planets in Signs', icon: Sun },
  { id: 'ascendant', label: 'Ascendants', icon: Compass },
  { id: 'aspect', label: 'Transit Aspects', icon: Star },
  { id: 'nakshatra', label: 'Nakshatras', icon: Moon },
];

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

export function AstroTab({ state, handlers }: Props) {
  const { astroContent } = state;
  const { addToast: notify } = useToast();
  const [section, setSection] = useState<Section>('planet');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editInterpretation, setEditInterpretation] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<AstroContent | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newInterpretation, setNewInterpretation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const sectionEntries = useMemo(
    () => astroContent.filter((e) => e.type === section),
    [astroContent, section]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sectionEntries;
    const q = search.toLowerCase();
    return sectionEntries.filter(
      (e) => e.title.toLowerCase().includes(q) || e.key.toLowerCase().includes(q) || e.interpretation.toLowerCase().includes(q)
    );
  }, [sectionEntries, search]);

  const beginEdit = (e: AstroContent) => {
    setEditingId(e.id);
    setEditTitle(e.title);
    setEditInterpretation(e.interpretation);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditInterpretation('');
  };

  const saveEdit = async () => {
    const entry = sectionEntries.find((e) => e.id === editingId);
    if (!entry) return;
    const result = await handlers.saveAstroEntry({
      id: entry.id,
      type: entry.type,
      key: entry.key,
      title: editTitle.trim() || entry.title,
      interpretation: editInterpretation,
    });
    if (result) cancelEdit();
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newTitle.trim() || !newInterpretation.trim()) {
      notify('Key, title, and interpretation are all required.', 'error');
      return;
    }
    const result = await handlers.saveAstroEntry({
      type: section,
      key: newKey.trim(),
      title: newTitle.trim(),
      interpretation: newInterpretation.trim(),
    });
    if (result) {
      setNewKey('');
      setNewTitle('');
      setNewInterpretation('');
      setShowAddForm(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await handlers.deleteAstroEntry(confirmDelete.id, confirmDelete.title);
    setConfirmDelete(null);
  };

  const totalByType = useMemo(() => {
    const counts: Record<Section, number> = { planet: 0, ascendant: 0, aspect: 0, nakshatra: 0 };
    astroContent.forEach((e) => { counts[e.type]++; });
    return counts;
  }, [astroContent]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="bg-cream border border-stone p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="p-1 px-2.5 bg-ink text-amber-200 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="h-3 w-3 text-gold" /> ASTROLOGY CONTENT EDITOR
          </span>
          <h2 className="font-serif text-2xl font-light text-ink">
            Natal Chart <span className="font-semibold text-gold-muted">Interpretations</span>
          </h2>
          <p className="text-xs text-ink/60 max-w-2xl leading-relaxed font-light">
            Edit the interpretive text shown in the natal chart result tiles (Sun/Moon/planet placements, ascendants, transit aspects, and nakshatras).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {astroContent.length === 0 && (
            <button
              onClick={handlers.seedAstroDefaults}
              className="px-3.5 py-2 bg-ink text-amber-200 hover:bg-gold-muted hover:text-ink rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="h-3.5 w-3.5" /> Seed Defaults
            </button>
          )}
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="px-3.5 py-2 bg-gold-muted text-ink hover:bg-ink hover:text-amber-200 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showAddForm ? 'Cancel' : 'New Entry'}
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { setSection(s.id); setSearch(''); setShowAddForm(false); cancelEdit(); }}
              className={`px-4 py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 cursor-pointer ${
                active
                  ? 'bg-ink text-amber-200 shadow-sm'
                  : 'bg-white border border-stone text-clay hover:border-ink/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
              <span className={`px-1.5 py-0.5 rounded text-[8px] ${active ? 'bg-amber-200/20 text-amber-200' : 'bg-cream text-clay'}`}>
                {totalByType[s.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clay" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${SECTIONS.find((s) => s.id === section)?.label.toLowerCase()}...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone rounded-xl text-xs font-mono outline-none focus:border-ink"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white border border-gold-muted/30 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="h-4 w-4 text-gold-muted" />
            <span className="font-mono text-[10px] text-ink uppercase tracking-widest font-bold">
              New {section} entry
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] text-clay uppercase tracking-widest font-bold mb-1">Key</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder={section === 'planet' ? 'e.g. Sun-Leo' : section === 'ascendant' ? 'e.g. Pisces' : section === 'aspect' ? 'e.g. Sun-Conjunction' : 'e.g. Rohini'}
                className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-xs font-mono outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-clay uppercase tracking-widest font-bold mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Display title"
                className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-xs font-mono outline-none focus:border-ink"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[9px] text-clay uppercase tracking-widest font-bold mb-1">Interpretation</label>
            <textarea
              value={newInterpretation}
              onChange={(e) => setNewInterpretation(e.target.value)}
              rows={3}
              placeholder="Interpretive text shown in the result tile..."
              className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-xs outline-none focus:border-ink resize-y leading-relaxed"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setShowAddForm(false); setNewKey(''); setNewTitle(''); setNewInterpretation(''); }}
              className="px-3 py-1.5 text-clay hover:text-ink font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3.5 py-1.5 bg-ink text-amber-200 hover:bg-gold-muted hover:text-ink rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Save className="h-3 w-3" /> Save
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && !showAddForm && (
        <div className="bg-cream border border-stone rounded-2xl p-10 text-center">
          <Sparkles className="h-10 w-10 text-gold-muted/40 mx-auto mb-3" />
          <h4 className="font-serif text-lg text-ink mb-1">
            {astroContent.length === 0 ? 'No interpretations saved yet' : 'No entries match your search'}
          </h4>
          <p className="text-xs text-clay max-w-md mx-auto mb-4">
            {astroContent.length === 0
              ? 'Click "Seed Defaults" to populate all 12 ascendants, 7 planets × 12 signs, transit aspects, and 27 nakshatras from the default library.'
              : 'Adjust your search to see more entries.'}
          </p>
          {astroContent.length === 0 && (
            <button
              onClick={handlers.seedAstroDefaults}
              className="px-4 py-2 bg-ink text-amber-200 hover:bg-gold-muted hover:text-ink rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="h-3.5 w-3.5" /> Seed Defaults Now
            </button>
          )}
        </div>
      )}

      {/* Entry List */}
      <div className="space-y-3">
        {filtered.map((e) => {
          const isEditing = editingId === e.id;
          return (
            <div key={e.id} className="bg-white border border-stone rounded-2xl p-5 shadow-sm">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-[9px] text-clay uppercase tracking-widest font-bold mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(ev) => setEditTitle(ev.target.value)}
                      className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-xs font-mono outline-none focus:border-ink"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-clay uppercase tracking-widest font-bold mb-1">Interpretation</label>
                    <textarea
                      value={editInterpretation}
                      onChange={(ev) => setEditInterpretation(ev.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-cream border border-stone rounded-lg text-xs outline-none focus:border-ink resize-y leading-relaxed"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 text-clay hover:text-ink font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-3.5 py-1.5 bg-ink text-amber-200 hover:bg-gold-muted hover:text-ink rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-base text-ink leading-tight">{e.title}</h4>
                      <p className="font-mono text-[9px] text-clay mt-0.5">
                        key: {e.key}
                        {e.updatedAt && (
                          <span className="ml-2">• updated {new Date(e.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => beginEdit(e)}
                        className="p-1.5 text-clay hover:text-gold-muted hover:bg-cream rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(e)}
                        className="p-1.5 text-clay hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-ink/80 leading-relaxed font-light">
                    {e.interpretation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Interpretation"
        message={confirmDelete ? `Permanently delete "${confirmDelete.title}"? This will remove the custom interpretation from the natal chart result tiles.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
