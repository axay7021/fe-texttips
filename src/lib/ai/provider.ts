import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import config from '@/config';

export function getAIModel() {
  const provider = process.env.AI_PROVIDER || 'google';

  switch (provider) {
    case 'anthropic': {
      if (!config.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is missing');
      }

      const anthropic = createAnthropic({
        apiKey: config.ANTHROPIC_API_KEY,
      });

      return anthropic('claude-3-haiku-20240307');
    }

    case 'openai': {
      if (!config.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is missing');
      }

      const openai = createOpenAI({
        apiKey: config.OPENAI_API_KEY,
      });

      return openai('o4-mini');
    }

    default: {
      if (!config.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is missing');
      }

      const google = createGoogleGenerativeAI({
        apiKey: config.GEMINI_API_KEY,
      });

      return google(process.env.AI_MODEL || 'gemini-3.1-flash-lite');
    }
  }
}
