## Context

The project is starting from an empty workspace with only the product idea documented in [docs/second_brain.md](c:/Users/z004nv3h/workspace/second-brain/docs/second_brain.md). The proposed Second Brain capability needs to support continuous capture, durable Markdown storage, semantic retrieval, contextual recall, and interoperability with external note systems. Because these concerns span ingestion, storage, indexing, retrieval, and connector boundaries, the change benefits from an explicit architectural design before implementation begins.

## Goals / Non-Goals

**Goals:**
- Define a canonical knowledge model for notes, tasks, drafts, and conversation-derived artifacts.
- Store captured knowledge as Markdown files in a workspace-managed hierarchy so the system remains inspectable and tool-friendly.
- Support semantic retrieval through an indexing pipeline that can back meaning-based search.
- Enable connector-based synchronization with external note platforms without making those platforms the source of truth.
- Build contextual recall that combines semantic relevance with recent activity and user/task history.
- Keep the design scalable enough for large note collections, background reindexing, and future expansion.

**Non-Goals:**
- Designing a full end-user UI in this change.
- Locking the implementation to a specific vector database or embedding provider.
- Delivering every external integration in the first implementation increment.
- Replacing general project documentation workflows outside the Second Brain scope.

## Decisions

### Canonical storage is Markdown-first
The system will treat workspace Markdown files as the canonical persisted representation of knowledge. Each captured item will be materialized as a Markdown document with structured frontmatter for metadata such as source, timestamps, tags, entity references, and sync state.

Alternative considered: storing canonical records in a database and exporting Markdown secondarily. Rejected because the product intent centers on transparent, user-accessible files and compatibility with tools like Obsidian.

### Ingestion and indexing are separate pipelines
Capture writes durable Markdown first, then publishes indexing work for semantic search. This keeps capture responsive and prevents vector indexing latency or provider outages from blocking storage.

Alternative considered: synchronous embed-on-write. Rejected because it couples user write latency to external inference and complicates retries.

### Retrieval uses a hybrid context assembly model
Recall will combine semantic matches, recency signals, and explicit task or conversation context. Pure vector similarity is not sufficient for a working memory system because recent and pinned items can be more important than the closest embedding match.

Alternative considered: semantic-only retrieval. Rejected because it would underperform on active tasks and short-lived conversational context.

### External note integrations use adapters around the canonical store
Integrations such as Notion and Obsidian will be implemented as adapters that import, export, or reconcile content against the workspace store. The canonical source of truth remains the local Markdown corpus.

Alternative considered: dual-write directly into each third-party tool. Rejected because it increases conflict risk and makes recovery harder.

### Knowledge organization uses stable content types and folders
The workspace layout will separate durable categories such as notes, conversations, tasks, references, and archives, while still allowing shared metadata and cross-linking. This keeps the file system scalable and understandable as the corpus grows.

Alternative considered: a flat note directory with tag-only organization. Rejected because operational workflows such as reindexing, retention, and sync become harder to target.

## Risks / Trade-offs

- [Index drift between Markdown and semantic index] → Mitigation: version indexed content, enqueue reindex jobs on file change, and provide a full rebuild path.
- [Connector conflicts with external edits] → Mitigation: track sync metadata in frontmatter, define reconciliation rules, and keep canonical local history.
- [Semantic retrieval quality varies by provider] → Mitigation: abstract embedding and vector backends behind interfaces and evaluate with scenario-based tests.
- [Unbounded growth degrades retrieval and maintenance] → Mitigation: add lifecycle states such as active and archived, and support incremental indexing plus archival policies.
- [Context recall may surface irrelevant or sensitive notes] → Mitigation: scope retrieval by workspace, note type, and permission boundaries before ranking.

## Migration Plan

1. Establish the workspace folder structure and canonical frontmatter schema.
2. Implement capture flows that materialize Markdown artifacts without semantic dependencies.
3. Add the indexing pipeline and semantic retrieval interfaces behind feature flags or configuration gates.
4. Introduce contextual recall on top of indexed and recent knowledge selection.
5. Add external connector adapters incrementally, starting with file-oriented systems before API-centric systems.
6. Support reindex and rebuild commands so existing repositories can migrate as schemas evolve.

Rollback is straightforward in the early phase because Markdown remains the source of truth; index rebuilds and connector jobs can be disabled without losing stored knowledge.

## Open Questions

- Which vector backend best fits the deployment model for this project: embedded local storage or managed service?
- Should external integrations be one-way export first or bidirectional synchronization from the start?
- What retention and redaction rules are required for conversation-derived notes that may contain sensitive user data?