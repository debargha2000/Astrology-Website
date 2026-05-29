/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartItem, Product, PageId } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (idx: number, q: number) => void;
  onRemoveItem: (idx: number) => void;
  onUpdateSize: (idx: number, s: CartItem['size']) => void;
  onUpdatePersonalization: (idx: number, val: boolean, details?: CartItem['birthDetails']) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSize,
  onUpdatePersonalization,
  onCheckout
}: CartDrawerProps) {
  
  const subtotal = cartItems.reduce((acc, curr) => {
    let price = curr.product.salePrice * curr.quantity;
    if (curr.personalizedCertification) {
      price += 250 * curr.quantity; // Extra Vedic certified custom calculations fee
    }
    return acc + price;
  }, 0);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 33 }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[#F8F6F1] shadow-2xl font-sans"
          >
            {/* Header */}
            <div className="flex h-20 items-center justify-between border-b border-[#D1CEBF] px-6">
              <div>
                <h3 className="font-serif text-lg font-light tracking-wide text-[#1A1A1A] flex items-center gap-1.5">
                  Your Sacred Cart
                  <span className="text-xs font-mono text-[#A6A18F]">({cartItems.length})</span>
                </h3>
                <span className="block text-[9px] font-mono tracking-widest text-[#1A1A1A]/65 uppercase leading-none mt-1">
                  Consecrated Solder Chamber
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="cursor-pointer p-2 rounded-full hover:bg-[#E5E3D8]/45 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart item listing list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                  <Sparkles className="h-10 w-10 text-[#A6A18F]/40 animate-pulse" />
                  <div>
                    <h4 className="font-serif text-base text-[#1A1A1A]/70">Your Cart is Empty</h4>
                    <p className="max-w-[250px] mx-auto text-[11px] text-[#1A1A1A]/50 leading-relaxed mt-1 font-light">
                      No crystal conductors have been placed into the alignment vessel yet.
                    </p>
                  </div>
                  <button
                    id="back-to-shop-from-cart"
                    onClick={onClose}
                    className="cursor-pointer px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#322D2C] text-white text-[10px] uppercase tracking-widest font-mono rounded-lg transition-colors border border-[#D1CEBF]/20"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    id={`cart-item-${idx}`}
                    key={idx}
                    className="pb-6 border-b border-[#D1CEBF]/40 space-y-4"
                  >
                    {/* Item info header */}
                    <div className="flex items-start gap-4">
                      {/* image */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-md object-cover border border-[#D1CEBF]/35 bg-[#FAF7F2]/30"
                      />

                      {/* basic text */}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-serif text-sm text-[#1A1A1A] font-light leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 text-[10px] text-[#1A1A1A]/60 font-mono">
                          <span>₹{item.product.salePrice}</span>
                          {item.personalizedCertification && (
                            <span className="text-[#A6A18F]">+ ₹250 Vedic Seal</span>
                          )}
                        </div>
                      </div>

                      {/* delete */}
                      <button
                        id={`remove-cart-item-${idx}`}
                        onClick={() => onRemoveItem(idx)}
                        className="cursor-pointer text-[#1A1A1A]/40 hover:text-[#9E2A2B] p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Size and Quantities selection */}
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 mb-1">
                          Wrist Size:
                        </label>
                        <select
                          id={`cart-item-size-${idx}`}
                          value={item.size}
                          onChange={(e) => onUpdateSize(idx, e.target.value as CartItem['size'])}
                          className="w-full bg-[#E5E3D8]/20 border border-[#D1CEBF] p-1.5 rounded text-[10px] outline-none focus:border-[#A6A18F] text-[#1A1A1A]"
                        >
                          <option value="petite">Petite (15cm - Female standard)</option>
                          <option value="standard-unisex">Standard Unisex (17cm)</option>
                          <option value="xl-mens">XL Bold (19cm - Male standard)</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="block text-[8px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 mb-1">
                          Quantity:
                        </label>
                        <div className="flex items-center bg-[#E5E3D8]/20 border border-[#D1CEBF] rounded overflow-hidden max-w-[85px]">
                          <button
                            id={`qty-minus-${idx}`}
                            type="button"
                            onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                            className="p-1.5 cursor-pointer text-[#1A1A1A] hover:bg-[#D1CEBF]/30"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="flex-1 text-center text-xs font-mono font-bold text-[#1A1A1A]">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${idx}`}
                            type="button"
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="p-1.5 cursor-pointer text-[#1A1A1A] hover:bg-[#D1CEBF]/30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personalized Astrological custom verification checkbox */}
                    <div className="p-3 bg-[#E5E3D8]/20 border border-[#D1CEBF]/50 rounded-xl flex items-start gap-2.5">
                      <input
                        id={`cart-personalization-toggle-${idx}`}
                        type="checkbox"
                        checked={item.personalizedCertification}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          onUpdatePersonalization(idx, checked, checked ? { name: '', birthDate: '' } : undefined);
                        }}
                        className="mt-0.5 accent-[#A6A18F] cursor-pointer"
                      />
                      <div className="space-y-1.5 flex-1">
                        <label
                          htmlFor={`cart-personalization-toggle-${idx}`}
                          className="text-[10px] font-mono text-[#1A1A1A] font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-between"
                        >
                          <span>Natal Chart Seal (+ ₹250)</span>
                          <span className="text-[8px] tracking-normal bg-[#A6A18F]/15 text-[#A6A18F] font-bold px-1.5 py-0.5 rounded uppercase font-mono">Recommended</span>
                        </label>
                        <p className="text-[10px] text-[#1A1A1A]/70 leading-normal font-sans font-light">
                          Provides a signed certificate with the precise constellation alignment hour at consecration.
                        </p>

                        <AnimatePresence>
                          {item.personalizedCertification && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 pt-2 border-t border-[#D1CEBF]/45"
                            >
                              <div>
                                <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/60 mb-0.5">
                                  Full Name of Wearer:
                                </label>
                                <input
                                  id={`birth-details-name-${idx}`}
                                  type="text"
                                  required
                                  placeholder="e.g. Priyan Sharma"
                                  value={item.birthDetails?.name || ''}
                                  onChange={(e) => {
                                    const details = item.birthDetails || { name: '', birthDate: '' };
                                    onUpdatePersonalization(idx, true, { ...details, name: e.target.value });
                                  }}
                                  className="w-full bg-white border border-[#D1CEBF] px-2 py-1 rounded text-[10px] outline-none text-[#1A1A1A] font-medium"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/60 mb-0.5">
                                    Birth Date:
                                  </label>
                                  <input
                                    id={`birth-details-date-${idx}`}
                                    type="date"
                                    required
                                    value={item.birthDetails?.birthDate || ''}
                                    onChange={(e) => {
                                      const details = item.birthDetails || { name: '', birthDate: '' };
                                      onUpdatePersonalization(idx, true, { ...details, birthDate: e.target.value });
                                    }}
                                    className="w-full bg-white border border-[#D1CEBF] px-2 py-1 rounded text-[10px] outline-none text-[#1A1A1A]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono uppercase text-[#1A1A1A]/60 mb-0.5">
                                    Birth Place:
                                  </label>
                                  <input
                                    id={`birth-details-place-${idx}`}
                                    type="text"
                                    placeholder="City (e.g. Mumbai)"
                                    value={item.birthDetails?.birthPlace || ''}
                                    onChange={(e) => {
                                      const details = item.birthDetails || { name: '', birthDate: '' };
                                      onUpdatePersonalization(idx, true, { ...details, birthPlace: e.target.value });
                                    }}
                                    className="w-full bg-white border border-[#D1CEBF] px-2 py-1 rounded text-[10px] outline-none text-[#1A1A1A] font-medium"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom calculation details summary & checkout button */}
            {cartItems.length > 0 && (
              <div className="border-t border-[#D1CEBF] bg-[#FAF7F2]/40 p-6 space-y-4">
                <div className="space-y-1.5 font-mono text-xs text-[#1A1A1A]/70">
                  <div className="flex justify-between">
                    <span>Consecrated Subtotal</span>
                    <span className="text-[#1A1A1A] font-bold">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certified Vedic Cleansing</span>
                    <span className="text-[#2D5A27] font-semibold uppercase">Free of Charge</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-[#D1CEBF] pt-3 text-[#1A1A1A] font-bold">
                    <span>Estimated Total</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#D1CEBF] rounded-xl flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#A6A18F]" />
                  <span className="text-[10px] text-[#1A1A1A]/60 leading-normal font-medium">
                    Backed by 75 Years of ancestral astrology curation. All crystals authenticated.
                  </span>
                </div>

                <button
                  id="cart-checkout-trigger"
                  onClick={onCheckout}
                  className="cursor-pointer w-full bg-[#1A1A1A] hover:bg-[#322D2C] text-white py-4 rounded-xl text-xs tracking-widest font-mono font-medium uppercase transition-colors flex items-center justify-center gap-2 border border-[#D1CEBF]/20"
                >
                  Proceed to Secure Checkout <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
