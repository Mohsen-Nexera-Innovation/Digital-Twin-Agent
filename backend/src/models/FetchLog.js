import { getDb } from '../database/connection.js';

export const FetchLog = {
  insert({ sourceName, fetched, newCount, error = null }) {
    return getDb().prepare(`
      INSERT INTO fetch_logs (source_name, fetched, new_count, error)
      VALUES (?, ?, ?, ?)
    `).run(sourceName, fetched, newCount, error);
  },

  getLastRun() {
    return getDb().prepare(`SELECT * FROM fetch_logs ORDER BY run_at DESC LIMIT 1`).get();
  },

  getRecent(limit = 20) {
    return getDb().prepare(`SELECT * FROM fetch_logs ORDER BY run_at DESC LIMIT ?`).all(limit);
  }
};
