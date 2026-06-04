import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/csrf-token', (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.get('/logs', authenticateToken, async (_req: Request, res: Response) => {
  const logs = await DB.getLogs();
  res.json(logs);
});

router.get('/email-records', authenticateToken, async (_req: Request, res: Response) => {
  const records = await DB.getEmailRecords();
  res.json(records);
});

router.post('/email-records', authenticateToken, async (req: Request, res: Response) => {
  const { clientName, email, subject } = req.body as {
    clientName?: string;
    email?: string;
    subject?: string;
  };
  if (!email || !subject) {
    return res.status(400).json({ error: 'Email and subject are required.' });
  }
  const record = await DB.addEmailRecord({
    clientName: clientName || 'Staff Dispatcher',
    email,
    subject,
    dateStr: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  });
  res.status(201).json(record);
});

export default router;
