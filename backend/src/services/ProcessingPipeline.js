import { Article } from '../models/Article.js';
import { Summarizer } from './ai/Summarizer.js';
import { Categorizer } from './ai/Categorizer.js';
import { TrendAnalyzer } from './ai/TrendAnalyzer.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { getDb } from '../database/connection.js';

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export const ProcessingPipeline = {
  async processUnhandledArticles() {
    if (!config.anthropicApiKey) {
      logger.warn('No ANTHROPIC_API_KEY set, skipping AI processing');
      return;
    }

    const unprocessed = Article.findUnprocessed(100);
    if (unprocessed.length === 0) {
      logger.info('No unprocessed articles found');
      return;
    }

    logger.info(`Processing ${unprocessed.length} articles with AI...`);
    const batchSize = config.claudeMaxBatchSize;
    const summaryBatches = chunkArray(unprocessed, batchSize);
    const categorizeBatches = chunkArray(unprocessed, 20);

    // Summarize
    const summaryResults = {};
    for (const batch of summaryBatches) {
      const results = await Summarizer.summarizeBatch(batch);
      for (const r of results) {
        if (r.summary) summaryResults[r.id] = r.summary;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    // Categorize
    const categoryResults = {};
    for (const batch of categorizeBatches) {
      const results = await Categorizer.categorizeBatch(batch);
      for (const r of results) {
        categoryResults[r.id] = { categories: r.categories || [], tags: r.tags || [] };
      }
      await new Promise(r => setTimeout(r, 500));
    }

    // Write to DB in transaction
    const db = getDb();
    const updateTx = db.transaction(() => {
      for (const article of unprocessed) {
        const summary = summaryResults[article.id] || null;
        const { categories = [], tags = [] } = categoryResults[article.id] || {};
        Article.updateProcessed(article.id, { summary, categories, tags });
      }
    });
    updateTx();

    // Analyze trends from processed articles
    const processedArticles = unprocessed.map(a => ({
      ...a,
      tags: categoryResults[a.id]?.tags || [],
    }));
    TrendAnalyzer.analyze(processedArticles);

    logger.info(`Processing pipeline complete for ${unprocessed.length} articles`);
  }
};
