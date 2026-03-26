## Context

The project currently uses `TokenEmbeddingProvider` plus an `InMemoryVectorIndex` as a reference backend for semantic retrieval. That design was intentionally abstract, but it does not persist vectors across process restarts and cannot exercise a real vector database workflow. A Milvus instance is available locally at `localhost:9091`, and the indexing abstraction is narrow enough to replace the in-memory store without rewriting the capture and retrieval logic.

## Goals / Non-Goals

**Goals:**
- Add a Milvus-backed vector index that uses the existing embedding provider output and current asynchronous indexing flow.
- Persist vector records and searchable metadata in a Milvus collection so semantic search survives process restarts.
- Keep the rest of the application backend-agnostic by introducing a vector index protocol instead of scattering Milvus calls across the codebase.
- Provide reindex and verify operations that can initialize, rebuild, and inspect the configured Milvus collection.
- Add tests that validate fallback-free semantic retrieval against the new backend abstraction and isolate Milvus-specific behavior from core service tests.

**Non-Goals:**
- Replacing the current token-based embedding provider in this change.
- Designing a multi-collection tenancy model.
- Introducing advanced Milvus indexing strategies beyond a pragmatic default collection setup.
- Supporting both Milvus and in-memory backends as first-class runtime options indefinitely.

## Decisions

### Introduce a vector index protocol
The current `AsyncIndexer` depends on a concrete `InMemoryVectorIndex`. This change will extract a protocol interface for vector indexes and implement both an in-memory adapter for tests and a Milvus adapter for production-like usage.

Alternative considered: replacing the concrete class with Milvus calls directly inside `AsyncIndexer`. Rejected because it would make testing harder and erase the clean backend boundary that already exists.

### Use MilvusClient quick-setup collection creation
The Milvus adapter will use `MilvusClient` and create a collection on demand with a configured dimension, default vector field name, string primary keys, and COSINE similarity.

Alternative considered: defining a fully custom schema with many scalar columns up front. Rejected for now because the current app only needs vector search plus recoverable identifiers and minimal metadata, and the quick setup path is enough for this integration.

### Persist searchable document metadata in Milvus records
Each indexed entity will include the artifact identifier, vector, title, body, content type, lifecycle state, and task references as scalar fields or dynamic metadata where needed. Search results will return the stored identifier and score, while the canonical Markdown store remains the source of truth for full document content.

Alternative considered: storing only vector plus identifier in Milvus. Rejected because operational inspection and future filtering become harder.

### Bootstrap through configuration rather than hardcoded constants
The CLI and service builder will accept Milvus URI and collection configuration, defaulting to `http://localhost:9091` for this workspace. This keeps the integration usable in other environments without editing code.

Alternative considered: hardcoding `localhost:9091` directly in the adapter. Rejected because it would couple the library to one workstation setup.

## Risks / Trade-offs

- [Milvus server is unavailable at runtime] → Mitigation: fail fast with a clear connection error during bootstrap or verification.
- [Token vectors are low quality compared with model embeddings] → Mitigation: keep embedding generation abstract so a higher-quality provider can be swapped in later.
- [Collection schema mismatches after code changes] → Mitigation: add explicit collection bootstrap and rebuild operations rather than relying on ad hoc writes.
- [Tests become dependent on local infrastructure] → Mitigation: keep unit tests on the abstraction layer and gate live Milvus validation behind targeted integration coverage.

## Migration Plan

1. Introduce a vector index protocol and refactor the indexer to depend on it.
2. Add Milvus configuration and adapter code with collection bootstrap.
3. Update service bootstrap and CLI wiring to use Milvus by default for this workspace.
4. Add rebuild, verify, and search behavior against Milvus-backed persistence.
5. Run the test suite and a live connectivity check against the configured Milvus instance.

Rollback is limited to restoring the in-memory adapter as the default backend and leaving the Milvus collection unused. Canonical Markdown artifacts remain unchanged.

## Open Questions

- Does the local Milvus instance require authentication, or is anonymous local access sufficient?
- Should lifecycle state and tags be modeled as explicit scalar fields now, or deferred until metadata filtering is needed?