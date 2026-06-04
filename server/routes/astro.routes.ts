import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const entries = await DB.getAstroContent();
    res.json(entries);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type, key, title, interpretation, updatedBy } = req.body as {
      type?: string;
      key?: string;
      title?: string;
      interpretation?: string;
      updatedBy?: string;
    };
    if (!type || !key || !title || !interpretation) {
      return res.status(400).json({ error: 'type, key, title, and interpretation are required.' });
    }
    const validTypes = ['planet', 'ascendant', 'aspect', 'nakshatra'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
    }
    const entry = await DB.upsertAstroContent({
      type: type as 'planet' | 'ascendant' | 'aspect' | 'nakshatra',
      key,
      title,
      interpretation,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || 'admin',
    });
    res.status(200).json(entry);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, key, title, interpretation, updatedBy } = req.body as {
      type?: string;
      key?: string;
      title?: string;
      interpretation?: string;
      updatedBy?: string;
    };
    if (!type || !key || !title || !interpretation) {
      return res.status(400).json({ error: 'type, key, title, and interpretation are required.' });
    }
    const entry = await DB.upsertAstroContent({
      id,
      type: type as 'planet' | 'ascendant' | 'aspect' | 'nakshatra',
      key,
      title,
      interpretation,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || 'admin',
    });
    res.status(200).json(entry);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DB.deleteAstroContent(id);
    res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

router.post('/bulk-seed', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const { buildAstroDefaults } = await import('../astroDefaults.js');
    const defaults = buildAstroDefaults();
    const created = await DB.bulkUpsertAstroContent(defaults);
    res.status(200).json({ created: created.length, entries: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

export default router;
