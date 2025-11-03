Here’s the full content of the completed **project.md** file so you can copy it directly:

***

# Project Context

## Purpose
The purpose of this project is to develop an open-source, API-first Property Management System (PMS) inspired by Apaleo. It will provide modular hospitality management capabilities including reservations, payments, rates, units, services, invoices, and automation workflows. The platform will follow a **spec-driven development** approach using OpenAPI (OpenSpec) to define and evolve APIs first, ensuring interoperability and extensibility between frontend, backend, and third-party systems.

## Tech Stack
- **Build Platform:** Nx monorepo for scalable development workflow
- **Development Environment:** Windows-based development with PowerShell/Command Prompt
- **Frontend:** Angular (v20) with Angular Material for UI/UX consistency
- **Backend:** Spring Boot (Java 25) microservice architecture
- **Database:** PostgreSQL (15+)
- **Automation:** n8n for process automation and external system integrations
- **API Contracts:** OpenSpec/OpenAPI 3.1
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Registration/Authentification:** keycloak 26.0.0

## Project Conventions

### Development Environment
- **Operating System:** Windows 10/11 with PowerShell as the primary command-line interface
- **Shell Syntax:** Use PowerShell conventions (`;` for command chaining instead of `&&`)
- **Path Conventions:** Windows-style paths with backslashes (`\`) in file system operations
- **Command Examples:**
  ```powershell
  # Correct PowerShell syntax
  cd c:\Users\andre\development\workspace\jdg.digital\apps\apps\oelapa; nx serve oelapa
  
  # Nx commands for Windows
  nx serve oelapa
  nx test oelapa --watch
  nx build oelapa --prod
  nx e2e oelapa --browser=chromium
  ```
- **IDE Recommendations:** VS Code with Angular, Nx, and Playwright extensions
- **Docker Desktop:** Required for running Keycloak and database services locally

### Monorepo Structure
- **Current Project:** `oelapa` is an Angular application within an Nx monorepo
- **Development Platform:** Windows environment with PowerShell as primary shell
- **Project Creation:** Generated using `nx g @nx/angular:app apps/oelapa`
- **CLI Usage:** All development commands should use `nx` instead of `ng` (e.g., `nx serve oelapa`, `nx build oelapa`, `nx test oelapa`)
- **Windows Commands:** Use PowerShell semicolon (`;`) syntax for chaining commands instead of Unix `&&`
- **Workspace Organization:** Applications in `apps/` directory, shared libraries in `libs/` directory
- **Shared Dependencies:** Common configurations, utilities, and components managed at workspace level

### Code Style
- Nx: monorepo structure with workspace libraries and applications
- Angular: follows Angular CLI defaults with ESLint and Prettier configuration
- Angular Development: Angular MCP can be used for best practice guidance and code generation
- Spring Boot: Google Java Style Guide + Checkstyle enforcement
- Commit messages: Conventional Commits (feat, fix, refactor, docs, chore)
- Branch names: feature/*, bugfix/*, hotfix/*
- Naming conventions: camelCase for variables, PascalCase for components and classes, snake_case for database schema
- Windows Development: Commands optimized for PowerShell and Windows file system conventions

### Architecture Patterns
- **Monorepo Organization:** Nx workspace managing multiple applications and shared libraries for scalable development
- **Specification-Driven Architecture:** All service contracts are defined in OpenSpec/OpenAPI first, auto-generating TypeScript and Java stubs.
- **Microservices:** Modular services like `reservation-service`, `inventory-service`, `invoicing-service`, `user-service`, `rate-service`.
- **API Gateway:** Spring Cloud Gateway to handle routing, authentication, and rate limiting.
- **Frontend Integration:** Angular consumes auto-generated TypeScript API clients generated via OpenAPI generator.
- **Persistence:** Spring Data JPA with PostgreSQL schema managed via Liquibase.
- **Security:** JWT-based authentication via Spring Security; role-based access control.
- **Automation:** n8n integration for tasks such as invoice generation, payment reminders, and data sync with external CRMs.
- **AI-Assisted Development:** Angular MCP for code generation, best practices, and architectural guidance
- **Test Automation:** Playwright MCP for advanced E2E test scenarios and browser automation

### Testing Strategy
- **Unit Tests:** JUnit 5 (backend), Jest (frontend)
- **Integration Tests:** Testcontainers for PostgreSQL + Spring Boot integration
- **End-to-End Tests:** Playwright for comprehensive browser automation and cross-browser testing
- **Contract Tests:** OpenAPI schema validation in CI
- **Load Testing:** k6 scripts for key endpoints (bookings, payments)
- **E2E Test Automation:** Playwright MCP can be used for advanced test automation scenarios

### Git Workflow
- **Main:** always production-ready
- **Develop:** main integration branch for upcoming release
- **Feature branches:** short-lived, based on `develop`
- Code reviews and lint checks required before merging

## Domain Context
This system is a **Property Management Platform (PMP)** for hospitality operators (hotels, serviced apartments, and vacation rentals). It will manage:
- Reservations, bookings, and guest profiles
- Units, buildings, and inventory
- Rates, availability, and restrictions
- Folios, financial transactions, and invoices
- Payment automation and reconciliation
- APIs for channel management and third-party integrations

The core domain aligns with Apaleo's open PMS approach, ensuring interoperability between independent modules and external software providers.

## Important Constraints
- Must be fully API-driven and spec-first (OpenSpec).
- All modules exposed as independent REST APIs.
- GDPR-compliant data model for guest management.
- Automation with n8n limited to non-sensitive operations.
- All authentication flows must be OAuth2/JWT compatible.

## External Dependencies
- **Nx:** Monorepo build system and development tools for scalable workspace management
- **OpenSpec/OpenAPI:** Used for spec-first code generation.
- **n8n:** Workflow automation platform for synchronization and notification processes.
- **Docker:** Environment orchestration.
- **GitHub Actions:** CI/CD pipeline for testing, building, and deploying microservices.
- **OpenTelemetry:** For distributed tracing and observability.
- **Playwright:** Cross-browser end-to-end testing framework with advanced automation capabilities
- **Angular MCP:** Model Context Protocol for Angular best practices and development assistance
- **Playwright MCP:** Advanced test automation and browser interaction capabilities
