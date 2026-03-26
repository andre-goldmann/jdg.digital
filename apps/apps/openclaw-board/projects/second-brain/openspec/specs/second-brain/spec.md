## Purpose

Define the expected behavior for the Second Brain capability, including Markdown-first capture, semantic retrieval, contextual recall, external note interoperability, and scalable lifecycle operations.

## Requirements

### Requirement: Automatic knowledge capture
The system SHALL persist user-provided messages, thoughts, drafts, ideas, and tasks as durable knowledge artifacts without requiring manual file creation.

#### Scenario: Capture a new conversation item
- **WHEN** a user provides new information to the system
- **THEN** the system creates or updates a durable knowledge artifact representing that information in the workspace

#### Scenario: Preserve captured content across sessions
- **WHEN** a user returns after a previous interaction
- **THEN** previously captured knowledge artifacts remain available for retrieval and reuse

### Requirement: Canonical Markdown storage
The system SHALL store persisted knowledge in Markdown files that are human-readable, workspace-accessible, and structured with metadata required for retrieval and synchronization.

#### Scenario: Store metadata with a note
- **WHEN** the system writes a knowledge artifact
- **THEN** the resulting Markdown file includes structured metadata for source, timestamps, and classification

#### Scenario: Keep the workspace inspectable
- **WHEN** an operator browses the workspace files
- **THEN** the stored knowledge corpus is organized in a way that can be understood without proprietary tooling

### Requirement: Semantic knowledge retrieval
The system SHALL support retrieval of stored knowledge by semantic meaning in addition to exact keyword matching.

#### Scenario: Find related information by intent
- **WHEN** a user asks for information using wording that differs from the original stored text
- **THEN** the system returns relevant knowledge artifacts that match the request semantically

#### Scenario: Tolerate large knowledge collections
- **WHEN** the knowledge base grows to many documents
- **THEN** retrieval remains available without requiring full linear scans of the Markdown corpus for every query

### Requirement: Milvus-backed semantic persistence
The system SHALL persist semantic search vectors in a configured Milvus collection so vector retrieval remains available across process restarts.

#### Scenario: Index a captured artifact into Milvus
- **WHEN** the indexing pipeline processes a captured knowledge artifact
- **THEN** the system writes the artifact identifier, vector embedding, and required retrieval metadata into the configured Milvus collection

#### Scenario: Search after restart
- **WHEN** the application restarts and reconnects to the configured Milvus collection
- **THEN** semantic search can return previously indexed artifacts without re-capturing the Markdown corpus first

### Requirement: Milvus collection lifecycle management
The system SHALL initialize and rebuild the configured Milvus collection as part of operational indexing workflows.

#### Scenario: Bootstrap a missing collection
- **WHEN** the configured Milvus collection does not exist during indexing or verification
- **THEN** the system creates the collection with the configured vector dimension and search metric before continuing

#### Scenario: Rebuild the vector backend
- **WHEN** an operator runs the reindex workflow
- **THEN** the system reconstructs Milvus vector state from the canonical Markdown corpus

### Requirement: Configurable Milvus connection
The system SHALL allow Milvus connection and collection settings to be configured without editing source code.

#### Scenario: Override the default endpoint
- **WHEN** an operator provides a custom Milvus URI or collection name
- **THEN** the system connects to that configured backend instead of the default workspace settings

### Requirement: Contextual memory assembly
The system SHALL assemble context for ongoing interactions from prior knowledge artifacts, recent activity, and active task history.

#### Scenario: Resume a prior topic
- **WHEN** a user continues a previously discussed task or project
- **THEN** the system can surface prior relevant artifacts without requiring the user to restate the background

#### Scenario: Prefer active context
- **WHEN** recent artifacts and semantically similar older artifacts both exist
- **THEN** the system ranks or filters results so active context is available to the current interaction

### Requirement: External note system interoperability
The system SHALL support integration boundaries for external note ecosystems such as Obsidian and Notion while preserving the local workspace as the canonical source of truth.

#### Scenario: Export knowledge to an external system
- **WHEN** a configured integration publishes a knowledge artifact
- **THEN** the external representation preserves the artifact content and essential metadata needed for traceability

#### Scenario: Reconcile external changes
- **WHEN** an external system returns updates for a synchronized artifact
- **THEN** the system records enough sync metadata to reconcile those updates against the local canonical copy

### Requirement: Scalable lifecycle management
The system SHALL support growth of the knowledge base through organization, indexing, and lifecycle controls for active and archived content.

#### Scenario: Archive stale material
- **WHEN** knowledge artifacts are no longer active but must remain retrievable
- **THEN** the system can move or classify them as archived without deleting their history

#### Scenario: Rebuild retrieval state
- **WHEN** indexing state is lost, outdated, or reconfigured
- **THEN** the system can rebuild retrieval state from the canonical Markdown corpus