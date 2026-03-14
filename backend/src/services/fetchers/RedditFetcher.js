import axios from 'axios';
import { BaseFetcher } from './BaseFetcher.js';
import { generateGuid } from '../../utils/deduplicator.js';
import { truncate } from '../../utils/textCleaner.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/index.js';

export class RedditFetcher extends BaseFetcher {
  async fetch() {
    try {
      const response = await axios.get(this.source.url, {
        params: { limit: config.maxArticlesPerSource, sort: 'hot' },
        headers: {
          'User-Agent': config.redditUserAgent,
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      const posts = response.data?.data?.children || [];
      return posts
        .filter(p => p.data.score > 50 && !p.data.stickied)
        .map(p => this.normalize(p.data))
        .filter(a => a.title && a.url);
    } catch (err) {
      logger.error(`RedditFetcher error: ${err.message}`);
      return [];
    }
  }

  normalize(post) {
    const url = post.url?.startsWith('http') ? post.url : `https://reddit.com${post.permalink}`;
    return {
      guid: generateGuid(`reddit_${post.id}`),
      title: post.title || '',
      url,
      content: truncate(post.selftext || `Score: ${post.score} | Subreddit: r/${post.subreddit}`, 500),
      author: `u/${post.author}` || null,
      published_at: new Date(post.created_utc * 1000).toISOString(),
      source_name: this.source.name,
      image_url: post.thumbnail?.startsWith('http') ? post.thumbnail : null,
      categories: [],
      tags: [],
    };
  }
}
