/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { ShopCategory, ShopSort } from '../constants/content';

export function useShopFilter(allProducts: Product[]) {
  const [shopCategory, setShopCategory] = useState<ShopCategory>('all');
  const [shopSort, setShopSort] = useState<ShopSort>('rating');

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((p) => {
      if (shopCategory === 'all') return true;
      return p.category === shopCategory;
    });
    return [...filtered].sort((a, b) => {
      if (shopSort === 'rating') return b.rating - a.rating;
      if (shopSort === 'price-low') return a.salePrice - b.salePrice;
      return b.salePrice - a.salePrice;
    });
  }, [allProducts, shopCategory, shopSort]);

  return {
    shopCategory,
    shopSort,
    setShopCategory,
    setShopSort,
    filteredProducts,
  };
}

export function useHeroSlideshow(length: number, intervalMs: number) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % length);
  }, [length]);

  const goTo = useCallback((idx: number) => setCurrentSlide(idx), []);

  // auto-advance handled at call site via useInterval hook
  return { currentSlide, next, goTo, advanceIntervalMs: intervalMs };
}
