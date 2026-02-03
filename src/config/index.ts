type Environment = 'development' | 'production' | 'test';

interface Config {
  NODE_ENV: Environment;
  ENV_TYPE: Environment;
  NEXT_PUBLIC_API_PATH: string;
  NEXT_PUBLIC_APP_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  MONGODB_URI: string;
  STRIPE_SECRET_KEY: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  GEMINI_API_KEY: string;
  AI_GATEWAY_API_KEY: string;
  OPENAI_API_KEY: string;
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  EMAIL: string;
}

const config: Config = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || 'development',
  ENV_TYPE: (process.env.ENV_TYPE as Environment) || 'development',
  NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH || '',
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3011',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3011',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  EMAIL: process.env.EMAIL || '',
};

export default config;
