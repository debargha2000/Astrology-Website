import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { productRepository } from '../repositories/index.js';

const router = Router();

const productCreateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  originalPrice: z.number().int().positive(),
  salePrice: z.number().int().positive(),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().nonnegative(),
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(500),
  benefits: z.array(z.string().min(1)).min(1),
  crystalsUsed: z.array(z.string().min(1)).min(1),
  imageUrl: z.union([z.string().url(), z.string().startsWith('/')]),
  videoUrl: z.union([z.string().url(), z.string().startsWith('/')]).optional(),
  category: z.enum(['bracelet', 'ring', 'combo', 'zodiac']),
  stockStatus: z.enum(['in-stock', 'low-stock', 'pre-order']),
  zodiacConnection: z.array(z.string()).optional(),
  isBestSeller: z.boolean().optional(),
  specifications: z.object({
    beadSize: z.string().optional(),
    beadCount: z.number().int().positive().optional(),
    threadMaterial: z.string().optional(),
    origin: z.string().optional(),
    chargeTime: z.string().optional(),
  }),
});

const productUpdateSchema = productCreateSchema.partial();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await productRepository.findAll();
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post(
  '/',
  authenticateToken,
  validate(productCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await productRepository.create(req.body);
      res.status(200).json(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(productUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Missing product ID.' });
        return;
      }
      const product = await productRepository.update(id, req.body);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found.' });
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
      res.status(400).json({ error: 'Missing product ID.' });
      return;
    }
    const success = await productRepository.delete(id);
    if (success) {
      res.json({ message: 'Product deleted.' });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
