export interface Article {
  id: number;
  guid: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  source_id?: number;
  source_name: string;
  author?: string;
  published_at?: string;
  fetched_at: string;
  processed_at?: string;
  categories: string[];
  tags: string[];
  trending_score: number;
  image_url?: string;
  is_featured: number;
}

export interface Category {
  name: string;
  count: number;
}

export interface TrendingTopic {
  topic: string;
  count: number;
}

export interface Source {
  id: number;
  name: string;
  type: string;
  url: string;
  enabled: number;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiMeta;
}

export interface ApiResponse<T> {
  data: T;
}
