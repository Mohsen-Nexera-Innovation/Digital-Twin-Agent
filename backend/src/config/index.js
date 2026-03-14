import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  newsApiKey: process.env.NEWSAPI_KEY || '',
  redditUserAgent: process.env.REDDIT_USER_AGENT || 'AINewsAgent/1.0',
  dbPath: process.env.DB_PATH || './data/news.db',
  fetchCronSchedule: process.env.FETCH_CRON_SCHEDULE || '0 7 * * *',
  maxArticlesPerSource: parseInt(process.env.MAX_ARTICLES_PER_SOURCE || '30'),
  articleRetentionDays: parseInt(process.env.ARTICLE_RETENTION_DAYS || '30'),
  claudeModel: process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001',
  claudeMaxBatchSize: parseInt(process.env.CLAUDE_MAX_BATCH_SIZE || '10'),
};
