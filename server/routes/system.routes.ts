import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { logRepository, emailRecordRepository } from '../repositories/index.js';

const router = Router();

const emailRecordCreateSchema = z.object({
  clientName: z.string().max(200).optional(),
  email: z.string().email(),
  subject: z.string().min(1).max(500),
});

router.get('/csrf-token', (req: Request, res: Response): void => {
  const token = req.csrfToken?.();
  res.json({ csrfToken: token || '' });
});

router.get('/logs', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  const logs = await logRepository.findAll();
  res.json(logs);
});

router.get(
  '/email-records',
  authenticateToken,
  async (_req: Request, res: Response): Promise<void> => {
    const records = await emailRecordRepository.findAll();
    res.json(records);
  }
);

router.post(
  '/email-records',
  authenticateToken,
  validate(emailRecordCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const record = await emailRecordRepository.create(req.body);
    res.status(201).json(record);
  }
);

export default router;
