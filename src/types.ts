/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'shop' | 'products' | 'zodiac-calculator' | 'charging-station' | 'encyclopedia' | 'about' | 'checkout' | 'cms';

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  shortDescription: string;
  benefits: string[];
  crystalsUsed: string[];
  imageUrl: string;
  videoUrl?: string; // Optional embedded video link
  category: 'bracelet' | 'ring' | 'combo' | 'zodiac';
  stockStatus: 'in-stock' | 'low-stock' | 'pre-order';
  zodiacConnection?: string[];
  isBestSeller?: boolean;
  specifications: {
    beadSize?: string;
    beadCount?: number;
    threadMaterial?: string;
    origin?: string;
    chargeTime?: string;
  };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verifiedPurchase: boolean;
  productTitle: string;
  avatarUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: 'standard-unisex' | 'petite' | 'xl-mens';
  personalizedCertification: boolean;
  birthDetails?: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  };
}

export interface ZodiacInfo {
  sign: string;
  rulingPlanet: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  recommendedProductIds: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  strengths: string[];
  challenges: string[];
  stoneBenefits: string;
  energyScore: {
    wealth: number;
    protection: number;
    career: number;
    clarity: number;
  };
}

export interface CrystalDetails {
  name: string;
  formula: string;
  hardness: string;
  chakra: string;
  origin: string;
  astrologicalSign: string;
  metaphysicalProperties: string[];
  scientificFacts: string;
  hexColor: string;
}

export interface WebsiteContent {
  brandName: string;
  brandSubtitle: string;
  heroHeadline: string;
  heroHighlight: string;
  heroParagraph: string;
  founderQuote: string;
  founderQuoteSubtitle: string;
  historyHeadline: string;
  historyParagraph1: string;
  historyParagraph2: string;
  bannerImage: string;
}

export interface Checkpoint {
  id: string;
  timestamp: string;
  title: string;
  user: string;
  websiteContent: WebsiteContent;
  products: Product[];
}

