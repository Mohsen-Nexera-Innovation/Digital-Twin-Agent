import { ClaudeClient } from './ClaudeClient.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/index.js';

const SYSTEM_PROMPT = `You are a technical news summarizer covering AI, AI agents, digital twins, data science, and machine learning.

For each article, write a 2-3 sentence summary that:
1. States the key innovation, development, product, or learning resource being covered
2. Explains why it matters to practitioners in AI, data science, or digital twin industries
3. Mentions any significant technical detail, tool, framework, or real-world application (e.g. use in airports, factories, smart cities)

Be precise and factual. Avoid marketing language and hype. Use appropriate technical terminology. Always respond with valid JSON.`;

export const Summarizer = {
  async summarizeBatch(articles) {
    if (articles.length === 0) return [];

    const items = articles.map((a, i) => ({
      id: a.id,
      title: a.title,
      content: (a.content || '').slice(0, 400),
    }));

    const userMessage = `Summarize these ${items.length} AI news articles. Return a JSON array with objects having "id" and "summary" fields.

Articles:
${JSON.stringify(items, null, 2)}

Return only valid JSON like: [{"id": 1, "summary": "..."}]`;

    try {
      const response = await ClaudeClient.complete(SYSTEM_PROMPT, userMessage, {
        maxTokens: items.length * 150 + 200,
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response');

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      logger.error(`Summarizer batch error: ${err.message}`);
      return articles.map(a => ({ id: a.id, summary: null }));
    }
  }
};
