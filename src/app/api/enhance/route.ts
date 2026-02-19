import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { headers } from 'next/headers';
import config from '@/config';
import { auth } from '@/lib/auth/auth';
import dbConnect from '@/lib/mongodb';
import DailyUsage from '@/models/daily-usage.model';
import Subscription from '@/models/subscription.model';

export async function POST(req: Request) {
  await dbConnect();

  const google = createGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
  });

  try {
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
    if (!config.GEMINI_API_KEY) {
      // biome-ignore lint/suspicious/noConsole: Allow logging
      console.error('GEMINI_API_KEY is missing in process.env');
      return new Response(
        'Missing Google API Key. Please add GEMINI_API_KEY to your .env file.',
        { status: 500 },
      );
    }

    const { prompt, text } = body;
    const userPrompt = prompt || text;

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      return new Response('Missing prompt', { status: 400 });
    }

    const systemPrompt = `You are a text enhancement expert. Your task is to rewrite the user's text in 6 distinct styles. You must provide all 6 versions in a single response.

    Styles:
    1. Professional
    2. Friendly
    3. Concise
    4. Polished
    5. Clear
    6. Confident

    Formatting Rules:
    - Use labels followed by a colon (e.g. Professional:)
    - ALWAYS put the rewritten text on a NEW LINE after the label.
    - Do NOT use markdown bold (asterisks) for the labels.
    - Separate each version with a blank line.
    - Do not include any preamble or extra chatter.
    
    Example Output:
    Professional:
    I hope this email finds you well.

    Friendly:
    Hey there! Hope you're doing great.
    
    (etc)`;

    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      onError: ({ error }) => {
        // biome-ignore lint/suspicious/noConsole: Allow logging
        console.error('Stream Error:', error);
      },
      // biome-ignore lint/suspicious/noConsole: Allow logging
      onFinish: ({ text }) => console.log('Stream Finished:', text),
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
