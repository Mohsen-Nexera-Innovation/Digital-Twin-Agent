import { Router } from 'express';
import { Article } from '../models/Article.js';
import { ALL_CATEGORIES } from '../config/categories.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(600), (req, res) => {
  const counts = Article.getCategoryCounts();
  const categories = ALL_CATEGORIES.map(name => ({
    name,
    count: counts[name] || 0,
  })).sort((a, b) => b.count - a.count);
  res.json({ data: categories });
});

export default router;
