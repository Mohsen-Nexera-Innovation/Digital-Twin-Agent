import apiClient from './client';
import type { Article, ApiListResponse, ApiResponse } from '../types/article';

export interface ArticleFilters {
  page?: number;
  limit?: number;
  category?: string | null;
  source?: string | null;
  sort?: string;
}

export const articlesApi = {
  getAll: (filters: ArticleFilters = {}) =>
    apiClient.get<ApiListResponse<Article>>('/articles', { params: filters }).then(r => r.data),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Article>>(`/articles/${id}`).then(r => r.data),

  getFeatured: () =>
    apiClient.get<ApiResponse<Article[]>>('/articles/featured').then(r => r.data),

  search: (q: string) =>
    apiClient.get<ApiResponse<Article[]>>('/search', { params: { q } }).then(r => r.data),
};
