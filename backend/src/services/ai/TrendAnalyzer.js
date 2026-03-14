import { getDb } from '../../database/connection.js';
import { TrendingTopic } from '../../models/TrendingTopic.js';
import { logger } from '../../utils/logger.js';

const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'are', 'new', 'how', 'why', 'what', 'when', 'will', 'can', 'has', 'its', 'not', 'but', 'all', 'into', 'more', 'over', 'about', 'says', 'your', 'our', 'their', 'use', 'used', 'using']);

export const TrendAnalyzer = {
  analyze(articles) {
    const topicCounts = {};

    for (const article of articles) {
      const tags = Array.isArray(article.tags) ? article.tags :
        (typeof article.tags === 'string' ? JSON.parse(article.tags || '[]') : []);

      for (const tag of tags) {
        if (tag && tag.length > 2) {
          const normalized = tag.toLowerCase().trim();
          if (!STOP_WORDS.has(normalized)) {
            topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
          }
        }
      }

      // Also extract from title
      const titleWords = article.title.split(/\s+/).filter(w =>
        w.length > 4 && !STOP_WORDS.has(w.toLowerCase()) && /^[A-Za-z]/.test(w)
      );
      for (const word of titleWords.slice(0, 3)) {
        const normalized = word.toLowerCase();
        topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
      }
    }

    for (const [topic, count] of Object.entries(topicCounts)) {
      for (let i = 0; i < count; i++) {
        TrendingTopic.upsert(topic);
      }
    }

    logger.info(`Trend analysis complete. Topics tracked: ${Object.keys(topicCounts).length}`);
  }
};
