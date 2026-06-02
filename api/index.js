// server/app.ts
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import crypto2 from "crypto";

// server/db.ts
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// src/data.ts
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
    zodiacConnection: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
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
    crystalsUsed: ["Amethyst", "Lapis Lazuli", "Sodalite", "Green Aventurine", "Tiger Eye", "Carnelian", "Red Jasper", "Porous Lava Basalt"],
    imageUrl: SEVEN_CHAKRA_IMAGE,
    category: "bracelet",
    stockStatus: "in-stock",
    zodiacConnection: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
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
  bannerImage: `${IMG}/aura_stone_hero_banner_1779793774735.png`
};

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
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is set but invalid JSON.", err);
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
    console.warn(`Firestore unavailable (${reason}). Falling back to local flat-file storage.`);
    useLocalFallback = true;
    return null;
  }
}
function isFirebaseActive() {
  return getFirestoreDB() !== null;
}
var DB_FILE = path.join(process.cwd(), "database.json");
var INITIAL_INVOICES = [
  { id: "INV-2026-601", client: "Aarav Mehta", date: "2026-05-24", item: "Astral Prosperity Bracelet Combo", amount: 8400, status: "Paid", alignment: "Money Magnet (Citrine + Pyrite)" },
  { id: "INV-2026-602", client: "Priya Sharma", date: "2026-05-25", item: "Evil Eye Armour Ring Set", amount: 5900, status: "Sent", alignment: "Protection (Black Tourmaline)" },
  { id: "INV-2026-603", client: "Devas Astrographics", date: "2026-05-21", item: "Mass Calibration (12 Sacred Geodes)", amount: 48e3, status: "Paid", alignment: "Vedic Grid Alignment" },
  { id: "INV-2026-604", client: "Rohit Khandelwal", date: "2026-05-18", item: "Crown Clarity Amethyst Special", amount: 9500, status: "Overdue", alignment: "Saturn Node Alignment" },
  { id: "INV-2026-605", client: "Kiran Desai", date: "2026-05-26", item: "Chakra Awakening Gilded Bead Set", amount: 12500, status: "Draft", alignment: "Full Alignment" }
];
var INITIAL_VENDORS = [
  { id: "VND-301", name: "Himalayan Fine Quartz Co.", contact: "Harish Rawat", origin: "Uttarakhand, India", rating: 5, category: "Raw Geodes", leadTime: "3 Days", leadGems: "Clear Quartz & Citrine", status: "Approved" },
  { id: "VND-302", name: "Uruguayan Amethyst Miner's Guild", contact: "Lucas Silveira", origin: "Artigas, Uruguay", rating: 5, category: "Crystalline Clusters", leadTime: "14 Days", leadGems: "Deep Amethyst", status: "Approved" },
  { id: "VND-303", name: "Gilded Silver & Thread Artisans", contact: "Kavita Jewellers", origin: "Jaipur, India", rating: 4, category: "Mountings & Elastic Conductors", leadTime: "5 Days", leadGems: "925 Silver Links", status: "Under Review" },
  { id: "VND-304", name: "Ganges Water Sanctify Source", contact: "Pandit Shastri Ji", origin: "Rishikesh, India", rating: 5, category: "Sanctifying Liquids", leadTime: "2 Days", leadGems: "Panchamrut & Ganga Jal", status: "Approved" }
];
var INITIAL_EXPENSES = [
  { id: "EXP-101", title: "Lunar Cleansing Sandalwood Paste", category: "Ritual Consecration", amount: 4200, date: "2026-05-20", notes: "Grown on organic farms in Mysore" },
  { id: "EXP-102", title: "Custom Velvet Protection Pouches", category: "Packaging", amount: 8500, date: "2026-05-22", notes: "Saffron-dyed lining for energetic insulation" },
  { id: "EXP-103", title: "Laboratory Geological Verification Fees", category: "Quality Inspection", amount: 12e3, date: "2026-05-24", notes: "Refractive Index and Mohs Hardness certification batch #411" },
  { id: "EXP-104", title: "Temple Astro-Scholars Commision", category: "Ritual Consecration", amount: 25e3, date: "2026-05-25", notes: "Bathing chant leaders over moon cycles" },
  { id: "EXP-105", title: "Ganga Jal Sacred Liquid Logistic Refills", category: "Sourcing & Shipping", amount: 6200, date: "2026-05-18", notes: "Pure glass canisters from Himalayan descent coordinates" }
];
var INITIAL_TASKS = [
  { id: "TSK-501", title: "Wash Batch #409 Clear Quartz in Panchamrut", status: "Water Cleanse", priority: "High", assignee: "Pandit Sharma", daysLeft: 1 },
  { id: "TSK-502", title: "Calibrate Amethyst beads with 432Hz Saturn frequencies", status: "Moon Bath Bathing", priority: "High", assignee: "Shastry Ji", daysLeft: 2 },
  { id: "TSK-503", title: "Review laboratory hardness scores for Green Aventirine arrival", status: "Backlog", priority: "Medium", assignee: "Dr. Vivek Soni", daysLeft: 5 },
  { id: "TSK-504", title: "Seal and pack Aarav Mehta Certified Prosperity Combo", status: "Sealed / Composed", priority: "Low", assignee: "Meera Patel", daysLeft: 0 },
  { id: "TSK-505", title: "Program Solar Warmth on Carnelian material locks", status: "Moon Bath Bathing", priority: "Medium", assignee: "Shastry Ji", daysLeft: 1 },
  { id: "TSK-506", title: "Verify signature holographic seals of Vedic certificate series 900", status: "Backlog", priority: "High", assignee: "Meera Patel", daysLeft: 3 }
];
var INITIAL_LOGS = [
  { id: "log-1", timestamp: "10:32 AM", message: "SECURE COGNITIVE LEDGER INITIALIZED: Welcome to Aura & Stone Central Operations." },
  { id: "log-2", timestamp: "10:45 AM", message: "RITUAL BATCH UPDATE COMPLETED: 12 Pure Citrine conductors advanced to lunar purification stage." },
  { id: "log-3", timestamp: "11:15 AM", message: "QUALITY CHECK SYSTEM VERIFICATION: Geologist verified Mohs index 7 on raw amethyst crystal bulk VND-302." }
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
        products: PRODUCTS,
        websiteContent: INITIAL_WEBSITE_CONTENT,
        checkpoints: []
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
        if (modified) {
          this.save(data);
        }
        return data;
      }
    } catch (e) {
      console.error("Error reading index file. Initializing default structures.", e);
    }
    const defaultData = {
      invoices: INITIAL_INVOICES,
      vendors: INITIAL_VENDORS,
      expenses: INITIAL_EXPENSES,
      tasks: INITIAL_TASKS,
      terminalLog: INITIAL_LOGS,
      products: PRODUCTS,
      websiteContent: INITIAL_WEBSITE_CONTENT,
      checkpoints: []
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
      console.error("CRITICAL: Failed to write to the index file.", e);
    }
  }
  // General log appender (Sync & Async)
  static async addLog(message) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
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
        await this.addLog(`Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (\u20B9${newInvoice.amount})`);
        return newInvoice;
      } catch (e) {
      }
    }
    const data = this.load();
    data.invoices = [newInvoice, ...data.invoices];
    this.save(data);
    await this.addLog(`Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (\u20B9${newInvoice.amount})`);
    return newInvoice;
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
      data.tasks[index].status = status;
      this.save(data);
      await this.addLog(`Updated task status for ${id} to "${status}"`);
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
        console.error("Firestore getProducts failure, falling back to local file", e);
      }
    }
    return this.load().products || PRODUCTS;
  }
  static async saveProduct(product) {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection("products").doc(product.id).set(product);
        await this.addLog(`Product "${product.name}" (${product.id}) saved and synchronized with Firestore.`);
        return product;
      } catch (e) {
        console.error("Firestore saveProduct error, falling back to local file", e);
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
        console.error("Firestore deleteProduct error, falling back to local file", e);
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
        console.error("Firestore getWebsiteContent failure, falling back to local file", e);
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
        console.error("Firestore saveWebsiteContent error, falling back to local file", e);
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
        console.error("Firestore getCheckpoints failure, falling back to local file", e);
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
        console.error("Firestore createCheckpoint failure, falling back to local file", e);
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
        console.error("Firestore fetch checkpoint rollback failure, falling back to local file", e);
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
        console.error("Firestore execute product collection rollback failure", e);
      }
    } else {
      const data = this.load();
      data.products = checkpoint.products;
      this.save(data);
    }
    await this.addLog(`RESTORE ROLLBACK INITIATED: Reverted state to checkpoint [${checkpoint.title}] successfully.`);
    return true;
  }
};

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
    return res.status(500).json({ error: "Server misconfigured: JWT secret unavailable." });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing divine session credentials." });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Astral session expired or corrupt." });
    }
    req.user = decoded;
    next();
  });
}
function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "8h" });
}

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
      await DB.addLog(`TRANSACTIONAL EMAIL DESPATCHED: Verification notice sent to client ${clientEmail}`);
    } catch (err) {
      console.error("Email dispatch error", err);
      await DB.addLog(`EMAIL ANOMALY: Failed to dispatch real SMTP transmission.`);
    }
  } else {
    console.log(`[SMTP SIMULATION] sending email to ${clientEmail}`);
    await DB.addLog(`EMAIL SIMULATOR INTERACTION: Mock receipt transmitted to: ${clientEmail}`);
  }
}

// server/middleware/csrf.ts
import crypto from "crypto";
var SAFE_METHODS = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
var TOKEN_HEADER = "x-csrf-token";
var COOKIE_KEY = "_csrf";
var TOKEN_BYTES = 32;
function signToken2(secret, cookieSecret2) {
  return crypto.createHmac("sha256", cookieSecret2).update(secret).digest("hex");
}
function safeEqual(a, b) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
function createCsrfProtection(options) {
  const { cookieSecret: cookieSecret2, exemptPaths = /* @__PURE__ */ new Set(), cookieKey = COOKIE_KEY, tokenHeader = TOKEN_HEADER } = options;
  const headerLower = tokenHeader.toLowerCase();
  return function csrfProtection2(req, res, next) {
    if (exemptPaths.has(req.path)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret2);
      return next();
    }
    const method = req.method.toUpperCase();
    if (SAFE_METHODS.has(method)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret2);
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
    attachTokenGenerator(req, res, cookieKey, cookieSecret2);
    return next();
  };
}
function attachTokenGenerator(req, res, cookieKey, cookieSecret2) {
  req.csrfToken = () => {
    const existing = req.signedCookies?.[cookieKey];
    if (existing) return existing;
    const secret = crypto.randomBytes(TOKEN_BYTES).toString("hex");
    const signed = signToken2(secret, cookieSecret2);
    res.cookie(cookieKey, signed, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      signed: true
    });
    return signed;
  };
}

// server/config.ts
var DEFAULT_ADMIN_EMAIL = "debarghapakhira@gmail.com";
function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
}

// server/app.ts
var app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
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
app.use(
  express.json({
    limit: "100kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
var cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET;
if (!cookieSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "COOKIE_SECRET or JWT_SECRET must be set in production. Refusing to start with a default cookie secret."
    );
  }
  console.warn(
    "\u26A0\uFE0F  COOKIE_SECRET/JWT_SECRET not set. Falling back to insecure development cookie secret."
  );
}
var finalCookieSecret = cookieSecret || "aurastone-dev-cookie-secret-change-in-production-please";
app.use(cookieParser(finalCookieSecret));
var CSRF_EXEMPT_PATHS = /* @__PURE__ */ new Set([
  "/api/payments/razorpay/webhook"
]);
var csrfProtection = createCsrfProtection({
  cookieSecret: finalCookieSecret,
  exemptPaths: CSRF_EXEMPT_PATHS
});
app.use(csrfProtection);
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Try again later." }
});
var paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many payment requests. Please slow down." }
});
if (isFirebaseActive()) {
  DB.addLog("SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.");
} else {
  DB.addLog("SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters.");
}
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.post(
  "/api/auth/google-login",
  authLimiter,
  async (req, res) => {
    const { email, uid, displayName } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Google email coordinate is required." });
    }
    const emailLower = email.toLowerCase();
    if (emailLower !== getAdminEmail()) {
      await DB.addLog(`SECURITY AUDIT FAILURE: Unauthorized Google login attempt made by "${emailLower}".`);
      return res.status(403).json({ error: `Access Denied: ${getAdminEmail()} is the only authorized account.` });
    }
    const token = signToken({
      id: uid || "google-admin-id",
      username: emailLower,
      email: emailLower,
      role: "admin"
    });
    await DB.addLog(`STAFF LOG IN: Google Sign-In completed for "${emailLower}" (${displayName || "N/A"}).`);
    return res.json({ token, role: "admin", username: emailLower });
  }
);
app.get("/api/invoices", authenticateToken, async (_req, res) => {
  const invoices = await DB.getInvoices();
  res.json(invoices);
});
app.post("/api/invoices", authenticateToken, async (req, res) => {
  const { client, item, amount, status, alignment } = req.body;
  if (!client || !amount) {
    return res.status(400).json({ error: "Missing client coordinates or total payment amount." });
  }
  const invoice = await DB.addInvoice({
    client,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    item: item || "Planetary Crystal Alignment Package",
    amount: Number(amount),
    status: status || "Sent",
    alignment: alignment || "Universal Alignment"
  });
  res.status(201).json(invoice);
});
app.delete("/api/invoices/:id", authenticateToken, async (req, res) => {
  const success = await DB.deleteInvoice(req.params.id);
  if (success) {
    res.json({ message: "Invoice successfully pruned." });
  } else {
    res.status(404).json({ error: "Invoice signature reference not found." });
  }
});
app.get("/api/vendors", authenticateToken, async (_req, res) => {
  const vendors = await DB.getVendors();
  res.json(vendors);
});
app.post("/api/vendors", authenticateToken, async (req, res) => {
  const { name, contact, origin, category, leadTime, leadGems } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: "Name and contact person are required." });
  }
  const vendor = await DB.addVendor({
    name,
    contact,
    origin: origin || "Himalayan Foothills",
    category: category || "Raw Crystals",
    leadTime: leadTime || "5 Days",
    leadGems: leadGems || "Crystalline beads"
  });
  res.status(201).json(vendor);
});
app.delete("/api/vendors/:id", authenticateToken, async (req, res) => {
  const success = await DB.deleteVendor(req.params.id);
  if (success) {
    res.json({ message: "Vendor registration successfully suspended." });
  } else {
    res.status(404).json({ error: "Vendor signature reference not found." });
  }
});
app.get("/api/expenses", authenticateToken, async (_req, res) => {
  const expenses = await DB.getExpenses();
  res.json(expenses);
});
app.post("/api/expenses", authenticateToken, async (req, res) => {
  const { title, category, amount, notes } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: "Title and amount parameters have not been compiled." });
  }
  const expense = await DB.addExpense({
    title,
    category: category || "Ritual Consecration",
    amount: Number(amount),
    notes: notes || ""
  });
  res.status(201).json(expense);
});
app.delete("/api/expenses/:id", authenticateToken, async (req, res) => {
  const success = await DB.deleteExpense(req.params.id);
  if (success) {
    res.json({ message: "Expense records successfully archived." });
  } else {
    res.status(404).json({ error: "Expense code reference not found." });
  }
});
app.get("/api/tasks", authenticateToken, async (_req, res) => {
  const tasks = await DB.getTasks();
  res.json(tasks);
});
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { title, status, priority, assignee, daysLeft } = req.body;
  if (!title || !assignee) {
    return res.status(400).json({ error: "Title and responsible assignee are mandatory fields." });
  }
  const task = await DB.addTask({
    title,
    status: status || "Backlog",
    priority: priority || "Medium",
    assignee,
    daysLeft: Number(daysLeft) || 3
  });
  res.status(201).json(task);
});
app.put("/api/tasks/:id/status", authenticateToken, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Missing state status parameter." });
  }
  const updatedTask = await DB.updateTaskStatus(
    req.params.id,
    status
  );
  if (updatedTask) {
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: "Vedic task identifier not discovered." });
  }
});
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const success = await DB.deleteTask(req.params.id);
  if (success) {
    res.json({ message: "Task resolved/archived." });
  } else {
    res.status(404).json({ error: "Task signature reference not found." });
  }
});
app.get("/api/logs", authenticateToken, async (_req, res) => {
  const logs = await DB.getLogs();
  res.json(logs);
});
app.get("/api/products", async (_req, res) => {
  try {
    const products = await DB.getProducts();
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.post("/api/products", authenticateToken, async (req, res) => {
  try {
    const product = await DB.saveProduct(req.body);
    res.status(200).json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const success = await DB.deleteProduct(req.params.id);
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
app.get("/api/website/content", async (_req, res) => {
  try {
    const content = await DB.getWebsiteContent();
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.post("/api/website/content", authenticateToken, async (req, res) => {
  try {
    const content = await DB.saveWebsiteContent(req.body);
    res.status(200).json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.get("/api/website/checkpoints", authenticateToken, async (_req, res) => {
  try {
    const checkpoints = await DB.getCheckpoints();
    res.json(checkpoints);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.post("/api/website/checkpoints", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const checkpoint = await DB.createCheckpoint(
      title || "Periodic Operational Checkpoint",
      req.user?.username || "debarghapakhira@gmail.com"
    );
    res.status(201).json(checkpoint);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.post("/api/website/checkpoints/:id/rollback", authenticateToken, async (req, res) => {
  try {
    const success = await DB.rollbackToCheckpoint(req.params.id);
    if (success) {
      res.json({ message: "Rollback succeeded." });
    } else {
      res.status(404).json({ error: "Rollback failed." });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
app.post(
  "/api/payments/razorpay/order",
  paymentLimiter,
  async (req, res) => {
    const { amount, currency = "INR", receiptEmail, clientName, cartItems } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Total amount is required for setting up order tunnels." });
    }
    const orderId = "order_" + crypto2.randomBytes(6).toString("hex");
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
        console.error("Razorpay processing exception: ", err);
        await DB.addLog("RAZORPAY EXCEPTION: Live channel failover. Generating sandboxed transaction.");
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
  }
);
app.post("/api/payments/razorpay/webhook", async (req, res) => {
  const signatureHeader = req.headers["x-razorpay-signature"];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "sacred_webhook7592_signature";
  if (!signature) {
    return res.status(400).json({ error: "Missing security signature block." });
  }
  let isSignatureValid = false;
  try {
    const rawBodyBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const hmac = crypto2.createHmac("sha256", razorpaySecret);
    hmac.update(rawBodyBuffer);
    const expectedSignature = hmac.digest("hex");
    isSignatureValid = crypto2.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    isSignatureValid = false;
  }
  const isBypassActive = process.env.NODE_ENV !== "production" && signature === "bypass_test_mode";
  if (!isSignatureValid && !isBypassActive) {
    await DB.addLog("CRITICAL: Unauthorized signature received on payment webhook.");
    return res.status(403).json({ error: "Signature failure. Connection unauthorized." });
  }
  const body = req.body;
  const event = body?.event;
  const payload = body?.payload;
  if (event === "payment.captured" || event === "simulated.payment.captured" || isBypassActive) {
    const paymentEntity = payload?.payment?.entity || {};
    const razorpayOrderId = paymentEntity.order_id || "order_sandbox_re";
    const amountPaidInRupees = (paymentEntity.amount || body?.amount || 1e4) / 100;
    const clientName = paymentEntity.notes?.clientName || body?.clientName || "Vrishabha Devotee";
    const clientEmail = paymentEntity.notes?.clientEmail || body?.receiptEmail || "operations@aurastone.in";
    const itemNames = paymentEntity.notes?.itemsDescription || body?.cartItems || "Planetary Crystal Alignment Package";
    await DB.addLog(`WEBHOOK TRANSACTION VERIFIED: Secured Order ID ${razorpayOrderId} (\u20B9${amountPaidInRupees})`);
    await DB.addInvoice({
      client: clientName,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
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
    return res.json({ status: "success", message: "Fulfillment sequence synced", orderId: razorpayOrderId });
  }
  res.json({ status: "ignored", event });
});
app.use((err, _req, res, _next) => {
  const code = err?.code;
  if (code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "CSRF validation failed." });
  }
  const message = err instanceof Error ? err.message : "Unknown server error";
  if (message.toLowerCase().includes("csrf")) {
    return res.status(403).json({ error: "CSRF validation failed." });
  }
  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: "Internal server error." });
});
var app_default = app;

// api/index.src.ts
var index_src_default = app_default;
export {
  index_src_default as default
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
