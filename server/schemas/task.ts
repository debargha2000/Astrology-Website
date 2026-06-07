import { z } from 'zod';

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(300),
  status: z.enum(['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignee: z.string().min(1).max(100),
  daysLeft: z.number().int().nonnegative(),
});

export const taskCreateSchema = taskSchema.omit({ id: true });
export const taskUpdateSchema = taskCreateSchema.partial();
export const taskStatusUpdateSchema = z.object({
  status: taskSchema.shape.status,
});

export type Task = z.infer<typeof taskSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
export type TaskStatusUpdate = z.infer<typeof taskStatusUpdateSchema>;
