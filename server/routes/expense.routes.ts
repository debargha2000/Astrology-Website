import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  const expenses = await DB.getExpenses();
  res.json(expenses);
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { title, category, amount, notes } = req.body as {
    title?: string;
    category?: string;
    amount?: number | string;
    notes?: string;
  };
  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount parameters have not been compiled.' });
  }

  const expense = await DB.addExpense({
    title,
    category: category || 'Ritual Consecration',
    amount: Number(amount),
    notes: notes || '',
  });
  res.status(201).json(expense);
});

router.post('/batch', authenticateToken, async (req: Request, res: Response) => {
  const { items } = req.body as { items?: any[] };
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required.' });
  }
  const created = await DB.bulkCreateExpenses(
    items.map((i) => ({
      title: i.title || 'Unknown Expense',
      category: i.category || 'Ritual Consecration',
      amount: Number(i.amount) || 0,
      notes: i.notes || '',
    }))
  );
  res.status(201).json({ count: created.length, items: created });
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { title, category, amount, notes } = req.body as {
    title?: string;
    category?: string;
    amount?: number | string;
    notes?: string;
  };
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (category !== undefined) updates.category = category;
  if (amount !== undefined) updates.amount = Number(amount);
  if (notes !== undefined) updates.notes = notes;

  const updated = await DB.updateExpense(req.params.id, updates as any);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Expense code reference not found.' });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteExpense(req.params.id);
  if (success) {
    res.json({ message: 'Expense records successfully archived.' });
  } else {
    res.status(404).json({ error: 'Expense code reference not found.' });
  }
});

router.delete('/batch', authenticateToken, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids?: string[] };
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array is required.' });
  }
  const deleted = await DB.bulkDeleteExpenses(ids);
  res.json({ deleted, total: ids.length });
});

export default router;
