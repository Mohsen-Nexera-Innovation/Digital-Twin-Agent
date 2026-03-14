export function getSourceClass(sourceName: string): string {
  const lower = sourceName.toLowerCase();
  if (lower.includes('techcrunch')) return 'source-techcrunch';
  if (lower.includes('verge')) return 'source-verge';
  if (lower.includes('mit')) return 'source-mit';
  if (lower.includes('reddit')) return 'source-reddit';
  if (lower.includes('hackernews') || lower.includes('hacker news')) return 'source-hn';
  if (lower.includes('arxiv')) return 'source-arxiv';
  return 'source-default';
}
