## 1. Workspace Knowledge Model

- [x] 1.1 Define the canonical folder layout for notes, conversations, tasks, references, and archives in the workspace.
- [x] 1.2 Define the Markdown frontmatter schema for captured artifacts, including source, timestamps, type, tags, and sync metadata.
- [x] 1.3 Implement file creation and update helpers that persist canonical Markdown artifacts consistently.

## 2. Capture Pipeline

- [x] 2.1 Implement capture flows that convert incoming messages, thoughts, drafts, ideas, and tasks into persisted knowledge artifacts.
- [x] 2.2 Add classification logic that assigns each captured artifact a stable content type and storage location.
- [x] 2.3 Add tests for initial capture, updates to existing artifacts, and persistence across sessions.

## 3. Indexing And Retrieval

- [x] 3.1 Define the indexing interface for embeddings and vector search without binding the design to a single provider.
- [x] 3.2 Implement asynchronous indexing jobs triggered by Markdown writes and updates.
- [x] 3.3 Implement semantic retrieval that can return relevant artifacts for meaning-based queries.
- [x] 3.4 Add rebuild and reindex flows that reconstruct retrieval state from the Markdown corpus.

## 4. Context Assembly

- [x] 4.1 Implement context selection that combines semantic matches, recency, and active task history.
- [x] 4.2 Add ranking or filtering rules that prioritize active context over stale but similar artifacts.
- [x] 4.3 Add tests for topic resumption and current-task context recall.

## 5. External Integrations

- [x] 5.1 Define an adapter contract for external note systems such as Obsidian and Notion.
- [x] 5.2 Implement an initial export or synchronization path that preserves artifact content and essential metadata.
- [x] 5.3 Implement sync-state tracking and reconciliation rules for externally updated artifacts.

## 6. Scalability And Operations

- [x] 6.1 Implement lifecycle states for active and archived knowledge artifacts.
- [x] 6.2 Add operational commands or jobs for archive, reindex, and integrity verification workflows.
- [x] 6.3 Add performance and regression tests covering larger knowledge collections and degraded index conditions.