import { z } from 'zod';

export const googleLoginSchema = z.object({
  email: z.string().email(),
  uid: z.string().min(1),
  displayName: z.string().min(1).max(200),
  recaptchaToken: z.string().optional(),
});

export const authResponseSchema = z.object({
  token: z.string().min(1),
  role: z.literal('admin'),
  username: z.string().email(),
});

export type GoogleLogin = z.infer<typeof googleLoginSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;