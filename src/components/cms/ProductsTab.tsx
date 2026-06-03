import React, { useState } from 'react';
import { Plus, Trash2, Box, Compass } from 'lucide-react';
import { DEFAULT_PRODUCT_FORM } from './seedData';
import { ImageUpload } from './ImageUpload';
import { ConfirmDialog } from './ConfirmDialog';
import { RichTextEditor } from './RichTextEditor';
import type { ProductForm } from './types';
import type { CmsState } from './useCmsState';
import type { CmsHandlers } from './useCmsHandlers';

interface Props {
  state: CmsState;
  handlers: CmsHandlers;
}

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/aura_stone_hero_banner_1779793774735.png`;

function newProductForm(): ProductForm {
  return {
    ...DEFAULT_PRODUCT_FORM,
    id: `prod-${Date.now()}`,
    specifications: { ...DEFAULT_PRODUCT_FORM.specifications }
  };
}

function fromExisting(p: any): ProductForm {
  return {
    ...DEFAULT_PRODUCT_FORM,
    ...p,
    benefits: Array.isArray(p.benefits) ? p.benefits.join('\n') : p.benefits || '',
    crystalsUsed: Array.isArray(p.crystalsUsed) ? p.crystalsUsed.join(', ') : p.crystalsUsed || '',
    zodiacConnection: Array.isArray(p.zodiacConnection) ? p.zodiacConnection.join(', ') : p.zodiacConnection || '',
    specifications: p.specifications || { ...DEFAULT_PRODUCT_FORM.specifications }
  };
}

export function ProductsTab({ state, handlers }: Props) {
  const { productsList } = state;
  const { saveProduct, deleteProduct } = handlers;
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [form, setForm] = useState<ProductForm>(newProductForm());

  const startAdd = () => {
    setEditing(null);
    setForm(newProductForm());
    setAdding(true);
  };

  const startEdit = (prod: any) => {
    setAdding(false);
    setEditing(prod);
    setForm(fromExisting(prod));
  };

  const cancel = () => {
    setAdding(false);
    setEditing(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProduct(form);
    cancel();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans select-text pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone/50 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">COMMERCE GRID INVENTORY</span>
          <h2 className="font-serif text-2xl font-light text-ink">Crystalline Jewelry Catalog</h2>
        </div>
        <button
          onClick={startAdd}
          className="cursor-pointer bg-ink hover:bg-[#332F2B] text-white text-xs font-mono font-bold uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-md leading-none"
        >
          <Plus className="h-4 w-4 text-gold" />
          <span>Publish New Curation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-cream border border-stone p-4 rounded-2xl shadow-3xs space-y-3">
            <span className="text-[9px] font-mono text-clay font-bold uppercase block tracking-wider">
              Live Showroom Index ({productsList.length})
            </span>
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {productsList.map((prod: any) => (
                <div
                  key={prod.id}
                  className={`p-3 rounded-xl border transition-all ${
                    editing?.id === prod.id
                      ? 'bg-ink border-ink text-white shadow-md'
                      : 'bg-white hover:bg-cream border-mist'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.imageUrl || FALLBACK_IMAGE}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-lg object-cover shrink-0 border border-cream"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <strong className="text-xs font-serif font-semibold block truncate leading-tight">{prod.name}</strong>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase bg-[#C5A880]/15 text-[#C5A880] shrink-0 font-bold">
                          {prod.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={editing?.id === prod.id ? 'text-gray-300' : 'text-clay'}>
                          Sale: <span className="font-bold text-gold">₹{prod.salePrice}</span>
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className={editing?.id === prod.id ? 'text-gray-400' : 'text-gray-500'}>
                          Stock: <span className="font-bold underline uppercase">{prod.stockStatus}</span>
                        </span>
                      </div>
                      {prod.videoUrl && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                          <Compass className="h-2.5 w-2.5 text-emerald-600" />
                          <span>Dynamic Video Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3.5 pt-2 border-t border-dashed border-gray-200/40">
                    <button
                      onClick={() => startEdit(prod)}
                      className={`cursor-pointer text-[9px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                        editing?.id === prod.id
                          ? 'bg-white hover:bg-gray-100 text-ink border-white'
                          : 'bg-white hover:bg-gray-100 text-ink border-stone'
                      }`}
                    >
                      Configure Item Details
                    </button>
                    <button
                      onClick={() => setDeleting(prod)}
                      className="cursor-pointer text-[9px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 flex items-center gap-1"
                      title="Erase publication record permanently"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                      <span>Erase</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {adding || editing ? (
            <form onSubmit={onSubmit} className="bg-white border-2 border-stone p-6 rounded-3xl shadow-md space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {adding ? 'Publish Fresh Creation' : `Modify "${editing?.name}"`}
                </h3>
                <button
                  type="button"
                  onClick={cancel}
                  className="cursor-pointer text-xs font-mono font-bold uppercase text-clay hover:text-ink tracking-wider"
                >
                  Dismiss Editing
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Dynamic Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. The Mercury Abundance Talisman"
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Catalog SKU *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editing}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                    placeholder="e.g. mercury-abundance-talisman"
                    className="w-full bg-cream/50 disabled:opacity-75 border border-stone p-2.5 rounded-xl font-medium font-mono outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProductForm['category'] })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium font-mono outline-none focus:border-black"
                  >
                    <option value="bracelet">Planetary Bracelet</option>
                    <option value="ring">Aura Guard Ring</option>
                    <option value="combo">Astrological Combo Set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Stock *</label>
                  <select
                    value={form.stockStatus}
                    onChange={(e) => setForm({ ...form, stockStatus: e.target.value as ProductForm['stockStatus'] })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none"
                  >
                    <option value="in-stock">IN STOCK</option>
                    <option value="low-stock">LOW STOCK</option>
                    <option value="out-of-stock">OUT OF STOCK</option>
                    <option value="pre-order">PRE-ORDER</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Bestseller? *</label>
                  <select
                    value={form.isBestSeller ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.value === 'true' })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none font-mono"
                  >
                    <option value="false">Standard Catalog Item</option>
                    <option value="true">Bestseller Showcase</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <label className="block text-clay font-mono text-[10px] uppercase font-bold">Short Promo Copy</label>
                <input
                  type="text"
                  value={form.shortDescription || ''}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1 font-sans text-xs">
                <label className="block text-clay font-mono text-[10px] uppercase font-bold">Full Description *</label>
                <RichTextEditor
                  value={form.description}
                  onChange={(html) => setForm({ ...form, description: html })}
                  placeholder="Describe the product..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
                <div className="space-y-1">
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                    folder="products"
                    label="Product Image"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Video URL</label>
                  <input
                    type="text"
                    value={form.videoUrl || ''}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Mineral Elements</label>
                  <input
                    type="text"
                    value={Array.isArray(form.crystalsUsed) ? form.crystalsUsed.join(', ') : form.crystalsUsed}
                    onChange={(e) => setForm({ ...form, crystalsUsed: e.target.value })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Compatible Signs</label>
                  <input
                    type="text"
                    value={Array.isArray(form.zodiacConnection) ? form.zodiacConnection.join(', ') : form.zodiacConnection}
                    onChange={(e) => setForm({ ...form, zodiacConnection: e.target.value })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-clay font-mono text-[10px] uppercase font-bold">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full bg-cream border border-stone p-2.5 rounded-xl font-mono outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <label className="block text-clay font-mono text-[10px] uppercase font-bold">Benefits (one per line)</label>
                <textarea
                  rows={3}
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  className="w-full bg-cream border border-stone p-2.5 rounded-xl font-medium outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-ink hover:bg-[#332F2B] active:scale-98 text-white font-mono text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all shadow-md mt-4"
              >
                🚀 Save Curation & Push Live (Triggers Auto-Rollback Checkpoint)
              </button>
            </form>
          ) : (
            <div className="bg-cream border-2 border-dashed border-stone rounded-3xl p-12 text-center select-none space-y-4">
              <div className="h-14 w-14 rounded-full bg-[#C5A880]/10 flex items-center justify-center mx-auto">
                <Box className="h-6 w-6 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-lg font-light text-ink">No Creative Item Selected</h3>
              <p className="text-xs text-clay max-w-sm mx-auto leading-relaxed">
                Select a curated bracelet or aura shield ring from the live showroom index on the left to edit, or click
                the <strong>"Publish New Curation"</strong> button above to create a custom product.
              </p>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={!!deleting}
        title="Delete Product"
        message={`Delete "${deleting?.name}"? An auto-backup checkpoint will be captured.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleting) {
            await deleteProduct(deleting.id, deleting.name);
            setDeleting(null);
          }
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
