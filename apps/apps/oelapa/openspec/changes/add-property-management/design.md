# Property Management Technical Design

## Context
The OELAPA PMS needs comprehensive property management capabilities to enable hotel operators to create and configure properties. This implements the two-phase property management approach documented in properties.md: Phase 1 (Creation) and Phase 2 (Configuration).

## Goals / Non-Goals
**Goals:**
- Enable property creation with required core information (code, name, location, company details)
- Provide comprehensive property configuration interface for operational settings
- Support multi-property context switching for enterprise customers
- Ensure form validation and data integrity for hospitality business rules
- Integrate seamlessly with existing authentication and UI patterns

**Non-Goals:**
- Advanced property analytics or reporting (future scope)
- Third-party property data synchronization (future integration)
- Property branding and theming customization (future enhancement)
- Property performance metrics and KPI tracking (future scope)

## Decisions

### Property Data Architecture
- **Decision:** Use hierarchical property settings structure (Property -> Settings -> Specific Configs)
- **Rationale:** Mirrors Apaleo's documented approach and enables granular permission management
- **Alternatives considered:** Flat settings structure (rejected due to complexity scaling issues)

### Property Context Management
- **Decision:** Implement property context service with reactive state management
- **Rationale:** Enables property context switching across all application modules
- **Alternatives considered:** Route-based property context (rejected due to UX complexity)

### Form Validation Strategy
- **Decision:** Use Angular reactive forms with custom validators for hospitality business rules
- **Rationale:** Provides type safety, reusable validation, and excellent UX feedback
- **Alternatives considered:** Template-driven forms (rejected due to complexity requirements)

### Settings Organization
- **Decision:** Tabbed interface matching Apaleo's settings organization (General, Distribution, Finance, Automation, Inventory)
- **Rationale:** Familiar UX for hospitality professionals and logical grouping of related settings
- **Alternatives considered:** Single-page settings (rejected due to information density)

## Risks / Trade-offs

### Data Complexity Risk
- **Risk:** Property settings complexity may lead to confusing UX
- **Mitigation:** Progressive disclosure, contextual help, and logical form grouping

### Multi-tenancy Preparation
- **Risk:** Current single-property design may not scale to multi-property enterprise needs
- **Mitigation:** Property context service designed for future multi-property enhancement

### Validation Complexity
- **Risk:** Hospitality business rules validation may become complex and hard to maintain
- **Mitigation:** Centralized validation service with documented business rule patterns

## Migration Plan
1. **Phase 1:** Implement property creation with core data model
2. **Phase 2:** Add property configuration interface with settings management
3. **Phase 3:** Integrate property context with existing reservation and dashboard modules
4. **Phase 4:** Add advanced property management features based on user feedback

## Open Questions
- Should property code generation be automatic or manual? (Initial: manual, future: configurable)
- How should property permissions be integrated with Keycloak roles? (Future scope)
- Should property templates be supported for quick setup? (Future enhancement)