import axios from 'axios';
import xml2js from 'xml2js';
import { BaseFetcher } from './BaseFetcher.js';
import { generateGuid } from '../../utils/deduplicator.js';
import { truncate } from '../../utils/textCleaner.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/index.js';

export class ArxivFetcher extends BaseFetcher {
  async fetch() {
    try {
      const response = await axios.get(this.source.url, {
        params: {
          search_query: 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL',
          start: 0,
          max_results: Math.min(config.maxArticlesPerSource, 20),
          sortBy: 'submittedDate',
          sortOrder: 'descending',
        },
        timeout: 15000,
      });

      const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false });
      const entries = parsed.feed?.entry;
      if (!entries) return [];

      const items = Array.isArray(entries) ? entries : [entries];
      return items.map(e => this.normalize(e)).filter(a => a.title && a.url);
    } catch (err) {
      logger.error(`ArxivFetcher error: ${err.message}`);
      return [];
    }
  }

  normalize(entry) {
    const url = Array.isArray(entry.id) ? entry.id[0] : entry.id;
    if (!url) return null;

    const title = typeof entry.title === 'string' ? entry.title : entry.title?._ || '';
    const summary = typeof entry.summary === 'string' ? entry.summary : entry.summary?._ || '';

    let authors = [];
    if (entry.author) {
      const authorList = Array.isArray(entry.author) ? entry.author : [entry.author];
      authors = authorList.slice(0, 3).map(a => a.name || '').filter(Boolean);
    }

    return {
      guid: generateGuid(url.trim()),
      title: title.replace(/\s+/g, ' ').trim(),
      url: url.trim(),
      content: truncate(summary.replace(/\s+/g, ' ').trim(), 800),
      author: authors.join(', ') || null,
      published_at: entry.published || new Date().toISOString(),
      source_name: this.source.name,
      image_url: null,
      categories: [],
      tags: [],
    };
  }
}
