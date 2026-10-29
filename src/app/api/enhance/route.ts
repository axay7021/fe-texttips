import { streamText } from 'ai';
import { headers } from 'next/headers';
import config from '@/config';
import { getAIModel } from '@/lib/ai/provider';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/mongodb';
import DailyUsage from '@/models/daily-usage.model';
import Subscription from '@/models/subscription.model';

export async function POST(req: Request) {
  const provider = process.env.AI_PROVIDER || 'google';
  const key = provider === 'openai' ? config.OPENAI_API_KEY
    : provider === 'anthropic' ? config.ANTHROPIC_API_KEY : config.GEMINI_API_KEY;
  if (!key) return Response.json({ error: 'AI service is not configured yet.', code: 'AI_NOT_CONFIGURED' }, { status: 503 });
  if (!config.MONGODB_URI) return Response.json({ error: 'Database is not configured yet.', code: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });

  try {
    await dbConnect();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Rate Limiting Logic
    let remainingRequests = -1; // -1 indicates unlimited
    let isLimited = true;

    if (session) {
      // Check for active subscription
      const subscription = await Subscription.findOne({
        userId: session.user.id,
        status: 'active',
      });

      if (subscription) {
        const now = new Date();

        // Check if subscription period is valid
        if (subscription.currentPeriodEnd > now) {
          // Check usage limit
          if (subscription.usageCount < subscription.planLimit) {
            // Authorized! Increment usage
            subscription.usageCount += 1;
            await subscription.save();

            isLimited = false;
            remainingRequests =
              subscription.planLimit - subscription.usageCount;
          } else {
            // Limit reached for the month
            // We could return a specific error here or fall back to daily free limit
            // For now, let's treat it as "no free access left" on the plan
            // But maybe they still get the daily free 3?
            // Let's assume they fall back to daily free limit if plan limit is reached.
            isLimited = true;
          }
        }
      }
    }

    if (isLimited) {
      const forwardedFor = (await headers()).get('x-forwarded-for');
      let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

      // Fallback for local development if needed
      if (ip === '::1' || ip === '127.0.0.1') {
        ip = 'localhost';
      }

      // Use userId if logged in, otherwise IP
      const identifier = session ? session.user.id : ip;

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Find usage record
      let usage = await DailyUsage.findOne({ identifier });

      if (!usage) {
        usage = new DailyUsage({
          identifier,
          count: 0,
          date: today,
        });
      } else {
        // Reset count if it's a new day
        if (usage.date.getTime() !== today.getTime()) {
          usage.count = 0;
          usage.date = today;
        }
      }

      // Check limit logic
      // Assuming isAdmin is defined elsewhere or should be added.
      // For now, let's define it as false to make the code syntactically correct
      // as per the instruction to ensure correctness.
      const isAdmin = false; // Placeholder for isAdmin, as it's not defined in the original code or the snippet.
      if (!isAdmin) {
        if (usage.count >= 3) {
          return new Response(
            JSON.stringify({
              error:
                'Daily limit reached. Please upgrade to a plan for more access.',
            }),
            { status: 403, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }

      // Increment and save
      usage.count += 1;
      await usage.save();

      remainingRequests = 3 - usage.count;
    }

    const body = await req.json();
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.log('Enhance API Request Body:', body);

    // Check if key is present to avoid silent failures


    const { prompt, text } = body;
    const userPrompt = prompt || text;

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      return new Response('Missing prompt', { status: 400 });
    }

    const REQUIRED_TONES = [
      'Professional',
      'Friendly',
      'Concise',
      'Polished',
      'Clear',
      'Confident',
    ] as const;

    const systemPrompt = `You are a text enhancement expert. Your ONLY task is to rewrite the user's text in exactly 6 distinct styles.

CRITICAL RULES — You MUST follow ALL of these:
1. You MUST output ALL 6 styles. Never skip any. The 6 styles are: ${REQUIRED_TONES.join(', ')}.
2. Each label MUST be written EXACTLY as shown above — capitalize the first letter, no bold/asterisks, no extra words.
3. Each label MUST be followed by a colon and nothing else on that line.
4. The rewritten text MUST start on the NEXT LINE after the label.
5. Separate each style block with exactly ONE blank line.
6. Do NOT add any preamble, commentary, or explanation before, between, or after the blocks.
7. Do NOT use markdown formatting (no **, no ##, no bullets).
8. If the input is gibberish or unclear, still provide all 6 rewrites with your best interpretation.

EXACT FORMAT (follow this precisely):
Professional:
[rewritten text]

Friendly:
[rewritten text]

Concise:
[rewritten text]

Polished:
[rewritten text]

Clear:
[rewritten text]

Confident:
[rewritten text]`;
    const result = streamText({
      model: getAIModel(),
      temperature: 0.4, // Lower temperature for consistent formatting
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Rewrite this text in all 6 styles: "${userPrompt}"`,
        },
      ],
      onError: ({ error }) => {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.error('Stream Error:', error);
      },
      onFinish: ({ text: finishedText }) => {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.log('Stream Finished:', finishedText);

        // Validate that all 6 tones are present in the output
        const missingTones = REQUIRED_TONES.filter(
          (tone) => !new RegExp(`${tone}:\\s*\\n`, 'i').test(finishedText),
        );
        if (missingTones.length > 0) {
          // biome-ignore lint/suspicious/noConsole: Allow logging
          console.warn('Missing tones in AI output:', missingTones);
        }
      },
    });

    result.usage.then((usages) => {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.log({
        inputTokens: usages.inputTokens,
        outputTokens: usages.outputTokens,
        totalTokens: usages.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'X-Remaining-Requests': remainingRequests.toString(),
      },
    });
  } catch (error: any) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('Enhance Error:', error);
    const errorMessage = error.message || 'Internal Server Error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
