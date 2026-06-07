import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { astroContentRepository } from '../repositories/index.js';

const router = Router();

const astroContentCreateSchema = z.object({
  type: z.enum(['planet', 'ascendant', 'aspect', 'nakshatra']),
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  interpretation: z.string().min(1).max(10000),
  updatedBy: z.string().email().optional(),
});

const astroContentUpdateSchema = astroContentCreateSchema.partial();
const astroContentBulkCreateSchema = z.object({
  entries: z.array(astroContentCreateSchema).min(1),
});

router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await astroContentRepository.findAll();
    res.json(entries);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post(
  '/',
  authenticateToken,
  validate(astroContentCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const entry = await astroContentRepository.create(req.body);
      res.status(200).json(entry);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(astroContentUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Missing content ID.' });
        return;
      }
      const entry = await astroContentRepository.update(id, req.body);
      if (entry) {
        res.status(200).json(entry);
      } else {
        res.status(404).json({ error: 'Content not found.' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing content ID.' });
      return;
    }
    await astroContentRepository.delete(id);
    res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post(
  '/bulk-seed',
  authenticateToken,
  validate(astroContentBulkCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { entries } = req.body;
      const created = await astroContentRepository.bulkCreate(entries);
      res.status(200).json({ created: created.length, entries: created });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

export default router;
