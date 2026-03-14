import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { articlesApi, type ArticleFilters } from '../api/articles';

export function useArticles(filters: ArticleFilters) {
  return useQuery({
    queryKey: ['articles', filters],
    queryFn: () => articlesApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['articles', 'featured'],
    queryFn: () => articlesApi.getFeatured(),
    staleTime: 10 * 60 * 1000,
  });
}
