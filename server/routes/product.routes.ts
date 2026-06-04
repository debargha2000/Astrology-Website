import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await DB.getProducts();
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = await DB.saveProduct(req.body);
    res.status(200).json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await DB.deleteProduct(req.params.id);
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
