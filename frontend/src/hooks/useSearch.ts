import { useState, useEffect } from 'react';
import { articlesApi } from '../api/articles';
import type { Article } from '../types/article';

export function useSearch(query: string) {
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await articlesApi.search(query);
        setResults(data.data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
