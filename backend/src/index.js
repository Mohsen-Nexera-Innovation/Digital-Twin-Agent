import 'dotenv/config';
import app from './app.js';
import { runMigrations } from './database/migrations.js';
import { startCronJobs } from './jobs/dailyFetch.js';
import { startCleanupJob } from './jobs/cleanup.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    // Run DB migrations
    runMigrations();

    // Start HTTP server
    app.listen(config.port, () => {
      logger.info(`AI News Agent backend running on http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    // Start scheduled jobs
    startCronJobs();
    startCleanupJob();
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
