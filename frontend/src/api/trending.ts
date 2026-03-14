import apiClient from './client';
import type { TrendingTopic, ApiResponse } from '../types/article';

export const trendingApi = {
  get: (period: 'today' | 'week' = 'today') =>
    apiClient.get<ApiResponse<TrendingTopic[]>>('/trending', { params: { period } }).then(r => r.data),
};
