import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { invoiceRepository } from '../repositories/index.js';

const router = Router();

const invoiceCreateSchema = z.object({
  client: z.string().min(1).max(200),
  item: z.string().max(500).optional(),
  amount: z.number().int().positive(),
  status: z.enum(['Paid', 'Sent', 'Overdue', 'Draft']).optional(),
  alignment: z.string().max(200).optional(),
});

const invoiceUpdateSchema = invoiceCreateSchema.partial();
const invoiceBatchCreateSchema = z.object({
  items: z.array(invoiceCreateSchema).min(1),
});
const invoiceBatchDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  const invoices = await invoiceRepository.findAll();
  res.json(invoices);
});

router.post(
  '/',
  authenticateToken,
  validate(invoiceCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const invoice = await invoiceRepository.create(req.body);
    res.status(201).json(invoice);
  }
);

router.post(
  '/batch',
  authenticateToken,
  validate(invoiceBatchCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    const created = await invoiceRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(invoiceUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing invoice ID.' });
      return;
    }
    const updated = await invoiceRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Invoice not found.' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing invoice ID.' });
    return;
  }
  const success = await invoiceRepository.delete(id);
  if (success) {
    res.json({ message: 'Invoice successfully pruned.' });
  } else {
    res.status(404).json({ error: 'Invoice not found.' });
  }
});

router.delete(
  '/batch',
  authenticateToken,
  validate(invoiceBatchDeleteSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    const deleted = await invoiceRepository.bulkDelete(ids);
    res.json({ deleted, total: ids.length });
  }
);

export default router;
