import { NextRequest, NextResponse, after } from "next/server";
import { Pool } from "pg";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; 
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}

// Fire-and-forget conversation logging so voice/text turns can be reviewed
// later to spot retrieval gaps, STT truncation, or prompt drift — a failure
// here must never break the actual chat response.
async function logChatTurn(entry: {
  source: "text" | "voice";
  ip: string;
  userMessage: string;
  assistantResponse: string;
  retrievalSucceeded: boolean;
  matchedChunks: number;
}) {
  try {
    await pool.query(
      `INSERT INTO chat_logs (source, ip, user_message, assistant_response, retrieval_succeeded, matched_chunks)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [entry.source, entry.ip, entry.userMessage, entry.assistantResponse, entry.retrievalSucceeded, entry.matchedChunks]
    );
  } catch (e: unknown) {
    console.warn("Failed to write chat_logs entry:", e instanceof Error ? e.message : e);
  }
}

async function getEmbedding(text: string, signal: AbortSignal): Promise<number[]> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {}),
      },
      body: JSON.stringify({ inputs: text }),
      signal,
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Hugging Face API failed: ${response.status} ${response.statusText} - ${errText}`);
  }

  const result = await response.json();
  if (Array.isArray(result)) {
    return result as number[];
  }
  throw new Error("Invalid embedding response format from Hugging Face");
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, source: rawSource } = await req.json();
    if (!message) {
      return new NextResponse("Message required", { status: 400 });
    }
    const source: "text" | "voice" = rawSource === "voice" ? "voice" : "text";

    const signal = req.signal;

    let queryVector: number[] = [];
    let embeddingFailed = false;
    try {
      queryVector = await getEmbedding(message, signal);
    } catch (e: any) {
      if (e.name === "AbortError") throw e; 
      console.warn("Embedding generation failed, degrading gracefully:", e.message);
      embeddingFailed = true;
    }

    let context = "";
    let retrievalSucceeded = false;
    let matchedChunks = 0;

    if (!embeddingFailed && queryVector.length > 0) {
      const vectorSql = `[${queryVector.join(",")}]`;
      const similarityThreshold = Number(process.env.RAG_SIMILARITY_THRESHOLD || "0.15");
      
      try {
        const { rows } = await pool.query(
          `SELECT id, content, metadata FROM match_kb_chunks($1::vector, $2, $3)`,
          [vectorSql, similarityThreshold, 5]
        );
        
        if (rows.length === 0) {
          const fallback = "I don't have specific details on that one yet — feel free to reach out to Keerthana directly at keerthana.b.v.codes@gmail.com, she'd be happy to fill you in.";
          after(() => logChatTurn({ source, ip, userMessage: message, assistantResponse: fallback, retrievalSucceeded: false, matchedChunks: 0 }));
          return createDirectStreamResponse(fallback);
        }

        context = rows.map((c: any, i: number) => `[#${i + 1}] ${c.content}`).join("\n\n");
        retrievalSucceeded = true;
        matchedChunks = rows.length;
      } catch (dbError: any) {
        console.warn("Database query failed, proceeding without context:", dbError.message);
      }
    }

    if (!retrievalSucceeded && embeddingFailed) {
       const fallback = "I'm having a little trouble pulling that up right now. Please reach out to Keerthana directly at keerthana.b.v.codes@gmail.com in the meantime.";
       after(() => logChatTurn({ source, ip, userMessage: message, assistantResponse: fallback, retrievalSucceeded: false, matchedChunks: 0 }));
       return createDirectStreamResponse(fallback);
    }

    const systemPrompt = [
      "You are a warm, knowledgeable assistant chatting with a recruiter or hiring manager about Keerthana B V's work — think helpful and personable, like a colleague who knows her work well, not a corporate policy bot.",
      "Write in natural, conversational sentences. Never mention 'context', 'knowledge base', retrieval, or any other internal system detail — if you don't know something, just say so warmly and point them to her email.",
      "Default to plain, friendly sentences. Only reach for a bolded heading or bullet list when you're genuinely listing several distinct items (like a tech stack or multiple projects) — a short answer shouldn't get a heading.",
      "Stay factual and professional — no exaggerated praise or buzzword-stuffed self-promotion — but be personable and easy to read, like you're genuinely glad to help.",
      "Say 'Keerthana' at most ONCE per reply, ideally the first sentence — every mention after that MUST be 'she'/'her'/'her's' instead. Example of CORRECT style: \"Keerthana is a Full Stack Developer. She's worked on several production apps, and her main stack is React and Node.\" Example of WRONG style (do not do this): \"Keerthana is a Full Stack Developer. Keerthana has worked on several production apps using Keerthana's preferred stack.\"",
      "If the answer isn't available, say so naturally (e.g. \"I don't have that on hand, but you can reach her directly at keerthana.b.v.codes@gmail.com\") instead of a stiff refusal.",
    ].join("\n");

    const userPrompt = `Use the CONTEXT to answer the USER.\n\nCONTEXT:\n${context || "No context found."}\n\nUSER: ${message}`;

    let stream;
    try {
      stream = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        model: "llama-3.1-8b-instant",
        stream: true,
      }, { signal }); 
    } catch (groqError: any) {
      if (groqError.name === "AbortError") throw groqError;
      console.error("Groq API failed:", groqError.message);
      const fallback = "I'm a little overloaded right now — mind trying again in a moment? Or feel free to reach Keerthana directly at keerthana.b.v.codes@gmail.com.";
      after(() => logChatTurn({ source, ip, userMessage: message, assistantResponse: fallback, retrievalSucceeded, matchedChunks }));
      return createDirectStreamResponse(fallback);
    }

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of stream) {
            if (signal.aborted) break;

            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
        } catch (err: any) {
          if (err.name !== "AbortError") {
             console.error("Stream processing error:", err);
          }
        } finally {
          controller.close();
          // Only log a turn that actually produced a reply — an aborted
          // request (user hit stop, or unmounted) shouldn't leave a
          // half-formed row in the logs.
          if (fullResponse) {
            after(() => logChatTurn({ source, ip, userMessage: message, assistantResponse: fullResponse, retrievalSucceeded, matchedChunks }));
          }
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      return new NextResponse(null, { status: 499 }); 
    }
    console.error("RAG API handler error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function createDirectStreamResponse(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const data = `data: ${JSON.stringify({ content: text })}\n\n`;
      controller.enqueue(encoder.encode(data));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
