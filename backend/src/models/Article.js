import { getDb } from '../database/connection.js';

export const Article = {
  insert(article) {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO articles
        (guid, title, url, content, source_id, source_name, author, published_at, image_url, categories, tags)
      VALUES
        (@guid, @title, @url, @content, @source_id, @source_name, @author, @published_at, @image_url, @categories, @tags)
    `);
    const parsedDate = article.published_at ? new Date(article.published_at) : null;
    const published_at = parsedDate && !isNaN(parsedDate) ? parsedDate.toISOString() : new Date().toISOString();

    return stmt.run({
      ...article,
      published_at,
      categories: JSON.stringify(article.categories || []),
      tags: JSON.stringify(article.tags || []),
    });
  },

  findAll({ page = 1, limit = 20, category = null, source = null, sort = 'published_at' } = {}) {
    const db = getDb();
    const offset = (page - 1) * limit;
    let whereClause = "WHERE a.published_at >= datetime('now', '-7 days')";
    const params = [];

    if (category && category !== 'All') {
      whereClause += ` AND a.categories LIKE ?`;
      params.push(`%"${category}"%`);
    }
    if (source) {
      whereClause += ` AND a.source_name = ?`;
      params.push(source);
    }

    const validSorts = { published_at: 'a.published_at DESC', trending_score: 'a.trending_score DESC', fetched_at: 'a.fetched_at DESC' };
    const orderBy = validSorts[sort] || 'a.published_at DESC';

    const articles = db.prepare(`
      SELECT a.* FROM articles a ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM articles a ${whereClause}
    `).get(...params);

    return {
      data: articles.map(parseArticle),
      meta: { total: total.count, page, limit, hasMore: offset + articles.length < total.count }
    };
  },

  findById(id) {
    const db = getDb();
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    return article ? parseArticle(article) : null;
  },

  findUnprocessed(limit = 50) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM articles WHERE processed_at IS NULL AND title IS NOT NULL
      ORDER BY fetched_at DESC LIMIT ?
    `).all(limit);
  },

  updateProcessed(id, { summary, categories, tags }) {
    const db = getDb();
    return db.prepare(`
      UPDATE articles SET
        summary = @summary,
        categories = @categories,
        tags = @tags,
        processed_at = datetime('now')
      WHERE id = @id
    `).run({
      id,
      summary,
      categories: JSON.stringify(categories || []),
      tags: JSON.stringify(tags || []),
    });
  },

  findFeatured(limit = 3) {
    const db = getDb();
    const articles = db.prepare(`
      SELECT * FROM articles
      WHERE published_at >= datetime('now', '-7 days')
      ORDER BY trending_score DESC, published_at DESC
      LIMIT ?
    `).all(limit);
    return articles.map(parseArticle);
  },

  search(query, limit = 20) {
    const db = getDb();
    const like = `%${query}%`;
    const articles = db.prepare(`
      SELECT * FROM articles
      WHERE (title LIKE ? OR summary LIKE ? OR tags LIKE ?)
        AND published_at >= datetime('now', '-7 days')
      ORDER BY published_at DESC
      LIMIT ?
    `).all(like, like, like, limit);
    return articles.map(parseArticle);
  },

  searchAll(query, limit = 5) {
    const db = getDb();
    const like = `%${query}%`;
    const articles = db.prepare(`
      SELECT * FROM articles
      WHERE (title LIKE ? OR content LIKE ? OR tags LIKE ?)
      ORDER BY published_at DESC
      LIMIT ?
    `).all(like, like, like, limit);
    return articles.map(parseArticle);
  },

  deleteOlderThan(days) {
    const db = getDb();
    return db.prepare(`
      DELETE FROM articles WHERE fetched_at < datetime('now', '-${days} days')
    `).run();
  },

  getCategoryCounts() {
    const db = getDb();
    const articles = db.prepare(`SELECT categories FROM articles`).all();
    const counts = {};
    for (const row of articles) {
      try {
        const cats = JSON.parse(row.categories || '[]');
        for (const cat of cats) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      } catch {}
    }
    return counts;
  }
};

function parseArticle(row) {
  return {
    ...row,
    categories: tryParse(row.categories, []),
    tags: tryParse(row.tags, []),
  };
}

function tryParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
