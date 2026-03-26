## Why

OpenClaw needs a persistent knowledge system that can capture user inputs continuously, organize them into durable notes, and retrieve them with contextual relevance. Building this now establishes the product's core memory layer and gives later agent workflows a stable foundation for recall, task continuity, and personal knowledge management.

## What Changes

- Introduce a Second Brain capability that stores messages, notes, tasks, and ideas as durable Markdown knowledge artifacts in the workspace.
- Add semantic retrieval over stored knowledge so information can be found by meaning, not only exact keywords.
- Define integrations with external note systems such as Obsidian and Notion to keep the knowledge base interoperable.
- Add contextual memory behavior so ongoing interactions can reuse prior facts, preferences, and project history without repeated user explanation.
- Define scalability expectations for indexing, storage layout, and lifecycle management as the knowledge base grows.

## Capabilities

### New Capabilities
- `second-brain`: Persistent personal knowledge management for automatic capture, semantic retrieval, external note integration, contextual continuity, and scalable long-term storage.

### Modified Capabilities
- None.

## Impact

- New specification for the Second Brain product behavior.
- Likely affects ingestion and storage services, retrieval/search services, memory management, connector integrations, and background indexing workflows.
- May introduce dependencies on embedding or vector search infrastructure and external provider APIs for sync targets.