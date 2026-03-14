import { Router } from 'express';
import { Article } from '../models/Article.js';
import { ClaudeClient } from '../services/ai/ClaudeClient.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

const SYSTEM_PROMPT = `You are an AI news assistant embedded in an AI News Agent platform.
You have access to articles from the agent's knowledge base covering: Latest AI News, AI Agents, Digital Twin, Data Science, and Machine Learning.

When answering:
- Be concise, accurate, and informative (3-5 sentences max unless the topic requires more depth)
- If the provided articles are relevant, reference them naturally (e.g. "According to a recent article from OpenAI...")
- If the articles are not relevant to the question, answer from your general knowledge and say so
- Always be helpful and technically precise
- Do not make up article titles or sources that aren't in the provided context`;

router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || message.trim().length < 2) {
    return res.status(400).json({ error: { message: 'Message is required' } });
  }

  try {
    // Extract meaningful keywords from the question for DB search
    const stopWords = new Set(['what', 'are', 'is', 'the', 'how', 'does', 'do', 'can', 'will', 'a', 'an', 'in', 'on', 'for', 'of', 'to', 'and', 'or', 'about', 'tell', 'me', 'explain', 'describe', 'give', 'some', 'latest', 'best', 'good', 'news', 'new', 'recent']);
    const keywords = message.trim().toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    // Search with the most specific keyword first, then fall back to the full message
    const searchTerm = keywords.length > 0 ? keywords[0] : message.trim();
    const relatedArticles = Article.searchAll(searchTerm, 5);

    let answer;

    if (!config.anthropicApiKey) {
      answer = "I can't provide an AI answer right now — the Anthropic API key is not configured or has no credits. Here are some related articles from the knowledge base that might help.";
    } else {
      // Build context from related articles
      const articleContext = relatedArticles.length > 0
        ? `\n\nRelevant articles from the knowledge base:\n${relatedArticles.map((a, i) =>
            `[${i + 1}] "${a.title}" (${a.source_name}, ${a.published_at?.slice(0, 10) || 'unknown date'})\n${a.summary || a.content?.slice(0, 200) || ''}`
          ).join('\n\n')}`
        : '\n\nNo closely matching articles found in the knowledge base for this query.';

      // Build conversation history for context
      const historyText = history.slice(-4).map(m =>
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      ).join('\n');

      const userMessage = historyText
        ? `Previous conversation:\n${historyText}\n\nCurrent question: ${message.trim()}${articleContext}`
        : `${message.trim()}${articleContext}`;

      try {
        answer = await ClaudeClient.complete(SYSTEM_PROMPT, userMessage, {
          maxTokens: 512,
          retries: 2,
        });
      } catch (err) {
        logger.warn(`Chat Claude error: ${err.message}`);
        answer = "I'm having trouble connecting to the AI service right now. Here are related articles from the knowledge base that might help answer your question.";
      }
    }

    res.json({
      answer,
      articles: relatedArticles,
    });
  } catch (err) {
    logger.error(`Chat route error: ${err.message}`);
    res.status(500).json({ error: { message: 'Failed to process chat message' } });
  }
});

export default router;
