import { Router } from 'express';
import { TrendingTopic } from '../models/TrendingTopic.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), (req, res) => {
  const { period = 'today' } = req.query;
  const topics = period === 'week' ? TrendingTopic.getWeek() : TrendingTopic.getToday();
  res.json({ data: topics });
});

export default router;
