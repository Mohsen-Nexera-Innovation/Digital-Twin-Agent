import { ClaudeClient } from './ClaudeClient.js';
import { CATEGORIES } from '../../config/categories.js';
import { logger } from '../../utils/logger.js';

const SYSTEM_PROMPT = `You are an AI news categorizer covering 5 specific domains. Assign categories and extract keyword tags from articles.

Available categories:
- Latest AI News: General AI news, model releases, company announcements, hardware, policy, safety, ethics, funding
- AI Agents: Agent frameworks (LangChain, AutoGen, CrewAI, LlamaIndex), RAG, function calling, tool use, agentic workflows, MCP, multi-agent systems, skills
- Digital Twin: Digital twins in industry, airports, smart cities, malls, IoT, NVIDIA Omniverse, Azure Digital Twins, BIM, Industry 4.0, predictive maintenance
- Data Science: Python, pandas, Jupyter, Kaggle, datasets, EDA, statistics, data visualization, data career, courses, tutorials, learning resources
- Machine Learning: PyTorch, TensorFlow, model training, fine-tuning, MLOps, deployment, deep learning, RL, embeddings, ML techniques, ML for digital twins

Rules:
- Assign 1-3 most relevant categories from the list above
- "Latest AI News" is the broadest — assign it alongside a specific category when the article is newsworthy, or alone when it does not fit a more specific category
- Extract 3-5 specific keyword tags (technologies, companies, concepts actually mentioned)
- Always respond with valid JSON`;

export const Categorizer = {
  async categorizeBatch(articles) {
    if (articles.length === 0) return [];

    const items = articles.map(a => ({
      id: a.id,
      title: a.title,
      snippet: (a.content || '').slice(0, 200),
    }));

    const userMessage = `Categorize these ${items.length} AI articles. Return JSON array with "id", "categories" (array), and "tags" (array) fields.

Articles:
${JSON.stringify(items, null, 2)}

Return only valid JSON like: [{"id": 1, "categories": ["LLMs"], "tags": ["GPT-4", "OpenAI"]}]`;

    try {
      const response = await ClaudeClient.complete(SYSTEM_PROMPT, userMessage, {
        maxTokens: items.length * 80 + 200,
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found');

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      logger.error(`Categorizer batch error: ${err.message}`);
      // Fallback to keyword matching
      return articles.map(a => ({
        id: a.id,
        categories: keywordMatch(a.title + ' ' + (a.content || '')),
        tags: [],
      }));
    }
  }
};

function keywordMatch(text) {
  const lower = text.toLowerCase();
  const matched = [];
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      matched.push(cat);
    }
  }
  return matched.length > 0 ? matched.slice(0, 3) : ['Latest AI News'];
}
