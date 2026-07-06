import pg from 'pg';

// Using built-in fetch which is available in Node 18+
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const HF_TOKEN = process.env.HF_TOKEN;

// The knowledge base chunks based on Keerthana's portfolio
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

async function getEmbedding(text) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_TOKEN}`,
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

async function main() {
  if (!process.env.DATABASE_URL || !process.env.HF_TOKEN) {
    console.error("Missing DATABASE_URL or HF_TOKEN environment variables!");
    process.exit(1);
  }

  console.log("Starting RAG seeding process...");
  
  // Create table if it doesn't exist (assuming the user ran setup.sql, this is just a backup)
  try {
    const res = await pool.query(`SELECT to_regclass('public.kb_chunks')`);
    if (!res.rows[0].to_regclass) {
      console.error("The kb_chunks table does not exist. Please run setup.sql in Supabase first.");
      process.exit(1);
    }
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    
    try {
      const embedding = await getEmbedding(chunk);
      const vectorSql = `[${embedding.join(",")}]`;
      
      await pool.query(
        `INSERT INTO kb_chunks (content, metadata, embedding) VALUES ($1, $2, $3::vector)`,
        [chunk, JSON.stringify({ source: "portfolio", index: i }), vectorSql]
      );
      
      console.log(`✅ Chunk ${i + 1} inserted successfully.`);
      
      // Wait slightly to avoid Hugging Face rate limits on free tier
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`❌ Failed to process chunk ${i + 1}:`, err.message);
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

main().catch(console.error);
