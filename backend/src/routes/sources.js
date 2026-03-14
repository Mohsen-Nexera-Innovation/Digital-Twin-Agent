import { Router } from 'express';
import { Source } from '../models/Source.js';
import { FetchLog } from '../models/FetchLog.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(600), (req, res) => {
  const sources = Source.findAll();
  res.json({ data: sources });
});

router.get('/logs', (req, res) => {
  const logs = FetchLog.getRecent(20);
  res.json({ data: logs });
});

export default router;
