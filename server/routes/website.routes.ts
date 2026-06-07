import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { websiteContentRepository, checkpointRepository } from '../repositories/index.js';

const router = Router();

const websiteContentSchema = z.object({
  brandName: z.string().min(1).max(100),
  brandSubtitle: z.string().min(1).max(100),
  heroHeadline: z.string().min(1).max(100),
  heroHighlight: z.string().min(1).max(100),
  heroParagraph: z.string().min(1).max(1000),
  founderQuote: z.string().min(1).max(2000),
  founderQuoteSubtitle: z.string().min(1).max(200),
  historyHeadline: z.string().min(1).max(200),
  historyParagraph1: z.string().min(1).max(2000),
  historyParagraph2: z.string().min(1).max(2000),
  bannerImage: z.union([z.string().url(), z.string().startsWith('/')]),
});

const checkpointCreateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

router.get('/content', async (_req: Request, res: Response): Promise<void> => {
  try {
    const content = await websiteContentRepository.findAll();
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post(
  '/content',
  authenticateToken,
  validate(websiteContentSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const content = await websiteContentRepository.save(req.body);
      res.status(200).json(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.get(
  '/checkpoints',
  authenticateToken,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const checkpoints = await checkpointRepository.findAll();
      res.json(checkpoints);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/checkpoints',
  authenticateToken,
  validate(checkpointCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.body;
      const user = req.user?.username || 'debarghapakhira@gmail.com';
      const checkpoint = await checkpointRepository.create(title, user);
      res.status(201).json(checkpoint);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/checkpoints/:id/rollback',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Missing checkpoint ID.' });
        return;
      }
      await checkpointRepository.rollback(id);
      res.json({ message: 'Rollback succeeded.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

export default router;
