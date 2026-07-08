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

// Whether to append a "[See this project](#nav:PROJECTS)" link is enforced
// here, not left to a prompt instruction — llama-3.1-8b-instant did not
// reliably remember to add it even with an explicit, example-backed rule.
// Same reasoning as the [CTA_CONTACT] marker and the zero-match canned
// fallback: anything that must be deterministic goes in code, not a prompt.
const PROJECT_LINK_MARKUP = "[See this project](#nav:PROJECTS)";
const PROJECT_KEYWORDS = [
  // AI Customer Support RAG agent
  "ragas", "prompt-injection", "prompt injection", "customer support",
  // AI Voice Agent
  "voice agent", "vapi", "tanglish", "gpt-4o-mini",
  // Legal Document AI
  "legal document", "cuad", "lora", "ncrie",
];

function mentionsSpecificProject(text: string): boolean {
  const lower = text.toLowerCase();
  return PROJECT_KEYWORDS.some((kw) => lower.includes(kw));
}

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

    const { message, source: rawSource, history: rawHistory } = await req.json();
    if (!message) {
      return new NextResponse("Message required", { status: 400 });
    }
    const source: "text" | "voice" = rawSource === "voice" ? "voice" : "text";

    // ChatWidget sends the full message list including the just-added current
    // turn as its last element (see handleSend's `historyToSend`), so that
    // duplicates `message` below — drop it, and cap how far back we look
    // since ChatWidget already caps a session at 6 exchanges.
    const priorHistory: { text?: string; sender?: string }[] = Array.isArray(rawHistory) ? rawHistory.slice(0, -1) : [];
    const conversationMessages = priorHistory
      .filter((m) => typeof m.text === "string" && m.text.trim())
      .slice(-12)
      .map((m) => ({
        role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.text as string,
      }));

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
          [vectorSql, similarityThreshold, 20]
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
      "NEVER invent a number, percentage, or statistic that is not literally present in CONTEXT — this applies even when it would make an answer sound more concrete or complete. If CONTEXT has no metric for what you're describing, describe it in plain words with zero numbers instead of manufacturing one. A fabricated stat is a factual error about a real person's real work and is worse than an answer with no numbers at all.",
      "If asked about your own identity (e.g. 'who are you', 'are you Keerthana', 'are you a bot/AI') answer directly and confidently, even if CONTEXT looks unrelated: you are Keerthana's AI assistant — a live RAG-and-voice-enabled demo she built into her portfolio to answer questions about her work. Never treat this kind of question as an unknown topic requiring the email fallback.",
      "Write in natural, conversational sentences. Never mention 'context', 'knowledge base', retrieval, or any other internal system detail — if you don't know something, just say so warmly and point them to her email.",
      "DEFAULT LENGTH IS SHORT: 2-3 sentences (roughly 40-70 words) for any specific question — a skill, a project, availability, a yes/no experience question. Get straight to the answer with zero preamble. Recruiters are skimming, not reading an essay. Only expand into a longer, more detailed answer (still under ~150 words) when the user explicitly asks to go deeper / for more detail / says yes to your own follow-up offer.",
      "YES/NO EXPERIENCE QUESTIONS (e.g. 'does she have RAG experience', 'has she built agents', 'did she use X') where the exact thing asked about IS confirmed in CONTEXT: open with a direct 'Yes —', then the facts, then a follow-up offer. Example shape for 'does she have RAG experience': \"Yes — two of her shipped projects use RAG: an AI customer support agent and this portfolio chatbot itself. Want me to go deeper on either one?\" That's it — do not front-load RAGAS scores, block rates, or architecture details unless asked; save those for the follow-up turn.",
      "The broad-identity opener (positioning line + 2-3 highlights + the self-referential chatbot line) applies ONLY to a question asking about her as a whole person/career with NO other topic named — e.g. 'tell me about Keerthana', 'who is she'. Questions about a specific topic are NEVER broad, even if worded as 'tell me about her RAG experience' or 'tell me about her voice AI work' — 'RAG experience' IS the named topic there, so answer RAG specifically and briefly, with zero identity-statement preamble ('Keerthana is an AI Solutions Engineer...' must not appear in a RAG-topic, skill-topic, or project-topic answer).",
      "SKILL GAPS: if the exact skill/technology asked about does NOT appear in CONTEXT, do NOT open with 'Yes' — that misrepresents the answer even if you go on to clarify. Open instead with something like \"Not something she's listed experience with directly, but...\", then name the closest adjacent/related skill CONTEXT actually shows, and you may add that she picks up new tools quickly given her track record. Never claim or imply direct experience with the specific unlisted skill itself, and never let the opening word contradict the rest of the answer.",
      "When a skill IS in CONTEXT, don't just confirm she knows it — name the specific project it was used in and what it accomplished there (e.g. asked about prompt injection defense → the customer support RAG agent's double-layer defense, 100% block rate) — still within the 2-3 sentence default.",
      "Default to plain, friendly sentences, no headings — a short answer never needs one.",
      "Stay factual and professional — no exaggerated praise or buzzword-stuffed self-promotion — but be personable and easy to read, like you're genuinely glad to help. Never write filler like 'talented professional', 'strong background', or 'passionate about'.",
      "Say 'Keerthana' at most ONCE per reply, ideally the first sentence — every mention after that MUST be 'she'/'her'/'her's' instead.",
      "The 'reach out to her directly' fallback is a last resort, not a default — only use it when CONTEXT genuinely has nothing on the topic, not just because a short honest answer feels incomplete.",
      "If the answer isn't available, say so naturally (e.g. \"I don't have that on hand, but you can reach her directly at keerthana.b.v.codes@gmail.com\") instead of a stiff refusal.",
    ].join("\n");

    const userPrompt = `Use the CONTEXT to answer the USER.\n\nCONTEXT:\n${context || "No context found."}\n\nUSER: ${message}`;

    let stream;
    try {
      stream = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationMessages,
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
          if (!signal.aborted && fullResponse && !fullResponse.includes("#nav:PROJECTS") && mentionsSpecificProject(fullResponse)) {
            const linkContent = `\n\n${PROJECT_LINK_MARKUP}`;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: linkContent })}\n\n`));
            fullResponse += linkContent;
          }
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
