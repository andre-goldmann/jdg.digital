## 1. Backend Abstraction

- [x] 1.1 Introduce a vector index protocol so the indexer no longer depends on a concrete in-memory implementation.
- [x] 1.2 Refactor the existing in-memory backend to implement the shared vector index contract.

## 2. Milvus Integration

- [x] 2.1 Add the `pymilvus` dependency and implement a Milvus-backed vector index adapter.
- [x] 2.2 Add collection bootstrap logic for the configured Milvus collection, dimension, and metric settings.
- [x] 2.3 Persist artifact identifiers and retrieval metadata in Milvus records alongside vectors.

## 3. Service And CLI Wiring

- [x] 3.1 Add Milvus configuration support to service bootstrap and CLI entrypoints.
- [x] 3.2 Update reindex and verify operations to work against the Milvus backend.

## 4. Validation

- [x] 4.1 Add or update tests for the new vector index abstraction and Milvus adapter behavior.
- [x] 4.2 Validate live connectivity and end-to-end semantic search against the local Milvus instance, using the working `pymilvus` client endpoint at `http://localhost:19530`.