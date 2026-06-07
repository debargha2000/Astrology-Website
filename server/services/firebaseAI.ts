import { VertexAI } from '@google-cloud/vertexai';

import { logger } from '../middleware/logging.js';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'aura-and-stone';
const LOCATION = process.env.FIREBASE_LOCATION || 'us-central1';

const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
    topP: 0.95,
  },
});

export interface ProductRecommendationInput {
  userBirthDetails: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
  };
  currentCart: Array<{ id: string; name: string; category: string; crystalsUsed: string[] }>;
  purchaseHistory: string[];
  userPreferences: {
    budget: 'low' | 'medium' | 'high';
    style: 'minimal' | 'statement' | 'spiritual';
    intent: 'wealth' | 'protection' | 'health' | 'relationships' | 'career' | 'general';
  };
}

export interface ChatbotInput {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext: {
    name: string;
    isAuthenticated: boolean;
    cartItems: number;
    currentPage: string;
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
  currentTransits: string[];
  focusArea: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'specific';
  specificQuestion?: string;
}

async function generateWithGemini(prompt: string): Promise<string> {
  try {
    const result = await generativeModel.generateContent(prompt);
    const response = result.response as unknown as {
      text?: () => string;
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    // Handle different response structures from Vertex AI Gemini API
    if (typeof response.text === 'function') {
      return response.text() || '';
    }
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0]!;
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const part = candidate.content.parts[0]!;
        if (part.text !== undefined) {
          return part.text;
        }
      }
    }
    return '';
  } catch (error) {
    logger.error({ error }, 'Gemini API error');
    throw new Error('Failed to generate AI response');
  }
}

export async function getProductRecommendations(
  input: ProductRecommendationInput
): Promise<string> {
  const prompt = `
You are an expert Vedic astrologer and crystal consultant for Aura & Stone.
Given the user's birth details and current cart, recommend 3 products from our catalog with detailed reasoning.

User Birth Details:
- Name: ${input.userBirthDetails.name}
- Birth Date: ${input.userBirthDetails.birthDate}
- Birth Time: ${input.userBirthDetails.birthTime || 'Not provided'}
- Birth Place: ${input.userBirthDetails.birthPlace || 'Not provided'}

Current Cart: ${JSON.stringify(input.currentCart)}
Purchase History: ${input.purchaseHistory.join(', ') || 'None'}
Preferences: Budget: ${input.userPreferences.budget}, Style: ${input.userPreferences.style}, Intent: ${input.userPreferences.intent}

Provide recommendations in this format:
1. Product Name - Brief astrological reasoning + specific crystal benefit
2. Product Name - Brief astrological reasoning + specific crystal benefit
3. Product Name - Brief astrological reasoning + specific crystal benefit

Keep responses concise, authentic to Vedic astrology, and practical.
`;

  return generateWithGemini(prompt);
}

export async function handleChatbotMessage(input: ChatbotInput): Promise<string> {
  const prompt = `
You are the Aura & Stone AI Assistant - knowledgeable about Vedic astrology, crystals, and our products.
Be helpful, authentic, and concise. Never make medical claims.

User Context:
- Name: ${input.userContext.name}
- Authenticated: ${input.userContext.isAuthenticated}
- Cart Items: ${input.userContext.cartItems}
- Current Page: ${input.userContext.currentPage}

Conversation History:
${input.conversationHistory.map((h) => `${h.role}: ${h.content}`).join('\n')}

Current Message: ${input.message}

Respond as the Aura & Stone assistant. Be warm, knowledgeable, and guide towards relevant products or astrological insights when appropriate.
`;

  return generateWithGemini(prompt);
}

export async function generateContent(input: ContentGenerationInput): Promise<string> {
  const toneInstructions = {
    professional: 'Professional, authoritative, trustworthy',
    spiritual: 'Sacred, reverent, connecting to ancient wisdom',
    luxury: 'Elegant, exclusive, aspirational',
    educational: 'Clear, informative, empowering',
  };

  const prompt = `
You are a content writer for Aura & Stone - premium Vedic crystal jewelry brand.
Create ${input.type} content with the following specifications:

Topic: ${input.topic}
Target Audience: ${input.targetAudience}
Tone: ${toneInstructions[input.tone]}
Key Points to Cover:
${input.keyPoints.map((p) => `- ${p}`).join('\n')}
Maximum Length: ${input.maxLength} words

Brand Voice: Authentic Vedic wisdom meets modern luxury. Use Sanskrit terms appropriately.
Products: Money Magnet (Citrine/Pyrite), Evil Eye (Black Tourmaline), Stress Killer (Amethyst), etc.
`;

  return generateWithGemini(prompt);
}

export async function getAstrologyInsights(input: AstrologyInsightInput): Promise<string> {
  const prompt = `
You are a senior Vedic astrologer providing personalized insights for Aura & Stone customers.
Provide authentic, practical astrological guidance without making deterministic predictions.

Birth Details:
- Name: ${input.birthDetails.name}
- Date: ${input.birthDetails.birthDate}
- Time: ${input.birthDetails.birthTime || 'Not provided'}
- Place: ${input.birthDetails.birthPlace || 'Not provided'}

Current Transits: ${input.currentTransits.join(', ')}
Focus: ${input.focusArea}
${input.specificQuestion ? `Specific Question: ${input.specificQuestion}` : ''}

Provide insights in this format:
1. Current Planetary Influence
2. Recommended Crystal Support
3. Practical Actions
4. Auspicious Timing (if applicable)

Be authentic to Vedic principles, practical, and empowering.
`;

  return generateWithGemini(prompt);
}
