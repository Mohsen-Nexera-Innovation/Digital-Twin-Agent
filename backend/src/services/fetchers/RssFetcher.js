import Parser from 'rss-parser';
import { BaseFetcher } from './BaseFetcher.js';
import { generateGuid } from '../../utils/deduplicator.js';
import { stripHtml, truncate } from '../../utils/textCleaner.js';
import { logger } from '../../utils/logger.js';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail'], ['content:encoded', 'contentEncoded']],
  },
  timeout: 10000,
});

export class RssFetcher extends BaseFetcher {
  async fetch() {
    try {
      const feed = await parser.parseURL(this.source.url);
      return feed.items.map(item => this.normalize(item)).filter(a => a.title && a.url);
    } catch (err) {
      logger.error(`RssFetcher error for ${this.source.name}: ${err.message}`);
      return [];
    }
  }

  normalize(item) {
    const url = item.link || item.guid;
    if (!url) return null;

    const rawContent = item.contentEncoded || item.content || item['content:encoded'] || item.summary || '';
    const content = truncate(stripHtml(rawContent), 800);

    let image_url = null;
    if (item.mediaContent?.$.url) image_url = item.mediaContent.$.url;
    else if (item.mediaThumbnail?.$.url) image_url = item.mediaThumbnail.$.url;
    else if (item.enclosure?.url) image_url = item.enclosure.url;

    // Try to extract image from content
    if (!image_url && rawContent) {
      const imgMatch = rawContent.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) image_url = imgMatch[1];
    }

    const rawAuthor = item.creator || item.author || null;
    const author = typeof rawAuthor === 'string' ? rawAuthor.slice(0, 200) : null;

    const rawDate = item.pubDate || item.isoDate;
    const published_at = rawDate && typeof rawDate === 'string' ? rawDate : new Date().toISOString();

    return {
      guid: generateGuid(url),
      title: stripHtml(item.title || '').slice(0, 500),
      url,
      content,
      author,
      published_at,
      source_name: this.source.name,
      image_url,
      categories: [],
      tags: [],
    };
  }
}
