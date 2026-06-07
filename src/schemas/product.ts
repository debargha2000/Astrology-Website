import { z } from 'zod';

export const productSpecificationsSchema = z.object({
  beadSize: z.string().optional(),
  beadCount: z.number().int().positive().optional(),
  threadMaterial: z.string().optional(),
  origin: z.string().optional(),
  chargeTime: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  originalPrice: z.number().int().positive(),
  salePrice: z.number().int().positive(),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().nonnegative(),
  description: z.string().min(1),
  shortDescription: z.string().min(1).max(500),
  benefits: z.array(z.string().min(1)).min(1),
  crystalsUsed: z.array(z.string().min(1)).min(1),
  imageUrl: z.union([z.string().url(), z.string().startsWith('/')]),
  videoUrl: z.union([z.string().url(), z.string().startsWith('/')]).optional(),
  category: z.enum(['bracelet', 'ring', 'combo', 'zodiac']),
  stockStatus: z.enum(['in-stock', 'low-stock', 'pre-order']),
  zodiacConnection: z.array(z.string()).optional(),
  isBestSeller: z.boolean().optional(),
  specifications: productSpecificationsSchema,
});

export const productCreateSchema = productSchema.omit({ id: true });
export const productUpdateSchema = productCreateSchema.partial();

export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductSpecifications = z.infer<typeof productSpecificationsSchema>;
