import { NextRequest, NextResponse } from "next/server";
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

async function getEmbedding(text: string, signal: AbortSignal): Promise<number[]> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2",
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

    const { message } = await req.json();
    if (!message) {
      return new NextResponse("Message required", { status: 400 });
    }

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

    if (!embeddingFailed && queryVector.length > 0) {
      const vectorSql = `[${queryVector.join(",")}]`;
      const similarityThreshold = Number(process.env.RAG_SIMILARITY_THRESHOLD || "0.15");
      
      try {
        const { rows } = await pool.query(
          `SELECT id, content, metadata FROM match_kb_chunks($1::vector, $2, $3)`,
          [vectorSql, similarityThreshold, 5]
        );
        
        if (rows.length === 0) {
          return createDirectStreamResponse(
            "I couldn't find specific information about that in my knowledge base. Please feel free to contact Keerthana directly at keerthana.b.v.codes@gmail.com for more details."
          );
        }

        context = rows.map((c: any, i: number) => `[#${i + 1}] ${c.content}`).join("\n\n");
        retrievalSucceeded = true;
      } catch (dbError: any) {
        console.warn("Database query failed, proceeding without context:", dbError.message);
      }
    }

    if (!retrievalSucceeded && embeddingFailed) {
       return createDirectStreamResponse(
         "I'm currently experiencing a connection issue with my knowledge base API. Please contact Keerthana directly at keerthana.b.v.codes@gmail.com in the meantime."
       );
    }

    const systemPrompt = [
      "You are Keerthana B V's expert portfolio AI assistant.",
      "Keerthana is a Full-Stack Developer based in Bengaluru. She recently completed her MCA from RVITM.",
      "She has delivered 8+ production web applications and specializes in React, Node.js, and AI automation.",
      "RULES: Be enthusiastic, professional, and concise. Use provided context to answer accurately. If unsure, suggest contacting Keerthana. Use [CTA_CONTACT] when asked for contact details.",
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
      return createDirectStreamResponse(
        "I'm currently experiencing high load or an API issue. Please try again later or contact Keerthana directly."
      );
    }

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (signal.aborted) break;
            
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
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
