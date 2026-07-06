import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Using edge runtime is not possible with pg, so this remains Node.js serverless
// Triggering a redeployment to ensure environment variables are picked up by Vercel

const chunks = [
  "Keerthana B V is a Full Stack Developer based in Bengaluru. She specializes in modern web engineering and applied AI.",
  "Keerthana served as a Full Stack Developer at ASPL Tech Solutions, taking ownership of production repositories and client deliveries from day one.",
  "Keerthana's research on AI-powered legal document analysis won Best Paper at NCRIE-2025. It is a deployed, full-stack application backed by a fine-tuned BERT model trained on 510 real contracts.",
  "Keerthana holds an MCA from RV Institute of Technology and Management with a CGPA of 8.2.",
  "Keerthana's tech stack includes React, Next.js, Node.js, TypeScript, Tailwind CSS, PostgreSQL, and Python for AI integration.",
  "Keerthana has delivered 8+ production web applications.",
  "Keerthana is actively looking for a role where she can keep building things that matter. She is open to remote and relocation.",
  "You can contact Keerthana directly via email at keerthana.b.v.codes@gmail.com or call her at +91 9901724479.",
  "Keerthana's portfolio includes a 'Legal Document Analysis System' using BERT, and a scalable e-commerce backend built with Node.js and PostgreSQL.",
  "Keerthana has experience with Docker, AWS, and CI/CD pipelines."
];

async function getEmbedding(text: string, hfToken: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
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
    throw new Error(`Hugging Face API failed: ${response.statusText}`);
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
