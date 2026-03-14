import { Router } from 'express';
import { Article } from '../models/Article.js';

const router = Router();

router.get('/', (req, res) => {
  const { q, limit = 20 } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ data: [] });
  }
  const results = Article.search(q.trim(), Math.min(parseInt(limit), 50));
  res.json({ data: results });
});

export default router;
