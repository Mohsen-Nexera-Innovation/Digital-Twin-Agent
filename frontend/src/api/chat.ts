import apiClient from './client';
import type { Article } from '../types/article';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  articles?: Article[];
  timestamp: number;
}

export interface ChatResponse {
  answer: string;
  articles: Article[];
}

export const chatApi = {
  send: (message: string, history: ChatMessage[]) =>
    apiClient.post<ChatResponse>('/chat', {
      message,
      history: history.slice(-6).map(m => ({ role: m.role, content: m.content })),
    }, { timeout: 30000 }).then(r => r.data),
};
