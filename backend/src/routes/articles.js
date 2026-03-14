import { Router } from 'express';
import { Article } from '../models/Article.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(180), (req, res) => {
  const { page = 1, limit = 20, category, source, sort } = req.query;
  const result = Article.findAll({
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 50),
    category,
    source,
    sort,
  });
  res.json(result);
});

router.get('/featured', cacheMiddleware(300), (req, res) => {
  const featured = Article.findFeatured(3);
  res.json({ data: featured });
});

router.get('/:id', (req, res) => {
  const article = Article.findById(parseInt(req.params.id));
  if (!article) return res.status(404).json({ error: { message: 'Article not found' } });
  res.json({ data: article });
});

export default router;

