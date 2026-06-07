import fs from 'fs';
import path from 'path';

import { PRODUCTS, DEFAULT_WEBSITE_CONTENT } from '../../src/data.js';
import { logger } from '../middleware/logging.js';
import type { AstroContent } from '../schemas/astroContent.js';
import type { Checkpoint } from '../schemas/checkpoint.js';
import type { Expense } from '../schemas/expense.js';
import type { Invoice } from '../schemas/invoice.js';
import type { Product } from '../schemas/product.js';
import type { Task } from '../schemas/task.js';
import type { Vendor } from '../schemas/vendor.js';
import type { WebsiteContent } from '../schemas/websiteContent.js';

const DB_FILE = path.join(process.cwd(), 'database.json');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface DatabaseStructure {
  invoices: Invoice[];
  vendors: Vendor[];
  expenses: Expense[];
  tasks: Task[];
  terminalLog: Array<Record<string, unknown>>;
  emailRecords: Array<Record<string, unknown>>;
  products: Product[];
  websiteContent: WebsiteContent;
  checkpoints: Checkpoint[];
  astroContent: AstroContent[];
}

function getInitialData(): DatabaseStructure {
  return {
    invoices: [
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
    ],
    vendors: [
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
    ],
    expenses: [
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
    ],
    tasks: [
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
    ],
    terminalLog: [
      {
        id: 'log-1',
        timestamp: '10:32 AM',
        message: 'SECURE COGNITIVE LEDGER INITIALIZED: Welcome to Aura & Stone Central Operations.',
      },
      {
        id: 'log-2',
        timestamp: '10:45 AM',
        message:
          'RITUAL BATCH UPDATE COMPLETED: 12 Pure Citrine conductors advanced to lunar purification stage.',
      },
      {
        id: 'log-3',
        timestamp: '11:15 AM',
        message:
          'QUALITY CHECK SYSTEM VERIFICATION: Geologist verified Mohs index 7 on raw amethyst crystal bulk VND-302.',
      },
    ],
    emailRecords: [],
    products: PRODUCTS,
    websiteContent: DEFAULT_WEBSITE_CONTENT,
    checkpoints: [],
    astroContent: [],
  };
}

export class LocalFileService {
  private load(): DatabaseStructure {
    if (IS_PRODUCTION) {
      return getInitialData();
    }
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(fileContent) as Partial<DatabaseStructure>;
        const initial = getInitialData();
        return { ...initial, ...data };
      }
    } catch (e) {
      logger.error({ err: e }, 'Error reading database file, using defaults');
    }
    return getInitialData();
  }

  private save(data: DatabaseStructure): void {
    if (IS_PRODUCTION) return;
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      logger.error({ err: e }, 'CRITICAL: Failed to write to database file');
    }
  }

  getCollection<K>(collectionName: keyof DatabaseStructure): K[] {
    return this.load()[collectionName] as unknown as K[];
  }

  setCollection<K>(collectionName: keyof DatabaseStructure, data: K[]): void {
    const db = this.load();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any)[collectionName] = data;
    this.save(db);
  }

  findById<K extends { id: string }>(
    collectionName: keyof DatabaseStructure,
    id: string
  ): K | null {
    const items = this.getCollection<K>(collectionName);
    return items.find((item) => item.id === id) || null;
  }

  create<K extends { id: string }>(collectionName: keyof DatabaseStructure, item: K): K {
    const items = this.getCollection<K>(collectionName);
    items.unshift(item);
    this.setCollection(collectionName, items);
    return item;
  }

  update<K extends { id: string }>(
    collectionName: keyof DatabaseStructure,
    id: string,
    updates: Partial<K>
  ): K | null {
    const items = this.getCollection<K>(collectionName);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates } as K;
    this.setCollection(collectionName, items);
    return items[index];
  }

  delete(collectionName: keyof DatabaseStructure, id: string): boolean {
    const items = this.getCollection<Record<string, unknown>>(collectionName);
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setCollection(collectionName, filtered as never[]);
    return true;
  }

  bulkCreate<K extends { id: string }>(collectionName: keyof DatabaseStructure, items: K[]): K[] {
    const existing = this.getCollection<K>(collectionName);
    this.setCollection(collectionName, [...items, ...existing]);
    return items;
  }

  bulkDelete(collectionName: keyof DatabaseStructure, ids: string[]): number {
    const items = this.getCollection<Record<string, unknown>>(collectionName);
    const before = items.length;
    const filtered = items.filter((item) => !ids.includes(item.id as string));
    this.setCollection(collectionName, filtered as never[]);
    return before - filtered.length;
  }
}

export const localFileService = new LocalFileService();
