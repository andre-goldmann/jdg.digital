CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS embeddings (
                                      id SERIAL PRIMARY KEY,
                                      embedding vector(1536),
                                      text text,
                                      metadata jsonb,
                                      created_at timestamptz DEFAULT now()
);