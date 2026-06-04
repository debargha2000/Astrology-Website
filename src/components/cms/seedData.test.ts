import { describe, it, expect } from 'vitest';

import {
  INITIAL_INVOICES,
  INITIAL_VENDORS,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  TASK_STATUSES,
  INVOICE_STATUSES,
  EXPENSE_CATEGORIES,
  GMAIL_TEMPLATES,
} from './seedData';

describe('CMS seed data invariants', () => {
  it('does not leak the old Signtific India brand', () => {
    const all = JSON.stringify({
      INITIAL_INVOICES,
      INITIAL_VENDORS,
      INITIAL_EXPENSES,
      INITIAL_TASKS,
      GMAIL_TEMPLATES,
    });
    expect(all).not.toMatch(/signtific/i);
  });

  it('every invoice has a valid status', () => {
    for (const inv of INITIAL_INVOICES) {
      expect(INVOICE_STATUSES).toContain(inv.status);
      expect(inv.amount).toBeGreaterThan(0);
    }
  });

  it('every task has a valid status', () => {
    for (const task of INITIAL_TASKS) {
      expect(TASK_STATUSES).toContain(task.status);
    }
  });

  it('every expense belongs to a known category', () => {
    for (const exp of INITIAL_EXPENSES) {
      expect(EXPENSE_CATEGORIES).toContain(exp.category);
      expect(exp.amount).toBeGreaterThan(0);
    }
  });

  it('every vendor has a non-empty origin and lead time', () => {
    for (const v of INITIAL_VENDORS) {
      expect(v.origin.length).toBeGreaterThan(0);
      expect(v.leadTime.length).toBeGreaterThan(0);
    }
  });

  it('Gmail templates cover all three scenarios and are non-empty', () => {
    expect(Object.keys(GMAIL_TEMPLATES).sort()).toEqual(['blessing', 'ledger', 'shipping']);
    for (const tpl of Object.values(GMAIL_TEMPLATES)) {
      expect(tpl.subject.length).toBeGreaterThan(0);
      expect(tpl.body.length).toBeGreaterThan(0);
    }
  });
});
