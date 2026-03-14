import cron from 'node-cron';
import { Article } from '../models/Article.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export function startCleanupJob() {
  // Run cleanup at 3 AM daily
  cron.schedule('0 3 * * *', () => {
    const result = Article.deleteOlderThan(config.articleRetentionDays);
    logger.info(`Cleanup: removed ${result.changes} articles older than ${config.articleRetentionDays} days`);
  });
}
