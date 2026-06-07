import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { vendorRepository } from '../repositories/index.js';

const router = Router();

const vendorCreateSchema = z.object({
  name: z.string().min(1).max(200),
  contact: z.string().min(1).max(200),
  origin: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  leadTime: z.string().max(50).optional(),
  leadGems: z.string().max(200).optional(),
});

const vendorUpdateSchema = vendorCreateSchema.partial().extend({
  rating: z.number().int().min(1).max(5).optional(),
  status: z.enum(['Approved', 'Under Review', 'Suspended']).optional(),
});

const vendorBatchCreateSchema = z.object({
  items: z.array(vendorCreateSchema).min(1),
});

router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  const vendors = await vendorRepository.findAll();
  res.json(vendors);
});

router.post(
  '/',
  authenticateToken,
  validate(vendorCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const vendor = await vendorRepository.create(req.body);
    res.status(201).json(vendor);
  }
);

router.post(
  '/batch',
  authenticateToken,
  validate(vendorBatchCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    const created = await vendorRepository.bulkCreate(items);
    res.status(201).json({ count: created.length, items: created });
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(vendorUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing vendor ID.' });
      return;
    }
    const updated = await vendorRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Vendor not found.' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing vendor ID.' });
    return;
  }
  const success = await vendorRepository.delete(id);
  if (success) {
    res.json({ message: 'Vendor registration successfully suspended.' });
  } else {
    res.status(404).json({ error: 'Vendor not found.' });
  }
});

export default router;
