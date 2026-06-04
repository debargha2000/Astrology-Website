/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, Flame, Eye, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
  key?: string;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  isAdded,
}: ProductCardProps) {
  // Format currency in INR
  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#D1CEBF] bg-[#F8F6F1] p-4 transition-all duration-300 hover:shadow-[0_12px_24px_-10px_rgba(26,26,26,0.08)]"
    >
      {/* Absolute Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isBestSeller && (
          <div className="flex items-center gap-1 bg-[#1A1A1A] text-[#F8F6F1] text-[9px] font-mono font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border border-[#D1CEBF]/30 shadow-sm animate-pulse">
            <Flame className="h-3 w-3 fill-current text-[#A6A18F]" />
            <span>BEST SELLER</span>
          </div>
        )}
        {product.stockStatus === 'low-stock' && (
          <div className="bg-[#9E2A2B] text-white text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full">
            LOW ALIGNMENT
          </div>
        )}
      </div>

      {/* Interactive Image Container */}
      <div
        id={`product-img-click-${product.id}`}
        onClick={() => onViewDetails(product)}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#E8E6E1] cursor-pointer border border-[#D1CEBF]/20"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Hover view guide */}
        <div className="absolute inset-0 bg-[#1A1A1A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-[#F8F6F1] text-[#1A1A1A] px-4 py-2 rounded-full text-[10px] tracking-widest uppercase font-mono shadow-sm flex items-center gap-1 border border-[#D1CEBF]/40">
            <Eye className="h-3.5 w-3.5" /> Reveal Cosmic Specs
          </span>
        </div>
      </div>

      {/* Meta Information */}
      <div className="mt-4 flex flex-1 flex-col">
        {/* Crystal Chips badge-line */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.crystalsUsed.slice(0, 3).map((crystal, idx) => (
            <span
              key={idx}
              className="text-[9px] font-mono tracking-wider text-[#1A1A1A]/70 bg-[#E8E6E1]/50 px-2 py-0.5 rounded-md border border-[#D1CEBF]/20"
            >
              {crystal}
            </span>
          ))}
          {product.crystalsUsed.length > 3 && (
            <span className="text-[9px] font-mono text-[#A6A18F] px-1 py-0.5">
              +{product.crystalsUsed.length - 3} more
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="font-serif text-base font-normal tracking-wide text-[#1A1A1A] hover:text-[#A6A18F] transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Short description */}
        <p className="mt-1 text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed flex-1 font-light">
          {product.shortDescription}
        </p>

        {/* Star Rating & Value */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex text-[#A6A18F]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? 'fill-[#A6A18F]' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#1A1A1A]/60 mt-0.5">
              ({product.reviewsCount})
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-[#A6A18F] font-semibold uppercase">
            Vedic Sanctified
          </span>
        </div>

        {/* Price & Primary Call To Action */}
        <div className="mt-4 pt-3 border-t border-[#D1CEBF]/40 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#1A1A1A] font-mono">
              {formatINR(product.salePrice)}
            </span>
            <span className="text-[11px] text-[#1A1A1A]/50 line-through font-mono">
              {formatINR(product.originalPrice)}
            </span>
          </div>

          <button
            id={`quick-add-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] tracking-widest uppercase font-mono font-medium rounded-lg transition-all duration-300 ${
              isAdded
                ? 'bg-[#E3EFE0] text-[#2E5A27] border border-[#2D5A27]/20 hover:bg-[#D5EAD0]'
                : 'bg-[#1A1A1A] hover:bg-[#322D2C] text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" /> Quick Consecrate
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
