import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/content', async (_req: Request, res: Response) => {
  try {
    const content = await DB.getWebsiteContent();
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/content', authenticateToken, async (req: Request, res: Response) => {
  try {
    const content = await DB.saveWebsiteContent(req.body);
    res.status(200).json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.get('/checkpoints', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const checkpoints = await DB.getCheckpoints();
    res.json(checkpoints);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/checkpoints', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title } = req.body as { title?: string };
    const checkpoint = await DB.createCheckpoint(
      title || 'Periodic Operational Checkpoint',
      req.user?.username || 'debarghapakhira@gmail.com'
    );
    res.status(201).json(checkpoint);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/checkpoints/:id/rollback', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await DB.rollbackToCheckpoint(req.params.id);
    if (success) {
      res.json({ message: 'Rollback succeeded.' });
    } else {
      res.status(404).json({ error: 'Rollback failed.' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
