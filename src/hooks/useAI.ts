import { useMutation } from '@tanstack/react-query';

import { api } from '../lib/api';

export interface RecommendationInput {
  userBirthDetails: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  };
  currentCart?: Array<{ id: string; name: string; category: string; crystalsUsed: string[] }>;
  purchaseHistory?: string[];
  userPreferences?: {
    budget?: 'low' | 'medium' | 'high';
    style?: 'minimal' | 'statement' | 'spiritual';
    intent?: 'wealth' | 'protection' | 'health' | 'relationships' | 'career' | 'general';
  };
}

export interface ChatbotInput {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext?: {
    name: string;
    isAuthenticated: boolean;
    cartItems?: number;
    currentPage?: string;
  };
}

export interface ContentGenerationInput {
  type: 'product-description' | 'blog-post' | 'email-campaign' | 'social-media';
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'spiritual' | 'luxury' | 'educational';
  keyPoints: string[];
  maxLength: number;
}

export interface AstrologyInsightInput {
  birthDetails: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  };
  currentTransits?: string[];
  focusArea: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'specific';
  specificQuestion?: string;
}

export function useProductRecommendations() {
  return useMutation({
    mutationFn: async (input: RecommendationInput) => {
      const response = await api.post<{ result: string }>('/api/ai/recommendations', input);
      return response.result;
    },
  });
}

export function useChatbot() {
  return useMutation({
    mutationFn: async (input: ChatbotInput) => {
      const response = await api.post<{ result: string }>('/api/ai/chatbot', input);
      return response.result;
    },
  });
}

export function useContentGeneration() {
  return useMutation({
    mutationFn: async (input: ContentGenerationInput) => {
      const response = await api.post<{ result: string }>('/api/ai/generate-content', input);
      return response.result;
    },
  });
}

export function useAstrologyInsights() {
  return useMutation({
    mutationFn: async (input: AstrologyInsightInput) => {
      const response = await api.post<{ result: string }>('/api/ai/astrology-insights', input);
      return response.result;
    },
  });
}
