import crypto from 'crypto';

export function generateGuid(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
}

export function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export function areSimilarTitles(title1, title2) {
  const a = normalizeTitle(title1);
  const b = normalizeTitle(title2);
  if (a === b) return true;
  const words1 = new Set(a.split(' ').filter(w => w.length > 3));
  const words2 = new Set(b.split(' ').filter(w => w.length > 3));
  const intersection = [...words1].filter(w => words2.has(w));
  const union = new Set([...words1, ...words2]);
  if (union.size === 0) return false;
  return intersection.length / union.size > 0.7;
}
