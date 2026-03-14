import cron from 'node-cron';
import { AggregatorService } from '../services/AggregatorService.js';
import { ProcessingPipeline } from '../services/ProcessingPipeline.js';
import { FetchLog } from '../models/FetchLog.js';
import { clearCache } from '../middleware/cache.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

async function runFullCycle() {
  logger.info('Running scheduled fetch cycle...');
  try {
    await AggregatorService.runFetchCycle();
    await ProcessingPipeline.processUnhandledArticles();
    clearCache();
    logger.info('Scheduled fetch cycle completed');
  } catch (err) {
    logger.error(`Scheduled fetch cycle failed: ${err.message}`);
  }
}

export function startCronJobs() {
  cron.schedule(config.fetchCronSchedule, runFullCycle);
  logger.info(`Daily fetch cron scheduled: ${config.fetchCronSchedule}`);

  // Run on startup if no fetch in last 20 hours
  const lastRun = FetchLog.getLastRun();
  if (!lastRun || new Date() - new Date(lastRun.run_at) > 20 * 60 * 60 * 1000) {
    logger.info('No recent fetch found, running initial fetch...');
    setTimeout(runFullCycle, 3000); // 3s delay to let server fully start
  }
}
