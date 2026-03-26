## ADDED Requirements

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