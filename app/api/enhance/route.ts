import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  try {
    const body = await req.json();
    console.log("Enhance API Request Body:", body);

    // Check if key is present to avoid silent failures
    if (!apiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing in process.env");
      return new Response(
        "Missing Google API Key. Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env file.",
        { status: 500 },
      );
    }

    const { prompt, text } = body;
    const userPrompt = prompt || text;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return new Response("Missing prompt", { status: 400 });
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
      model: google("gemini-2.5-flash-lite"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      onError: ({ error }) => {
        console.error("Stream Error:", error);
      },
      onFinish: ({ text }) => console.log("Stream Finished:", text),
    });

    result.usage.then((usages) => {
      console.log({
        inputTokens: usages.inputTokens,
        outputTokens: usages.outputTokens,
        totalTokens: usages.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Enhance Error:", error);
    const errorMessage = error.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
