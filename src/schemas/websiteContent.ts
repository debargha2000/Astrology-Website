import { z } from 'zod';

export const websiteContentSchema = z.object({
  brandName: z.string().min(1).max(100),
  brandSubtitle: z.string().min(1).max(100),
  heroHeadline: z.string().min(1).max(100),
  heroHighlight: z.string().min(1).max(100),
  heroParagraph: z.string().min(1).max(1000),
  founderQuote: z.string().min(1).max(2000),
  founderQuoteSubtitle: z.string().min(1).max(200),
  historyHeadline: z.string().min(1).max(200),
  historyParagraph1: z.string().min(1).max(2000),
  historyParagraph2: z.string().min(1).max(2000),
  bannerImage: z.union([z.string().url(), z.string().startsWith('/')]),
});

export type WebsiteContent = z.infer<typeof websiteContentSchema>;
