import 'dotenv/config';
import { runMigrations } from '../database/migrations.js';
import { AggregatorService } from '../services/AggregatorService.js';
import { ProcessingPipeline } from '../services/ProcessingPipeline.js';
import { logger } from '../utils/logger.js';

runMigrations();
logger.info('Starting manual fetch...');
await AggregatorService.runFetchCycle();
await ProcessingPipeline.processUnhandledArticles();
logger.info('Manual fetch complete');
process.exit(0);
