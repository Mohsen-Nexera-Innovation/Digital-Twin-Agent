import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Source, ApiResponse } from '../types/article';

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: () => apiClient.get<ApiResponse<Source[]>>('/sources').then(r => r.data),
    staleTime: 30 * 60 * 1000,
  });
}
