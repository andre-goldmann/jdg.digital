## Why

The current semantic retrieval implementation is in-memory only, which makes vector search ephemeral and unsuitable for a running Second Brain that needs persistent, scalable retrieval. Integrating Milvus now replaces the placeholder backend with a real vector database and lets the project use the available local Milvus instance at `localhost:9091`.

## What Changes

- Replace the in-memory vector index with a Milvus-backed vector index implementation using the Python Milvus client.
- Add configuration for Milvus connection details, collection naming, vector field settings, and search parameters.
- Persist vector records and searchable metadata in Milvus so semantic search survives process restarts.
- Add backend-aware reindex and verification flows for Milvus collection creation, rebuild, and health validation.
- Keep the current indexing abstraction so the rest of the service layer does not depend directly on Milvus client calls.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `second-brain`: Semantic retrieval and rebuild behavior will be extended to support a Milvus-backed vector store and operational validation for the configured backend.

## Impact

- Affects the indexing layer, service bootstrap, CLI wiring, operational commands, and test coverage.
- Introduces the `pymilvus` dependency and a runtime dependency on a reachable Milvus service.
- Requires search and rebuild logic to persist vectors and metadata in a named Milvus collection.