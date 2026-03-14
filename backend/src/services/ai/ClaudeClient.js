import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export const ClaudeClient = {
  async complete(systemPrompt, userMessage, options = {}) {
    const { model = config.claudeModel, maxTokens = 1024, retries = 3 } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await client.messages.create({
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        });
        return response.content[0].text;
      } catch (err) {
        const isRetryable = err.status === 429 || err.status === 529 || err.status >= 500;
        if (isRetryable && attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000;
          logger.warn(`Claude API attempt ${attempt} failed (${err.status}), retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          throw err;
        }
      }
    }
  }
};
