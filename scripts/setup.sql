-- Enable pgvector extension
create extension if not exists vector;

-- Create the table to store knowledge base chunks
create table if not exists kb_chunks (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding vector(384) -- all-MiniLM-L6-v2 produces 384-dimensional vectors
);

-- Create a function to search for matching chunks
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
