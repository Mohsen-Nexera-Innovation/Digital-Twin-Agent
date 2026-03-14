export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Latest AI News':  { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc', border: 'rgba(165,180,252,0.3)' },
  'AI Agents':       { bg: 'rgba(59,130,246,0.15)',   text: '#60a5fa', border: 'rgba(96,165,250,0.3)'  },
  'Digital Twin':    { bg: 'rgba(20,184,166,0.15)',   text: '#2dd4bf', border: 'rgba(45,212,191,0.3)'  },
  'Data Science':    { bg: 'rgba(234,179,8,0.15)',    text: '#fbbf24', border: 'rgba(251,191,36,0.3)'  },
  'Machine Learning':{ bg: 'rgba(239,68,68,0.15)',    text: '#f87171', border: 'rgba(248,113,113,0.3)' },
};

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || { bg: 'rgba(99,102,241,0.1)', text: '#a5b4fc', border: 'rgba(165,180,252,0.2)' };
}
