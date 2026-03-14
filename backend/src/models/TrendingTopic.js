import { getDb } from '../database/connection.js';

export const TrendingTopic = {
  upsert(topic) {
    return getDb().prepare(`
      INSERT INTO trending_topics (topic, count, date) VALUES (?, 1, date('now'))
      ON CONFLICT(topic, date) DO UPDATE SET count = count + 1
    `).run(topic);
  },

  getToday(limit = 15) {
    return getDb().prepare(`
      SELECT topic, count FROM trending_topics
      WHERE date = date('now')
      ORDER BY count DESC LIMIT ?
    `).all(limit);
  },

  getWeek(limit = 20) {
    return getDb().prepare(`
      SELECT topic, SUM(count) as total FROM trending_topics
      WHERE date >= date('now', '-7 days')
      GROUP BY topic ORDER BY total DESC LIMIT ?
    `).all(limit);
  }
};
