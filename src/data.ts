/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review, ZodiacInfo, CrystalDetails, WebsiteContent } from './types';

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

// Let's use the actual generated images with timestamps
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

export const ZODIAC_ARIES_IMAGE = `${IMG}/zodiac_aries_1779999813981.png`;
export const ZODIAC_TAURUS_IMAGE = `${IMG}/zodiac_taurus_1779999832338.png`;
export const ZODIAC_GEMINI_IMAGE = `${IMG}/zodiac_gemini_1779999846623.png`;
export const ZODIAC_CANCER_IMAGE = `${IMG}/zodiac_cancer_1779999861997.png`;
export const ZODIAC_LEO_IMAGE = `${IMG}/zodiac_leo_1779999878981.png`;
export const ZODIAC_VIRGO_IMAGE = `${IMG}/zodiac_virgo_1779999897818.png`;
export const ZODIAC_LIBRA_IMAGE = `${IMG}/zodiac_libra_1779999916880.png`;
export const ZODIAC_SCORPIO_IMAGE = `${IMG}/zodiac_scoprio_1779999934063.png`;
export const ZODIAC_SAGITTARIUS_IMAGE = `${IMG}/zodiac_sagittarius_1779999950620.png`;
export const ZODIAC_CAPRICORN_IMAGE = `${IMG}/zodiac_capricorn_1779999980872.png`;
export const ZODIAC_AQUARIUS_IMAGE = `${IMG}/zodiac_aquarius_1780000002499.png`;
export const ZODIAC_PISCES_IMAGE = `${IMG}/zodiac_pisces_1780000023031.png`;

export const PRODUCTS: Product[] = [
  {
    id: 'money-magnet',
    name: 'The Aura & Stone Money Magnet Bracelet',
    originalPrice: 1499,
    salePrice: 1199,
    rating: 4.9,
    reviewsCount: 1642,
    shortDescription: 'Attract immense wealth, new career breakthroughs, positive cash flows and acute financial focus.',
    description: 'Our signature jewelry masterwork, engineered from grade-A wealth crystals. This alignment formula targets the flow of material energy to attract massive opportunities, sound investment mindset, and unlock frozen finances. Specifically tuned to the wearer’s birth chart, each bead works in harmony to bring positive financial vibrations.',
    benefits: [
      'Attracts wealth, luxury, and professional recognition.',
      'Calibrates logical judgment to prevent unwise financial spending.',
      'Assists in establishing healthy habits for investing and saving.',
      'Clears mental blockages surrounding personal abundance and low self-worth.'
    ],
    crystalsUsed: ['Citrine', 'Pyrite', 'Green Aventurine', 'Tiger Eye', 'Clear Quartz'],
    imageUrl: MONEY_MAGNET_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    isBestSeller: true,
    zodiacConnection: ['Leo', 'Taurus', 'Gemini', 'Virgo', 'Sagittarius', 'Capricorn'],
    specifications: {
      beadSize: '8mm Grade A+ Spheres',
      beadCount: 24,
      threadMaterial: 'Vedic Double Elastic Chord',
      origin: 'Finely Sourced (Brazil, Madagascar)',
      chargeTime: '3 Nights / 48 Astrological Hours'
    }
  },
  {
    id: 'evil-eye',
    name: 'The No Nazar Grounding Armor - Black Tourmaline & Hematite Shield',
    originalPrice: 1199,
    salePrice: 899,
    rating: 4.8,
    reviewsCount: 948,
    shortDescription: 'Ward off negative energies, protect from the malicious look of envy (nazar), and anchor your inner zen.',
    description: 'Designed as a personal energy-deflecting sanctuary. This piece pairs premium Obsidian, matte Black Tourmaline, and magnetic silver Hematite. It serves as an invisible shield against negative gazes, workplace jealousy, and heavy-hearted environments, absorbing and neutralizing malicious intent.',
    benefits: [
      'Absorbs and neutralizes malicious intentions, envy, and the evil eye.',
      'Provides structural energetic grounding to calm hyperactive and anxious minds.',
      'Acts as a defensive aura barrier when walking into cluttered spaces.',
      'Facilitates high-speed energetic recovery from physical exhaustion.'
    ],
    crystalsUsed: ['Black Tourmaline', 'Obsidian', 'Magnetic Hematite'],
    imageUrl: EVIL_EYE_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Scorpio', 'Capricorn', 'Aries', 'Pisces', 'Cancer'],
    specifications: {
      beadSize: '8mm Matted & Polished Spheres',
      beadCount: 23,
      threadMaterial: 'Double-woven Resilient Core',
      origin: 'Himalayan Foothills & Peruvian Andes',
      chargeTime: '2 Nights Lunar Absorption'
    }
  },
  {
    id: 'super-combo',
    name: 'The Master Healer - Pure Clear Quartz Balance Bracelet',
    originalPrice: 2499,
    salePrice: 1899,
    rating: 4.97,
    reviewsCount: 3104,
    shortDescription: 'The ultimate cosmic balancing light: Amplify your direct manifest waves, block psychic drains, and align all chakra nodes.',
    description: 'Our premium crystal selection featuring raw, laser-aligned, diamond-cut Pure Clear Quartz. Known globally as the "Master Healer," it absorbs, stores, releases, and regulates energy. It double-focuses the power of any adjacent crystals you wear, bringing mental precision and neutralizing background electrical radiation.',
    benefits: [
      'The supreme crystalline amplifier for alignment, focus, and energy.',
      'Dismantles energy stagnation to open continuous positive motivation.',
      'Comes with a complimentary raw Selenite cleansing slab in the box.',
      'Charged during coinciding solar rise and full moon peak alignments.'
    ],
    crystalsUsed: ['Pure Faceted Clear Quartz', 'Laser-Aligned Crystal Spheres'],
    imageUrl: COMBO_IMAGE,
    category: 'combo',
    stockStatus: 'low-stock',
    isBestSeller: true,
    zodiacConnection: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    specifications: {
      beadSize: '8mm Faceted Brilliant Spheres',
      beadCount: 24,
      threadMaterial: 'Heavy-duty Elastic Suture',
      origin: 'Premium Sourced Brazilian Earth Crystals',
      chargeTime: '3 Nights Triple Energizing Sequence'
    }
  },
  {
    id: 'stress-killer',
    name: 'The Stress Killer - Royal Lavender Amethyst Bracelet',
    originalPrice: 1299,
    salePrice: 999,
    rating: 4.85,
    reviewsCount: 521,
    shortDescription: 'Soothe the nervous system, end bedtime overthinking, unlock profound deep sleep waves, and reset stress cycles.',
    description: 'A masterpiece of absolute serenity. Deep lavender spheres of high-grade Amethyst operate on the Crown and Third Eye chakras to dismantle modern cognitive anxiety. Perfect for engineers, designers, business owners, and students dealing with chronic mental fatigue and burnout.',
    benefits: [
      'Induces calming wave signatures in the brain to reduce overthinking.',
      'Stills internal chatter and speeds up transition to deep, restorative REM sleep.',
      'Soothes skin frequencies and cellular inflammation induced by continuous stress.',
      'Enhances spiritual intuition and meditative focus.'
    ],
    crystalsUsed: ['Royal Amethyst', 'Lavender Quartz', 'Pure Mountain Quartz'],
    imageUrl: STRESS_KILLER_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Pisces', 'Aquarius', 'Sagittarius', 'Virgo'],
    specifications: {
      beadSize: '10mm Organic High Polish Spheres',
      beadCount: 20,
      threadMaterial: 'Premium Silk Stretch Core',
      origin: 'Uruguayan Deep Crystals & Himalayan Quartz',
      chargeTime: '3 Nights Sacred Sound Bathing'
    }
  },
  {
    id: 'love-harmony',
    name: 'The Divine Harmony - Rose Quartz & Peach Sunstone Bracelet',
    originalPrice: 1299,
    salePrice: 949,
    rating: 4.92,
    reviewsCount: 264,
    shortDescription: 'Open your heart chakra to attract pure love, foster harmonious relationships, absolute empathy, and heal old emotional bruises.',
    description: 'This ultra-exclusive jewelry pairing combines the tender pink hues of first-grade Rose Quartz alongside energetic peach Sunstone beads. Designed to unlock boundaries, welcome new healthy friendships, and stabilize your cardiac meridian center with unmatched emotional warmth and safety.',
    benefits: [
      'Sparks mutual affection, trust, and deep, honest relationship connections.',
      'Melts old, cold emotional armor or trauma blocks around your core.',
      'Releases beautiful radiant aura markers that draw high-vibrational people near.',
      'Perfect for deep emotional healing and high self-esteem calibration.'
    ],
    crystalsUsed: ['Premium Rose Quartz', 'Natural Peach Sunstone', 'White Jade'],
    imageUrl: LOVE_HARMONY_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Taurus', 'Libra', 'Cancer', 'Pisces'],
    specifications: {
      beadSize: '8mm Fine Polished Spheres',
      beadCount: 22,
      threadMaterial: 'Soft Pink Silk Elastic core',
      origin: 'Premium Madagascan Rose Mines',
      chargeTime: '2 Nights Lunar Bath Singing Bowls'
    }
  },
  {
    id: 'student-crystal',
    name: 'The Students Crystal - Lapis Lazuli Concentration Bracelet',
    originalPrice: 1199,
    salePrice: 899,
    rating: 4.78,
    reviewsCount: 388,
    shortDescription: 'Deepen academic focus, enhance memory recall, open the throat chakra for vocal eloquence and exam confidence.',
    description: 'Dappled with golden specks of pyrite, our royal blue Lapis Lazuli bracelet is highly tuned for intellect, cognitive endurance, and communication channels. Designed specifically for academic scholars, creative writers, and public speakers seeking truth, wisdom, and pristine clarity.',
    benefits: [
      'Catalyzes logical analysis and rapid problem-solving execution.',
      'Bolsters long-term text retention and sharpens visual spatial intellect.',
      'Clears the throat chakra to eliminate stuttering blocks and nervous speaking draft.',
      'Instills a tranquil confidence during competitive tests and stressful evaluations.'
    ],
    crystalsUsed: ['Lapis Lazuli', 'Blue Sodalite', 'Hematite'],
    imageUrl: STUDENT_CRYSTAL_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Sagittarius', 'Libra', 'Aquarius', 'Taurus'],
    specifications: {
      beadSize: '8mm Laser-aligned Spheres',
      beadCount: 24,
      threadMaterial: 'Premium Blue Elastic Filament',
      origin: 'Badakhshan Royal Mines',
      chargeTime: '2 Nights Astro Alignment'
    }
  },
  {
    id: 'seven-chakra',
    name: 'The Real 7 Chakra Healing & Lava Stone Grounding',
    originalPrice: 1399,
    salePrice: 1099,
    rating: 4.88,
    reviewsCount: 712,
    shortDescription: 'Regulate your seven core chakra nodes simultaneously while serving as a natural organic essential oil diffuser.',
    description: 'A beautiful thermodynamic compass for your energy body. It features seven distinct premium crystals aligning precisely to your seven operational chakras, combined with porous basalt Lava Stones. You can place a single drop of continuous essential oil (like sandalwood or lavender) onto the lava stones to experience all-day therapeutic aromatherapy.',
    benefits: [
      'Secures spiritual and thermodynamic grounding against energy spikes.',
      'Resets and unblocks all seven key meridian centers along the spinal energy pillar.',
      'Diffuses favorite functional essential wellness oils passively across 24 hours.',
      'Restores raw vital energy to clear inexplicable fatigue.'
    ],
    crystalsUsed: ['Amethyst', 'Lapis Lazuli', 'Sodalite', 'Green Aventurine', 'Tiger Eye', 'Carnelian', 'Red Jasper', 'Porous Lava Basalt'],
    imageUrl: SEVEN_CHAKRA_IMAGE,
    category: 'bracelet',
    stockStatus: 'in-stock',
    zodiacConnection: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    specifications: {
      beadSize: '8mm Matched Gems + 10mm Lava',
      beadCount: 22,
      threadMaterial: 'Resilient Hypoallergenic Core',
      origin: 'Global Sourced Crystals & Icelandic Lava',
      chargeTime: '3 Nights Sacred Sound & Full Moon Charge'
    }
  },
  {
    id: 'pyrite-luxury-ring',
    name: 'Aura & Stone Luxury Pyrite Resin-Ring (Silver Band)',
    originalPrice: 1199,
    salePrice: 799,
    rating: 4.8,
    reviewsCount: 245,
    shortDescription: 'Attract gold, wealth, and solid focus in a modern polished sterling silver adjustable frame.',
    description: 'An elegant, luxury ring encasing real, raw crystalline Pyrite flakes in a high-clarity resin cabochon. Tailored specifically for modern minimalists who wish to keep their financial manifestation keys extremely close, serving as a silent luxury standard piece.',
    benefits: [
      'Continuous energetic link through principal hand tactile feedback.',
      'Sterling silver premium adjustable band fits all ring fingers perfectly.',
      'Encourages a continuous flow of creative entrepreneurial ideas.'
    ],
    crystalsUsed: ['Pyrite', 'Clear Resonance Resin'],
    imageUrl: PYRITE_RING_IMAGE,
    category: 'ring',
    stockStatus: 'in-stock',
    zodiacConnection: ['Leo', 'Taurus', 'Gemini', 'Capricorn'],
    specifications: {
      beadSize: '12mm Resin Cabochon',
      beadCount: 1,
      threadMaterial: 'Adjustable S925 Silver Band',
      origin: 'Peruvian Pyrite',
      chargeTime: '3 Nights Astral Gilded Charge'
    }
  },
  {
    id: 'citrine-luxury-ring',
    name: 'Aura & Stone Luxury Citrine Solar-Ring (Gold Band)',
    originalPrice: 1199,
    salePrice: 799,
    rating: 4.82,
    reviewsCount: 194,
    shortDescription: 'Channel the warmth and solar success magnet of pure Brazilian Citrine in a premium 18k gold-plated mount.',
    description: 'Imbued with the solar power of the ruling planet Jupiter. This beautiful gold-plated adjustable ring features a raw crystal of golden Citrine carefully encapsulated in glass-smooth protective matrixes. Bring light, joy, and positive customer conversions to your business.',
    benefits: [
      'Empowers Jupiter planetary rays inside your hand chart.',
      '18K gold-plated adjustable brass band for luxurious day-long wear.',
      'Disperses pessimistic energies, bad dreams, and workspace friction.'
    ],
    crystalsUsed: ['Citrine', '18K Gold Plated Brass Frame'],
    imageUrl: CITRINE_RING_IMAGE,
    category: 'ring',
    stockStatus: 'in-stock',
    zodiacConnection: ['Leo', 'Sagittarius', 'Aries', 'Virgo'],
    specifications: {
      beadSize: '14mm Solar matrix Cabochon',
      beadCount: 1,
      threadMaterial: '18K Gold-Plated Adjustable Band',
      origin: 'Brazilian Citrine Mines',
      chargeTime: '3 Nights solar rise & Mantra Charge'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Aarav Mehta',
    rating: 5,
    text: 'I was honestly super skeptical at first. But after wearing the Money Magnet bracelet for just 2 weeks, my long-stuck payments of 3.4 Lakhs from a client were cleared out of nowhere! The quality of the stones is superb—very heavy and premium, far better than cheap plastic beads online.',
    date: 'May 14, 2026',
    verifiedPurchase: true,
    productTitle: 'The Aura & Stone Money Magnet Bracelet',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=d4af37&fontFamily=Inter'
  },
  {
    id: 'rev-2',
    author: 'Priyanka Sharma',
    rating: 5,
    text: 'The No Nazar Evil Eye bracelet is stunning! I wear it on my right wrist constantly. The Black Tourmaline has a beautiful matte look, and the evil eye bead is handmade and glassy, not cheap. I feel so much more grounded during heavy meetings. Highly recommend this brand!',
    date: 'May 10, 2026',
    verifiedPurchase: true,
    productTitle: 'The No Nazar Evil Eye Protection Bracelet',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=PS&backgroundColor=1a365d&fontFamily=Inter'
  },
  {
    id: 'rev-3',
    author: 'Vikram Aditya',
    rating: 5,
    text: 'Got the Super Balanced Combo pack. Unboxing is a sheer 10/10 luxury experience. The wooden box, the sacred red thread, and the aroma of sandalwood oil make you realize this is charged with real effort. My trading sessions have been remarkably calm and profitable since.',
    date: 'April 28, 2026',
    verifiedPurchase: true,
    productTitle: 'The Super Balanced Combo (Money Magnet + Evil Eye)',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=VA&backgroundColor=2d3748&fontFamily=Inter'
  },
  {
    id: 'rev-4',
    author: 'Riya Deshmukh',
    rating: 5,
    text: 'I struggle with extreme sleep-onset overthinking due to my master’s thesis. The Stress Killer Amethyst bracelet has been a lifesaver. I place it under my pillow or write with it on. There is a deep, soothing cooling effect you feel after wearing it. Real Crystals indeed!',
    date: 'May 02, 2026',
    verifiedPurchase: true,
    productTitle: 'The Stress Killer - Lavender Amethyst Bracelet',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RD&backgroundColor=702963&fontFamily=Inter'
  },
  {
    id: 'rev-5',
    author: 'Nikhil Kapoor',
    rating: 5,
    text: 'Fantastic customer service. They took my birth chart details during checkout, and the actual Vedic energizing certificate was signed by their resident astrologer indicating the exact hora (hour) it was charged. This level of authentic Indian astrology science is phenomenal. Buying 2 more for my parents!',
    date: 'April 19, 2026',
    verifiedPurchase: true,
    productTitle: 'The Aura & Stone Money Magnet Bracelet',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=NK&backgroundColor=2c5282&fontFamily=Inter'
  }
];

export const ZODIAC_DATA: Record<string, ZodiacInfo> = {
  Aries: {
    sign: 'Aries',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Fire',
    recommendedProductIds: ['evil-eye', 'seven-chakra', 'citrine-luxury-ring'],
    luckyNumbers: [9, 18, 27],
    luckyColors: ['Scarlet Red', 'Golden Honey', 'Copper'],
    strengths: ['Unshakeable Courage', 'Natural Leadership', 'Passionate Drive', 'Dynamic Vision'],
    challenges: ['Impulsiveness', 'Rapid Burnout', 'Short Temper', 'Restlessness'],
    stoneBenefits: 'Red Jasper and volcanic Lava Stones anchor the volatile fiery energy of Aries, keeping them safe from impulsive investment decisions while maintaining high pioneering motivation.',
    energyScore: { wealth: 85, protection: 90, career: 95, clarity: 80 }
  },
  Taurus: {
    sign: 'Taurus',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Earth',
    recommendedProductIds: ['money-magnet', 'pyrite-luxury-ring', 'seven-chakra'],
    luckyNumbers: [5, 6, 15],
    luckyColors: ['Royal Emerald', 'Champagne Ivory', 'Rose Gold'],
    strengths: ['Absolute Reliability', 'Aesthetic Appreciation', 'Unswerving Determination', 'Financial Wisdom'],
    challenges: ['Resistance to Change', 'Possessiveness', 'Heavy Procrastination', 'Over-indulgence'],
    stoneBenefits: 'Green Aventurine and Pyrite perfectly sync with Taurus’s Venusian craving for earthly luxury and steady wealth accumulation, manifesting continuous career growth.',
    energyScore: { wealth: 98, protection: 85, career: 90, clarity: 88 }
  },
  Gemini: {
    sign: 'Gemini',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Air',
    recommendedProductIds: ['money-magnet', 'pyrite-luxury-ring', 'super-combo'],
    luckyNumbers: [3, 5, 14],
    luckyColors: ['Bright Citron', 'Mint Green', 'Smoky Platinum'],
    strengths: ['Intelligent Adaptability', 'Stellar Communication', 'Curious Intellect', 'Witty Logic'],
    challenges: ['Scattered Energies', 'Chronic Indecision', 'Superficial Focus', 'Anxious Chatting'],
    stoneBenefits: 'Tiger Eye helps focus Gemini’s dualistic, wandering attention onto concrete executive achievements, while Citrine sparks rich merchant-like communication and rapid negotiation.',
    energyScore: { wealth: 92, protection: 80, career: 88, clarity: 95 }
  },
  Cancer: {
    sign: 'Cancer',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Water',
    recommendedProductIds: ['evil-eye', 'stress-killer', 'seven-chakra'],
    luckyNumbers: [2, 7, 11],
    luckyColors: ['Pearl White', 'Moonlight Silver', 'Seafoam Blue'],
    strengths: ['Deep Empathy', 'Protective Loyalty', 'Vivid Imagination', 'Nurturing Intuition'],
    challenges: ['Extreme Mood Swings', 'Clinging to the Past', 'Emotional Exhaustion', 'Defensive Retreat'],
    stoneBenefits: 'Matted Black Tourmaline acts as an essential sponge to absorb toxic environmental stress, while high-clarity Amethyst calms the Cancerian tide of intense night thoughts.',
    energyScore: { wealth: 80, protection: 98, career: 82, clarity: 92 }
  },
  Leo: {
    sign: 'Leo',
    rulingPlanet: 'Sun (Surya)',
    element: 'Fire',
    recommendedProductIds: ['money-magnet', 'citrine-luxury-ring', 'pyrite-luxury-ring'],
    luckyNumbers: [1, 5, 9],
    luckyColors: ['Pure Gold', 'Amber Orange', 'Rich Bronze'],
    strengths: ['Magnanimous Generosity', 'Radiant Self-Confidence', 'Royal Charisma', 'Fierce Loyalty'],
    challenges: ['Pride and Ego Blocks', 'Need for Constant Attention', 'Stubborn Pride', 'Impatience with details'],
    stoneBenefits: 'As children of the Sun, Pyrite and Citrine act as solar super-chargers, magnifying the natural charisma of Leos into high career authority, recognition, and golden abundance.',
    energyScore: { wealth: 99, protection: 82, career: 97, clarity: 85 }
  },
  Virgo: {
    sign: 'Virgo',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Earth',
    recommendedProductIds: ['money-magnet', 'stress-killer', 'super-combo'],
    luckyNumbers: [3, 6, 21],
    luckyColors: ['Olive Green', 'Classic Slate', 'Champagne Pearl'],
    strengths: ['Meticulous Precision', 'Analytical Ingenuity', 'Practical Helpfulness', 'High Discrimination'],
    challenges: ['Crippling Perfectionism', 'Overthinking Every Micro-detail', 'Inner Critic Exhaustion', 'Worrying'],
    stoneBenefits: 'Amethyst acts to soothe the highly active neural pathways of Virgos, while Green Aventurine acts as a practical earth talisman to manifest stable material gains.',
    energyScore: { wealth: 94, protection: 88, career: 92, clarity: 98 }
  },
  Libra: {
    sign: 'Libra',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Air',
    recommendedProductIds: ['student-crystal', 'super-combo', 'seven-chakra'],
    luckyNumbers: [5, 6, 24],
    luckyColors: ['Powder Blue', 'Pastel Pink', 'Champagne Gold'],
    strengths: ['Masterful Diplomacy', 'Refined Artistic Taste', 'Fair-Minded Justice', 'Pleasant Charisma'],
    challenges: ['Paralyzing Indecisiveness', 'Procrastination', 'Extravagant Spending', 'Avoiding Confrontation'],
    stoneBenefits: 'Lapis Lazuli stimulates profound self-honesty, aligning Libra’s internal scales. Combining with Tiger Eye grants Libra the executive courage to make definitive choices in business.',
    energyScore: { wealth: 88, protection: 90, career: 90, clarity: 92 }
  },
  Scorpio: {
    sign: 'Scorpio',
    rulingPlanet: 'Mars & Pluto',
    element: 'Water',
    recommendedProductIds: ['evil-eye', 'super-combo', 'seven-chakra'],
    luckyNumbers: [4, 9, 13],
    luckyColors: ['Deep Crimson', 'Obsidian Black', 'Midnight Plum'],
    strengths: ['Intense Focus', 'Unmatched Willpower', 'Magnetic Aura', 'Phoenix-like Recovery'],
    challenges: ['Jealousy and Secrecy', 'Holding Grudges', 'Self-Sabotage', 'Extreme Suspiciousness'],
    stoneBenefits: 'Black Tourmaline provides a safe channel for Scorpio’s intense magnetic fields, deflecting any external jealousy while ensuring their deep meditative focus remains unpolluted.',
    energyScore: { wealth: 90, protection: 99, career: 92, clarity: 85 }
  },
  Sagittarius: {
    sign: 'Sagittarius',
    rulingPlanet: 'Jupiter (Guru)',
    element: 'Fire',
    recommendedProductIds: ['money-magnet', 'student-crystal', 'citrine-luxury-ring'],
    luckyNumbers: [3, 7, 12],
    luckyColors: ['Imperial Yellow', 'Indigo Indigo', 'Saffron'],
    strengths: ['Boundless Optimism', 'Philosophical Wisdom', 'Love for Adventure', 'Absolute Honesty'],
    challenges: ['Tactless Outspokenness', 'Blind Optimistic Risk-Taking', 'Impatience', 'Scattered Talents'],
    stoneBenefits: 'Sourced Lapis Lazuli aligns beautifully with Jupiterian higher learning and philosophical truth, helping Sagittarius channel their lucky vibrations into actual academic/professional excellence.',
    energyScore: { wealth: 95, protection: 85, career: 94, clarity: 90 }
  },
  Capricorn: {
    sign: 'Capricorn',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Earth',
    recommendedProductIds: ['money-magnet', 'pyrite-luxury-ring', 'super-combo'],
    luckyNumbers: [4, 8, 17],
    luckyColors: ['Charcoal Black', 'Midnight Blue', 'Warm Bronze'],
    strengths: ['Unyielding Discipline', 'Strategic Ambition', 'Absolute Patience', 'High-end Authority'],
    challenges: ['Severe Pessimism', 'Workaholic Burnout', 'Cold Detachment', 'Resistance to Vulnerability'],
    stoneBenefits: 'Saturnine energy demands patience, hard work, and structure. Beautiful Pyrite honors this ethic by materializing structural wealth, while Black Tourmaline acts to protect the stoic Capricorn from heavy fatigue.',
    energyScore: { wealth: 96, protection: 95, career: 98, clarity: 87 }
  },
  Aquarius: {
    sign: 'Aquarius',
    rulingPlanet: 'Saturn & Uranus',
    element: 'Air',
    recommendedProductIds: ['student-crystal', 'stress-killer', 'seven-chakra'],
    luckyNumbers: [2, 11, 22],
    luckyColors: ['Electric Cerulean', 'Slate Silver', 'Smoky Quartz Color'],
    strengths: ['Visionary Originality', 'Humanitarian Heart', 'Brilliant Intellect', 'Independent Spirit'],
    challenges: ['Emotional Aloofness', 'Stubborn Rebellion', 'Extreme Overthinking', 'Feeling Misunderstood'],
    stoneBenefits: 'Amethyst relaxes the revolutionary Aquarius brain, while Lapis Lazuli opens paths for universal wisdom and eloquent speech to pitch their futuristic ideas successfully.',
    energyScore: { wealth: 88, protection: 92, career: 91, clarity: 96 }
  },
  Pisces: {
    sign: 'Pisces',
    rulingPlanet: 'Jupiter & Neptune',
    element: 'Water',
    recommendedProductIds: ['stress-killer', 'evil-eye', 'super-combo'],
    luckyNumbers: [3, 7, 16],
    luckyColors: ['Aquamarine', 'Soft Lavender', 'Seafoam Jade'],
    strengths: ['Unbounded Compassion', 'Pure Astral Intuition', 'Artistic Mastery', 'Ethereal Soul'],
    challenges: ['Escapist Tendencies', 'Absorbing Others Negative Energies like a sponge', 'Lack of Boundaries', 'Self-Doubt'],
    stoneBenefits: 'As highly sensitive emotional sponges, Pisceans urgently require Obsidian/Black Tourmaline to sever toxic cords, combined with Amethyst to bridge their vivid dream worlds with physical grounded success.',
    energyScore: { wealth: 85, protection: 97, career: 84, clarity: 94 }
  }
};

export const CRYSTAL_ENCYCLOPEDIA: Record<string, CrystalDetails> = {
  Citrine: {
    name: 'Citrine',
    formula: 'SiO₂ (Silicon Dioxide with Iron trace impurities)',
    hardness: '7.0 Mohs (Highly scratch-resistant)',
    chakra: 'Solar Plexus Chakra (Manipura) - Center of personal authority, power, and wealth creation',
    origin: 'Hand-selected from elite geode deposits in Rio Grande do Sul, Brazil',
    astrologicalSign: 'Leo, Gemini, Sagittarius, Taurus',
    metaphysicalProperties: [
      'Often called the "Merchant Stone" because of its historical use in shop registries and cash tills to attract wealth.',
      'One of only two crystals on Earth that NEVER holds or accumulates negative energy, meaning it never requires clearing.',
      'Acts like solar energy locked in crystal lattices, replacing sluggish moods with radiant warm confidence.'
    ],
    scientificFacts: 'Natural Citrine is incredibly rare. The beautiful golden hue is caused by sub-microscopic iron colloid distribution inside the clear quartz lattice during volcanic shifts millions of years ago.',
    hexColor: '#EAA835'
  },
  Pyrite: {
    name: 'Pyrite',
    formula: 'FeS₂ (Iron Disulfide - "Fool’s Gold")',
    hardness: '6.0 - 6.5 Mohs (Dense and metallic)',
    chakra: 'Solar Plexus and Third Eye Chakras - Focus, willpower, and logical shields',
    origin: 'Exquisite heavy cubes sourced from Huanzala, Peru',
    astrologicalSign: 'Leo, Capricorn, Aries, Gemini',
    metaphysicalProperties: [
      'Forms a powerful defensive energy shield against environmental digital EMF waves and office politics.',
      'Channels Earth energies to provide massive stamina, structural motivation, and decisive entrepreneurial courage.',
      'Attracts raw opportunities by realigning the wearer to "Gold Standard" thoughts of self-belief and continuous income.'
    ],
    scientificFacts: 'Pyrite grows naturally in perfect cube and pyritohedron formations. Its brassy metallic luster reflects light beautifully, which ancient shamans used as sacred diagnostic mirrors.',
    hexColor: '#D4AF37'
  },
  'Green Aventurine': {
    name: 'Green Aventurine',
    formula: 'SiO₂ with Fuchsite Mica inclusions giving a shiny metallic sheen',
    hardness: '7.0 Mohs (Excellent durability)',
    chakra: 'Heart Chakra (Anahata) - Center of emotional healing, luck, and alignment to lucky paths',
    origin: 'Sourced from organic mines of Karnataka, Southern India',
    astrologicalSign: 'Taurus, Libra, Virgo, Cancer',
    metaphysicalProperties: [
      'Famously treated as the "Stone of Opportunity", widely believed to be the luckiest of all gems for financial luck and casino rolls.',
      'Cleanses ancient systemic blockages of grief and loss, making one receptive to receiving gifts and career windfalls.',
      'Aids in balancing blood pressure levels and calms competitive stress in rapid business environments.'
    ],
    scientificFacts: 'The glistening emerald sparkle of Indian Aventurine is caused by tiny scattered platelets of green chromium-rich Fuchsite mica that align horizontally within the quartz.',
    hexColor: '#2D7F5E'
  },
  'Black Tourmaline': {
    name: 'Black Tourmaline (Schorl)',
    formula: 'NaFe₃Al₆Si₆O₁₈(BO₃)₃(OH)₄',
    hardness: '7.0 - 7.5 Mohs (Extremely robust)',
    chakra: 'Root Chakra (Muladhara) - Shielding, absolute safety, and heavy grounding',
    origin: 'Raw mineral columns sourced from Minas Gerais, Brazil',
    astrologicalSign: 'Scorpio, Capricorn, Libra',
    metaphysicalProperties: [
      'The premier protective crystal on Earth. Absorbs negative intentions, curses, workspace gossip and neutralizing them.',
      'Repels psychological toxicity and stops empathetic people from carrying the exhaustion of others.',
      'Provides a safe, heavy anchor during meditation, instantly centering chaotic circular thoughts.'
    ],
    scientificFacts: 'Black Tourmaline is highly pyroelectric and piezoelectric. Heating or rubbing the crystal causes it to accumulate an electrical charge, physically attracting lightweight dust or ash.',
    hexColor: '#1A1A1A'
  },
  Amethyst: {
    name: 'Lavender Amethyst',
    formula: 'SiO₂ (Quartz doped with iron and natural gamma irradiation)',
    hardness: '7.0 Mohs (Durable daily crystal)',
    chakra: 'Crown Chakra (Sahasrara) & Third Eye (Ajna) - Calm sleep, intuition, mental reset',
    origin: 'Selected from premium deep-purple cluster mines in Artigas, Uruguay',
    astrologicalSign: 'Pisces, Aquarius, Virgo, Scorpio',
    metaphysicalProperties: [
      'Historically used as a natural antidote against intoxication and heavy physical indulgence.',
      'Shifts rapid brainwaves (Beta) down to deeply serene Alpha and Theta rhythms, easing chronic insomnia and midnight tension.',
      'Encourages logical self-mastery, easing addictions, stress cycles, and compulsive phone scrolling.'
    ],
    scientificFacts: 'Amethyst owes its royal violet color to natural irradiation replacing silicon atoms with iron ions inside the quartz. If left under strong, continuous solar rays, the color can fade beautifully.',
    hexColor: '#702963'
  },
  'Lapis Lazuli': {
    name: 'Lapis Lazuli (The Stone of Royalty)',
    formula: 'Alosilicate mineral complex rich in Lazurite, Calcite, and bright speckles of gold Pyrite',
    hardness: '5.5 Mohs (Requires mindful handling)',
    chakra: 'Throat Chakra (Vishuddha) & Third Eye - Vocal expression, memory recall, logic',
    origin: 'Sourced from the legendary 6,000-year-old Sar-e-Sang mines in Badakhshan, Afghanistan',
    astrologicalSign: 'Sagittarius, Libra, Aquarius, Taurus',
    metaphysicalProperties: [
      'The sacred stone of Ancient Egyptian Pharaohs, highly ground for Cleopatra’s blue eyeshadow and Tutankhamun’s sarcophagus.',
      'Inspires strict intellectual honesty, critical thinking, and rapid truth-seeking analysis.',
      'Strengthens throat chakra, easing stuttering, public speaking stage fright, and clarifying vocal tone.'
    ],
    scientificFacts: 'Lapis Lazuli is not a single mineral; it is a metamorphic rock. Its deep blue color derives from sulfur radical ions in the Lazurite complex, sparkling with real gold inclusions of Iron Pyrite.',
    hexColor: '#112255'
  }
};

/**
 * Default website content used as the initial state for the store and
 * as the safe fallback when the CMS content fetch fails. Mirrors the
 * `INITIAL_WEBSITE_CONTENT` in `server/db.ts` so the site renders
 * coherently on first paint even without network connectivity.
 */
export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  brandName: 'Aura & Stone',
  brandSubtitle: 'Crystalline Astrology',
  heroHeadline: 'The Indian',
  heroHighlight: 'Science of Signs',
  heroParagraph:
    'Fine crystal jewelry engineered from verified planetary minerals. Cleansed, moon bathed, and programmed to your birth chart parameters to create an unshakeable energetic shield.',
  founderQuote:
    'In today\u2019s fast-paced corporate and creative grids, we are continuously bombarded by negative gazes, digital noise, and heavy financial doubt. Aura & Stone was co-conceived because I wanted authentic, laboratory-tested crystal jewelry that looks incredibly sharp and high-fashion while offering robust spiritual protection. We took 75 years of my family\u2019s ancestral alignment wisdom and made it sleek, minimalistic, and absolute.',
  founderQuoteSubtitle: 'Co-Founder & Chief Vedic Architect, Aura & Stone',
  historyHeadline: 'Ancient Sceptred Science Met Minimalist Form',
  historyParagraph1:
    'Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.',
  historyParagraph2:
    'By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.',
  bannerImage: `${IMG}/aura_stone_hero_banner_1779793774735.png`,
};
