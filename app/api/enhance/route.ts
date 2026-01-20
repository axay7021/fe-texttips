import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { text, tone } = await request.json();

    if (!text) {
      return new Response("Missing text", { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response("API key not configured", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });
    console.log(model);
    const prompt = `You are a text rewriting assistant. Rewrite the following text based on the tone requested.

Rules:
- Return ONLY the rewritten text, nothing else
- No explanations, no formatting, no quotation marks
- Just the rewritten sentence
- If informal, make it ${tone || "professional"}
- If already formal, keep it ${tone || "professional"}

Original text: "${text}"

Rewritten text:`;

    const result = await model.generateContentStream(prompt);

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            const data = `data: ${JSON.stringify({ content: chunkText })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("AI Error:", error);
          const errorData = `data: ${JSON.stringify({ error: "AI processing failed. Check API Key." })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Enhance Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
