export type CmsSubTab =
  | 'dashboard'
  | 'invoices'
  | 'vendors'
  | 'expenses'
  | 'tasks'
  | 'gmail'
  | 'products'
  | 'site';

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

export interface ProductForm {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  shortDescription: string;
  benefits: string | string[];
  crystalsUsed: string | string[];
  imageUrl: string;
  videoUrl: string;
  category: 'bracelet' | 'ring' | 'combo';
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  isBestSeller: boolean;
  zodiacConnection: string | string[];
  specifications: {
    beadSize: string;
    beadCount: number;
    threadMaterial: string;
    origin: string;
    chargeTime: string;
  };
}

export interface SiteForm {
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
  title: string;
  timestamp: string;
  user: string;
}

export interface MailRecord {
  id: string;
  clientName: string;
  email: string;
  subject: string;
  dateStr: string;
}

export const ADMIN_EMAIL = 'debarghapakhira@gmail.com';
export const ADMIN_TOKEN_KEY = 'aura_stone_admin_token';
export const LEGACY_ADMIN_TOKEN_KEYS = ['signtific_admin_token'];

export function getAdminToken(): string | null {
  const current = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (current) return current;
  for (const legacy of LEGACY_ADMIN_TOKEN_KEYS) {
    const old = localStorage.getItem(legacy);
    if (old) {
      localStorage.setItem(ADMIN_TOKEN_KEY, old);
      localStorage.removeItem(legacy);
      return old;
    }
  }
  return null;
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  for (const legacy of LEGACY_ADMIN_TOKEN_KEYS) {
    localStorage.removeItem(legacy);
  }
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  for (const legacy of LEGACY_ADMIN_TOKEN_KEYS) {
    localStorage.removeItem(legacy);
  }
}
