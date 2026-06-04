import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  const vendors = await DB.getVendors();
  res.json(vendors);
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { name, contact, origin, category, leadTime, leadGems } = req.body as {
    name?: string;
    contact?: string;
    origin?: string;
    category?: string;
    leadTime?: string;
    leadGems?: string;
  };
  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and contact person are required.' });
  }

  const vendor = await DB.addVendor({
    name,
    contact,
    origin: origin || 'Himalayan Foothills',
    category: category || 'Raw Crystals',
    leadTime: leadTime || '5 Days',
    leadGems: leadGems || 'Crystalline beads',
  });
  res.status(201).json(vendor);
});

router.post('/batch', authenticateToken, async (req: Request, res: Response) => {
  const { items } = req.body as { items?: any[] };
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required.' });
  }
  const created = await DB.bulkCreateVendors(
    items.map((i) => ({
      name: i.name || 'Unknown Vendor',
      contact: i.contact || 'Unknown',
      origin: i.origin || 'Himalayan Foothills',
      category: i.category || 'Raw Crystals',
      leadTime: i.leadTime || '5 Days',
      leadGems: i.leadGems || 'Crystalline beads',
    }))
  );
  res.status(201).json({ count: created.length, items: created });
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { name, contact, origin, category, leadTime, leadGems, status, rating } = req.body as {
    name?: string;
    contact?: string;
    origin?: string;
    category?: string;
    leadTime?: string;
    leadGems?: string;
    status?: string;
    rating?: number;
  };
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (contact !== undefined) updates.contact = contact;
  if (origin !== undefined) updates.origin = origin;
  if (category !== undefined) updates.category = category;
  if (leadTime !== undefined) updates.leadTime = leadTime;
  if (leadGems !== undefined) updates.leadGems = leadGems;
  if (status !== undefined) updates.status = status;
  if (rating !== undefined) updates.rating = rating;

  const updated = await DB.updateVendor(req.params.id, updates as any);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Vendor signature reference not found.' });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteVendor(req.params.id);
  if (success) {
    res.json({ message: 'Vendor registration successfully suspended.' });
  } else {
    res.status(404).json({ error: 'Vendor signature reference not found.' });
  }
});

export default router;
