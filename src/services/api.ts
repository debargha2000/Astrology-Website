/**
 * Centralized API service aggregator
 * Re-exports all domain-specific services for convenience
 */

export { invoiceService } from './invoiceService';
export { vendorService } from './vendorService';
export { expenseService } from './expenseService';
export { taskService } from './taskService';
export { authService } from './authService';
export { logService } from './logService';

export type { Invoice, Vendor, Expense, Task, TerminalLog, AuthResponse } from './types';
