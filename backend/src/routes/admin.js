import { Router } from 'express';
import { AggregatorService } from '../services/AggregatorService.js';
import { ProcessingPipeline } from '../services/ProcessingPipeline.js';
import { clearCache } from '../middleware/cache.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/fetch', async (req, res) => {
  try {
    res.json({ message: 'Fetch cycle started in background' });
    // Run async after response
    setImmediate(async () => {
      await AggregatorService.runFetchCycle();
      await ProcessingPipeline.processUnhandledArticles();
      clearCache();
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/process', async (req, res) => {
  try {
    res.json({ message: 'Processing pipeline started in background' });
    setImmediate(async () => {
      await ProcessingPipeline.processUnhandledArticles();
      clearCache();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
