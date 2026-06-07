import { z } from 'zod';

export const vendorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  contact: z.string().min(1).max(200),
  origin: z.string().min(1).max(200),
  rating: z.number().int().min(1).max(5),
  category: z.string().min(1).max(100),
  leadTime: z.string().min(1).max(50),
  leadGems: z.string().min(1).max(200),
  status: z.enum(['Approved', 'Under Review', 'Suspended']),
});

export const vendorCreateSchema = vendorSchema.omit({ id: true, rating: true, status: true });
export const vendorUpdateSchema = vendorCreateSchema.partial().extend({
  rating: z.number().int().min(1).max(5).optional(),
  status: z.enum(['Approved', 'Under Review', 'Suspended']).optional(),
});
export const vendorBatchCreateSchema = z.object({
  items: z.array(vendorCreateSchema).min(1),
});

export type Vendor = z.infer<typeof vendorSchema>;
export type VendorCreate = z.infer<typeof vendorCreateSchema>;
export type VendorUpdate = z.infer<typeof vendorUpdateSchema>;
export type VendorBatchCreate = z.infer<typeof vendorBatchCreateSchema>;
