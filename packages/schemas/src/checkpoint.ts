import { z } from 'zod';
import { productSchema } from './product';
import { websiteContentSchema } from './websiteContent';

export const checkpointSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  title: z.string().min(1).max(200),
  user: z.string().email(),
  websiteContent: websiteContentSchema,
  products: z.array(productSchema),
});

export const checkpointCreateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export type Checkpoint = z.infer<typeof checkpointSchema>;
export type CheckpointCreate = z.infer<typeof checkpointCreateSchema>;