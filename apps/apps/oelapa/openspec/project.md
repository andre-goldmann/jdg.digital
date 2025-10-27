Here’s the full content of the completed **project.md** file so you can copy it directly:

***

# Project Context

## Purpose
The purpose of this project is to develop an open-source, API-first Property Management System (PMS) inspired by Apaleo. It will provide modular hospitality management capabilities including reservations, payments, rates, units, services, invoices, and automation workflows. The platform will follow a **spec-driven development** approach using OpenAPI (OpenSpec) to define and evolve APIs first, ensuring interoperability and extensibility between frontend, backend, and third-party systems.

## Tech Stack
- **Frontend:** Angular (v17) with Angular Material for UI/UX consistency
- **Backend:** Spring Boot (Java 21) microservice architecture
- **Database:** PostgreSQL (15+)
- **Automation:** n8n for process automation and external system integrations
- **API Contracts:** OpenSpec/OpenAPI 3.1
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions

## Project Conventions

### Code Style
- Angular: follows Angular CLI defaults with ESLint and Prettier configuration
- Spring Boot: Google Java Style Guide + Checkstyle enforcement
- Commit messages: Conventional Commits (feat, fix, refactor, docs, chore)
- Branch names: feature/*, bugfix/*, hotfix/*
- Naming conventions: camelCase for variables, PascalCase for components and classes, snake_case for database schema

### Architecture Patterns
- **Specification-Driven Architecture:** All service contracts are defined in OpenSpec/OpenAPI first, auto-generating TypeScript and Java stubs.
- **Microservices:** Modular services like `reservation-service`, `inventory-service`, `invoicing-service`, `user-service`, `rate-service`.
- **API Gateway:** Spring Cloud Gateway to handle routing, authentication, and rate limiting.
- **Frontend Integration:** Angular consumes auto-generated TypeScript API clients generated via OpenAPI generator.
- **Persistence:** Spring Data JPA with PostgreSQL schema managed via Liquibase.
- **Security:** JWT-based authentication via Spring Security; role-based access control.
- **Automation:** n8n integration for tasks such as invoice generation, payment reminders, and data sync with external CRMs.

### Testing Strategy
- **Unit Tests:** JUnit 5 (backend), Jest (frontend)
- **Integration Tests:** Testcontainers for PostgreSQL + Spring Boot integration
- **End-to-End Tests:** Cypress for full user flows
- **Contract Tests:** OpenAPI schema validation in CI
- **Load Testing:** k6 scripts for key endpoints (bookings, payments)

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
- **OpenSpec/OpenAPI:** Used for spec-first code generation.
- **n8n:** Workflow automation platform for synchronization and notification processes.
- **Docker:** Environment orchestration.
- **GitHub Actions:** CI/CD pipeline for testing, building, and deploying microservices.
- **OpenTelemetry:** For distributed tracing and observability.
