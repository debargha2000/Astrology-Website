import type { Invoice, Vendor, Expense, Task, ProductForm } from './types';

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-601',
    client: 'Aarav Mehta',
    date: '2026-05-24',
    item: 'Astral Prosperity Bracelet Combo',
    amount: 8400,
    status: 'Paid',
    alignment: 'Money Magnet (Citrine + Pyrite)',
  },
  {
    id: 'INV-2026-602',
    client: 'Priya Sharma',
    date: '2026-05-25',
    item: 'Evil Eye Armour Ring Set',
    amount: 5900,
    status: 'Sent',
    alignment: 'Protection (Black Tourmaline)',
  },
  {
    id: 'INV-2026-603',
    client: 'Devas Astrographics',
    date: '2026-05-21',
    item: 'Mass Calibration (12 Sacred Geodes)',
    amount: 48000,
    status: 'Paid',
    alignment: 'Vedic Grid Alignment',
  },
  {
    id: 'INV-2026-604',
    client: 'Rohit Khandelwal',
    date: '2026-05-18',
    item: 'Crown Clarity Amethyst Special',
    amount: 9500,
    status: 'Overdue',
    alignment: 'Saturn Node Alignment',
  },
  {
    id: 'INV-2026-605',
    client: 'Kiran Desai',
    date: '2026-05-26',
    item: 'Chakra Awakening Gilded Bead Set',
    amount: 12500,
    status: 'Draft',
    alignment: 'Full Alignment',
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'VND-301',
    name: 'Himalayan Fine Quartz Co.',
    contact: 'Harish Rawat',
    origin: 'Uttarakhand, India',
    rating: 5,
    category: 'Raw Geodes',
    leadTime: '3 Days',
    leadGems: 'Clear Quartz & Citrine',
    status: 'Approved',
  },
  {
    id: 'VND-302',
    name: "Uruguayan Amethyst Miner's Guild",
    contact: 'Lucas Silveira',
    origin: 'Artigas, Uruguay',
    rating: 5,
    category: 'Crystalline Clusters',
    leadTime: '14 Days',
    leadGems: 'Deep Amethyst',
    status: 'Approved',
  },
  {
    id: 'VND-303',
    name: 'Gilded Silver & Thread Artisans',
    contact: 'Kavita Jewellers',
    origin: 'Jaipur, India',
    rating: 4,
    category: 'Mountings & Elastic Conductors',
    leadTime: '5 Days',
    leadGems: '925 Silver Links',
    status: 'Under Review',
  },
  {
    id: 'VND-304',
    name: 'Ganges Water Sanctify Source',
    contact: 'Pandit Shastri Ji',
    origin: 'Rishikesh, India',
    rating: 5,
    category: 'Sanctifying Liquids',
    leadTime: '2 Days',
    leadGems: 'Panchamrut & Ganga Jal',
    status: 'Approved',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'EXP-101',
    title: 'Lunar Cleansing Sandalwood Paste',
    category: 'Ritual Consecration',
    amount: 4200,
    date: '2026-05-20',
    notes: 'Grown on organic farms in Mysore',
  },
  {
    id: 'EXP-102',
    title: 'Custom Velvet Protection Pouches',
    category: 'Packaging',
    amount: 8500,
    date: '2026-05-22',
    notes: 'Saffron-dyed lining for energetic insulation',
  },
  {
    id: 'EXP-103',
    title: 'Laboratory Geological Verification Fees',
    category: 'Quality Inspection',
    amount: 12000,
    date: '2026-05-24',
    notes: 'Refractive Index and Mohs Hardness certification batch #411',
  },
  {
    id: 'EXP-104',
    title: 'Temple Astro-Scholars Commision',
    category: 'Ritual Consecration',
    amount: 25000,
    date: '2026-05-25',
    notes: 'Bathing chant leaders over moon cycles',
  },
  {
    id: 'EXP-105',
    title: 'Ganga Jal Sacred Liquid Logistic Refills',
    category: 'Sourcing & Shipping',
    amount: 6200,
    date: '2026-05-18',
    notes: 'Pure glass canisters from Himalayan descent coordinates',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'TSK-501',
    title: 'Wash Batch #409 Clear Quartz in Panchamrut',
    status: 'Water Cleanse',
    priority: 'High',
    assignee: 'Pandit Sharma',
    daysLeft: 1,
  },
  {
    id: 'TSK-502',
    title: 'Calibrate Amethyst beads with 432Hz Saturn frequencies',
    status: 'Moon Bath Bathing',
    priority: 'High',
    assignee: 'Shastry Ji',
    daysLeft: 2,
  },
  {
    id: 'TSK-503',
    title: 'Review laboratory hardness scores for Green Aventirine arrival',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Dr. Vivek Soni',
    daysLeft: 5,
  },
  {
    id: 'TSK-504',
    title: 'Seal and pack Aarav Mehta Certified Prosperity Combo',
    status: 'Sealed / Composed',
    priority: 'Low',
    assignee: 'Meera Patel',
    daysLeft: 0,
  },
  {
    id: 'TSK-505',
    title: 'Program Solar Warmth on Carnelian material locks',
    status: 'Moon Bath Bathing',
    priority: 'Medium',
    assignee: 'Shastry Ji',
    daysLeft: 1,
  },
  {
    id: 'TSK-506',
    title: 'Verify signature holographic seals of Vedic certificate series 900',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Meera Patel',
    daysLeft: 3,
  },
];

export const TASK_STATUSES: Task['status'][] = [
  'Backlog',
  'Water Cleanse',
  'Moon Bath Bathing',
  'Sealed / Composed',
];

export const INVOICE_STATUSES: Invoice['status'][] = ['Paid', 'Sent', 'Overdue', 'Draft'];

export const EXPENSE_CATEGORIES = [
  'Ritual Consecration',
  'Packaging',
  'Quality Inspection',
  'Sourcing & Shipping',
];

export const PRIORITIES: Task['priority'][] = ['High', 'Medium', 'Low'];

export const GMAIL_TEMPLATES = {
  blessing: {
    subject: 'Astral Prosperity Crystal Consecration Notice',
    body: 'Hari Om,\n\nWe are pleased to inform you that your customized planetary crystal beads have been aligned and bathed under strict Vedic chants, natural sandalwood pastes, and holy Ganga Jal coordinate bathes over lunar cycle nodes.\n\nYour holographic sacred authenticity attestation certificate series has been printed and sealed in velvet protective pouches. Standard dispatch routing will begin shortly.\n\nBlessed Journeys,\nAura & Stone Dispatch Core',
  },
  shipping: {
    subject: 'Sacred Vedic Gems Consignment Dispatched',
    body: 'Dear Customer,\n\nYour attuned gemstone crystal matrix has been safely layered in saffron-dyed protection velvet wraps and shipped with premium express mail. Your energetic insulation packages are locked.\n\nYour batch code tracking references are active. Monitor state alignment gracefully.\n\nNamaste,\nOperations Team, Jaipur Hub',
  },
  ledger: {
    subject: 'Commercial Attestation Ledger Attuned & Invoice Finalized',
    body: 'Hello Astrolabe Business Partner,\n\nThis is to certify that your commercial partner invoice has been safely finalized and posted to our real-time secure storage grid.\n\nYou can access or print your high-definition aligned accounting overview directly within our staff terminal dashboard anytime.\n\nRegards,\nAura & Stone Billing Division',
  },
} as const;

export const DEFAULT_PRODUCT_FORM: ProductForm = {
  id: '',
  name: '',
  originalPrice: 1999,
  salePrice: 1499,
  rating: 5,
  reviewsCount: 1,
  description: '',
  shortDescription: '',
  benefits: '',
  crystalsUsed: '',
  imageUrl: '',
  videoUrl: '',
  category: 'bracelet' as const,
  stockStatus: 'in-stock' as const,
  isBestSeller: false,
  zodiacConnection: '',
  specifications: {
    beadSize: '8mm Grade A Spheres',
    beadCount: 24,
    threadMaterial: 'Vedic Elastic Chord',
    origin: 'Finely Sourced',
    chargeTime: '3 Nights',
  },
};

export const DEFAULT_SITE_FORM = {
  brandName: '',
  brandSubtitle: '',
  heroHeadline: '',
  heroHighlight: '',
  heroParagraph: '',
  founderQuote: '',
  founderQuoteSubtitle: '',
  historyHeadline: '',
  historyParagraph1: '',
  historyParagraph2: '',
  bannerImage: '',
};
