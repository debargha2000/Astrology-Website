/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export interface HeroSlide {
  name: string;
  img: string;
  crystal: string;
  price: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { name: 'The Money Magnet Bracelet', img: '', crystal: 'Citrine & Pyrite', price: '₹1,199' },
  { name: 'Grounding Armor Nazar Shield', img: '', crystal: 'Black Tourmaline', price: '₹899' },
  { name: 'The Master Healer Pack', img: '', crystal: 'Faceted Clear Quartz', price: '₹1,899' },
  { name: 'The Stress Killer Remedy', img: '', crystal: 'Royal Amethyst', price: '₹999' },
  {
    name: 'Divine Harmony & Calm',
    img: '',
    crystal: 'Rose Quartz & Peach Sunstone',
    price: '₹949',
  },
];

export const SHOP_CATEGORIES = ['all', 'bracelet', 'ring', 'combo'] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const SHOP_SORTS = ['rating', 'price-low', 'price-high'] as const;
export type ShopSort = (typeof SHOP_SORTS)[number];

export const SLIDESHOW_INTERVAL_MS = 4500;
export const REVIEW_CAROUSEL_INTERVAL_MS = 8000;

export const STATISTICS = [
  { value: '15,000+', label: 'Aligned Bracelets Shipped' },
  { value: '99.7%', label: 'Manifestation Rating' },
  { value: '75+ Yrs', label: 'Astrological Heritage' },
  { value: 'Grade A+', label: 'Certified Pure Geodes' },
];

export const FAQ_ITEMS = [
  {
    question: 'Do I wear the bracelets on my left or right wrist?',
    answer:
      'For receiving prosperity and career growth, wear the Money Magnet on the left wrist (the intuitive receiving side of your nervous system). For repelling active envy, bad gaze (nazar), and workplace static, wear the Evil Eye on the right wrist (the defensive projecting pathway).',
  },
  {
    question: 'How long does the 3-Nights Consecration last?',
    answer:
      'The acoustic mantras and lunar energy cells program the stones to peak alignment for about 12 months. We highly recommend utilizing our interactive Vedic Charge Station on the portal to virtually "re-align" your crystals during peak cosmic alignments, like full-moon cycles, or shipping them back for manual planetary re-bathing.',
  },
  {
    question: 'How do I know the crystals are authentic and mineralogical?',
    answer:
      'We never use colored glass, lightweight plastic, synthetics, or acrylic beads. Every mineral geode is sourced directly from certified mines in Peru, Brazil, and Afghanistan, and physically tested for density, crystalline structure hardness (Mohs index), and origin integrity. We ship a signed Vedic Certificate verifying these coordinates in every box.',
  },
];

export const CONSECRATION_STEPS = [
  {
    number: '01',
    title: 'Liquid Hydration Cleanse',
    description:
      'Crystals are washed in Panchamrut—raw honey, cow milk, and ancient Ganges coordinates—to strip residual trade static and human friction energies.',
  },
  {
    number: '02',
    title: 'Lunar Vibrational Bathing',
    description:
      'Stones rest under moon bathing frequencies to align molecular lattices. In addition, 432Hz Sanskrit chants resonate corresponding planetary frequencies.',
  },
  {
    number: '03',
    title: 'Solar Rise Gilded Lock',
    description:
      'The final sealing and solar warming locks auspicious material frequencies. We certificate each stone securely before airtight velvet shielding.',
  },
];
