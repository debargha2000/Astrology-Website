import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, async (_req: Request, res: Response) => {
  const tasks = await DB.getTasks();
  res.json(tasks);
});

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { title, status, priority, assignee, daysLeft } = req.body as {
    title?: string;
    status?: 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed';
    priority?: 'Low' | 'Medium' | 'High';
    assignee?: string;
    daysLeft?: number | string;
  };
  if (!title || !assignee) {
    return res.status(400).json({ error: 'Title and responsible assignee are mandatory fields.' });
  }

  const task = await DB.addTask({
    title,
    status: status || 'Backlog',
    priority: priority || 'Medium',
    assignee,
    daysLeft: Number(daysLeft) || 3,
  });
  res.status(201).json(task);
});

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { title, status, priority, assignee, daysLeft } = req.body as {
    title?: string;
    status?: 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed';
    priority?: 'Low' | 'Medium' | 'High';
    assignee?: string;
    daysLeft?: number | string;
  };
  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (assignee !== undefined) updates.assignee = assignee;
  if (daysLeft !== undefined) updates.daysLeft = Number(daysLeft);

  const updated = await DB.updateTask(req.params.id, updates as any);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Vedic task identifier not discovered.' });
  }
});

router.put('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  const { status } = req.body as { status?: string };
  if (!status) {
    return res.status(400).json({ error: 'Missing state status parameter.' });
  }

  const updatedTask = await DB.updateTaskStatus(
    req.params.id,
    status as 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed'
  );
  if (updatedTask) {
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: 'Vedic task identifier not discovered.' });
  }
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteTask(req.params.id);
  if (success) {
    res.json({ message: 'Task resolved/archived.' });
  } else {
    res.status(404).json({ error: 'Task signature reference not found.' });
  }
});

export default router;
