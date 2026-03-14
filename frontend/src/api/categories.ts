import apiClient from './client';
import type { Category, ApiResponse } from '../types/article';

export const categoriesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>('/categories').then(r => r.data),
};
