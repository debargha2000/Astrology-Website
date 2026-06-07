import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { taskRepository } from '../repositories/index.js';

const router = Router();

const taskCreateSchema = z.object({
  title: z.string().min(1).max(300),
  status: z.enum(['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  assignee: z.string().min(1).max(100),
  daysLeft: z.number().int().nonnegative().optional(),
});

const taskUpdateSchema = taskCreateSchema.partial();
const taskStatusUpdateSchema = z.object({
  status: z.enum(['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed']),
});

router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  const tasks = await taskRepository.findAll();
  res.json(tasks);
});

router.post(
  '/',
  authenticateToken,
  validate(taskCreateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const task = await taskRepository.create(req.body);
    res.status(201).json(task);
  }
);

router.put(
  '/:id',
  authenticateToken,
  validate(taskUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing task ID.' });
      return;
    }
    const updated = await taskRepository.update(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Task not found.' });
    }
  }
);

router.put(
  '/:id/status',
  authenticateToken,
  validate(taskStatusUpdateSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Missing task ID.' });
      return;
    }
    const updatedTask = await taskRepository.updateStatus(id, req.body.status);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ error: 'Task not found.' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing task ID.' });
    return;
  }
  const success = await taskRepository.delete(id);
  if (success) {
    res.json({ message: 'Task resolved/archived.' });
  } else {
    res.status(404).json({ error: 'Task not found.' });
  }
});

export default router;
