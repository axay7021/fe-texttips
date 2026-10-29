export async function GET() {
  return Response.json({ status: 'ok', configured: {
    database: Boolean(process.env.MONGODB_URI),
    ai: Boolean(process.env.AI_PROVIDER === 'openai' ? process.env.OPENAI_API_KEY : process.env.AI_PROVIDER === 'anthropic' ? process.env.ANTHROPIC_API_KEY : process.env.GEMINI_API_KEY),
    email: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
  } });
}
