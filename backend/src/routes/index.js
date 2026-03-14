import { Router } from 'express';
import articlesRouter from './articles.js';
import categoriesRouter from './categories.js';
import trendingRouter from './trending.js';
import searchRouter from './search.js';
import sourcesRouter from './sources.js';
import adminRouter from './admin.js';
import chatRouter from './chat.js';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/categories', categoriesRouter);
router.use('/trending', trendingRouter);
router.use('/search', searchRouter);
router.use('/sources', sourcesRouter);
router.use('/admin', adminRouter);
router.use('/chat', chatRouter);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
