import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { Product, WebsiteContent, Checkpoint } from '../src/types';
import { PRODUCTS } from '../src/data';

// Read config for lazy initialization
const CONFIG_PATH = path.join(process.cwd(), 'firebase-applet-config.json');
let projectId = 'gen-lang-client-0811246245'; // default fallback
let firestoreDatabaseId: string | undefined = undefined;

try {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (config.projectId) {
      projectId = config.projectId;
    }
    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      firestoreDatabaseId = config.firestoreDatabaseId;
    }
  }
} catch (err) {
  // Firebase config not found, using defaults
}

let firestoreDb: admin.firestore.Firestore | null = null;
let useLocalFallback = false;

export function getFirestoreDB() {
  if (useLocalFallback) {
    return null;
  }
  if (firestoreDb) {
    return firestoreDb;
  }
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: projectId,
      });
    }
    firestoreDb = firestoreDatabaseId
      ? (admin as any).firestore(firestoreDatabaseId)
      : admin.firestore();
    return firestoreDb;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`⚠️ Firestore unavailable (${reason}). Falling back to local flat-file storage at database.json.`);
    useLocalFallback = true;
    return null;
  }
}

export function isFirebaseActive(): boolean {
  return getFirestoreDB() !== null;
}

export interface Invoice {
  id: string;
  client: string;
  date: string;
  item: string;
  amount: number;
  status: 'Paid' | 'Sent' | 'Overdue' | 'Draft';
  alignment: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  origin: string;
  rating: number;
  category: string;
  leadTime: string;
  leadGems: string;
  status: 'Approved' | 'Under Review' | 'Suspended';
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed';
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  daysLeft: number;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  message: string;
}

const DB_FILE = path.join(process.cwd(), 'database.json');

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-2026-601', client: 'Aarav Mehta', date: '2026-05-24', item: 'Astral Prosperity Bracelet Combo', amount: 8400, status: 'Paid', alignment: 'Money Magnet (Citrine + Pyrite)' },
  { id: 'INV-2026-602', client: 'Priya Sharma', date: '2026-05-25', item: 'Evil Eye Armour Ring Set', amount: 5900, status: 'Sent', alignment: 'Protection (Black Tourmaline)' },
  { id: 'INV-2026-603', client: 'Devas Astrographics', date: '2026-05-21', item: 'Mass Calibration (12 Sacred Geodes)', amount: 48000, status: 'Paid', alignment: 'Vedic Grid Alignment' },
  { id: 'INV-2026-604', client: 'Rohit Khandelwal', date: '2026-05-18', item: 'Crown Clarity Amethyst Special', amount: 9500, status: 'Overdue', alignment: 'Saturn Node Alignment' },
  { id: 'INV-2026-605', client: 'Kiran Desai', date: '2026-05-26', item: 'Chakra Awakening Gilded Bead Set', amount: 12500, status: 'Draft', alignment: 'Full Alignment' }
];

const INITIAL_VENDORS: Vendor[] = [
  { id: 'VND-301', name: 'Himalayan Fine Quartz Co.', contact: 'Harish Rawat', origin: 'Uttarakhand, India', rating: 5, category: 'Raw Geodes', leadTime: '3 Days', leadGems: 'Clear Quartz & Citrine', status: 'Approved' },
  { id: 'VND-302', name: 'Uruguayan Amethyst Miner\'s Guild', contact: 'Lucas Silveira', origin: 'Artigas, Uruguay', rating: 5, category: 'Crystalline Clusters', leadTime: '14 Days', leadGems: 'Deep Amethyst', status: 'Approved' },
  { id: 'VND-303', name: 'Gilded Silver & Thread Artisans', contact: 'Kavita Jewellers', origin: 'Jaipur, India', rating: 4, category: 'Mountings & Elastic Conductors', leadTime: '5 Days', leadGems: '925 Silver Links', status: 'Under Review' },
  { id: 'VND-304', name: 'Ganges Water Sanctify Source', contact: 'Pandit Shastri Ji', origin: 'Rishikesh, India', rating: 5, category: 'Sanctifying Liquids', leadTime: '2 Days', leadGems: 'Panchamrut & Ganga Jal', status: 'Approved' }
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'EXP-101', title: 'Lunar Cleansing Sandalwood Paste', category: 'Ritual Consecration', amount: 4200, date: '2026-05-20', notes: 'Grown on organic farms in Mysore' },
  { id: 'EXP-102', title: 'Custom Velvet Protection Pouches', category: 'Packaging', amount: 8500, date: '2026-05-22', notes: 'Saffron-dyed lining for energetic insulation' },
  { id: 'EXP-103', title: 'Laboratory Geological Verification Fees', category: 'Quality Inspection', amount: 12000, date: '2026-05-24', notes: 'Refractive Index and Mohs Hardness certification batch #411' },
  { id: 'EXP-104', title: 'Temple Astro-Scholars Commision', category: 'Ritual Consecration', amount: 25000, date: '2026-05-25', notes: 'Bathing chant leaders over moon cycles' },
  { id: 'EXP-105', title: 'Ganga Jal Sacred Liquid Logistic Refills', category: 'Sourcing & Shipping', amount: 6200, date: '2026-05-18', notes: 'Pure glass canisters from Himalayan descent coordinates' }
];

const INITIAL_TASKS: Task[] = [
  { id: 'TSK-501', title: 'Wash Batch #409 Clear Quartz in Panchamrut', status: 'Water Cleanse', priority: 'High', assignee: 'Pandit Sharma', daysLeft: 1 },
  { id: 'TSK-502', title: 'Calibrate Amethyst beads with 432Hz Saturn frequencies', status: 'Moon Bath Bathing', priority: 'High', assignee: 'Shastry Ji', daysLeft: 2 },
  { id: 'TSK-503', title: 'Review laboratory hardness scores for Green Aventirine arrival', status: 'Backlog', priority: 'Medium', assignee: 'Dr. Vivek Soni', daysLeft: 5 },
  { id: 'TSK-504', title: 'Seal and pack Aarav Mehta Certified Prosperity Combo', status: 'Sealed / Composed', priority: 'Low', assignee: 'Meera Patel', daysLeft: 0 },
  { id: 'TSK-505', title: 'Program Solar Warmth on Carnelian material locks', status: 'Moon Bath Bathing', priority: 'Medium', assignee: 'Shastry Ji', daysLeft: 1 },
  { id: 'TSK-506', title: 'Verify signature holographic seals of Vedic certificate series 900', status: 'Backlog', priority: 'High', assignee: 'Meera Patel', daysLeft: 3 }
];

const INITIAL_LOGS: TerminalLog[] = [
  { id: 'log-1', timestamp: '10:32 AM', message: 'SECURE COGNITIVE LEDGER INITIALIZED: Welcome to Aura & Stone Central Operations.' },
  { id: 'log-2', timestamp: '10:45 AM', message: 'RITUAL BATCH UPDATE COMPLETED: 12 Pure Citrine conductors advanced to lunar purification stage.' },
  { id: 'log-3', timestamp: '11:15 AM', message: 'QUALITY CHECK SYSTEM VERIFICATION: Geologist verified Mohs index 7 on raw amethyst crystal bulk VND-302.' }
];

const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  brandName: 'Aura & Stone',
  brandSubtitle: 'Crystalline Astrology',
  heroHeadline: 'The Indian',
  heroHighlight: 'Science of Signs',
  heroParagraph: 'Fine crystal jewelry engineered from verified planetary minerals. Cleansed, moon bathed, and programmed to your birth chart parameters to create an unshakeable energetic shield.',
  founderQuote: 'In today’s fast-paced corporate and creative grids, we are continuously bombarded by negative gazes, digital noise, and heavy financial doubt. Aura & Stone was co-conceived because I wanted authentic, laboratory-tested crystal jewelry that looks incredibly sharp and high-fashion while offering robust spiritual protection. We took 75 years of my family\'s ancestral alignment wisdom and made it sleek, minimalistic, and absolute.',
  founderQuoteSubtitle: 'Co-Founder & Chief Vedic Architect, Aura & Stone',
  historyHeadline: 'Ancient Sceptred Science Met Minimalist Form',
  historyParagraph1: 'Aura & Stone was pioneered in the foothills of Jammu, Kashmir, with a deep, uncompromising mission: to de-mystify ancient Indian gemologies and elevate them to modern standards of luxury, precision, and physical authenticity. Led by three generations of Astro-scholars, we isolate specific minerals (such as green aventurine or Uruguayan amethyst clusters) that possess corresponding atomic frequencies to planetary transit nodes.',
  historyParagraph2: 'By merging deep Vedic practices with laboratory testing (refractive indexes, geological hardness, chemical matrix formulas), we construct exquisite jewelry talismans that serve as protective and prosperous energy shields for daily corporate movers.',
  bannerImage: '/src/assets/images/aura_stone_hero_banner_1779793774735.png'
};

interface DatabaseStructure {
  invoices: Invoice[];
  vendors: Vendor[];
  expenses: Expense[];
  tasks: Task[];
  terminalLog: TerminalLog[];
  products: Product[];
  websiteContent: WebsiteContent;
  checkpoints: Checkpoint[];
}

export class DB {
  private static load(): DatabaseStructure {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(fileContent) as any;
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
        return data as DatabaseStructure;
      }
    } catch (e) {
      console.error('Error reading index file. Initializing default structures.', e);
    }

    const defaultData: DatabaseStructure = {
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

  private static save(data: DatabaseStructure) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('CRITICAL: Failed to write to the index file.', e);
    }
  }

  // General log appender (Sync & Async)
  public static async addLog(message: string): Promise<TerminalLog> {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logId = `log-${Date.now()}`;
    const fdb = getFirestoreDB();
    
    if (fdb) {
      try {
        const newLogPayload: TerminalLog = { id: logId, timestamp, message };
        await fdb.collection('logs').doc(logId).set(newLogPayload);
        return newLogPayload;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const newLog: TerminalLog = { id: logId, timestamp, message };
    data.terminalLog = [newLog, ...data.terminalLog.slice(0, 9)];
    this.save(data);
    return newLog;
  }

  public static async getLogs(): Promise<TerminalLog[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('logs').orderBy('id', 'desc').limit(10).get();
        return snapshot.docs.map(doc => doc.data() as TerminalLog);
      } catch (e) {
        // Silently fall back to local storage
      }
    }
    return this.load().terminalLog;
  }

  // INVOICES CRUD
  public static async getInvoices(): Promise<Invoice[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('invoices').get();
        return snapshot.docs.map(doc => doc.data() as Invoice);
      } catch (e) {
        // Silently fall back to local storage
      }
    }
    return this.load().invoices;
  }

  public static async addInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const customId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const newInvoice: Invoice = {
      ...invoice,
      id: customId
    };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('invoices').doc(customId).set(newInvoice);
        await this.addLog(`Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (₹${newInvoice.amount})`);
        return newInvoice;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    data.invoices = [newInvoice, ...data.invoices];
    this.save(data);
    await this.addLog(`Created High-Precision Invoice ${newInvoice.id} for ${newInvoice.client} (₹${newInvoice.amount})`);
    return newInvoice;
  }

  public static async deleteInvoice(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('invoices').doc(id).delete();
        await this.addLog(`Cleared Invoice ${id} from operational ledger.`);
        return true;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const countBefore = data.invoices.length;
    data.invoices = data.invoices.filter(i => i.id !== id);
    if (data.invoices.length < countBefore) {
      this.save(data);
      await this.addLog(`Cleared Invoice ${id} from operational ledger.`);
      return true;
    }
    return false;
  }

  // VENDORS CRUD
  public static async getVendors(): Promise<Vendor[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('vendors').get();
        return snapshot.docs.map(doc => doc.data() as Vendor);
      } catch (e) {
        // Silently fall back to local storage
      }
    }
    return this.load().vendors;
  }

  public static async addVendor(vendor: Omit<Vendor, 'id' | 'status' | 'rating'>): Promise<Vendor> {
    const customId = `VND-${Math.floor(Math.random() * 90 + 300)}`;
    const newVendor: Vendor = {
      ...vendor,
      id: customId,
      rating: 5,
      status: 'Approved'
    };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('vendors').doc(customId).set(newVendor);
        await this.addLog(`Onboarded newly registered artisan and geode vendor: ${newVendor.name}`);
        return newVendor;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    data.vendors = [...data.vendors, newVendor];
    this.save(data);
    await this.addLog(`Onboarded newly registered artisan and geode vendor: ${newVendor.name}`);
    return newVendor;
  }

  public static async deleteVendor(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('vendors').doc(id).delete();
        await this.addLog(`Suspended/deleted vendor registration: ${id}`);
        return true;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const countBefore = data.vendors.length;
    const vendorRef = data.vendors.find(v => v.id === id);
    data.vendors = data.vendors.filter(v => v.id !== id);
    if (data.vendors.length < countBefore) {
      this.save(data);
      await this.addLog(`Suspended/deleted vendor registration: ${vendorRef?.name || id}`);
      return true;
    }
    return false;
  }

  // EXPENSES CRUD
  public static async getExpenses(): Promise<Expense[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('expenses').get();
        return snapshot.docs.map(doc => doc.data() as Expense);
      } catch (e) {
        // Silently fall back to local storage
      }
    }
    return this.load().expenses;
  }

  public static async addExpense(expense: Omit<Expense, 'id' | 'date'>): Promise<Expense> {
    const customId = `EXP-${Math.floor(Math.random() * 90 + 100)}`;
    const newExpense: Expense = {
      ...expense,
      id: customId,
      date: new Date().toISOString().split('T')[0],
    };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('expenses').doc(customId).set(newExpense);
        await this.addLog(`Logged operations expense: ${newExpense.title} (₹${newExpense.amount})`);
        return newExpense;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    data.expenses = [newExpense, ...data.expenses];
    this.save(data);
    await this.addLog(`Logged operations expense: ${newExpense.title} (₹${newExpense.amount})`);
    return newExpense;
  }

  public static async deleteExpense(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('expenses').doc(id).delete();
        await this.addLog(`Removed operational expense log record ID: ${id}`);
        return true;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const countBefore = data.expenses.length;
    data.expenses = data.expenses.filter(e => e.id !== id);
    if (data.expenses.length < countBefore) {
      this.save(data);
      await this.addLog(`Removed operational expense log record ID: ${id}`);
      return true;
    }
    return false;
  }

  // TASKS CRUD
  public static async getTasks(): Promise<Task[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('tasks').get();
        return snapshot.docs.map(doc => doc.data() as Task);
      } catch (e) {
        // Silently fall back to local storage
      }
    }
    return this.load().tasks;
  }

  public static async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    const customId = `TSK-${Math.floor(Math.random() * 90 + 500)}`;
    const newTask: Task = {
      ...task,
      id: customId
    };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('tasks').doc(customId).set(newTask);
        await this.addLog(`Created astrological task: ${newTask.title} for ${newTask.assignee}`);
        return newTask;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    data.tasks = [newTask, ...data.tasks];
    this.save(data);
    await this.addLog(`Created astrological task: ${newTask.title} for ${newTask.assignee}`);
    return newTask;
  }

  public static async updateTaskStatus(id: string, status: Task['status']): Promise<Task | null> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const docRef = fdb.collection('tasks').doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          await docRef.update({ status });
          const updatedSnap = await docRef.get();
          const taskData = updatedSnap.data() as Task;
          await this.addLog(`Updated task status for ${id} to "${status}"`);
          return taskData;
        }
        return null;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const index = data.tasks.findIndex(t => t.id === id);
    if (index > -1) {
      data.tasks[index].status = status;
      this.save(data);
      await this.addLog(`Updated task status for ${id} to "${status}"`);
      return data.tasks[index];
    }
    return null;
  }

  public static async deleteTask(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('tasks').doc(id).delete();
        await this.addLog(`Cleared astrological task reference ID: ${id}`);
        return true;
      } catch (e) {
        // Silently fall back to local storage
      }
    }

    const data = this.load();
    const countBefore = data.tasks.length;
    data.tasks = data.tasks.filter(t => t.id !== id);
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
  public static async getProducts(): Promise<Product[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('products').get();
        if (snapshot.empty) {
          // Seed products collection in Firestore
          for (const p of PRODUCTS) {
            await fdb.collection('products').doc(p.id).set(p);
          }
          return PRODUCTS;
        }
        return snapshot.docs.map(doc => doc.data() as Product);
      } catch (e) {
        console.error('Firestore getProducts failure, falling back to local file', e);
      }
    }
    return this.load().products || PRODUCTS;
  }

  public static async saveProduct(product: Product): Promise<Product> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('products').doc(product.id).set(product);
        await this.addLog(`Product "${product.name}" (${product.id}) saved and synchronized with Firestore.`);
        return product;
      } catch (e) {
        console.error('Firestore saveProduct error, falling back to local file', e);
      }
    }

    const data = this.load();
    const index = data.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      data.products[index] = product;
    } else {
      data.products.push(product);
    }
    this.save(data);
    await this.addLog(`Product "${product.name}" (${product.id}) saved to local JSON database.`);
    return product;
  }

  public static async deleteProduct(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('products').doc(id).delete();
        await this.addLog(`Product ID ${id} deleted static reference from Firestore.`);
        return true;
      } catch (e) {
        console.error('Firestore deleteProduct error, falling back to local file', e);
      }
    }

    const data = this.load();
    const countBefore = data.products.length;
    const prod = data.products.find(p => p.id === id);
    data.products = data.products.filter(p => p.id !== id);
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
  public static async getWebsiteContent(): Promise<WebsiteContent> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const doc = await fdb.collection('website_config').doc('homepage').get();
        if (!doc.exists) {
          await fdb.collection('website_config').doc('homepage').set(INITIAL_WEBSITE_CONTENT);
          return INITIAL_WEBSITE_CONTENT;
        }
        return doc.data() as WebsiteContent;
      } catch (e) {
        console.error('Firestore getWebsiteContent failure, falling back to local file', e);
      }
    }
    return this.load().websiteContent || INITIAL_WEBSITE_CONTENT;
  }

  public static async saveWebsiteContent(content: WebsiteContent): Promise<WebsiteContent> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('website_config').doc('homepage').set(content);
        await this.addLog('Website custom theme header and layout properties synchronized.');
        return content;
      } catch (e) {
        console.error('Firestore saveWebsiteContent error, falling back to local file', e);
      }
    }

    const data = this.load();
    data.websiteContent = content;
    this.save(data);
    await this.addLog('Website custom theme header and layout properties saved locally.');
    return content;
  }

  // ==========================================
  // SYSTEM CHECKPOINTS FOR ROLLBACK (UP TO 25)
  // ==========================================
  public static async getCheckpoints(): Promise<Checkpoint[]> {
    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        const snapshot = await fdb.collection('checkpoints').orderBy('timestamp', 'desc').limit(25).get();
        return snapshot.docs.map(doc => doc.data() as Checkpoint);
      } catch (e) {
        console.error('Firestore getCheckpoints failure, falling back to local file', e);
      }
    }
    return this.load().checkpoints || [];
  }

  public static async createCheckpoint(title: string, user: string): Promise<Checkpoint> {
    const checkpointId = `chk-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const currentContent = await this.getWebsiteContent();
    const currentProducts = await this.getProducts();

    const newCheckpoint: Checkpoint = {
      id: checkpointId,
      timestamp,
      title: title || 'Periodic Operational Checkpoint',
      user: user || 'debarghapakhira@gmail.com',
      websiteContent: currentContent,
      products: currentProducts
    };

    const fdb = getFirestoreDB();
    if (fdb) {
      try {
        await fdb.collection('checkpoints').doc(checkpointId).set(newCheckpoint);
        const snapshot = await fdb.collection('checkpoints').orderBy('timestamp', 'desc').get();
        if (snapshot.size > 25) {
          const deletePromises = snapshot.docs.slice(25).map(doc => doc.ref.delete());
          await Promise.all(deletePromises);
        }
        await this.addLog(`System Rollback Checkpoint Created: "${newCheckpoint.title}"`);
        return newCheckpoint;
      } catch (e) {
        console.error('Firestore createCheckpoint failure, falling back to local file', e);
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

  public static async rollbackToCheckpoint(id: string): Promise<boolean> {
    const fdb = getFirestoreDB();
    let checkpoint: Checkpoint | undefined;

    if (fdb) {
      try {
        const doc = await fdb.collection('checkpoints').doc(id).get();
        if (doc.exists) {
          checkpoint = doc.data() as Checkpoint;
        }
      } catch (e) {
        console.error('Firestore fetch checkpoint rollback failure, falling back to local file', e);
      }
    }

    if (!checkpoint) {
      const data = this.load();
      checkpoint = data.checkpoints?.find(c => c.id === id);
    }

    if (!checkpoint) {
      throw new Error(`Checkpoint with record ID "${id}" was not resolved.`);
    }

    // Restore website copy/setting configurations
    await this.saveWebsiteContent(checkpoint.websiteContent);

    // Restore products lists
    if (fdb) {
      try {
        // delete existing products in Firestore and rewrite checkpoint versions
        const snapshot = await fdb.collection('products').get();
        const deleteBatch = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deleteBatch);

        for (const p of checkpoint.products) {
          await fdb.collection('products').doc(p.id).set(p);
        }
      } catch (e) {
        console.error('Firestore execute product collection rollback failure', e);
      }
    } else {
      const data = this.load();
      data.products = checkpoint.products;
      this.save(data);
    }

    await this.addLog(`RESTORE ROLLBACK INITIATED: Reverted state to checkpoint [${checkpoint.title}] successfully.`);
    return true;
  }
}
