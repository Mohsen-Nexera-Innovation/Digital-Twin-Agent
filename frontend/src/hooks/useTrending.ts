import { useQuery } from '@tanstack/react-query';
import { trendingApi } from '../api/trending';

export function useTrending(period: 'today' | 'week' = 'today') {
  return useQuery({
    queryKey: ['trending', period],
    queryFn: () => trendingApi.get(period),
    staleTime: 10 * 60 * 1000,
  });
}
