import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import config from '@/config';

export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({
    apiKey: config.GEMINI_API_KEY,
  });

  try {
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

    return result.toUIMessageStreamResponse();
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
