import { RssFetcher } from './fetchers/RssFetcher.js';
import { HackerNewsFetcher } from './fetchers/HackerNewsFetcher.js';
import { ArxivFetcher } from './fetchers/ArxivFetcher.js';
import { RedditFetcher } from './fetchers/RedditFetcher.js';
import { Source } from '../models/Source.js';
import { Article } from '../models/Article.js';
import { FetchLog } from '../models/FetchLog.js';
import { logger } from '../utils/logger.js';
import { generateGuid } from '../utils/deduplicator.js';

const FETCHER_MAP = {
  rss: RssFetcher,
  hackernews: HackerNewsFetcher,
  arxiv: ArxivFetcher,
  reddit: RedditFetcher,
};

export const AggregatorService = {
  async runFetchCycle() {
    logger.info('Starting fetch cycle...');
    const sources = Source.findAll().filter(s => s.enabled);
    let totalNew = 0;

    for (const source of sources) {
      const FetcherClass = FETCHER_MAP[source.type];
      if (!FetcherClass) {
        logger.warn(`No fetcher for type: ${source.type}`);
        continue;
      }

      try {
        const fetcher = new FetcherClass(source);
        const articles = await fetcher.fetch();
        logger.info(`Fetched ${articles.length} articles from ${source.name}`);

        let newCount = 0;
        for (const article of articles) {
          if (!article.guid) article.guid = generateGuid(article.url);
          const result = Article.insert({ ...article, source_id: source.id });
          if (result.changes > 0) newCount++;
        }

        FetchLog.insert({ sourceName: source.name, fetched: articles.length, newCount });
        totalNew += newCount;
        logger.info(`New articles from ${source.name}: ${newCount}`);

        // Small delay between sources to be polite
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        logger.error(`Failed to fetch from ${source.name}: ${err.message}`);
        FetchLog.insert({ sourceName: source.name, fetched: 0, newCount: 0, error: err.message });
      }
    }

    logger.info(`Fetch cycle complete. Total new articles: ${totalNew}`);
    return totalNew;
  }
};
