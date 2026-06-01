/**
 * Centralized API service interfaces and types
 * This module defines the contracts for all backend communications.
 */

export interface ApiError {
  error: string;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
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

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}
