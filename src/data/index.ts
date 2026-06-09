/**
 * Data exports - split from monolithic data.ts into separate modules
 */

// Product data
export { PRODUCTS } from './products';
export type { Product } from '../types';

// Review data
export { REVIEWS } from './reviews';
export type { Review } from '../types';

// Zodiac data
export { ZODIAC_DATA } from './zodiac';
export type { ZodiacInfo } from '../types';

// Crystal encyclopedia data
export { CRYSTAL_ENCYCLOPEDIA } from './crystals';
export type { CrystalDetails } from '../types';

// Website content
export { DEFAULT_WEBSITE_CONTENT } from './websiteContent';
export type { WebsiteContent } from '../types';

// Image URLs
export {
  HERO_IMAGE,
  MONEY_MAGNET_IMAGE,
  EVIL_EYE_IMAGE,
  COMBO_IMAGE,
  RITUAL_IMAGE,
  LOVE_HARMONY_IMAGE,
  STRESS_KILLER_IMAGE,
  STUDENT_CRYSTAL_IMAGE,
  SEVEN_CHAKRA_IMAGE,
  PYRITE_RING_IMAGE,
  CITRINE_RING_IMAGE,
  VEDIC_EXPERT_IMAGE,
  POLISHED_GEMSTONES_LOOM_IMAGE,
  ZODIAC_ARIES_IMAGE,
  ZODIAC_TAURUS_IMAGE,
  ZODIAC_GEMINI_IMAGE,
  ZODIAC_CANCER_IMAGE,
  ZODIAC_LEO_IMAGE,
  ZODIAC_VIRGO_IMAGE,
  ZODIAC_LIBRA_IMAGE,
  ZODIAC_SCORPIO_IMAGE,
  ZODIAC_SAGITTARIUS_IMAGE,
  ZODIAC_CAPRICORN_IMAGE,
  ZODIAC_AQUARIUS_IMAGE,
  ZODIAC_PISCES_IMAGE,
} from './images';
