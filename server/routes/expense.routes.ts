import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { expenseRepository } from '../repositories/index.js';

const router = Router();

const expenseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().max(100).optional(),
  amount: z.number().int().positive(),
  notes: z.string().max(1000).optional(),
});

const expenseUpdateSchema = expenseCreateSchema.partial();
const expenseBatchCreateSchema = z.object({
  items: z.array(expenseCreateSchema).min(1),
});
const expenseBatchDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  const expenses = await expenseRepository.findAll();
  res.json(expenses);
});

router.post(
  '/',
  authenticateToken,
  validate(expenseCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const expense = await expenseRepository.create(req.body);
    res.status(201).json(expense);
  }
);

router.post(
  '/batch',
  authenticateToken,
  validate(expenseBatchCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    const created = await expenseRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(expenseUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing expense ID.' });
      return;
    }
    const updated = await expenseRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Expense not found.' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing expense ID.' });
    return;
  }
  const success = await expenseRepository.delete(id);
  if (success) {
    res.json({ message: 'Expense records successfully archived.' });
  } else {
    res.status(404).json({ error: 'Expense not found.' });
  }
});

router.delete(
  '/batch',
  authenticateToken,
  validate(expenseBatchDeleteSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    const deleted = await expenseRepository.bulkDelete(ids);
    res.json({ deleted, total: ids.length });
  }
);

export default router;
