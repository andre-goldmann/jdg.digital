# n8n Workflow Creator Documentation Guidelines

## Project Overview

This is the comprehensive documentation repository for n8n, a fair-code licensed workflow automation tool. The project contains two primary documentation files covering the complete n8n ecosystem, from basic workflows to advanced custom node development.

## Key Architecture Components

### Documentation Structure
- **Complete Documentation** (`N8N - Complete n8n documentation.md`): Main comprehensive guide
- **Combined Documentation** (`n8n_docs_combined.md`): Consolidated reference with 85,000+ lines covering all aspects

### Core n8n Concepts
- **Workflows**: Collections of nodes that automate processes, executed sequentially
- **Nodes**: Individual components (trigger, action, core) that compose workflows
  - Trigger nodes: Start workflows based on conditions
  - Action nodes: Interact with external services (400+ integrations)
  - Core nodes: Handle data processing, logic, and flow control
- **Data Structure**: All data flows as JSON arrays of objects between nodes
- **Canvas**: Visual workflow builder interface in the Editor UI

## Development Workflows

### Custom Node Development
```bash
# Install n8n-node-dev CLI
npm install -g n8n-node-dev

# Create new node
n8n-node-dev new

# Build and test
n8n-node-dev build
```

### n8n-nodes-module Creation
- Module names must start with `n8n-nodes-`
- Package.json requires `n8n` key with `nodes` and `credentials` arrays
- Install location: `~/.n8n/custom/` (v1.0+) or `~/.n8n/nodes/`
- Use `npm link` for local development testing

### Testing Patterns
- Test with multiple input items (not just single items)
- Verify `continueOnFail` functionality
- Test pagination with `limit: 1`
- Validate credential handling and error responses

## Project-Specific Conventions

### Node Development Standards
- Use TypeScript for all node development
- Follow camelCase for `name` properties in descriptions
- Ensure file names match class names exactly
- Add `continueOnFail` handlers for production resilience
- Implement consistent response formats between Create/Get/GetAll operations

### Data Flow Patterns
- n8n uses ETL (Extract, Transform, Load) model
- Execution order changed in v1.0: depth-first vs breadth-first
- Multi-input nodes require data on at least one input
- Data pinning available for development (ignored in production)

### Documentation Conventions
- Follow Microsoft Writing Style Guide
- Use Markdown with specific formatting patterns
- Include operation examples and credential setup
- Document OAuth methods first when multiple auth options exist

## Integration Points

### External Dependencies
- Custom nodes can include external npm dependencies
- Python support added in Code node (v1.0+)
- WebSocket support for real-time integrations
- API-first approach for services without dedicated nodes

### Deployment Considerations
- Self-hosted instances support custom nodes
- n8n Cloud has different limitations
- Environment variables for AI features (`N8N_AI_ENABLED`, `N8N_AI_OPENAI_API_KEY`)
- Database structure includes 20+ tables for workflows, credentials, executions

## Critical Commands & Paths

- Custom node installation: `~/.n8n/custom/` or `N8N_CUSTOM_EXTENSIONS` directory
- Development build: `npm run build && npm link`
- Linting: `npm run lint`
- Node types: Execute, Trigger, Webhook patterns

## Common Pitfalls

- Don't use deprecated request lib (removed in v1.0)
- Avoid loading nodes from global node_modules (deprecated)
- Handle expression errors properly to prevent silent failures
- Mind default values - changing them breaks existing workflows
- Ensure proper disposal of connections and resources