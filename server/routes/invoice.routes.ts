import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  const invoices = await DB.getInvoices();
  res.json(invoices);
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { client, item, amount, status, alignment } = req.body as {
    client?: string;
    item?: string;
    amount?: number | string;
    status?: string;
    alignment?: string;
  };
  if (!client || !amount) {
    return res.status(400).json({ error: 'Missing client coordinates or total payment amount.' });
  }

  const invoice = await DB.addInvoice({
    client,
    date: new Date().toISOString().split('T')[0],
    item: item || 'Planetary Crystal Alignment Package',
    amount: Number(amount),
    status: (status as 'Paid' | 'Sent' | 'Overdue' | 'Draft') || 'Sent',
    alignment: alignment || 'Universal Alignment',
  });
  res.status(201).json(invoice);
});

router.post('/batch', authenticateToken, async (req: Request, res: Response) => {
  const { items } = req.body as { items?: any[] };
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required.' });
  }
  const created = await DB.bulkCreateInvoices(
    items.map((i) => ({
      client: i.client || 'Unknown',
      date: i.date || new Date().toISOString().split('T')[0],
      item: i.item || 'Planetary Crystal Alignment Package',
      amount: Number(i.amount) || 0,
      status: i.status || 'Sent',
      alignment: i.alignment || 'Universal Alignment',
    }))
  );
  res.status(201).json({ count: created.length, items: created });
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { client, item, amount, status, alignment } = req.body as {
    client?: string;
    item?: string;
    amount?: number | string;
    status?: string;
    alignment?: string;
  };
  const updates: Record<string, unknown> = {};
  if (client !== undefined) updates.client = client;
  if (item !== undefined) updates.item = item;
  if (amount !== undefined) updates.amount = Number(amount);
  if (status !== undefined) updates.status = status;
  if (alignment !== undefined) updates.alignment = alignment;

  const updated = await DB.updateInvoice(req.params.id, updates as any);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Invoice signature reference not found.' });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteInvoice(req.params.id);
  if (success) {
    res.json({ message: 'Invoice successfully pruned.' });
  } else {
    res.status(404).json({ error: 'Invoice signature reference not found.' });
  }
});

router.delete('/batch', authenticateToken, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids?: string[] };
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array is required.' });
  }
  const deleted = await DB.bulkDeleteInvoices(ids);
  res.json({ deleted, total: ids.length });
});

export default router;
