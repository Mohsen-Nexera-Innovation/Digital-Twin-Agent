import { getDb } from '../database/connection.js';

export const Source = {
  findAll() {
    return getDb().prepare('SELECT * FROM sources ORDER BY name').all();
  },
  findById(id) {
    return getDb().prepare('SELECT * FROM sources WHERE id = ?').get(id);
  },
  findByName(name) {
    return getDb().prepare('SELECT * FROM sources WHERE name = ?').get(name);
  }
};
