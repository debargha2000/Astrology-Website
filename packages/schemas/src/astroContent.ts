import { z } from 'zod';

export const astroContentTypeSchema = z.enum(['planet', 'ascendant', 'aspect', 'nakshatra']);

export const astroContentSchema = z.object({
  id: z.string().min(1),
  type: astroContentTypeSchema,
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  interpretation: z.string().min(1).max(10000),
  updatedAt: z.string().datetime(),
  updatedBy: z.string().email(),
});

export const astroContentCreateSchema = astroContentSchema.omit({
  id: true,
  updatedAt: true,
  updatedBy: true,
});
export const astroContentUpdateSchema = astroContentCreateSchema.partial();
export const astroContentBulkCreateSchema = z.object({
  entries: z.array(astroContentCreateSchema).min(1),
});

export type AstroContent = z.infer<typeof astroContentSchema>;
export type AstroContentType = z.infer<typeof astroContentTypeSchema>;
export type AstroContentCreate = z.infer<typeof astroContentCreateSchema>;
export type AstroContentUpdate = z.infer<typeof astroContentUpdateSchema>;
export type AstroContentBulkCreate = z.infer<typeof astroContentBulkCreateSchema>;