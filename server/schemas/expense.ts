import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  amount: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).optional(),
});

export const expenseCreateSchema = expenseSchema.omit({ id: true, date: true });
export const expenseUpdateSchema = expenseCreateSchema.partial();
export const expenseBatchCreateSchema = z.object({
  items: z.array(expenseCreateSchema).min(1),
});
export const expenseBatchDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;
export type ExpenseBatchCreate = z.infer<typeof expenseBatchCreateSchema>;
export type ExpenseBatchDelete = z.infer<typeof expenseBatchDeleteSchema>;
