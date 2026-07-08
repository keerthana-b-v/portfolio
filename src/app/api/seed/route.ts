import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Using edge runtime is not possible with pg, so this remains Node.js serverless
// Triggering a redeployment to ensure environment variables are picked up by Vercel

const chunks = [
  "Keerthana B V is an AI Solutions Engineer based in Bengaluru, specializing in Voice AI, Prompt Engineering, and LLM Agents. She designs, prompts, and ships production conversational agents end-to-end.",
  "This chatbot is Keerthana's AI assistant, not Keerthana herself — it's a live RAG-and-voice-enabled demo she built into her portfolio, here to answer questions about her projects, skills, and experience on her behalf.",
  "Keerthana's career highlights: a deployed RAG customer support agent validated at 94.4% faithfulness and 85.5% context precision (RAGAS) with a 100% prompt-injection block rate, a multilingual voice agent built on Vapi AI and GPT-4o-mini, and a Best Paper (NCRIE 2025) for a LoRA-fine-tuned BERT legal document model. This chatbot you're talking to right now is itself a RAG pipeline she built end-to-end — a live demo of her work, not just a portfolio listing.",
  "Keerthana served as a Full Stack Developer at ASPL Tech Solutions Pvt. Ltd., Bengaluru (Oct 2025 – Mar 2026). She collaborated directly with 5+ clients to gather requirements, run project updates, and translate business goals into production software, building client-facing web applications in React.js and Node.js.",
  "Keerthana served as a MERN Stack Developer Intern at Dyashin Technosoft Pvt. Ltd., Bengaluru (Nov 2024 – Jan 2025), where she built a MERN e-commerce platform, resolved 15+ critical UAT bugs, and cut post-launch defects by 40%.",
  "Keerthana has hands-on RAG (Retrieval-Augmented Generation) experience across multiple shipped projects: an e-commerce customer support RAG agent, a fine-tuned legal document intelligence system, and this very portfolio chatbot you're talking to right now, which is itself a live RAG pipeline.",
  "This portfolio chatbot is a real, production RAG system Keerthana built end-to-end: Hugging Face sentence-transformers embeddings, a Postgres + pgvector vector store on Supabase, cosine-similarity retrieval, and Groq's llama-3.1-8b-instant for generation, streamed back over SSE. This conversation is a live demo of her RAG engineering, not just a portfolio listing.",
  "Keerthana's flagship RAG project is an AI Customer Support Conversational Agent — a full-stack e-commerce support agent built with FastAPI, LangChain, and SQLite, streaming responses in real time over SSE with sub-second latency, deployed on Render and Vercel.",
  "On that customer support RAG agent, Keerthana red-teamed it with adversarial prompt-injection attacks and built a double-layer defense (keyword screening + LLM classification) that achieved a 100% block rate on the attack test suite.",
  "Keerthana validated that same RAG agent's answer quality with a custom RAGAS evaluation runner, measuring 94.4% faithfulness and 85.5% context precision, and engineered stateful multi-turn intent routing with sentiment tracking that auto-escalates frustrated customers to a human handoff.",
  "Keerthana also built an AI Voice Agent — a multilingual (English/Tanglish) conversational voice agent using Vapi AI and OpenAI GPT-4o-mini to automate customer order intake and L1 FAQs, with a serverless Make.com pipeline logging structured call data to Google Sheets and Twilio sending UPI payment links via SMS.",
  "Keerthana's research on AI-powered legal document analysis won Best Paper at NCRIE-2025. She fine-tuned a domain-specific BERT model with LoRA to 84.9% F1 on the 510-contract CUAD benchmark in about 3 hours on a single T4 GPU — a deployed, full-stack application, not just an academic exercise.",
  "Keerthana's core LLM/RAG tooling includes LangChain, RAG architecture design, RAGAS evaluation, FAISS/BM25 retrieval, context window management, and working with models like GPT-4o-mini and Llama-3.1 via Groq.",
  "Keerthana's prompt engineering skills include system prompt design, dialogue flow, context handling, JSON schema constraints, slot-filling, red-teaming, prompt-injection defense, and hallucination mitigation.",
  "Keerthana's voice AI skills include Vapi AI (STT/TTS), Twilio, call-flow design, Tanglish and vernacular language handling, and latency-aware turn-taking.",
  "Keerthana's broader engineering stack includes React, Next.js, Node.js, TypeScript, Tailwind CSS, PostgreSQL, Python, FastAPI, Docker, AWS, and CI/CD pipelines — she designs schemas, integrates models, configures servers, and ships UIs end to end.",
  "Keerthana holds an MCA from RV Institute of Technology and Management with a CGPA of 8.2 (graduation Aug 2025), and a BCA from Community Institute of Commerce and Management with a CGPA of 8.4 (2023).",
  "Keerthana is fluent in English (professional proficiency), Kannada, and Telugu.",
  "Keerthana is actively looking for roles in AI solutions engineering, voice AI, prompt engineering, conversational AI / chatbot development, or AI agent development where she can keep building things that matter. She is open to remote roles and to in-office/on-site roles based in Bengaluru, but not to relocating outside Bengaluru.",
  "You can contact Keerthana directly via email at keerthana.b.v.codes@gmail.com or call her at +91 9901724479."
];

async function getEmbedding(text: string, hfToken: string) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${hfToken}`,
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Hugging Face API failed: ${response.status} ${response.statusText} - ${errText}`);
  }

  const result = await response.json();
  if (Array.isArray(result)) {
    return result;
  }
  throw new Error("Invalid embedding response format from Hugging Face");
}

export async function GET() {
  const { DATABASE_URL, HF_TOKEN } = process.env;

  if (!DATABASE_URL || !HF_TOKEN) {
    return NextResponse.json(
      { error: "Missing DATABASE_URL or HF_TOKEN in Vercel environment variables." },
      { status: 500 }
    );
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Set up database schema
    await pool.query(`
      create extension if not exists vector;
      
      create table if not exists kb_chunks (
        id bigserial primary key,
        content text not null,
        metadata jsonb,
        embedding vector(384)
      );

      create or replace function match_kb_chunks (
        query_embedding vector(384),
        match_threshold float,
        match_count int
      )
      returns table (
        id bigint,
        content text,
        metadata jsonb,
        similarity float
      )
      language sql stable
      as $$
        select
          kb_chunks.id,
          kb_chunks.content,
          kb_chunks.metadata,
          1 - (kb_chunks.embedding <=> query_embedding) as similarity
        from kb_chunks
        where 1 - (kb_chunks.embedding <=> query_embedding) > match_threshold
        order by similarity desc
        limit match_count;
      $$;
    `);

    // 2. Clear existing chunks to avoid duplicates if run multiple times
    await pool.query('TRUNCATE TABLE kb_chunks;');

    // 3. Seed data
    const insertPromises = chunks.map(async (chunk, i) => {
      const embedding = await getEmbedding(chunk, HF_TOKEN);
      const vectorSql = `[${embedding.join(",")}]`;
      
      await pool.query(
        `INSERT INTO kb_chunks (content, metadata, embedding) VALUES ($1, $2, $3::vector)`,
        [chunk, JSON.stringify({ source: "portfolio", index: i }), vectorSql]
      );
    });

    await Promise.all(insertPromises);
    const insertedCount = chunks.length;

    return NextResponse.json({ 
      success: true, 
      message: `Database setup complete! Seeded ${insertedCount} chunks into knowledge base.` 
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during setup." },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
