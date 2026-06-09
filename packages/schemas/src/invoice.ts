import { z } from 'zod';

export const invoiceSchema = z.object({
  id: z.string().min(1),
  client: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  item: z.string().min(1).max(500),
  amount: z.number().int().positive(),
  status: z.enum(['Paid', 'Sent', 'Overdue', 'Draft']),
  alignment: z.string().min(1).max(200),
});

export const invoiceCreateSchema = invoiceSchema.omit({ id: true });
export const invoiceUpdateSchema = invoiceCreateSchema.partial();
export const invoiceBatchCreateSchema = z.object({
  items: z.array(invoiceCreateSchema).min(1),
});
export const invoiceBatchDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>;
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>;
export type InvoiceBatchCreate = z.infer<typeof invoiceBatchCreateSchema>;
export type InvoiceBatchDelete = z.infer<typeof invoiceBatchDeleteSchema>;