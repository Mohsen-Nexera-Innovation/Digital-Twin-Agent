import axios from 'axios';
import { BaseFetcher } from './BaseFetcher.js';
import { generateGuid } from '../../utils/deduplicator.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/index.js';

const AI_KEYWORDS = ['AI', 'ML', 'LLM', 'GPT', 'neural', 'machine learning', 'deep learning', 'artificial intelligence', 'language model', 'transformer', 'diffusion', 'claude', 'gemini', 'llama', 'openai', 'anthropic', 'agent'];

export class HackerNewsFetcher extends BaseFetcher {
  async fetch() {
    try {
      const response = await axios.get(this.source.url, {
        params: {
          query: 'AI machine learning LLM',
          tags: 'story',
          numericFilters: 'points>10',
          hitsPerPage: config.maxArticlesPerSource,
        },
        timeout: 10000,
      });

      return response.data.hits
        .filter(hit => {
          const text = `${hit.title} ${hit.url || ''}`.toLowerCase();
          return AI_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
        })
        .map(hit => this.normalize(hit))
        .filter(a => a.title && a.url);
    } catch (err) {
      logger.error(`HackerNewsFetcher error: ${err.message}`);
      return [];
    }
  }

  normalize(hit) {
    const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
    return {
      guid: generateGuid(url),
      title: hit.title || '',
      url,
      content: `Points: ${hit.points} | Comments: ${hit.num_comments}`,
      author: hit.author || null,
      published_at: hit.created_at || new Date().toISOString(),
      source_name: this.source.name,
      image_url: null,
      categories: [],
      tags: [],
    };
  }
}
