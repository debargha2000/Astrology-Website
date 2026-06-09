// server/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

// server/db.ts
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// src/data/images.ts
var getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/");
  }
  return "/";
};
var BASE_URL = getBaseUrl();
var IMG = `${BASE_URL}src/assets/images`;
var HERO_IMAGE = `${IMG}/aura_stone_hero_banner_1779793774735.png`;
var MONEY_MAGNET_IMAGE = `${IMG}/money_magnet_bracelet_1779793792641.png`;
var EVIL_EYE_IMAGE = `${IMG}/evil_eye_bracelet_1779793810222.png`;
var COMBO_IMAGE = `${IMG}/super_balanced_combo_1779793830531.png`;
var RITUAL_IMAGE = `${IMG}/vedic_charging_1779793852967.png`;
var LOVE_HARMONY_IMAGE = `${IMG}/love_harmony_rose_quartz_1779998954650.png`;
var STRESS_KILLER_IMAGE = `${IMG}/stress_killer_amethyst_1779998973130.png`;
var STUDENT_CRYSTAL_IMAGE = `${IMG}/student_crystal_lapis_1779998989153.png`;
var SEVEN_CHAKRA_IMAGE = `${IMG}/seven_chakra_lava_1779999005612.png`;
var PYRITE_RING_IMAGE = `${IMG}/pyrite_luxury_silver_1779999025465.png`;
var CITRINE_RING_IMAGE = `${IMG}/citrine_luxury_gold_1779999055408.png`;
var VEDIC_EXPERT_IMAGE = `${IMG}/vedic_expert_portrait_1779999076620.png`;
var POLISHED_GEMSTONES_LOOM_IMAGE = `${IMG}/polished_gemstones_loom_1779999095722.png`;
var ZODIAC_ARIES_IMAGE = `${IMG}/zodiac_aries_1779999813981.png`;
var ZODIAC_TAURUS_IMAGE = `${IMG}/zodiac_taurus_1779999832338.png`;
var ZODIAC_GEMINI_IMAGE = `${IMG}/zodiac_gemini_1779999846623.png`;
var ZODIAC_CANCER_IMAGE = `${IMG}/zodiac_cancer_1779999861997.png`;
var ZODIAC_LEO_IMAGE = `${IMG}/zodiac_leo_1779999878981.png`;
var ZODIAC_VIRGO_IMAGE = `${IMG}/zodiac_virgo_1779999897818.png`;
var ZODIAC_LIBRA_IMAGE = `${IMG}/zodiac_libra_1779999916880.png`;
var ZODIAC_SCORPIO_IMAGE = `${IMG}/zodiac_scorpio_1779999934063.png`;
var ZODIAC_SAGITTARIUS_IMAGE = `${IMG}/zodiac_sagittarius_1779999950620.png`;
var ZODIAC_CAPRICORN_IMAGE = `${IMG}/zodiac_capricorn_1779999980872.png`;
var ZODIAC_AQUARIUS_IMAGE = `${IMG}/zodiac_aquarius_1780000002499.png`;
var ZODIAC_PISCES_IMAGE = `${IMG}/zodiac_pisces_1780000023031.png`;

// src/data/products.ts
var PRODUCTS = [
  {
    id: "money-magnet",
    name: "The Aura & Stone Money Magnet Bracelet",
    originalPrice: 1499,
    salePrice: 1199,
    rating: 4.9,
    reviewsCount: 1642,
    shortDescription: "Attract immense wealth, new career breakthroughs, positive cash flows and acute financial focus.",
    description: "Our signature jewelry masterwork, engineered from grade-A wealth crystals. This alignment formula targets the flow of material energy to attract massive opportunities, sound investment mindset, and unlock frozen finances. Specifically tuned to the wearer\u2019s birth chart, each bead works in harmony to bring positive financial vibrations.",
    benefits: [
      "Attracts wealth, luxury, and professional recognition.",
      "Calibrates logical judgment to prevent unwise financial spending.",
      "Assists in establishing healthy habits for investing and saving.",
      "Clears mental blockages surrounding personal abundance and low self-worth."
    ],
    crystalsUsed: ["Citrine", "Pyrite", "Green Aventurine", "Tiger Eye", "Clear Quartz"],
    imageUrl: MONEY_MAGNET_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    isBestSeller: true,
    zodiacConnection: ["Leo", "Taurus", "Gemini", "Virgo", "Sagittarius", "Capricorn"],
    specifications: {
      beadSize: "8mm Grade A+ Spheres",
      beadCount: 24,
      threadMaterial: "Vedic Double Elastic Chord",
      origin: "Finely Sourced (Brazil, Madagascar)",
      chargeTime: "3 Nights / 48 Astrological Hours"
    }
  },
  {
    id: "evil-eye",
    name: "The No Nazar Grounding Armor - Black Tourmaline & Hematite Shield",
    originalPrice: 1199,
    salePrice: 899,
    rating: 4.8,
    reviewsCount: 948,
    shortDescription: "Ward off negative energies, protect from the malicious look of envy (nazar), and anchor your inner zen.",
    description: "Designed as a personal energy-deflecting sanctuary. This piece pairs premium Obsidian, matte Black Tourmaline, and magnetic silver Hematite. It serves as an invisible shield against negative gazes, workplace jealousy, and heavy-hearted environments, absorbing and neutralizing malicious intent.",
    benefits: [
      "Absorbs and neutralizes malicious intentions, envy, and the evil eye.",
      "Provides structural energetic grounding to calm hyperactive and anxious minds.",
      "Acts as a defensive aura barrier when walking into cluttered spaces.",
      "Facilitates high-speed energetic recovery from physical exhaustion."
    ],
    crystalsUsed: ["Black Tourmaline", "Obsidian", "Magnetic Hematite"],
    imageUrl: EVIL_EYE_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: ["Scorpio", "Capricorn", "Aries", "Pisces", "Cancer"],
    specifications: {
      beadSize: "8mm Matted & Polished Spheres",
      beadCount: 23,
      threadMaterial: "Double-woven Resilient Core",
      origin: "Himalayan Foothills & Peruvian Andes",
      chargeTime: "2 Nights Lunar Absorption"
    }
  },
  {
    id: "super-combo",
    name: "The Master Healer - Pure Clear Quartz Balance Bracelet",
    originalPrice: 2499,
    salePrice: 1899,
    rating: 4.97,
    reviewsCount: 3104,
    shortDescription: "The ultimate cosmic balancing light: Amplify your direct manifest waves, block psychic drains, and align all chakra nodes.",
    description: 'Our premium crystal selection featuring raw, laser-aligned, diamond-cut Pure Clear Quartz. Known globally as the "Master Healer," it absorbs, stores, releases, and regulates energy. It double-focuses the power of any adjacent crystals you wear, bringing mental precision and neutralizing background electrical radiation.',
    benefits: [
      "The supreme crystalline amplifier for alignment, focus, and energy.",
      "Dismantles energy stagnation to open continuous positive motivation.",
      "Comes with a complimentary raw Selenite cleansing slab in the box.",
      "Charged during coinciding solar rise and full moon peak alignments."
    ],
    crystalsUsed: ["Pure Faceted Clear Quartz", "Laser-Aligned Crystal Spheres"],
    imageUrl: COMBO_IMAGE,
    category: "combo",
    stockStatus: "low-stock",
    isBestSeller: true,
    zodiacConnection: [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces"
    ],
    specifications: {
      beadSize: "8mm Faceted Brilliant Spheres",
      beadCount: 24,
      threadMaterial: "Heavy-duty Elastic Suture",
      origin: "Premium Sourced Brazilian Earth Crystals",
      chargeTime: "3 Nights Triple Energizing Sequence"
    }
  },
  {
    id: "stress-killer",
    name: "The Stress Killer - Royal Lavender Amethyst Bracelet",
    originalPrice: 1299,
    salePrice: 999,
    rating: 4.85,
    reviewsCount: 521,
    shortDescription: "Soothe the nervous system, end bedtime overthinking, unlock profound deep sleep waves, and reset stress cycles.",
    description: "A masterpiece of absolute serenity. Deep lavender spheres of high-grade Amethyst operate on the Crown and Third Eye chakras to dismantle modern cognitive anxiety. Perfect for engineers, designers, business owners, and students dealing with chronic mental fatigue and burnout.",
    benefits: [
      "Induces calming wave signatures in the brain to reduce overthinking.",
      "Stills internal chatter and speeds up transition to deep, restorative REM sleep.",
      "Soothes skin frequencies and cellular inflammation induced by continuous stress.",
      "Enhances spiritual intuition and meditative focus."
    ],
    crystalsUsed: ["Royal Amethyst", "Lavender Quartz", "Pure Mountain Quartz"],
    imageUrl: STRESS_KILLER_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: ["Pisces", "Aquarius", "Sagittarius", "Virgo"],
    specifications: {
      beadSize: "10mm Organic High Polish Spheres",
      beadCount: 20,
      threadMaterial: "Premium Silk Stretch Core",
      origin: "Uruguayan Deep Crystals & Himalayan Quartz",
      chargeTime: "3 Nights Sacred Sound Bathing"
    }
  },
  {
    id: "love-harmony",
    name: "The Divine Harmony - Rose Quartz & Peach Sunstone Bracelet",
    originalPrice: 1299,
    salePrice: 949,
    rating: 4.92,
    reviewsCount: 264,
    shortDescription: "Open your heart chakra to attract pure love, foster harmonious relationships, absolute empathy, and heal old emotional bruises.",
    description: "This ultra-exclusive jewelry pairing combines the tender pink hues of first-grade Rose Quartz alongside energetic peach Sunstone beads. Designed to unlock boundaries, welcome new healthy friendships, and stabilize your cardiac meridian center with unmatched emotional warmth and safety.",
    benefits: [
      "Sparks mutual affection, trust, and deep, honest relationship connections.",
      "Melts old, cold emotional armor or trauma blocks around your core.",
      "Releases beautiful radiant aura markers that draw high-vibrational people near.",
      "Perfect for deep emotional healing and high self-esteem calibration."
    ],
    crystalsUsed: ["Premium Rose Quartz", "Natural Peach Sunstone", "White Jade"],
    imageUrl: LOVE_HARMONY_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: ["Taurus", "Libra", "Cancer", "Pisces"],
    specifications: {
      beadSize: "8mm Fine Polished Spheres",
      beadCount: 22,
      threadMaterial: "Soft Pink Silk Elastic core",
      origin: "Premium Madagascan Rose Mines",
      chargeTime: "2 Nights Lunar Bath Singing Bowls"
    }
  },
  {
    id: "student-crystal",
    name: "The Students Crystal - Lapis Lazuli Concentration Bracelet",
    originalPrice: 1199,
    salePrice: 899,
    rating: 4.78,
    reviewsCount: 388,
    shortDescription: "Deepen academic focus, enhance memory recall, open the throat chakra for vocal eloquence and exam confidence.",
    description: "Dappled with golden specks of pyrite, our royal blue Lapis Lazuli bracelet is highly tuned for intellect, cognitive endurance, and communication channels. Designed specifically for academic scholars, creative writers, and public speakers seeking truth, wisdom, and pristine clarity.",
    benefits: [
      "Catalyzes logical analysis and rapid problem-solving execution.",
      "Bolsters long-term text retention and sharpens visual spatial intellect.",
      "Clears the throat chakra to eliminate stuttering blocks and nervous speaking draft.",
      "Instills a tranquil confidence during competitive tests and stressful evaluations."
    ],
    crystalsUsed: ["Lapis Lazuli", "Blue Sodalite", "Hematite"],
    imageUrl: STUDENT_CRYSTAL_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: ["Sagittarius", "Libra", "Aquarius", "Taurus"],
    specifications: {
      beadSize: "8mm Laser-aligned Spheres",
      beadCount: 24,
      threadMaterial: "Premium Blue Elastic Filament",
      origin: "Badakhshan Royal Mines",
      chargeTime: "2 Nights Astro Alignment"
    }
  },
  {
    id: "seven-chakra",
    name: "The Real 7 Chakra Healing & Lava Stone Grounding",
    originalPrice: 1399,
    salePrice: 1099,
    rating: 4.88,
    reviewsCount: 712,
    shortDescription: "Regulate your seven core chakra nodes simultaneously while serving as a natural organic essential oil diffuser.",
    description: "A beautiful thermodynamic compass for your energy body. It features seven distinct premium crystals aligning precisely to your seven operational chakras, combined with porous basalt Lava Stones. You can place a single drop of continuous essential oil (like sandalwood or lavender) onto the lava stones to experience all-day therapeutic aromatherapy.",
    benefits: [
      "Secures spiritual and thermodynamic grounding against energy spikes.",
      "Resets and unblocks all seven key meridian centers along the spinal energy pillar.",
      "Diffuses favorite functional essential wellness oils passively across 24 hours.",
      "Restores raw vital energy to clear inexplicable fatigue."
    ],
    crystalsUsed: [
      "Amethyst",
      "Lapis Lazuli",
      "Sodalite",
      "Green Aventurine",
      "Tiger Eye",
      "Carnelian",
      "Red Jasper",
      "Porous Lava Basalt"
    ],
    imageUrl: SEVEN_CHAKRA_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces"
    ],
    specifications: {
      beadSize: "8mm Matched Gems + 10mm Lava",
      beadCount: 22,
      threadMaterial: "Resilient Hypoallergenic Core",
      origin: "Global Sourced Crystals & Icelandic Lava",
      chargeTime: "3 Nights Sacred Sound & Full Moon Charge"
    }
  },
  {
    id: "pyrite-luxury-ring",
    name: "Aura & Stone Luxury Pyrite Resin-Ring (Silver Band)",
    originalPrice: 1199,
    salePrice: 799,
    rating: 4.8,
    reviewsCount: 245,
    shortDescription: "Attract gold, wealth, and solid focus in a modern polished sterling silver adjustable frame.",
    description: "An elegant, luxury ring encasing real, raw crystalline Pyrite flakes in a high-clarity resin cabochon. Tailored specifically for modern minimalists who wish to keep their financial manifestation keys extremely close, serving as a silent luxury standard piece.",
    benefits: [
      "Continuous energetic link through principal hand tactile feedback.",
      "Sterling silver premium adjustable band fits all ring fingers perfectly.",
      "Encourages a continuous flow of creative entrepreneurial ideas."
    ],
    crystalsUsed: ["Pyrite", "Clear Resonance Resin"],
    imageUrl: PYRITE_RING_IMAGE,
    category: "ring",
    stockStatus: "in-stock",
    zodiacConnection: ["Leo", "Taurus", "Gemini", "Capricorn"],
    specifications: {
      beadSize: "12mm Resin Cabochon",
      beadCount: 1,
      threadMaterial: "Adjustable S925 Silver Band",
      origin: "Peruvian Pyrite",
      chargeTime: "3 Nights Astral Gilded Charge"
    }
  },
  {
    id: "citrine-luxury-ring",
    name: "Aura & Stone Luxury Citrine Solar-Ring (Gold Band)",
    originalPrice: 1199,
    salePrice: 799,
    rating: 4.82,
    reviewsCount: 194,
    shortDescription: "Channel the warmth and solar success magnet of pure Brazilian Citrine in a premium 18k gold-plated mount.",
    description: "Imbued with the solar power of the ruling planet Jupiter. This beautiful gold-plated adjustable ring features a raw crystal of golden Citrine carefully encapsulated in glass-smooth protective matrixes. Bring light, joy, and positive customer conversions to your business.",
    benefits: [
      "Empowers Jupiter planetary rays inside your hand chart.",
      "18K gold-plated adjustable brass band for luxurious day-long wear.",
      "Disperses pessimistic energies, bad dreams, and workspace friction."
    ],
    crystalsUsed: ["Citrine", "18K Gold Plated Brass Frame"],
    imageUrl: CITRINE_RING_IMAGE,
    category: "ring",
    stockStatus: "in-stock",
    zodiacConnection: ["Leo", "Sagittarius", "Aries", "Virgo"],
    specifications: {
      beadSize: "14mm Solar matrix Cabochon",
      beadCount: 1,
      threadMaterial: "18K Gold-Plated Adjustable Band",
      origin: "Brazilian Citrine Mines",
      chargeTime: "3 Nights solar rise & Mantra Charge"
    }
  }
];

// src/data/websiteContent.ts
var DEFAULT_WEBSITE_CONTENT = {
  brandName: "Aura & Stone",
  brandSubtitle: "Crystalline Astrology",
  heroHeadline: "The Indian",
  heroHighlight: "Science of Signs",
  heroParagraph: "Fine crystal jewelry engineered from verified planetary minerals. Cleansed, moon bathed, and programmed to your birth chart parameters to create an unshakeable energetic shield.",
  founderQuote: "In today\u2019s fast-paced corporate and creative grids, we are continuously bombarded by negative gazes, digital noise, and heavy financial doubt. Aura & Stone was co-conceived because I wanted authentic, laboratory-tested crystal jewelry that looks incredibly sharp and high-fashion while offering robust spiritual protection. We took 75 years of my family\u2019s ancestral alignment wisdom and made it sleek, minimalistic, and absolute.",
  founderQuoteSubtitle: "Co-Founder & Chief Vedic Architect, Aura & Stone",
  historyHeadline: "Ancient Sceptred Science Met Minimalist Form",
  historyParagraph1: "Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.",
  historyParagraph2: "By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.",
  bannerImage: HERO_IMAGE
};

// server/middleware/logging.ts
import pino from "pino";
var isDevelopment = process.env.NODE_ENV !== "production";
var logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  ...isDevelopment ? {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname"
      }
    }
  } : {},
  base: {
    service: "aura-stone-api",
    env: process.env.NODE_ENV || "development"
  },
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});

// server/db.ts
var CONFIG_PATH = path.join(process.cwd(), "firebase-applet-config.json");
var SERVICE_ACCOUNT_PATH = path.join(process.cwd(), "serviceAccountKey.json");
var projectId = "aura-and-stone";
var firestoreDatabaseId = void 0;
try {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    if (config.projectId) {
      projectId = config.projectId;
    }
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)") {
      firestoreDatabaseId = config.firestoreDatabaseId;
    }
  }
} catch (err) {
}
var firestoreDb = null;
var useLocalFallback = false;
var IS_PRODUCTION = process.env.NODE_ENV === "production";
function getServiceAccount() {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      return JSON.parse(envKey);
    } catch (err) {
      logger.warn({ err }, "FIREBASE_SERVICE_ACCOUNT_KEY is set but invalid JSON.");
    }
  }
  try {
    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      return JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));
    }
  } catch (err) {
  }
  return null;
}
function getFirestoreDB() {
  if (useLocalFallback) {
    return null;
  }
  if (firestoreDb) {
    return firestoreDb;
  }
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = getServiceAccount();
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId
        });
      } else {
        admin.initializeApp({
          projectId
        });
      }
    }
    const app2 = admin.app();
    firestoreDb = firestoreDatabaseId ? getFirestore(app2, firestoreDatabaseId) : getFirestore(app2);
    return firestoreDb;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.warn(`Firestore unavailable (${reason}). Falling back to local flat-file storage.`);
    useLocalFallback = true;
    return null;
  }
}
function isFirebaseActive() {
  return getFirestoreDB() !== null;
}
var DB_FILE = path.join(process.cwd(), "database.json");
var INITIAL_INVOICES = [
  {
    id: "INV-2026-601",
    client: "Aarav Mehta",
    date: "2026-05-24",
    item: "Astral Prosperity Bracelet Combo",
    amount: 8400,
    status: "Paid",
    alignment: "Money Magnet (Citrine + Pyrite)"
  },
  {
    id: "INV-2026-602",
    client: "Priya Sharma",
    date: "2026-05-25",
    item: "Evil Eye Armour Ring Set",
    amount: 5900,
    status: "Sent",
    alignment: "Protection (Black Tourmaline)"
  },
  {
    id: "INV-2026-603",
    client: "Devas Astrographics",
    date: "2026-05-21",
    item: "Mass Calibration (12 Sacred Geodes)",
    amount: 48e3,
    status: "Paid",
    alignment: "Vedic Grid Alignment"
  },
  {
    id: "INV-2026-604",
    client: "Rohit Khandelwal",
    date: "2026-05-18",
    item: "Crown Clarity Amethyst Special",
    amount: 9500,
    status: "Overdue",
    alignment: "Saturn Node Alignment"
  },
  {
    id: "INV-2026-605",
    client: "Kiran Desai",
    date: "2026-05-26",
    item: "Chakra Awakening Gilded Bead Set",
    amount: 12500,
    status: "Draft",
    alignment: "Full Alignment"
  }
];
var INITIAL_VENDORS = [
  {
    id: "VND-301",
    name: "Himalayan Fine Quartz Co.",
    contact: "Harish Rawat",
    origin: "Uttarakhand, India",
    rating: 5,
    category: "Raw Geodes",
    leadTime: "3 Days",
    leadGems: "Clear Quartz & Citrine",
    status: "Approved"
  },
  {
    id: "VND-302",
    name: "Uruguayan Amethyst Miner's Guild",
    contact: "Lucas Silveira",
    origin: "Artigas, Uruguay",
    rating: 5,
    category: "Crystalline Clusters",
    leadTime: "14 Days",
    leadGems: "Deep Amethyst",
    status: "Approved"
  },
  {
    id: "VND-303",
    name: "Gilded Silver & Thread Artisans",
    contact: "Kavita Jewellers",
    origin: "Jaipur, India",
    rating: 4,
    category: "Mountings & Elastic Conductors",
    leadTime: "5 Days",
    leadGems: "925 Silver Links",
    status: "Under Review"
  },
  {
    id: "VND-304",
    name: "Ganges Water Sanctify Source",
    contact: "Pandit Shastri Ji",
    origin: "Rishikesh, India",
    rating: 5,
    category: "Sanctifying Liquids",
    leadTime: "2 Days",
    leadGems: "Panchamrut & Ganga Jal",
    status: "Approved"
  }
];
var INITIAL_EXPENSES = [
  {
    id: "EXP-101",
    title: "Lunar Cleansing Sandalwood Paste",
    category: "Ritual Consecration",
    amount: 4200,
    date: "2026-05-20",
    notes: "Grown on organic farms in Mysore"
  },
  {
    id: "EXP-102",
    title: "Custom Velvet Protection Pouches",
    category: "Packaging",
    amount: 8500,
    date: "2026-05-22",
    notes: "Saffron-dyed lining for energetic insulation"
  },
  {
    id: "EXP-103",
    title: "Laboratory Geological Verification Fees",
    category: "Quality Inspection",
    amount: 12e3,
    date: "2026-05-24",
    notes: "Refractive Index and Mohs Hardness certification batch #411"
  },
  {
    id: "EXP-104",
    title: "Temple Astro-Scholars Commision",
    category: "Ritual Consecration",
    amount: 25e3,
    date: "2026-05-25",
    notes: "Bathing chant leaders over moon cycles"
  },
  {
    id: "EXP-105",
    title: "Ganga Jal Sacred Liquid Logistic Refills",
    category: "Sourcing & Shipping",
    amount: 6200,
    date: "2026-05-18",
    notes: "Pure glass canisters from Himalayan descent coordinates"
  }
];
var INITIAL_TASKS = [
  {
    id: "TSK-501",
    title: "Wash Batch #409 Clear Quartz in Panchamrut",
    status: "Water Cleanse",
    priority: "High",
    assignee: "Pandit Sharma",
    daysLeft: 1
  },
  {
    id: "TSK-502",
    title: "Calibrate Amethyst beads with 432Hz Saturn frequencies",
    status: "Moon Bath Bathing",
    priority: "High",
    assignee: "Shastry Ji",
    daysLeft: 2
  },
  {
    id: "TSK-503",
    title: "Review laboratory hardness scores for Green Aventirine arrival",
    status: "Backlog",
    priority: "Medium",
    assignee: "Dr. Vivek Soni",
    daysLeft: 5
  },
  {
    id: "TSK-504",
    title: "Seal and pack Aarav Mehta Certified Prosperity Combo",
    status: "Sealed / Composed",
    priority: "Low",
    assignee: "Meera Patel",
    daysLeft: 0
  },
  {
    id: "TSK-505",
    title: "Program Solar Warmth on Carnelian material locks",
    status: "Moon Bath Bathing",
    priority: "Medium",
    assignee: "Shastry Ji",
    daysLeft: 1
  },
  {
    id: "TSK-506",
    title: "Verify signature holographic seals of Vedic certificate series 900",
    status: "Backlog",
    priority: "High",
    assignee: "Meera Patel",
    daysLeft: 3
  }
];
var INITIAL_LOGS = [
  {
    id: "log-1",
    timestamp: "10:32 AM",
    message: "SECURE COGNITIVE LEDGER INITIALIZED: Welcome to Aura & Stone Central Operations."
  },
  {
    id: "log-2",
    timestamp: "10:45 AM",
    message: "RITUAL BATCH UPDATE COMPLETED: 12 Pure Citrine conductors advanced to lunar purification stage."
  },
  {
    id: "log-3",
    timestamp: "11:15 AM",
    message: "QUALITY CHECK SYSTEM VERIFICATION: Geologist verified Mohs index 7 on raw amethyst crystal bulk VND-302."
  }
];
var INITIAL_WEBSITE_CONTENT = {
  brandName: "Aura & Stone",
  brandSubtitle: "Crystalline Astrology",
  heroHeadline: "The Indian",
  heroHighlight: "Science of Signs",
  heroParagraph: "Fine crystal jewelry engineered from verified planetary minerals. Cleansed, moon bathed, and programmed to your birth chart parameters to create an unshakeable energetic shield.",
  founderQuote: "In today\u2019s fast-paced corporate and creative grids, we are continuously bombarded by negative gazes, digital noise, and heavy financial doubt. Aura & Stone was co-conceived because I wanted authentic, laboratory-tested crystal jewelry that looks incredibly sharp and high-fashion while offering robust spiritual protection. We took 75 years of my family's ancestral alignment wisdom and made it sleek, minimalistic, and absolute.",
  founderQuoteSubtitle: "Co-Founder & Chief Vedic Architect, Aura & Stone",
  historyHeadline: "Ancient Sceptred Science Met Minimalist Form",
  historyParagraph1: "Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.",
  historyParagraph2: "By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.",
  bannerImage: "/src/assets/images/aura_stone_hero_banner_1779793774735.png"
};
var DB = class {
  static load() {
    if (IS_PRODUCTION && !fs) {
      const defaultData2 = {
        invoices: INITIAL_INVOICES,
        vendors: INITIAL_VENDORS,
        expenses: INITIAL_EXPENSES,
        tasks: INITIAL_TASKS,
        terminalLog: INITIAL_LOGS,
        emailRecords: [],
        products: PRODUCTS,
        websiteContent: INITIAL_WEBSITE_CONTENT,
        checkpoints: [],
        astroContent: []
      };
      return defaultData2;
    }
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        let modified = false;
        if (!data.products) {
          data.products = PRODUCTS;
          modified = true;
        }
        if (!data.websiteContent) {
          data.websiteContent = INITIAL_WEBSITE_CONTENT;
          modified = true;
        }
        if (!data.checkpoints) {
          data.checkpoints = [];
          modified = true;
        }
        if (!data.emailRecords) {
          data.emailRecords = [];
          modified = true;
        }
        if (!data.astroContent) {
          data.astroContent = [];
          modified = true;
        }
        if (modified) {
          this.save(data);
        }
        return data;
      }
    } catch (e) {
      logger.error({ e }, "Error reading index file. Initializing default structures.");
    }
    const defaultData = {
      invoices: INITIAL_INVOICES,
      vendors: INITIAL_VENDORS,
      expenses: INITIAL_EXPENSES,
      tasks: INITIAL_TASKS,
      terminalLog: INITIAL_LOGS,
      emailRecords: [],
      products: PRODUCTS,
      websiteContent: INITIAL_WEBSITE_CONTENT,
      checkpoints: [],
      astroContent: []
    };
    this.save(defaultData);
    return defaultData;
  }
  static save(data) {
    if (IS_PRODUCTION) {
      return;
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      logger.error({ e }, "CRITICAL: Failed to write to the index file.");
    }
  }
  // General log appender (Sync & Async)
  static async addLog(message) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const logId = `log-${Date.now()}`;
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const newLogPayload = { id: logId, timestamp, message };
        await fdb.collection("logs").doc(logId).set(newLogPayload);
        return newLogPayload;
      } catch (e) {
      }
    }
    const data = this.load();
    const newLog = { id: logId, timestamp, message };
    data.terminalLog = [newLog, ...data.terminalLog.slice(0, 9)];
    this.save(data);
    return newLog;
  }
  static async getLogs() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("logs").orderBy("id", "desc").limit(10).get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().terminalLog;
  }
  // EMAIL RECORDS CRUD
  static async getEmailRecords() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("email_records").orderBy("id", "desc").limit(50).get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().emailRecords || [];
  }
  static async addEmailRecord(record) {
    const id = `email-${Date.now()}`;
    const newRecord = { ...record, id };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("email_records").doc(id).set(newRecord);
        return newRecord;
      } catch (e) {
      }
    }
    const data = this.load();
    data.emailRecords = [newRecord, ...data.emailRecords || []].slice(0, 50);
    this.save(data);
    return newRecord;
  }
  // ASTRO CONTENT CRUD
  static async getAstroContent() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("astro_content").get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().astroContent || [];
  }
  static async upsertAstroContent(entry) {
    const id = entry.id || `astro-${entry.type}-${entry.key}-${Date.now()}`;
    const newEntry = { ...entry, id };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("astro_content").doc(id).set(newEntry, { merge: true });
        return newEntry;
      } catch (e) {
      }
    }
    const data = this.load();
    const list = data.astroContent || [];
    const idx = list.findIndex((e) => e.id === id);
    if (idx >= 0) list[idx] = newEntry;
    else list.push(newEntry);
    data.astroContent = list;
    this.save(data);
    return newEntry;
  }
  static async deleteAstroContent(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("astro_content").doc(id).delete();
        return;
      } catch (e) {
      }
    }
    const data = this.load();
    data.astroContent = (data.astroContent || []).filter((e) => e.id !== id);
    this.save(data);
  }
  static async bulkUpsertAstroContent(entries) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const batch = fdb.batch();
        const results = entries.map((entry) => {
          const id = `astro-${entry.type}-${entry.key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const newEntry = { ...entry, id };
          batch.set(fdb.collection("astro_content").doc(id), newEntry);
          return newEntry;
        });
        await batch.commit();
        return results;
      } catch (e) {
      }
    }
    const data = this.load();
    const list = data.astroContent || [];
    const newEntries = entries.map((entry) => {
      const id = `astro-${entry.type}-${entry.key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const newEntry = { ...entry, id };
      list.push(newEntry);
      return newEntry;
    });
    data.astroContent = list;
    this.save(data);
    return newEntries;
  }
  // INVOICES CRUD
  static async getInvoices() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("invoices").get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().invoices;
  }
  static async addInvoice(invoice) {
    const customId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const newInvoice = {
      ...invoice,
      id: customId
    };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("invoices").doc(customId).set(newInvoice);
        await this.addLog(
          `Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (\u20B9${newInvoice.amount})`
        );
        return newInvoice;
      } catch (e) {
      }
    }
    const data = this.load();
    data.invoices = [newInvoice, ...data.invoices];
    this.save(data);
    await this.addLog(
      `Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (\u20B9${newInvoice.amount})`
    );
    return newInvoice;
  }
  static async bulkCreateInvoices(items) {
    const created = [];
    for (const item of items) {
      const inv = await this.addInvoice(item);
      created.push(inv);
    }
    return created;
  }
  static async bulkCreateExpenses(items) {
    const created = [];
    for (const item of items) {
      const exp = await this.addExpense(item);
      created.push(exp);
    }
    return created;
  }
  static async bulkCreateVendors(items) {
    const created = [];
    for (const item of items) {
      const vnd = await this.addVendor(item);
      created.push(vnd);
    }
    return created;
  }
  static async updateInvoice(id, updates) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection("invoices").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(updates);
          const updatedSnap = await docRef.get();
          const invoiceData = updatedSnap.data();
          await this.addLog(`Updated invoice ${id} for ${invoiceData.client}.`);
          return invoiceData;
        }
        return null;
      } catch (e) {
      }
    }
    const data = this.load();
    const index = data.invoices.findIndex((i) => i.id === id);
    if (index > -1) {
      data.invoices[index] = { ...data.invoices[index], ...updates };
      this.save(data);
      await this.addLog(`Updated invoice ${id} for ${data.invoices[index].client}.`);
      return data.invoices[index];
    }
    return null;
  }
  static async deleteInvoice(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("invoices").doc(id).delete();
        await this.addLog(`Cleared Invoice ${id} from operational ledger.`);
        return true;
      } catch (e) {
      }
    }
    const data = this.load();
    const countBefore = data.invoices.length;
    data.invoices = data.invoices.filter((i) => i.id !== id);
    if (data.invoices.length < countBefore) {
      this.save(data);
      await this.addLog(`Cleared Invoice ${id} from operational ledger.`);
      return true;
    }
    return false;
  }
  static async bulkDeleteInvoices(ids) {
    let deleted = 0;
    for (const id of ids) {
      const ok = await this.deleteInvoice(id);
      if (ok) deleted++;
    }
    return deleted;
  }
  static async bulkDeleteExpenses(ids) {
    let deleted = 0;
    for (const id of ids) {
      const ok = await this.deleteExpense(id);
      if (ok) deleted++;
    }
    return deleted;
  }
  // VENDORS CRUD
  static async getVendors() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("vendors").get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().vendors;
  }
  static async addVendor(vendor) {
    const customId = `VND-${Math.floor(Math.random() * 90 + 300)}`;
    const newVendor = {
      ...vendor,
      id: customId,
      rating: 5,
      status: "Approved"
    };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("vendors").doc(customId).set(newVendor);
        await this.addLog(`Onboarded newly registered artisan and geode vendor: ${newVendor.name}`);
        return newVendor;
      } catch (e) {
      }
    }
    const data = this.load();
    data.vendors = [...data.vendors, newVendor];
    this.save(data);
    await this.addLog(`Onboarded newly registered artisan and geode vendor: ${newVendor.name}`);
    return newVendor;
  }
  static async updateVendor(id, updates) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection("vendors").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(updates);
          const updatedSnap = await docRef.get();
          const vendorData = updatedSnap.data();
          await this.addLog(`Updated vendor ${id} (${vendorData.name}).`);
          return vendorData;
        }
        return null;
      } catch (e) {
      }
    }
    const data = this.load();
    const index = data.vendors.findIndex((v) => v.id === id);
    if (index > -1) {
      data.vendors[index] = { ...data.vendors[index], ...updates };
      this.save(data);
      await this.addLog(`Updated vendor ${id} (${data.vendors[index].name}).`);
      return data.vendors[index];
    }
    return null;
  }
  static async deleteVendor(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("vendors").doc(id).delete();
        await this.addLog(`Suspended/deleted vendor registration: ${id}`);
        return true;
      } catch (e) {
      }
    }
    const data = this.load();
    const countBefore = data.vendors.length;
    const vendorRef = data.vendors.find((v) => v.id === id);
    data.vendors = data.vendors.filter((v) => v.id !== id);
    if (data.vendors.length < countBefore) {
      this.save(data);
      await this.addLog(`Suspended/deleted vendor registration: ${vendorRef?.name || id}`);
      return true;
    }
    return false;
  }
  // EXPENSES CRUD
  static async getExpenses() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("expenses").get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().expenses;
  }
  static async addExpense(expense) {
    const customId = `EXP-${Math.floor(Math.random() * 90 + 100)}`;
    const newExpense = {
      ...expense,
      id: customId,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("expenses").doc(customId).set(newExpense);
        await this.addLog(`Logged operations expense: ${newExpense.title} (\u20B9${newExpense.amount})`);
        return newExpense;
      } catch (e) {
      }
    }
    const data = this.load();
    data.expenses = [newExpense, ...data.expenses];
    this.save(data);
    await this.addLog(`Logged operations expense: ${newExpense.title} (\u20B9${newExpense.amount})`);
    return newExpense;
  }
  static async updateExpense(id, updates) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection("expenses").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(updates);
          const updatedSnap = await docRef.get();
          const expenseData = updatedSnap.data();
          await this.addLog(`Updated expense ${id} (${expenseData.title}).`);
          return expenseData;
        }
        return null;
      } catch (e) {
      }
    }
    const data = this.load();
    const index = data.expenses.findIndex((e) => e.id === id);
    if (index > -1) {
      data.expenses[index] = { ...data.expenses[index], ...updates };
      this.save(data);
      await this.addLog(`Updated expense ${id} (${data.expenses[index].title}).`);
      return data.expenses[index];
    }
    return null;
  }
  static async deleteExpense(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("expenses").doc(id).delete();
        await this.addLog(`Removed operational expense log record ID: ${id}`);
        return true;
      } catch (e) {
      }
    }
    const data = this.load();
    const countBefore = data.expenses.length;
    data.expenses = data.expenses.filter((e) => e.id !== id);
    if (data.expenses.length < countBefore) {
      this.save(data);
      await this.addLog(`Removed operational expense log record ID: ${id}`);
      return true;
    }
    return false;
  }
  // TASKS CRUD
  static async getTasks() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("tasks").get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
      }
    }
    return this.load().tasks;
  }
  static async addTask(task) {
    const customId = `TSK-${Math.floor(Math.random() * 90 + 500)}`;
    const newTask = {
      ...task,
      id: customId
    };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("tasks").doc(customId).set(newTask);
        await this.addLog(`Created astrological task: ${newTask.title} for ${newTask.assignee}`);
        return newTask;
      } catch (e) {
      }
    }
    const data = this.load();
    data.tasks = [newTask, ...data.tasks];
    this.save(data);
    await this.addLog(`Created astrological task: ${newTask.title} for ${newTask.assignee}`);
    return newTask;
  }
  static async updateTaskStatus(id, status) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection("tasks").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update({ status });
          const updatedSnap = await docRef.get();
          const taskData = updatedSnap.data();
          await this.addLog(`Updated task status for ${id} to "${status}"`);
          return taskData;
        }
        return null;
      } catch (e) {
      }
    }
    const data = this.load();
    const index = data.tasks.findIndex((t) => t.id === id);
    if (index > -1) {
      const task = data.tasks[index];
      if (task) {
        task.status = status;
        this.save(data);
        await this.addLog(`Updated task status for ${id} to "${status}"`);
        return task;
      }
    }
    return null;
  }
  static async updateTask(id, updates) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection("tasks").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update(updates);
          const updatedSnap = await docRef.get();
          const taskData = updatedSnap.data();
          await this.addLog(`Updated task ${id} ("${taskData.title}").`);
          return taskData;
        }
        return null;
      } catch (e) {
      }
    }
    const data = this.load();
    const index = data.tasks.findIndex((t) => t.id === id);
    if (index > -1) {
      data.tasks[index] = { ...data.tasks[index], ...updates };
      this.save(data);
      await this.addLog(`Updated task ${id} ("${data.tasks[index].title}").`);
      return data.tasks[index];
    }
    return null;
  }
  static async deleteTask(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("tasks").doc(id).delete();
        await this.addLog(`Cleared astrological task reference ID: ${id}`);
        return true;
      } catch (e) {
      }
    }
    const data = this.load();
    const countBefore = data.tasks.length;
    data.tasks = data.tasks.filter((t) => t.id !== id);
    if (data.tasks.length < countBefore) {
      this.save(data);
      await this.addLog(`Cleared astrological task reference ID: ${id}`);
      return true;
    }
    return false;
  }
  // ==========================================
  // PRODUCTS CRUD
  // ==========================================
  static async getProducts() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("products").get();
        if (snapshot.empty) {
          for (const p of PRODUCTS) {
            await fdb.collection("products").doc(p.id).set(p);
          }
          return PRODUCTS;
        }
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
        logger.error({ e }, "Firestore getProducts failure, falling back to local file");
      }
    }
    return this.load().products || PRODUCTS;
  }
  static async saveProduct(product) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("products").doc(product.id).set(product);
        await this.addLog(
          `Product "${product.name}" (${product.id}) saved and synchronized with Firestore.`
        );
        return product;
      } catch (e) {
        logger.error({ e }, "Firestore saveProduct error, falling back to local file");
      }
    }
    const data = this.load();
    const index = data.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      data.products[index] = product;
    } else {
      data.products.push(product);
    }
    this.save(data);
    await this.addLog(`Product "${product.name}" (${product.id}) saved to local JSON database.`);
    return product;
  }
  static async deleteProduct(id) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("products").doc(id).delete();
        await this.addLog(`Product ID ${id} deleted static reference from Firestore.`);
        return true;
      } catch (e) {
        logger.error({ e }, "Firestore deleteProduct error, falling back to local file");
      }
    }
    const data = this.load();
    const countBefore = data.products.length;
    const prod = data.products.find((p) => p.id === id);
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length < countBefore) {
      this.save(data);
      await this.addLog(`Product "${prod?.name || id}" (${id}) removed from local JSON database.`);
      return true;
    }
    return false;
  }
  // ==========================================
  // WEBSITE CONTENT CONFIG
  // ==========================================
  static async getWebsiteContent() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const doc = await fdb.collection("website_config").doc("homepage").get();
        if (!doc.exists) {
          await fdb.collection("website_config").doc("homepage").set(INITIAL_WEBSITE_CONTENT);
          return INITIAL_WEBSITE_CONTENT;
        }
        return doc.data();
      } catch (e) {
        logger.error({ e }, "Firestore getWebsiteContent failure, falling back to local file");
      }
    }
    return this.load().websiteContent || INITIAL_WEBSITE_CONTENT;
  }
  static async saveWebsiteContent(content) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("website_config").doc("homepage").set(content);
        await this.addLog("Website custom theme header and layout properties synchronized.");
        return content;
      } catch (e) {
        logger.error({ e }, "Firestore saveWebsiteContent error, falling back to local file");
      }
    }
    const data = this.load();
    data.websiteContent = content;
    this.save(data);
    await this.addLog("Website custom theme header and layout properties saved locally.");
    return content;
  }
  // ==========================================
  // SYSTEM CHECKPOINTS FOR ROLLBACK (UP TO 25)
  // ==========================================
  static async getCheckpoints() {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection("checkpoints").orderBy("timestamp", "desc").limit(25).get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
        logger.error({ e }, "Firestore getCheckpoints failure, falling back to local file");
      }
    }
    return this.load().checkpoints || [];
  }
  static async createCheckpoint(title, user) {
    const checkpointId = `chk-${Date.now()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const currentContent = await this.getWebsiteContent();
    const currentProducts = await this.getProducts();
    const newCheckpoint = {
      id: checkpointId,
      timestamp,
      title: title || "Periodic Operational Checkpoint",
      user: user || "debarghapakhira@gmail.com",
      websiteContent: currentContent,
      products: currentProducts
    };
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("checkpoints").doc(checkpointId).set(newCheckpoint);
        const snapshot = await fdb.collection("checkpoints").orderBy("timestamp", "desc").get();
        if (snapshot.size > 25) {
          const deletePromises = snapshot.docs.slice(25).map((doc) => doc.ref.delete());
          await Promise.all(deletePromises);
        }
        await this.addLog(`System Rollback Checkpoint Created: "${newCheckpoint.title}"`);
        return newCheckpoint;
      } catch (e) {
        logger.error({ e }, "Firestore createCheckpoint failure, falling back to local file");
      }
    }
    const data = this.load();
    if (!data.checkpoints) {
      data.checkpoints = [];
    }
    data.checkpoints = [newCheckpoint, ...data.checkpoints].slice(0, 25);
    this.save(data);
    await this.addLog(`System Rollback Checkpoint Created (Local): "${newCheckpoint.title}"`);
    return newCheckpoint;
  }
  static async rollbackToCheckpoint(id) {
    const fdb = getFirestoreDB();
    let checkpoint;
    if (fdb) {
      try {
        const doc = await fdb.collection("checkpoints").doc(id).get();
        if (doc.exists) {
          checkpoint = doc.data();
        }
      } catch (e) {
        logger.error(
          { e },
          "Firestore fetch checkpoint rollback failure, falling back to local file"
        );
      }
    }
    if (!checkpoint) {
      const data = this.load();
      checkpoint = data.checkpoints?.find((c) => c.id === id);
    }
    if (!checkpoint) {
      throw new Error(`Checkpoint with record ID "${id}" was not resolved.`);
    }
    await this.saveWebsiteContent(checkpoint.websiteContent);
    if (fdb) {
      try {
        const snapshot = await fdb.collection("products").get();
        const deleteBatch = snapshot.docs.map((doc) => doc.ref.delete());
        await Promise.all(deleteBatch);
        for (const p of checkpoint.products) {
          await fdb.collection("products").doc(p.id).set(p);
        }
      } catch (e) {
        logger.error({ e }, "Firestore execute product collection rollback failure");
      }
    } else {
      const data = this.load();
      data.products = checkpoint.products;
      this.save(data);
    }
    await this.addLog(
      `RESTORE ROLLBACK INITIATED: Reverted state to checkpoint [${checkpoint.title}] successfully.`
    );
    return true;
  }
};

// server/middleware/csrf.ts
import crypto from "crypto";
var SAFE_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
var TOKEN_HEADER = "x-csrf-token";
var COOKIE_KEY = "_csrf";
var TOKEN_BYTES = 32;
function signToken(secret, cookieSecret) {
  return crypto.createHmac("sha256", cookieSecret).update(secret).digest("hex");
}
function safeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
function attachTokenGenerator(req, res, cookieKey, cookieSecret) {
  req.csrfToken = () => {
    const existing = req.signedCookies?.[cookieKey];
    if (existing) return existing;
    const secret = crypto.randomBytes(TOKEN_BYTES).toString("hex");
    const signed = signToken(secret, cookieSecret);
    res.cookie(cookieKey, signed, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      signed: true
    });
    return signed;
  };
}
function createCsrfProtection(options) {
  const {
    cookieSecret,
    exemptPaths = /* @__PURE__ */ new Set(),
    cookieKey = COOKIE_KEY,
    tokenHeader = TOKEN_HEADER
  } = options;
  const headerLower = tokenHeader.toLowerCase();
  return function csrfProtection(req, res, next) {
    if (exemptPaths.has(req.path)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret);
      return next();
    }
    const method = req.method.toUpperCase();
    if (SAFE_METHODS.has(method)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret);
      return next();
    }
    const cookieToken = req.signedCookies?.[cookieKey] ?? "";
    const headerTokenRaw = req.headers[headerLower];
    const headerToken = Array.isArray(headerTokenRaw) ? headerTokenRaw[0] : headerTokenRaw;
    if (!cookieToken || !headerToken) {
      return next(Object.assign(new Error("CSRF token missing"), { code: "EBADCSRFTOKEN" }));
    }
    if (!safeEqual(cookieToken, headerToken)) {
      return next(Object.assign(new Error("CSRF token mismatch"), { code: "EBADCSRFTOKEN" }));
    }
    attachTokenGenerator(req, res, cookieKey, cookieSecret);
    return next();
  };
}

// server/middleware/redisRateLimit.ts
import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
var redisClient = null;
var rateLimiter = null;
var redisInitAttempted = false;
var redisInitFailed = false;
var isTestEnv = process.env.NODE_ENV === "test" || process.env.DISABLE_REDIS_RATE_LIMIT === "true";
function initRedisRateLimiter() {
  if (isTestEnv) {
    logger.info("Redis rate limiter disabled in test environment");
    return;
  }
  if (redisInitAttempted) {
    return;
  }
  redisInitAttempted = true;
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 2e3
    });
    redisClient.on("error", (err) => {
      if (!redisInitFailed) {
        logger.warn({ err }, "Redis connection failed, rate limiting will use in-memory fallback");
        redisInitFailed = true;
      }
    });
    redisClient.on("connect", () => {
      logger.info("Redis connected for rate limiting");
      redisInitFailed = false;
    });
    redisClient.connect().catch(() => {
      if (!redisInitFailed) {
        logger.warn("Redis connection failed, rate limiting will use in-memory fallback");
        redisInitFailed = true;
      }
    });
    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: "rl:",
      points: 100,
      duration: 60,
      blockDuration: 60 * 15
    });
    logger.info("Redis rate limiter initialized");
  } catch (err) {
    logger.warn({ err }, "Failed to initialize Redis rate limiter, falling back to in-memory");
    redisInitFailed = true;
  }
}
function createInMemoryLimiter(options) {
  const store = /* @__PURE__ */ new Map();
  return async (req, res, next) => {
    const key = `${options.keyPrefix || "rl:"}${req.ip}:${req.path}`;
    const now = Date.now();
    let entry = store.get(key);
    if (!entry || entry.expires < now) {
      entry = { points: options.points, expires: now + options.duration * 1e3 };
      store.set(key, entry);
    }
    if (entry.points > 0) {
      entry.points--;
      next();
    } else {
      const secs = Math.ceil((entry.expires - now) / 1e3) || 1;
      res.set("Retry-After", String(secs));
      res.status(429).json({
        error: "Too many requests",
        retryAfter: secs
      });
    }
  };
}
function createRateLimiter(options) {
  if (isTestEnv) {
    return async (_req, _res, next) => {
      next();
    };
  }
  const inMemoryLimiter = createInMemoryLimiter(options);
  if (!rateLimiter && !redisInitFailed) {
    initRedisRateLimiter();
  }
  let limiter = null;
  if (redisClient) {
    limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: options.keyPrefix || "rl:",
      points: options.points,
      duration: options.duration,
      blockDuration: options.blockDuration || 60 * 15
    });
  }
  return async (req, res, next) => {
    const isDev2 = process.env.NODE_ENV === "development" || !process.env.NODE_ENV || process.env.NODE_ENV === "unset";
    if (redisInitFailed || isDev2 || !limiter) {
      return inMemoryLimiter(req, res, next);
    }
    const key = `${options.keyPrefix || "rl:"}${req.ip}:${req.path}`;
    try {
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const isRedisError = rejRes instanceof Error || rejRes && typeof rejRes === "object" && !("msBeforeNext" in rejRes);
      if (isRedisError) {
        logger.warn({ err: rejRes }, "Rate limiter Redis error, falling back to in-memory");
        return inMemoryLimiter(req, res, next);
      }
      const secs = Math.round(rejRes.msBeforeNext / 1e3) || 1;
      res.set("Retry-After", String(secs));
      res.status(429).json({
        error: "Too many requests",
        retryAfter: secs
      });
    }
  };
}
var authRateLimiter = createRateLimiter({
  points: 10,
  duration: 15 * 60,
  keyPrefix: "rl:auth:",
  blockDuration: 60 * 15
});
var apiRateLimiter = createRateLimiter({
  points: 100,
  duration: 60,
  keyPrefix: "rl:api:"
});
var paymentRateLimiter = createRateLimiter({
  points: 30,
  duration: 15 * 60,
  keyPrefix: "rl:payment:",
  blockDuration: 60 * 30
});
var aiRateLimiter = createRateLimiter({
  points: 20,
  duration: 60,
  keyPrefix: "rl:ai:",
  blockDuration: 60 * 5
});

// server/middleware/requestId.ts
import crypto2 from "crypto";
var requestId = (req, _res, next) => {
  req.id = req.headers["x-request-id"] || crypto2.randomUUID();
  req.startTime = Date.now();
  next();
};
var requestLogger = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - req.startTime;
    const log = logger.child({
      reqId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent")
    });
    if (res.statusCode >= 400) {
      log.warn(
        { body: typeof body === "string" ? body.slice(0, 500) : body },
        "Request completed with error"
      );
    } else {
      log.info("Request completed");
    }
    return originalSend.call(this, body);
  };
  next();
};

// server/routes/ai.routes.ts
import { Router } from "express";
import { z } from "zod";

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      `FATAL: JWT_SECRET environment variable is missing or too short (min 32 chars). Generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
    );
  }
  return secret;
}
function authenticateToken(req, res, next) {
  let secret;
  try {
    secret = getJwtSecret();
  } catch {
    res.status(500).json({ error: "Server misconfigured: JWT secret unavailable." });
    return;
  }
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Missing divine session credentials." });
    return;
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Astral session expired or corrupt." });
      return;
    }
    req.user = decoded;
    next();
  });
}
function signToken2(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "8h" });
}

// server/middleware/validation.ts
function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        logger.warn({ errors, path: req.path, method: req.method }, "Validation failed");
        res.status(422).json({
          error: "Validation failed",
          issues: errors
        });
        return;
      }
      req.validated = result.data;
      next();
    } catch (err) {
      logger.error({ err, path: req.path, method: req.method }, "Validation error");
      res.status(500).json({ error: "Internal validation error" });
    }
  };
}

// server/services/firebaseAI.ts
import { VertexAI } from "@google-cloud/vertexai";
var PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "aura-and-stone";
var LOCATION = process.env.FIREBASE_LOCATION || "us-central1";
var vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
var generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
    topP: 0.95
  }
});
async function generateWithGemini(prompt) {
  try {
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    if (typeof response.text === "function") {
      return response.text() || "";
    }
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const part = candidate.content.parts[0];
        if (part.text !== void 0) {
          return part.text;
        }
      }
    }
    return "";
  } catch (error) {
    logger.error({ error }, "Gemini API error");
    throw new Error("Failed to generate AI response");
  }
}
async function getProductRecommendations(input) {
  const prompt = `
You are an expert Vedic astrologer and crystal consultant for Aura & Stone.
Given the user's birth details and current cart, recommend 3 products from our catalog with detailed reasoning.

User Birth Details:
- Name: ${input.userBirthDetails.name}
- Birth Date: ${input.userBirthDetails.birthDate}
- Birth Time: ${input.userBirthDetails.birthTime || "Not provided"}
- Birth Place: ${input.userBirthDetails.birthPlace || "Not provided"}

Current Cart: ${JSON.stringify(input.currentCart)}
Purchase History: ${input.purchaseHistory.join(", ") || "None"}
Preferences: Budget: ${input.userPreferences.budget}, Style: ${input.userPreferences.style}, Intent: ${input.userPreferences.intent}

Provide recommendations in this format:
1. Product Name - Brief astrological reasoning + specific crystal benefit
2. Product Name - Brief astrological reasoning + specific crystal benefit
3. Product Name - Brief astrological reasoning + specific crystal benefit

Keep responses concise, authentic to Vedic astrology, and practical.
`;
  return generateWithGemini(prompt);
}
async function handleChatbotMessage(input) {
  const prompt = `
You are the Aura & Stone AI Assistant - knowledgeable about Vedic astrology, crystals, and our products.
Be helpful, authentic, and concise. Never make medical claims.

User Context:
- Name: ${input.userContext.name}
- Authenticated: ${input.userContext.isAuthenticated}
- Cart Items: ${input.userContext.cartItems}
- Current Page: ${input.userContext.currentPage}

Conversation History:
${input.conversationHistory.map((h) => `${h.role}: ${h.content}`).join("\n")}

Current Message: ${input.message}

Respond as the Aura & Stone assistant. Be warm, knowledgeable, and guide towards relevant products or astrological insights when appropriate.
`;
  return generateWithGemini(prompt);
}
async function generateContent(input) {
  const toneInstructions = {
    professional: "Professional, authoritative, trustworthy",
    spiritual: "Sacred, reverent, connecting to ancient wisdom",
    luxury: "Elegant, exclusive, aspirational",
    educational: "Clear, informative, empowering"
  };
  const prompt = `
You are a content writer for Aura & Stone - premium Vedic crystal jewelry brand.
Create ${input.type} content with the following specifications:

Topic: ${input.topic}
Target Audience: ${input.targetAudience}
Tone: ${toneInstructions[input.tone]}
Key Points to Cover:
${input.keyPoints.map((p) => `- ${p}`).join("\n")}
Maximum Length: ${input.maxLength} words

Brand Voice: Authentic Vedic wisdom meets modern luxury. Use Sanskrit terms appropriately.
Products: Money Magnet (Citrine/Pyrite), Evil Eye (Black Tourmaline), Stress Killer (Amethyst), etc.
`;
  return generateWithGemini(prompt);
}
async function getAstrologyInsights(input) {
  const prompt = `
You are a senior Vedic astrologer providing personalized insights for Aura & Stone customers.
Provide authentic, practical astrological guidance without making deterministic predictions.

Birth Details:
- Name: ${input.birthDetails.name}
- Date: ${input.birthDetails.birthDate}
- Time: ${input.birthDetails.birthTime || "Not provided"}
- Place: ${input.birthDetails.birthPlace || "Not provided"}

Current Transits: ${input.currentTransits.join(", ")}
Focus: ${input.focusArea}
${input.specificQuestion ? `Specific Question: ${input.specificQuestion}` : ""}

Provide insights in this format:
1. Current Planetary Influence
2. Recommended Crystal Support
3. Practical Actions
4. Auspicious Timing (if applicable)

Be authentic to Vedic principles, practical, and empowering.
`;
  return generateWithGemini(prompt);
}

// server/routes/ai.routes.ts
var router = Router();
var recommendationSchema = z.object({
  userBirthDetails: z.object({
    name: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional()
  }),
  currentCart: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      crystalsUsed: z.array(z.string())
    })
  ).optional(),
  purchaseHistory: z.array(z.string()).optional(),
  userPreferences: z.object({
    budget: z.enum(["low", "medium", "high"]).optional(),
    style: z.enum(["minimal", "statement", "spiritual"]).optional(),
    intent: z.enum(["wealth", "protection", "health", "relationships", "career", "general"]).optional()
  }).optional()
});
var chatbotSchema = z.object({
  message: z.string().min(1).max(2e3),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string()
    })
  ).max(20).optional(),
  userContext: z.object({
    name: z.string(),
    isAuthenticated: z.boolean(),
    cartItems: z.number().optional(),
    currentPage: z.string().optional()
  }).optional()
});
var contentSchema = z.object({
  type: z.enum(["product-description", "blog-post", "email-campaign", "social-media"]),
  topic: z.string().min(1).max(500),
  targetAudience: z.string().min(1).max(200),
  tone: z.enum(["professional", "spiritual", "luxury", "educational"]),
  keyPoints: z.array(z.string().min(1).max(200)).max(10),
  maxLength: z.number().int().positive().max(5e3)
});
var astrologySchema = z.object({
  birthDetails: z.object({
    name: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional()
  }),
  currentTransits: z.array(z.string()).optional(),
  focusArea: z.enum(["daily", "weekly", "monthly", "yearly", "specific"]),
  specificQuestion: z.string().max(1e3).optional()
});
router.post(
  "/recommendations",
  authenticateToken,
  validate(recommendationSchema),
  async (req, res) => {
    try {
      const result = await getProductRecommendations(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router.post(
  "/chatbot",
  validate(chatbotSchema),
  async (req, res) => {
    try {
      const result = await handleChatbotMessage(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router.post(
  "/generate-content",
  authenticateToken,
  validate(contentSchema),
  async (req, res) => {
    try {
      const result = await generateContent(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router.post(
  "/astrology-insights",
  validate(astrologySchema),
  async (req, res) => {
    try {
      const result = await getAstrologyInsights(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
var ai_routes_default = router;

// server/routes/astro.routes.ts
import { Router as Router2 } from "express";
import { z as z2 } from "zod";

// server/services/FirestoreService.ts
import fs2 from "fs";
import admin2 from "firebase-admin";
import { getFirestore as getFirestore2 } from "firebase-admin/firestore";
var CONFIG_PATH2 = "./firebase-applet-config.json";
var SERVICE_ACCOUNT_PATH2 = "./serviceAccountKey.json";
var projectId2 = "aura-and-stone";
var firestoreDatabaseId2 = void 0;
try {
  if (fs2.existsSync(CONFIG_PATH2)) {
    const config = JSON.parse(fs2.readFileSync(CONFIG_PATH2, "utf-8"));
    if (config.projectId) projectId2 = config.projectId;
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)") {
      firestoreDatabaseId2 = config.firestoreDatabaseId;
    }
  }
} catch {
}
var firestoreDb2 = null;
var useLocalFallback2 = false;
function getServiceAccount2() {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      return JSON.parse(envKey);
    } catch (err) {
      logger.warn({ err }, "FIREBASE_SERVICE_ACCOUNT_KEY is set but invalid JSON");
    }
  }
  try {
    if (fs2.existsSync(SERVICE_ACCOUNT_PATH2)) {
      return JSON.parse(fs2.readFileSync(SERVICE_ACCOUNT_PATH2, "utf-8"));
    }
  } catch {
  }
  return null;
}
function getFirestoreDB2() {
  if (useLocalFallback2) return null;
  if (firestoreDb2) return firestoreDb2;
  try {
    if (admin2.apps.length === 0) {
      const serviceAccount = getServiceAccount2();
      if (serviceAccount) {
        admin2.initializeApp({
          credential: admin2.credential.cert(serviceAccount),
          projectId: projectId2
        });
      } else {
        admin2.initializeApp({ projectId: projectId2 });
      }
    }
    const app2 = admin2.app();
    firestoreDb2 = firestoreDatabaseId2 ? getFirestore2(app2, firestoreDatabaseId2) : getFirestore2(app2);
    logger.info("Firestore initialized successfully");
    return firestoreDb2;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logger.warn({ reason }, "Firestore unavailable, falling back to local storage");
    useLocalFallback2 = true;
    return null;
  }
}
function isFirebaseActive2() {
  return getFirestoreDB2() !== null;
}

// server/services/LocalFileService.ts
import fs3 from "fs";
import path2 from "path";
var DB_FILE2 = path2.join(process.cwd(), "database.json");
var IS_PRODUCTION2 = process.env.NODE_ENV === "production";
function getInitialData() {
  return {
    invoices: [
      {
        id: "INV-2026-601",
        client: "Aarav Mehta",
        date: "2026-05-24",
        item: "Astral Prosperity Bracelet Combo",
        amount: 8400,
        status: "Paid",
        alignment: "Money Magnet (Citrine + Pyrite)"
      },
      {
        id: "INV-2026-602",
        client: "Priya Sharma",
        date: "2026-05-25",
        item: "Evil Eye Armour Ring Set",
        amount: 5900,
        status: "Sent",
        alignment: "Protection (Black Tourmaline)"
      },
      {
        id: "INV-2026-603",
        client: "Devas Astrographics",
        date: "2026-05-21",
        item: "Mass Calibration (12 Sacred Geodes)",
        amount: 48e3,
        status: "Paid",
        alignment: "Vedic Grid Alignment"
      },
      {
        id: "INV-2026-604",
        client: "Rohit Khandelwal",
        date: "2026-05-18",
        item: "Crown Clarity Amethyst Special",
        amount: 9500,
        status: "Overdue",
        alignment: "Saturn Node Alignment"
      },
      {
        id: "INV-2026-605",
        client: "Kiran Desai",
        date: "2026-05-26",
        item: "Chakra Awakening Gilded Bead Set",
        amount: 12500,
        status: "Draft",
        alignment: "Full Alignment"
      }
    ],
    vendors: [
      {
        id: "VND-301",
        name: "Himalayan Fine Quartz Co.",
        contact: "Harish Rawat",
        origin: "Uttarakhand, India",
        rating: 5,
        category: "Raw Geodes",
        leadTime: "3 Days",
        leadGems: "Clear Quartz & Citrine",
        status: "Approved"
      },
      {
        id: "VND-302",
        name: "Uruguayan Amethyst Miner's Guild",
        contact: "Lucas Silveira",
        origin: "Artigas, Uruguay",
        rating: 5,
        category: "Crystalline Clusters",
        leadTime: "14 Days",
        leadGems: "Deep Amethyst",
        status: "Approved"
      },
      {
        id: "VND-303",
        name: "Gilded Silver & Thread Artisans",
        contact: "Kavita Jewellers",
        origin: "Jaipur, India",
        rating: 4,
        category: "Mountings & Elastic Conductors",
        leadTime: "5 Days",
        leadGems: "925 Silver Links",
        status: "Under Review"
      },
      {
        id: "VND-304",
        name: "Ganges Water Sanctify Source",
        contact: "Pandit Shastri Ji",
        origin: "Rishikesh, India",
        rating: 5,
        category: "Sanctifying Liquids",
        leadTime: "2 Days",
        leadGems: "Panchamrut & Ganga Jal",
        status: "Approved"
      }
    ],
    expenses: [
      {
        id: "EXP-101",
        title: "Lunar Cleansing Sandalwood Paste",
        category: "Ritual Consecration",
        amount: 4200,
        date: "2026-05-20",
        notes: "Grown on organic farms in Mysore"
      },
      {
        id: "EXP-102",
        title: "Custom Velvet Protection Pouches",
        category: "Packaging",
        amount: 8500,
        date: "2026-05-22",
        notes: "Saffron-dyed lining for energetic insulation"
      },
      {
        id: "EXP-103",
        title: "Laboratory Geological Verification Fees",
        category: "Quality Inspection",
        amount: 12e3,
        date: "2026-05-24",
        notes: "Refractive Index and Mohs Hardness certification batch #411"
      },
      {
        id: "EXP-104",
        title: "Temple Astro-Scholars Commision",
        category: "Ritual Consecration",
        amount: 25e3,
        date: "2026-05-25",
        notes: "Bathing chant leaders over moon cycles"
      },
      {
        id: "EXP-105",
        title: "Ganga Jal Sacred Liquid Logistic Refills",
        category: "Sourcing & Shipping",
        amount: 6200,
        date: "2026-05-18",
        notes: "Pure glass canisters from Himalayan descent coordinates"
      }
    ],
    tasks: [
      {
        id: "TSK-501",
        title: "Wash Batch #409 Clear Quartz in Panchamrut",
        status: "Water Cleanse",
        priority: "High",
        assignee: "Pandit Sharma",
        daysLeft: 1
      },
      {
        id: "TSK-502",
        title: "Calibrate Amethyst beads with 432Hz Saturn frequencies",
        status: "Moon Bath Bathing",
        priority: "High",
        assignee: "Shastry Ji",
        daysLeft: 2
      },
      {
        id: "TSK-503",
        title: "Review laboratory hardness scores for Green Aventirine arrival",
        status: "Backlog",
        priority: "Medium",
        assignee: "Dr. Vivek Soni",
        daysLeft: 5
      },
      {
        id: "TSK-504",
        title: "Seal and pack Aarav Mehta Certified Prosperity Combo",
        status: "Sealed / Composed",
        priority: "Low",
        assignee: "Meera Patel",
        daysLeft: 0
      },
      {
        id: "TSK-505",
        title: "Program Solar Warmth on Carnelian material locks",
        status: "Moon Bath Bathing",
        priority: "Medium",
        assignee: "Shastry Ji",
        daysLeft: 1
      },
      {
        id: "TSK-506",
        title: "Verify signature holographic seals of Vedic certificate series 900",
        status: "Backlog",
        priority: "High",
        assignee: "Meera Patel",
        daysLeft: 3
      }
    ],
    terminalLog: [
      {
        id: "log-1",
        timestamp: "10:32 AM",
        message: "SECURE COGNITIVE LEDGER INITIALIZED: Welcome to Aura & Stone Central Operations."
      },
      {
        id: "log-2",
        timestamp: "10:45 AM",
        message: "RITUAL BATCH UPDATE COMPLETED: 12 Pure Citrine conductors advanced to lunar purification stage."
      },
      {
        id: "log-3",
        timestamp: "11:15 AM",
        message: "QUALITY CHECK SYSTEM VERIFICATION: Geologist verified Mohs index 7 on raw amethyst crystal bulk VND-302."
      }
    ],
    emailRecords: [],
    products: PRODUCTS,
    websiteContent: DEFAULT_WEBSITE_CONTENT,
    checkpoints: [],
    astroContent: []
  };
}
var LocalFileService = class {
  load() {
    if (IS_PRODUCTION2) {
      return getInitialData();
    }
    try {
      if (fs3.existsSync(DB_FILE2)) {
        const fileContent = fs3.readFileSync(DB_FILE2, "utf-8");
        const data = JSON.parse(fileContent);
        const initial = getInitialData();
        return { ...initial, ...data };
      }
    } catch (e) {
      logger.error({ err: e }, "Error reading database file, using defaults");
    }
    return getInitialData();
  }
  save(data) {
    if (IS_PRODUCTION2) return;
    try {
      fs3.writeFileSync(DB_FILE2, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      logger.error({ err: e }, "CRITICAL: Failed to write to database file");
    }
  }
  getCollection(collectionName) {
    return this.load()[collectionName];
  }
  setCollection(collectionName, data) {
    const db = this.load();
    db[collectionName] = data;
    this.save(db);
  }
  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => item.id === id) || null;
  }
  create(collectionName, item) {
    const items = this.getCollection(collectionName);
    items.unshift(item);
    this.setCollection(collectionName, items);
    return item;
  }
  update(collectionName, id, updates) {
    const items = this.getCollection(collectionName);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    this.setCollection(collectionName, items);
    return items[index];
  }
  delete(collectionName, id) {
    const items = this.getCollection(collectionName);
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setCollection(collectionName, filtered);
    return true;
  }
  bulkCreate(collectionName, items) {
    const existing = this.getCollection(collectionName);
    this.setCollection(collectionName, [...items, ...existing]);
    return items;
  }
  bulkDelete(collectionName, ids) {
    const items = this.getCollection(collectionName);
    const before = items.length;
    const filtered = items.filter((item) => !ids.includes(item.id));
    this.setCollection(collectionName, filtered);
    return before - filtered.length;
  }
};
var localFileService = new LocalFileService();

// server/services/RepositoryFactory.ts
var currentBackend = "local";
function getStorageBackend() {
  if (isFirebaseActive2()) {
    currentBackend = "firestore";
  } else {
    currentBackend = "local";
  }
  return currentBackend;
}
function generateId(collectionName) {
  const prefixes = {
    invoices: "INV",
    vendors: "VND",
    expenses: "EXP",
    tasks: "TSK",
    products: "PROD",
    astro_content: "ASTRO",
    checkpoints: "CHK",
    terminalLog: "LOG",
    emailRecords: "EMAIL"
  };
  const prefix = prefixes[collectionName] || "ID";
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function createFirestoreRepository(collectionName) {
  const db = getFirestoreDB2();
  if (!db) {
    logger.warn("Firestore not available, falling back to local");
    return createLocalRepository(collectionName);
  }
  const collection = db.collection(collectionName);
  return {
    async findAll() {
      const snapshot = await collection.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    async findById(id) {
      const doc = await collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    },
    async create(data) {
      const id = data.id || generateId(collectionName);
      const newData = { ...data, id };
      await collection.doc(id).set(newData);
      return newData;
    },
    async update(id, data) {
      const docRef = collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return null;
      await docRef.update(data);
      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() };
    },
    async delete(id) {
      const docRef = collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    },
    async bulkCreate(items) {
      const batch = db.batch();
      const results = [];
      for (const item of items) {
        const id = item.id || generateId(collectionName);
        const newItem = { ...item, id };
        batch.set(collection.doc(id), newItem);
        results.push(newItem);
      }
      await batch.commit();
      return results;
    },
    async bulkDelete(ids) {
      const batch = db.batch();
      for (const id of ids) {
        batch.delete(collection.doc(id));
      }
      await batch.commit();
      return ids.length;
    }
  };
}
function createLocalRepository(collectionName) {
  return {
    async findAll() {
      return localFileService.getCollection(
        collectionName
      );
    },
    async findById(id) {
      return localFileService.findById(
        collectionName,
        id
      );
    },
    async create(data) {
      return localFileService.create(
        collectionName,
        data
      );
    },
    async update(id, data) {
      return localFileService.update(
        collectionName,
        id,
        data
      );
    },
    async delete(id) {
      return localFileService.delete(
        collectionName,
        id
      );
    },
    async bulkCreate(items) {
      return localFileService.bulkCreate(
        collectionName,
        items
      );
    },
    async bulkDelete(ids) {
      return localFileService.bulkDelete(
        collectionName,
        ids
      );
    }
  };
}
function getRepository(collectionName) {
  const backend = getStorageBackend();
  logger.debug({ collectionName, backend }, "Using storage backend");
  if (backend === "firestore") {
    return createFirestoreRepository(collectionName);
  }
  return createLocalRepository(collectionName);
}

// server/services/domain/InvoiceService.ts
var COLLECTION = "invoices";
var invoiceService = {
  async findAll() {
    return getRepository(COLLECTION).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION).create(data);
    logger.info({ invoiceId: created.id, client: created.client }, "Invoice created");
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION).update(id, data);
    if (updated) {
      logger.info({ invoiceId: id, client: updated.client }, "Invoice updated");
    }
    return updated;
  },
  async delete(id) {
    const repo = getRepository(COLLECTION);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ invoiceId: id, client: existing?.client }, "Invoice deleted");
    }
    return deleted;
  },
  async bulkCreate(items) {
    const created = await getRepository(COLLECTION).bulkCreate(items);
    logger.info({ count: created.length }, "Invoices bulk created");
    return created;
  },
  async bulkDelete(ids) {
    const deleted = await getRepository(COLLECTION).bulkDelete(ids);
    logger.info({ count: deleted }, "Invoices bulk deleted");
    return deleted;
  }
};

// server/repositories/InvoiceRepository.ts
var invoiceRepository = invoiceService;

// server/services/domain/VendorService.ts
var COLLECTION2 = "vendors";
var vendorService = {
  async findAll() {
    return getRepository(COLLECTION2).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION2).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION2).create({
      ...data,
      rating: 5,
      status: "Approved"
    });
    logger.info({ vendorId: created.id, name: created.name }, "Vendor created");
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION2).update(id, data);
    if (updated) {
      logger.info({ vendorId: id, name: updated.name }, "Vendor updated");
    }
    return updated;
  },
  async delete(id) {
    const repo = getRepository(COLLECTION2);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ vendorId: id, name: existing?.name }, "Vendor deleted");
    }
    return deleted;
  },
  async bulkCreate(items) {
    const created = await getRepository(COLLECTION2).bulkCreate(
      items.map((item) => ({ ...item, rating: 5, status: "Approved" }))
    );
    logger.info({ count: created.length }, "Vendors bulk created");
    return created;
  },
  async bulkDelete(ids) {
    const deleted = await getRepository(COLLECTION2).bulkDelete(ids);
    logger.info({ count: deleted }, "Vendors bulk deleted");
    return deleted;
  }
};

// server/repositories/VendorRepository.ts
var vendorRepository = vendorService;

// server/services/domain/ExpenseService.ts
var COLLECTION3 = "expenses";
var expenseService = {
  async findAll() {
    return getRepository(COLLECTION3).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION3).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION3).create({
      ...data,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    logger.info(
      { expenseId: created.id, title: created.title, amount: created.amount },
      "Expense created"
    );
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION3).update(id, data);
    if (updated) {
      logger.info({ expenseId: id, title: updated.title }, "Expense updated");
    }
    return updated;
  },
  async delete(id) {
    const repo = getRepository(COLLECTION3);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ expenseId: id, title: existing?.title }, "Expense deleted");
    }
    return deleted;
  },
  async bulkCreate(items) {
    const created = await getRepository(COLLECTION3).bulkCreate(
      items.map((item) => ({ ...item, date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }))
    );
    logger.info({ count: created.length }, "Expenses bulk created");
    return created;
  },
  async bulkDelete(ids) {
    const deleted = await getRepository(COLLECTION3).bulkDelete(ids);
    logger.info({ count: deleted }, "Expenses bulk deleted");
    return deleted;
  }
};

// server/repositories/ExpenseRepository.ts
var expenseRepository = expenseService;

// server/services/domain/TaskService.ts
var COLLECTION4 = "tasks";
var taskService = {
  async findAll() {
    return getRepository(COLLECTION4).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION4).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION4).create(data);
    logger.info(
      { taskId: created.id, title: created.title, assignee: created.assignee },
      "Task created"
    );
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION4).update(id, data);
    if (updated) {
      logger.info({ taskId: id, title: updated.title }, "Task updated");
    }
    return updated;
  },
  async updateStatus(id, status) {
    return this.update(id, { status });
  },
  async delete(id) {
    const repo = getRepository(COLLECTION4);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ taskId: id, title: existing?.title }, "Task deleted");
    }
    return deleted;
  },
  async bulkCreate(items) {
    const created = await getRepository(COLLECTION4).bulkCreate(items);
    logger.info({ count: created.length }, "Tasks bulk created");
    return created;
  },
  async bulkDelete(ids) {
    const deleted = await getRepository(COLLECTION4).bulkDelete(ids);
    logger.info({ count: deleted }, "Tasks bulk deleted");
    return deleted;
  }
};

// server/repositories/TaskRepository.ts
var taskRepository = taskService;

// server/services/domain/ProductService.ts
var COLLECTION5 = "products";
var productService = {
  async findAll() {
    const repo = getRepository(COLLECTION5);
    const products = await repo.findAll();
    if (products.length === 0) {
      for (const p of PRODUCTS) {
        await repo.create(p);
      }
      return PRODUCTS;
    }
    return products;
  },
  async findById(id) {
    return getRepository(COLLECTION5).findById(id);
  },
  async create(data) {
    const repo = getRepository(COLLECTION5);
    const existing = await repo.findById(data.id);
    if (existing) {
      return repo.update(data.id, data);
    }
    const created = await repo.create(data);
    logger.info({ productId: created.id, name: created.name }, "Product created");
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION5).update(id, data);
    if (updated) {
      logger.info({ productId: id, name: updated.name }, "Product updated");
    }
    return updated;
  },
  async delete(id) {
    const repo = getRepository(COLLECTION5);
    const existing = await repo.findById(id);
    const deleted = await repo.delete(id);
    if (deleted) {
      logger.info({ productId: id, name: existing?.name }, "Product deleted");
    }
    return deleted;
  },
  async save(product) {
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION5).doc(product.id).set(product);
        logger.info({ productId: product.id, name: product.name }, "Product saved to Firestore");
        return product;
      } catch (e) {
        logger.error(
          { err: e, productId: product.id },
          "Firestore saveProduct error, falling back to local"
        );
      }
    }
    const repo = getRepository(COLLECTION5);
    const existing = await repo.findById(product.id);
    if (existing) {
      return repo.update(product.id, product);
    }
    return repo.create(product);
  }
};

// server/repositories/ProductRepository.ts
var productRepository = productService;

// server/services/domain/WebsiteContentService.ts
var COLLECTION6 = "websiteContent";
var websiteContentService = {
  async findAll() {
    const repo = getRepository(COLLECTION6);
    const content = await repo.findAll();
    return content[0] || DEFAULT_WEBSITE_CONTENT;
  },
  async findById(id) {
    return getRepository(COLLECTION6).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION6).create({
      ...DEFAULT_WEBSITE_CONTENT,
      ...data,
      id: "homepage"
    });
    logger.info("Website content created");
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION6).update(
      id,
      data
    );
    if (updated) {
      logger.info({ contentId: id }, "Website content updated");
    }
    return updated;
  },
  async save(data) {
    const fullData = { ...DEFAULT_WEBSITE_CONTENT, ...data };
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION6).doc("homepage").set(fullData);
        logger.info("Website content saved to Firestore");
        return fullData;
      } catch (e) {
        logger.error({ err: e }, "Firestore saveWebsiteContent error, falling back to local");
      }
    }
    const repo = getRepository(COLLECTION6);
    const existing = await repo.findAll();
    if (existing && existing[0]?.id) {
      return repo.update(existing[0].id, fullData);
    }
    return repo.create({ ...fullData, id: "homepage" });
  }
};

// server/repositories/WebsiteContentRepository.ts
var websiteContentRepository = websiteContentService;

// server/services/domain/AstroContentService.ts
var COLLECTION7 = "astroContent";
var astroContentService = {
  async findAll() {
    return getRepository(COLLECTION7).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION7).findById(id);
  },
  async create(data) {
    const created = await getRepository(COLLECTION7).create({
      ...data,
      id: `astro-${data.type}-${data.key}-${Date.now()}`,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    logger.info(
      { astroContentId: created.id, type: created.type, key: created.key },
      "Astro content created"
    );
    return created;
  },
  async update(id, data) {
    const updated = await getRepository(COLLECTION7).update(id, {
      ...data,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (updated) {
      logger.info({ astroContentId: id }, "Astro content updated");
    }
    return updated;
  },
  async delete(id) {
    const deleted = await getRepository(COLLECTION7).delete(id);
    if (deleted) {
      logger.info({ astroContentId: id }, "Astro content deleted");
    }
    return deleted;
  },
  async bulkCreate(entries) {
    const created = await getRepository(COLLECTION7).bulkCreate(
      entries.map((entry) => ({
        ...entry,
        id: `astro-${entry.type}-${entry.key}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }))
    );
    logger.info({ count: created.length }, "Astro content bulk created");
    return created;
  }
};

// server/repositories/AstroContentRepository.ts
var astroContentRepository = astroContentService;

// server/services/domain/LogService.ts
var COLLECTION8 = "logs";
var logService = {
  async findAll() {
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        const snapshot = await fdb.collection(COLLECTION8).orderBy("id", "desc").limit(10).get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
        logger.error({ err: e }, "Firestore getLogs failure, falling back to local");
      }
    }
    const repo = getRepository(COLLECTION8);
    return repo.findAll();
  },
  async create(message) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const logId = `log-${Date.now()}`;
    const newLog = { id: logId, timestamp, message };
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION8).doc(logId).set(newLog);
        return newLog;
      } catch (e) {
        logger.error({ err: e }, "Firestore addLog failure, falling back to local");
      }
    }
    const repo = getRepository(COLLECTION8);
    await repo.create(newLog);
    return newLog;
  }
};

// server/repositories/LogRepository.ts
var logRepository = logService;

// server/services/domain/EmailRecordService.ts
var COLLECTION9 = "emailRecords";
var emailRecordService = {
  async findAll() {
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        const snapshot = await fdb.collection(COLLECTION9).orderBy("id", "desc").limit(50).get();
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
        logger.error({ err: e }, "Firestore getEmailRecords failure, falling back to local");
      }
    }
    const repo = getRepository(COLLECTION9);
    return repo.findAll();
  },
  async create(data) {
    const id = `email-${Date.now()}`;
    const newRecord = { ...data, id };
    const fdb = getFirestoreDB2();
    if (fdb) {
      try {
        await fdb.collection(COLLECTION9).doc(id).set(newRecord);
        return newRecord;
      } catch (e) {
        logger.error({ err: e }, "Firestore addEmailRecord failure, falling back to local");
      }
    }
    const repo = getRepository(COLLECTION9);
    await repo.create(newRecord);
    return newRecord;
  }
};

// server/repositories/EmailRecordRepository.ts
var emailRecordRepository = emailRecordService;

// server/services/domain/CheckpointService.ts
var COLLECTION10 = "checkpoints";
var MAX_CHECKPOINTS = 25;
var checkpointService = {
  async findAll() {
    return getRepository(COLLECTION10).findAll();
  },
  async findById(id) {
    return getRepository(COLLECTION10).findById(id);
  },
  async create(title, user) {
    const websiteContent = await websiteContentService.findAll();
    const products = await productService.findAll();
    const checkpoint = {
      id: `chk-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      title: title || "Periodic Operational Checkpoint",
      user,
      websiteContent,
      products
    };
    const created = await getRepository(COLLECTION10).create(checkpoint);
    await this.cleanupOldCheckpoints();
    logger.info({ checkpointId: created.id, title: created.title }, "Checkpoint created");
    return created;
  },
  async rollback(id) {
    const checkpoint = await this.findById(id);
    if (!checkpoint) {
      throw new Error(`Checkpoint with ID "${id}" not found`);
    }
    await websiteContentService.save(checkpoint.websiteContent);
    const repo = getRepository("products");
    const existingProducts = await repo.findAll();
    for (const product of existingProducts) {
      await repo.delete(product.id);
    }
    for (const product of checkpoint.products) {
      await repo.create(product);
    }
    logger.info({ checkpointId: id, title: checkpoint.title }, "Rollback completed");
    return true;
  },
  async cleanupOldCheckpoints() {
    const checkpoints = await this.findAll();
    if (checkpoints.length > MAX_CHECKPOINTS) {
      const toDelete = checkpoints.slice(MAX_CHECKPOINTS).map((c) => c.id);
      await getRepository(COLLECTION10).bulkDelete(toDelete);
    }
  },
  async delete(id) {
    return getRepository(COLLECTION10).delete(id);
  }
};

// server/repositories/CheckpointRepository.ts
var checkpointRepository = checkpointService;

// server/routes/astro.routes.ts
var router2 = Router2();
var astroContentCreateSchema = z2.object({
  type: z2.enum(["planet", "ascendant", "aspect", "nakshatra"]),
  key: z2.string().min(1).max(100),
  title: z2.string().min(1).max(200),
  interpretation: z2.string().min(1).max(1e4),
  updatedBy: z2.string().email().optional()
});
var astroContentUpdateSchema = astroContentCreateSchema.partial();
var astroContentBulkCreateSchema = z2.object({
  entries: z2.array(astroContentCreateSchema).min(1)
});
router2.get("/", authenticateToken, async (_req, res) => {
  try {
    const entries = await astroContentRepository.findAll();
    res.json(entries);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
router2.post(
  "/",
  authenticateToken,
  validate(astroContentCreateSchema),
  async (req, res) => {
    try {
      const entry = await astroContentRepository.create(req.body);
      res.status(200).json(entry);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router2.put(
  "/:id",
  authenticateToken,
  validate(astroContentUpdateSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing content ID." });
        return;
      }
      const entry = await astroContentRepository.update(id, req.body);
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ error: "Content not found." });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router2.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing content ID." });
      return;
    }
    await astroContentRepository.delete(id);
    res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
router2.post(
  "/bulk-seed",
  authenticateToken,
  validate(astroContentBulkCreateSchema),
  async (req, res) => {
    try {
      const { entries } = req.body;
      const created = await astroContentRepository.bulkCreate(entries);
      res.status(200).json({ created: created.length, entries: created });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
var astro_routes_default = router2;

// server/routes/auth.routes.ts
import { Router as Router3 } from "express";

// server/config.ts
var DEFAULT_ADMIN_EMAIL = "debarghapakhira@gmail.com";
function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
}

// server/middleware/asyncHandler.ts
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// server/routes/auth.routes.ts
var router3 = Router3();
router3.post(
  "/google-login",
  asyncHandler(async (req, res) => {
    const { email, uid, displayName } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Google email coordinate is required." });
    }
    const emailLower = email.toLowerCase();
    if (emailLower !== getAdminEmail()) {
      await DB.addLog(
        `SECURITY AUDIT FAILURE: Unauthorized Google login attempt made by "${emailLower}".`
      );
      return res.status(403).json({ error: `Access Denied: ${getAdminEmail()} is the only authorized account.` });
    }
    const token = signToken2({
      id: uid || "google-admin-id",
      username: emailLower,
      email: emailLower,
      role: "admin"
    });
    await DB.addLog(
      `STAFF LOG IN: Google Sign-In completed for "${emailLower}" (${displayName || "N/A"}).`
    );
    return res.json({ token, role: "admin", username: emailLower });
  })
);
var auth_routes_default = router3;

// server/routes/expense.routes.ts
import { Router as Router4 } from "express";
import { z as z3 } from "zod";
var router4 = Router4();
var expenseCreateSchema = z3.object({
  title: z3.string().min(1).max(200),
  category: z3.string().max(100).optional(),
  amount: z3.number().int().positive(),
  notes: z3.string().max(1e3).optional()
});
var expenseUpdateSchema = expenseCreateSchema.partial();
var expenseBatchCreateSchema = z3.object({
  items: z3.array(expenseCreateSchema).min(1)
});
var expenseBatchDeleteSchema = z3.object({
  ids: z3.array(z3.string().min(1)).min(1)
});
router4.get(
  "/",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const expenses = await expenseRepository.findAll();
    res.json(expenses);
  })
);
router4.post(
  "/",
  authenticateToken,
  validate(expenseCreateSchema),
  asyncHandler(async (req, res) => {
    const expense = await expenseRepository.create(req.body);
    res.status(201).json(expense);
  })
);
router4.post(
  "/batch",
  authenticateToken,
  validate(expenseBatchCreateSchema),
  asyncHandler(async (req, res) => {
    const { items } = req.body;
    const created = await expenseRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  })
);
router4.put(
  "/:id",
  authenticateToken,
  validate(expenseUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing expense ID." });
      return;
    }
    const updated = await expenseRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Expense not found." });
    }
  })
);
router4.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing expense ID." });
      return;
    }
    const success = await expenseRepository.delete(id);
    if (success) {
      res.json({ message: "Expense records successfully archived." });
    } else {
      res.status(404).json({ error: "Expense not found." });
    }
  })
);
router4.delete(
  "/batch",
  authenticateToken,
  validate(expenseBatchDeleteSchema),
  asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const deleted = await expenseRepository.bulkDelete(ids);
    res.json({ deleted, total: ids.length });
  })
);
var expense_routes_default = router4;

// server/routes/invoice.routes.ts
import { Router as Router5 } from "express";
import { z as z4 } from "zod";
var router5 = Router5();
var invoiceCreateSchema = z4.object({
  client: z4.string().min(1).max(200),
  item: z4.string().max(500).optional(),
  amount: z4.number().int().positive(),
  status: z4.enum(["Paid", "Sent", "Overdue", "Draft"]).optional(),
  alignment: z4.string().max(200).optional()
});
var invoiceUpdateSchema = invoiceCreateSchema.partial();
var invoiceBatchCreateSchema = z4.object({
  items: z4.array(invoiceCreateSchema).min(1)
});
var invoiceBatchDeleteSchema = z4.object({
  ids: z4.array(z4.string().min(1)).min(1)
});
router5.get(
  "/",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const invoices = await invoiceRepository.findAll();
    res.json(invoices);
  })
);
router5.post(
  "/",
  authenticateToken,
  validate(invoiceCreateSchema),
  asyncHandler(async (req, res) => {
    const invoice = await invoiceRepository.create(req.body);
    res.status(201).json(invoice);
  })
);
router5.post(
  "/batch",
  authenticateToken,
  validate(invoiceBatchCreateSchema),
  asyncHandler(async (req, res) => {
    const { items } = req.body;
    const created = await invoiceRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  })
);
router5.put(
  "/:id",
  authenticateToken,
  validate(invoiceUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing invoice ID." });
      return;
    }
    const updated = await invoiceRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Invoice not found." });
    }
  })
);
router5.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing invoice ID." });
      return;
    }
    const success = await invoiceRepository.delete(id);
    if (success) {
      res.json({ message: "Invoice successfully pruned." });
    } else {
      res.status(404).json({ error: "Invoice not found." });
    }
  })
);
router5.delete(
  "/batch",
  authenticateToken,
  validate(invoiceBatchDeleteSchema),
  asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const deleted = await invoiceRepository.bulkDelete(ids);
    res.json({ deleted, total: ids.length });
  })
);
var invoice_routes_default = router5;

// server/routes/openapi.routes.ts
import { Router as Router6 } from "express";
import swaggerUi from "swagger-ui-express";

// server/openapi.ts
var openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Aura & Stone API",
    version: "1.0.0",
    description: "API for Aura & Stone - Vedic Crystal Astrology E-commerce",
    contact: {
      name: "Aura & Stone",
      email: "operations@aurastone.in"
    }
  },
  servers: [
    {
      url: "/api",
      description: "API Base Path"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
      csrfToken: {
        type: "apiKey",
        in: "header",
        name: "X-CSRF-Token"
      }
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          originalPrice: { type: "integer" },
          salePrice: { type: "integer" },
          rating: { type: "number" },
          reviewsCount: { type: "integer" },
          description: { type: "string" },
          shortDescription: { type: "string" },
          benefits: { type: "array", items: { type: "string" } },
          crystalsUsed: { type: "array", items: { type: "string" } },
          imageUrl: { type: "string", format: "uri" },
          videoUrl: { type: "string", format: "uri", nullable: true },
          category: { type: "string", enum: ["bracelet", "ring", "combo", "zodiac"] },
          stockStatus: { type: "string", enum: ["in-stock", "low-stock", "pre-order"] },
          zodiacConnection: { type: "array", items: { type: "string" } },
          isBestSeller: { type: "boolean" },
          specifications: {
            type: "object",
            properties: {
              beadSize: { type: "string" },
              beadCount: { type: "integer" },
              threadMaterial: { type: "string" },
              origin: { type: "string" },
              chargeTime: { type: "string" }
            }
          }
        }
      },
      Invoice: {
        type: "object",
        properties: {
          id: { type: "string" },
          client: { type: "string" },
          date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          item: { type: "string" },
          amount: { type: "integer" },
          status: { type: "string", enum: ["Paid", "Sent", "Overdue", "Draft"] },
          alignment: { type: "string" }
        }
      },
      Vendor: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          contact: { type: "string" },
          origin: { type: "string" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          category: { type: "string" },
          leadTime: { type: "string" },
          leadGems: { type: "string" },
          status: { type: "string", enum: ["Approved", "Under Review", "Suspended"] }
        }
      },
      Expense: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          category: { type: "string" },
          amount: { type: "integer" },
          date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
          notes: { type: "string" }
        }
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          status: {
            type: "string",
            enum: ["Backlog", "Water Cleanse", "Moon Bath Bathing", "Sealed / Composed"]
          },
          priority: { type: "string", enum: ["Low", "Medium", "High"] },
          assignee: { type: "string" },
          daysLeft: { type: "integer" }
        }
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/products": {
      get: {
        summary: "Get all products",
        responses: {
          "200": {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" }
            }
          }
        },
        responses: {
          "201": {
            description: "Product created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" }
              }
            }
          }
        }
      }
    },
    "/invoices": {
      get: {
        summary: "Get all invoices",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "List of invoices",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Invoice" }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create an invoice",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["client", "amount"],
                properties: {
                  client: { type: "string" },
                  item: { type: "string" },
                  amount: { type: "integer" },
                  status: { type: "string", enum: ["Paid", "Sent", "Overdue", "Draft"] },
                  alignment: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Invoice created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Invoice" }
              }
            }
          }
        }
      }
    },
    "/ai/recommendations": {
      post: {
        summary: "Get AI product recommendations",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userBirthDetails"],
                properties: {
                  userBirthDetails: {
                    type: "object",
                    required: ["name", "birthDate"],
                    properties: {
                      name: { type: "string" },
                      birthDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                      birthTime: { type: "string" },
                      birthPlace: { type: "string" }
                    }
                  },
                  currentCart: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        category: { type: "string" },
                        crystalsUsed: { type: "array", items: { type: "string" } }
                      }
                    }
                  },
                  purchaseHistory: { type: "array", items: { type: "string" } },
                  userPreferences: {
                    type: "object",
                    properties: {
                      budget: { type: "string", enum: ["low", "medium", "high"] },
                      style: { type: "string", enum: ["minimal", "statement", "spiritual"] },
                      intent: {
                        type: "string",
                        enum: [
                          "wealth",
                          "protection",
                          "health",
                          "relationships",
                          "career",
                          "general"
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "AI recommendations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/ai/chatbot": {
      post: {
        summary: "Chat with AI assistant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  message: { type: "string" },
                  conversationHistory: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", enum: ["user", "assistant"] },
                        content: { type: "string" }
                      }
                    }
                  },
                  userContext: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      isAuthenticated: { type: "boolean" },
                      cartItems: { type: "integer" },
                      currentPage: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Chatbot response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// server/routes/openapi.routes.ts
var router6 = Router6();
router6.get("/spec", (_req, res) => {
  res.json(openApiSpec);
});
router6.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Aura & Stone API Documentation"
  })
);
var openapi_routes_default = router6;

// server/routes/payment.routes.ts
import crypto3 from "crypto";
import { Router as Router7 } from "express";

// server/services/email.ts
import nodemailer from "nodemailer";
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}
async function sendFulfillmentEmail(clientEmail, clientName, itemsDescription, orderId) {
  const transporter = getMailTransporter();
  const subject = `\u26A1 Consecration Cycle Initialized - Aura & Stone (Order #${orderId})`;
  const textContent = `Greetings ${clientName},

Your payment has been successfully secured. The 3-Nights Purification & Consecration Cycle has been initialized for your items: ${itemsDescription}.

Himalayan Sourcing Coordinates: Jammu, India.
Certification code: SGD-${orderId}.

Deep regards,
Aura & Stone Private Ltd.`;
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 24px; color: #1C1917; background-color: #FAF7F2; border-radius: 16px; border: 1px solid #EAE6DF; max-width: 600px; margin: 0 auto;">
      <h2 style="font-family: serif; font-size: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; color: #151313; text-transform: uppercase; letter-spacing: 0.05em;">
        Divine Consecration Chamber
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
        Greetings <strong>${clientName}</strong>,
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #44403C;">
        Your transaction for Order <strong>#${orderId}</strong> has cleared checkout. Your chosen items have been moved into our sacred Himalayan purification chamber:
      </p>
      <blockquote style="background-color: #FDFBF7; border-left: 4px solid #D4AF37; padding: 12px; margin: 16px 0; font-size: 13px; font-style: italic; color: #57534E;">
        ${itemsDescription}
      </blockquote>
      <p style="font-size: 12px; line-height: 1.6; color: #57534E;">
        Over the next 3 nights, Pandit Sharma and Shastri Ji will wash your materials in organic Panchamrut flows, immerse them under moon bathing frequencies, and align their mineral lattices with high-precision 432Hz Saturn and Jupiter acoustic vibrations.
      </p>
      <div style="background-color: #151313; color: #D4AF37; font-family: monospace; font-size: 11px; padding: 10px; border-radius: 8px; margin-top: 16px; text-align: center; border: 1px solid #D4AF37/20;">
        CERTIFICATES SERIES SECURED: CODE SGD-${orderId.substring(6, 12)}
      </div>
      <p style="font-size: 12px; margin-top: 24px; color: #857F75; text-align: center; border-top: 1px solid #EAE6DF; padding-top: 12px;">
        Aura & Stone Private Ltd. \u2022 Central Operations \u2022 Rishikesh, Uttarakhand, India
      </p>
    </div>
  `;
  if (transporter) {
    try {
      await transporter.sendMail({
        from: '"Aura & Stone Operations" <operations@aurastone.in>',
        to: clientEmail,
        subject,
        text: textContent,
        html: htmlContent
      });
      await DB.addLog(
        `TRANSACTIONAL EMAIL DESPATCHED: Verification notice sent to client ${clientEmail}`
      );
    } catch (err) {
      logger.error({ err }, "Email dispatch error");
      await DB.addLog(`EMAIL ANOMALY: Failed to dispatch real SMTP transmission.`);
    }
  } else {
    logger.info(`[SMTP SIMULATION] sending email to ${clientEmail}`);
    await DB.addLog(`EMAIL SIMULATOR INTERACTION: Mock receipt transmitted to: ${clientEmail}`);
  }
}

// server/routes/payment.routes.ts
var router7 = Router7();
router7.post(
  "/razorpay/order",
  asyncHandler(async (req, res) => {
    const {
      amount,
      currency = "INR",
      receiptEmail,
      clientName,
      cartItems
    } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Total amount is required for setting up order tunnels." });
      return;
    }
    const orderId = "order_" + crypto3.randomBytes(6).toString("hex");
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (razorpayKeyId && razorpaySecret) {
      const authString = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString("base64");
      try {
        const apiResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency,
            receipt: "rec_" + Date.now().toString().slice(-6),
            notes: {
              clientName,
              clientEmail: receiptEmail,
              itemsDescription: cartItems || "High-Precision Consecration Curation Bundle"
            }
          })
        });
        if (!apiResponse.ok) {
          throw new Error("Failure during remote Razorpay initialization.");
        }
        const orderData = await apiResponse.json();
        await DB.addLog(`RAZORPAY LIVE: Registered order ${orderData.id} for \u20B9${amount}`);
        return res.status(201).json(orderData);
      } catch (err) {
        logger.error({ err }, "Razorpay processing exception");
        await DB.addLog(
          "RAZORPAY EXCEPTION: Live channel failover. Generating sandboxed transaction."
        );
      }
    }
    await DB.addLog(`RAZORPAY SANDBOX: Allocated checkout reference ${orderId} for \u20B9${amount}`);
    res.status(201).json({
      id: orderId,
      entity: "order",
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: "rec_" + Date.now().toString().slice(-6),
      status: "created",
      notes: {
        clientName,
        clientEmail: receiptEmail,
        itemsDescription: cartItems || "Sandboxed Curation Package"
      },
      created_at: Math.floor(Date.now() / 1e3)
    });
    return;
  })
);
router7.post(
  "/razorpay/webhook",
  asyncHandler(async (req, res) => {
    const signatureHeader = req.headers["x-razorpay-signature"];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "sacred_webhook7592_signature";
    if (!signature) {
      res.status(400).json({ error: "Missing security signature block." });
      return;
    }
    let isSignatureValid = false;
    try {
      const rawBodyBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));
      const hmac = crypto3.createHmac("sha256", razorpaySecret);
      hmac.update(rawBodyBuffer);
      const expectedSignature = hmac.digest("hex");
      isSignatureValid = crypto3.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      isSignatureValid = false;
    }
    const isBypassActive = process.env.NODE_ENV === "development" && signature === "bypass_test_mode";
    if (!isSignatureValid && !isBypassActive) {
      await DB.addLog("CRITICAL: Unauthorized signature received on payment webhook.");
      res.status(403).json({ error: "Signature failure. Connection unauthorized." });
      return;
    }
    const body = req.body;
    const event = body?.event;
    const payload = body?.payload;
    if (event === "payment.captured" || event === "simulated.payment.captured" || isBypassActive) {
      const paymentEntity = payload?.payment?.entity || {};
      const razorpayOrderId = paymentEntity.order_id || "order_sandbox_re";
      const amountPaidInRupees = (paymentEntity.amount || body?.amount || 1e4) / 100;
      const clientName = paymentEntity.notes?.clientName ?? body?.clientName ?? "Vrishabha Devotee";
      const clientEmail = paymentEntity.notes?.clientEmail ?? body?.receiptEmail ?? "operations@aurastone.in";
      const itemNames = paymentEntity.notes?.itemsDescription ?? body?.cartItems ?? "Planetary Crystal Alignment Package";
      await DB.addLog(
        `WEBHOOK TRANSACTION VERIFIED: Secured Order ID ${razorpayOrderId} (\u20B9${amountPaidInRupees})`
      );
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      await DB.addInvoice({
        client: clientName,
        date: today,
        item: itemNames,
        amount: amountPaidInRupees,
        status: "Paid",
        alignment: "Secured via Razorpay Secure checkout Gateway"
      });
      await DB.addTask({
        title: `Sanctify crystals for order: ${razorpayOrderId} (${clientName})`,
        status: "Water Cleanse",
        priority: "High",
        assignee: "Pandit Sharma",
        daysLeft: 3
      });
      await sendFulfillmentEmail(clientEmail, clientName, itemNames, razorpayOrderId);
      res.json({
        status: "success",
        message: "Fulfillment sequence synced",
        orderId: razorpayOrderId
      });
      return;
    }
    res.json({ status: "ignored", event });
  })
);
var payment_routes_default = router7;

// server/routes/product.routes.ts
import { Router as Router8 } from "express";
import { z as z5 } from "zod";
var router8 = Router8();
var productCreateSchema = z5.object({
  id: z5.string().min(1),
  name: z5.string().min(1).max(200),
  originalPrice: z5.number().int().positive(),
  salePrice: z5.number().int().positive(),
  rating: z5.number().min(0).max(5),
  reviewsCount: z5.number().int().nonnegative(),
  description: z5.string().min(1),
  shortDescription: z5.string().min(1).max(500),
  benefits: z5.array(z5.string().min(1)).min(1),
  crystalsUsed: z5.array(z5.string().min(1)).min(1),
  imageUrl: z5.union([z5.string().url(), z5.string().startsWith("/")]),
  videoUrl: z5.union([z5.string().url(), z5.string().startsWith("/")]).optional(),
  category: z5.enum(["bracelet", "ring", "combo", "zodiac"]),
  stockStatus: z5.enum(["in-stock", "low-stock", "pre-order"]),
  zodiacConnection: z5.array(z5.string()).optional(),
  isBestSeller: z5.boolean().optional(),
  specifications: z5.object({
    beadSize: z5.string().optional(),
    beadCount: z5.number().int().positive().optional(),
    threadMaterial: z5.string().optional(),
    origin: z5.string().optional(),
    chargeTime: z5.string().optional()
  })
});
var productUpdateSchema = productCreateSchema.partial();
router8.get("/", async (_req, res) => {
  try {
    const products = await productRepository.findAll();
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
router8.post(
  "/",
  authenticateToken,
  validate(productCreateSchema),
  async (req, res) => {
    try {
      const product = await productRepository.create(req.body);
      res.status(200).json(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router8.put(
  "/:id",
  authenticateToken,
  validate(productUpdateSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing product ID." });
        return;
      }
      const product = await productRepository.update(id, req.body);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router8.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing product ID." });
      return;
    }
    const success = await productRepository.delete(id);
    if (success) {
      res.json({ message: "Product deleted." });
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
var product_routes_default = router8;

// server/routes/system.routes.ts
import { Router as Router9 } from "express";
import { z as z6 } from "zod";
var router9 = Router9();
var emailRecordCreateSchema = z6.object({
  clientName: z6.string().max(200).optional(),
  email: z6.string().email(),
  subject: z6.string().min(1).max(500)
});
router9.get("/csrf-token", (req, res) => {
  const token = req.csrfToken?.();
  res.json({ csrfToken: token || "" });
});
router9.get(
  "/logs",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const logs = await logRepository.findAll();
    res.json(logs);
  })
);
router9.get(
  "/email-records",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const records = await emailRecordRepository.findAll();
    res.json(records);
  })
);
router9.post(
  "/email-records",
  authenticateToken,
  validate(emailRecordCreateSchema),
  asyncHandler(async (req, res) => {
    const record = await emailRecordRepository.create(req.body);
    res.status(201).json(record);
  })
);
var system_routes_default = router9;

// server/routes/task.routes.ts
import { Router as Router10 } from "express";
import { z as z7 } from "zod";
var router10 = Router10();
var taskCreateSchema = z7.object({
  title: z7.string().min(1).max(300),
  status: z7.enum(["Backlog", "Water Cleanse", "Moon Bath Bathing", "Sealed / Composed"]).optional(),
  priority: z7.enum(["Low", "Medium", "High"]).optional(),
  assignee: z7.string().min(1).max(100),
  daysLeft: z7.number().int().nonnegative().optional()
});
var taskUpdateSchema = taskCreateSchema.partial();
var taskStatusUpdateSchema = z7.object({
  status: z7.enum(["Backlog", "Water Cleanse", "Moon Bath Bathing", "Sealed / Composed"])
});
router10.get(
  "/",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const tasks = await taskRepository.findAll();
    res.json(tasks);
  })
);
router10.post(
  "/",
  authenticateToken,
  validate(taskCreateSchema),
  asyncHandler(async (req, res) => {
    const task = await taskRepository.create(req.body);
    res.status(201).json(task);
  })
);
router10.put(
  "/:id",
  authenticateToken,
  validate(taskUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing task ID." });
      return;
    }
    const updated = await taskRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  })
);
router10.put(
  "/:id/status",
  authenticateToken,
  validate(taskStatusUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing task ID." });
      return;
    }
    const updatedTask = await taskRepository.updateStatus(id, req.body.status);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  })
);
router10.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing task ID." });
      return;
    }
    const success = await taskRepository.delete(id);
    if (success) {
      res.json({ message: "Task resolved/archived." });
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  })
);
var task_routes_default = router10;

// server/routes/vendor.routes.ts
import { Router as Router11 } from "express";
import { z as z8 } from "zod";
var router11 = Router11();
var vendorCreateSchema = z8.object({
  name: z8.string().min(1).max(200),
  contact: z8.string().min(1).max(200),
  origin: z8.string().max(200).optional(),
  category: z8.string().max(100).optional(),
  leadTime: z8.string().max(50).optional(),
  leadGems: z8.string().max(200).optional()
});
var vendorUpdateSchema = vendorCreateSchema.partial().extend({
  rating: z8.number().int().min(1).max(5).optional(),
  status: z8.enum(["Approved", "Under Review", "Suspended"]).optional()
});
var vendorBatchCreateSchema = z8.object({
  items: z8.array(vendorCreateSchema).min(1)
});
router11.get(
  "/",
  authenticateToken,
  asyncHandler(async (_req, res) => {
    const vendors = await vendorRepository.findAll();
    res.json(vendors);
  })
);
router11.post(
  "/",
  authenticateToken,
  validate(vendorCreateSchema),
  asyncHandler(async (req, res) => {
    const vendor = await vendorRepository.create(req.body);
    res.status(201).json(vendor);
  })
);
router11.post(
  "/batch",
  authenticateToken,
  validate(vendorBatchCreateSchema),
  asyncHandler(async (req, res) => {
    const { items } = req.body;
    const created = await vendorRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  })
);
router11.put(
  "/:id",
  authenticateToken,
  validate(vendorUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing vendor ID." });
      return;
    }
    const updated = await vendorRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Vendor not found." });
    }
  })
);
router11.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Missing vendor ID." });
      return;
    }
    const success = await vendorRepository.delete(id);
    if (success) {
      res.json({ message: "Vendor registration successfully suspended." });
    } else {
      res.status(404).json({ error: "Vendor not found." });
    }
  })
);
var vendor_routes_default = router11;

// server/routes/website.routes.ts
import { Router as Router12 } from "express";
import { z as z9 } from "zod";
var router12 = Router12();
var websiteContentSchema = z9.object({
  brandName: z9.string().min(1).max(100),
  brandSubtitle: z9.string().min(1).max(100),
  heroHeadline: z9.string().min(1).max(100),
  heroHighlight: z9.string().min(1).max(100),
  heroParagraph: z9.string().min(1).max(1e3),
  founderQuote: z9.string().min(1).max(2e3),
  founderQuoteSubtitle: z9.string().min(1).max(200),
  historyHeadline: z9.string().min(1).max(200),
  historyParagraph1: z9.string().min(1).max(2e3),
  historyParagraph2: z9.string().min(1).max(2e3),
  bannerImage: z9.union([z9.string().url(), z9.string().startsWith("/")])
});
var checkpointCreateSchema = z9.object({
  title: z9.string().min(1).max(200).optional()
});
router12.get("/content", async (_req, res) => {
  try {
    const content = await websiteContentRepository.findAll();
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
router12.post(
  "/content",
  authenticateToken,
  validate(websiteContentSchema),
  async (req, res) => {
    try {
      const content = await websiteContentRepository.save(req.body);
      res.status(200).json(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router12.get(
  "/checkpoints",
  authenticateToken,
  async (_req, res) => {
    try {
      const checkpoints = await checkpointRepository.findAll();
      res.json(checkpoints);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router12.post(
  "/checkpoints",
  authenticateToken,
  validate(checkpointCreateSchema),
  async (req, res) => {
    try {
      const { title } = req.body;
      const user = req.user?.username || "debarghapakhira@gmail.com";
      const checkpoint = await checkpointRepository.create(title, user);
      res.status(201).json(checkpoint);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
router12.post(
  "/checkpoints/:id/rollback",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: "Missing checkpoint ID." });
        return;
      }
      await checkpointRepository.rollback(id);
      res.json({ message: "Rollback succeeded." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: message });
    }
  }
);
var website_routes_default = router12;

// server/app.ts
var app = express();
var allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : void 0
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"]
  })
);
var isDev = process.env.NODE_ENV !== "production";
app.use(
  helmet({
    contentSecurityPolicy: isDev ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://*.googleapis.com"],
        frameSrc: ["'self'", "https://checkout.razorpay.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);
app.set("trust proxy", 1);
app.use(requestId);
app.use(requestLogger);
app.use(
  express.json({
    limit: "100kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
function getCookieSecret() {
  const cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET;
  if (!cookieSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "COOKIE_SECRET or JWT_SECRET must be set in production. Refusing to start with a default cookie secret."
      );
    }
    logger.warn(
      "\u26A0\uFE0F  COOKIE_SECRET/JWT_SECRET not set. Falling back to insecure development cookie secret."
    );
    return "aurastone-dev-cookie-secret-change-in-production-please";
  }
  return cookieSecret;
}
var cookieParserInitialized = false;
function ensureCookieParser() {
  if (!cookieParserInitialized) {
    const finalCookieSecret = getCookieSecret();
    app.use(cookieParser(finalCookieSecret));
    cookieParserInitialized = true;
  }
}
var CSRF_EXEMPT_PATHS = /* @__PURE__ */ new Set(["/api/payments/razorpay/webhook"]);
var csrfProtectionInitialized = false;
function ensureCsrfProtection() {
  if (!csrfProtectionInitialized) {
    const csrfProtection = createCsrfProtection({
      cookieSecret: getCookieSecret(),
      exemptPaths: CSRF_EXEMPT_PATHS
    });
    app.use(csrfProtection);
    csrfProtectionInitialized = true;
  }
}
app.use((req, res, next) => {
  ensureCookieParser();
  ensureCsrfProtection();
  next();
});
initRedisRateLimiter();
if (isFirebaseActive()) {
  logger.info("SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.");
} else {
  logger.warn(
    "SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters."
  );
}
app.use("/api", apiRateLimiter, system_routes_default);
app.use("/api/auth", authRateLimiter, auth_routes_default);
app.use("/api/invoices", invoice_routes_default);
app.use("/api/vendors", vendor_routes_default);
app.use("/api/expenses", expense_routes_default);
app.use("/api/tasks", task_routes_default);
app.use("/api/astro-content", astro_routes_default);
app.use("/api/products", product_routes_default);
app.use("/api/website", website_routes_default);
app.use("/api/payments", paymentRateLimiter, payment_routes_default);
app.use("/api/ai", aiRateLimiter, ai_routes_default);
app.use("/api/docs", openapi_routes_default);
app.use((err, _req, res, _next) => {
  const code = err?.code;
  if (code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "CSRF validation failed." });
  }
  const message = err instanceof Error ? err.message : "Unknown server error";
  if (message.toLowerCase().includes("csrf")) {
    return res.status(403).json({ error: "CSRF validation failed." });
  }
  logger.error({ err }, "Unhandled server error");
  return res.status(500).json({ error: "Internal server error." });
});
var app_default = app;

// api/index.src.ts
var index_src_default = app_default;
export {
  index_src_default as default
};
