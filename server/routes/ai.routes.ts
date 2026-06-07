import { Router, Request, Response } from 'express';
import { z } from 'zod';

import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import {
  getProductRecommendations,
  handleChatbotMessage,
  generateContent,
  getAstrologyInsights,
} from '../services/firebaseAI.js';

const router = Router();

const recommendationSchema = z.object({
  userBirthDetails: z.object({
    name: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional(),
  }),
  currentCart: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        crystalsUsed: z.array(z.string()),
      })
    )
    .optional(),
  purchaseHistory: z.array(z.string()).optional(),
  userPreferences: z
    .object({
      budget: z.enum(['low', 'medium', 'high']).optional(),
      style: z.enum(['minimal', 'statement', 'spiritual']).optional(),
      intent: z
        .enum(['wealth', 'protection', 'health', 'relationships', 'career', 'general'])
        .optional(),
    })
    .optional(),
});

const chatbotSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
  userContext: z
    .object({
      name: z.string(),
      isAuthenticated: z.boolean(),
      cartItems: z.number().optional(),
      currentPage: z.string().optional(),
    })
    .optional(),
});

const contentSchema = z.object({
  type: z.enum(['product-description', 'blog-post', 'email-campaign', 'social-media']),
  topic: z.string().min(1).max(500),
  targetAudience: z.string().min(1).max(200),
  tone: z.enum(['professional', 'spiritual', 'luxury', 'educational']),
  keyPoints: z.array(z.string().min(1).max(200)).max(10),
  maxLength: z.number().int().positive().max(5000),
});

const astrologySchema = z.object({
  birthDetails: z.object({
    name: z.string().min(1),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    birthTime: z.string().optional(),
    birthPlace: z.string().optional(),
  }),
  currentTransits: z.array(z.string()).optional(),
  focusArea: z.enum(['daily', 'weekly', 'monthly', 'yearly', 'specific']),
  specificQuestion: z.string().max(1000).optional(),
});

router.post(
  '/recommendations',
  authenticateToken,
  validate(recommendationSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getProductRecommendations(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/chatbot',
  validate(chatbotSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await handleChatbotMessage(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/generate-content',
  authenticateToken,
  validate(contentSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await generateContent(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

router.post(
  '/astrology-insights',
  validate(astrologySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getAstrologyInsights(req.body);
      res.json({ result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
);

export default router;
