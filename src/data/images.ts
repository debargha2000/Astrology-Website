/**
 * Image URL constants
 */

// Determine base URL for assets - works with both ESM and CJS
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
  }
  // Fallback for SSR or non-browser environments
  return '/';
};

const BASE_URL = getBaseUrl();
const IMG = `${BASE_URL}src/assets/images`;

// Product images
export const HERO_IMAGE = `${IMG}/aura_stone_hero_banner_1779793774735.png`;
export const MONEY_MAGNET_IMAGE = `${IMG}/money_magnet_bracelet_1779793792641.png`;
export const EVIL_EYE_IMAGE = `${IMG}/evil_eye_bracelet_1779793810222.png`;
export const COMBO_IMAGE = `${IMG}/super_balanced_combo_1779793830531.png`;
export const RITUAL_IMAGE = `${IMG}/vedic_charging_1779793852967.png`;

export const LOVE_HARMONY_IMAGE = `${IMG}/love_harmony_rose_quartz_1779998954650.png`;
export const STRESS_KILLER_IMAGE = `${IMG}/stress_killer_amethyst_1779998973130.png`;
export const STUDENT_CRYSTAL_IMAGE = `${IMG}/student_crystal_lapis_1779998989153.png`;
export const SEVEN_CHAKRA_IMAGE = `${IMG}/seven_chakra_lava_1779999005612.png`;
export const PYRITE_RING_IMAGE = `${IMG}/pyrite_luxury_silver_1779999025465.png`;
export const CITRINE_RING_IMAGE = `${IMG}/citrine_luxury_gold_1779999055408.png`;
export const VEDIC_EXPERT_IMAGE = `${IMG}/vedic_expert_portrait_1779999076620.png`;
export const POLISHED_GEMSTONES_LOOM_IMAGE = `${IMG}/polished_gemstones_loom_1779999095722.png`;

// Zodiac images
export const ZODIAC_ARIES_IMAGE = `${IMG}/zodiac_aries_1779999813981.png`;
export const ZODIAC_TAURUS_IMAGE = `${IMG}/zodiac_taurus_1779999832338.png`;
export const ZODIAC_GEMINI_IMAGE = `${IMG}/zodiac_gemini_1779999846623.png`;
export const ZODIAC_CANCER_IMAGE = `${IMG}/zodiac_cancer_1779999861997.png`;
export const ZODIAC_LEO_IMAGE = `${IMG}/zodiac_leo_1779999878981.png`;
export const ZODIAC_VIRGO_IMAGE = `${IMG}/zodiac_virgo_1779999897818.png`;
export const ZODIAC_LIBRA_IMAGE = `${IMG}/zodiac_libra_1779999916880.png`;
export const ZODIAC_SCORPIO_IMAGE = `${IMG}/zodiac_scorpio_1779999934063.png`;
export const ZODIAC_SAGITTARIUS_IMAGE = `${IMG}/zodiac_sagittarius_1779999950620.png`;
export const ZODIAC_CAPRICORN_IMAGE = `${IMG}/zodiac_capricorn_1779999980872.png`;
export const ZODIAC_AQUARIUS_IMAGE = `${IMG}/zodiac_aquarius_1780000002499.png`;
export const ZODIAC_PISCES_IMAGE = `${IMG}/zodiac_pisces_1780000023031.png`;
