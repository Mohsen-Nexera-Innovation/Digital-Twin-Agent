import apiClient from './client';

export const adminApi = {
  triggerFetch: () => apiClient.post('/admin/fetch').then(r => r.data),
};
