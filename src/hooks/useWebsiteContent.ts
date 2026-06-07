import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../lib/api';
import { websiteContentSchema, type WebsiteContent } from '../schemas';

const WEBSITE_CONTENT_KEY = ['websiteContent'] as const;

export function useWebsiteContent() {
  return useQuery({
    queryKey: WEBSITE_CONTENT_KEY,
    queryFn: async () => {
      const data = await api.get<unknown>('/api/website/content');
      return websiteContentSchema.parse(data) as WebsiteContent;
    },
  });
}

export function useSaveWebsiteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      const data = await api.post<unknown>('/api/website/content', content);
      return websiteContentSchema.parse(data) as WebsiteContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBSITE_CONTENT_KEY });
    },
  });
}
