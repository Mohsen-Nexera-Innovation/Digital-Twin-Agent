import { getDb } from './connection.js';
import { logger } from '../utils/logger.js';
import { SOURCES } from '../config/sources.js';

export function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      type        TEXT NOT NULL,
      url         TEXT NOT NULL UNIQUE,
      enabled     INTEGER DEFAULT 1,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      guid            TEXT NOT NULL UNIQUE,
      title           TEXT NOT NULL,
      url             TEXT NOT NULL,
      content         TEXT,
      summary         TEXT,
      source_id       INTEGER REFERENCES sources(id),
      source_name     TEXT,
      author          TEXT,
      published_at    TEXT,
      fetched_at      TEXT DEFAULT (datetime('now')),
      processed_at    TEXT,
      categories      TEXT DEFAULT '[]',
      tags            TEXT DEFAULT '[]',
      trending_score  REAL DEFAULT 0,
      image_url       TEXT,
      is_featured     INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS fetch_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      run_at      TEXT DEFAULT (datetime('now')),
      source_name TEXT,
      fetched     INTEGER DEFAULT 0,
      new_count   INTEGER DEFAULT 0,
      error       TEXT
    );

    CREATE TABLE IF NOT EXISTS trending_topics (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      topic       TEXT NOT NULL,
      count       INTEGER DEFAULT 1,
      date        TEXT DEFAULT (date('now')),
      UNIQUE(topic, date)
    );

    CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source_id);
    CREATE INDEX IF NOT EXISTS idx_articles_processed ON articles(processed_at);
    CREATE INDEX IF NOT EXISTS idx_articles_fetched ON articles(fetched_at DESC);
  `);

  // Seed sources
  const insertSource = db.prepare(`
    INSERT OR IGNORE INTO sources (name, type, url, enabled)
    VALUES (@name, @type, @url, @enabled)
  `);
  const seedSources = db.transaction(() => {
    for (const src of SOURCES) {
      insertSource.run({ name: src.name, type: src.type, url: src.url, enabled: src.enabled ? 1 : 0 });
    }
  });
  seedSources();

  logger.info('Database migrations complete');
}
