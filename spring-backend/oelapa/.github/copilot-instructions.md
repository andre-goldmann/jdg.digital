# Copilot Instructions for Oelapa Spring Backend

## Project Overview
This is a Spring Boot 3.5.7 backend service that integrates with the Apaleo hospitality platform APIs. The project uses Java 21, PostgreSQL, and follows standard Spring Boot REST patterns.

## Architecture & Key Components

### Apaleo Integration
- **API Specifications**: All Apaleo API schemas are stored in `src/main/resources/apaleo/` as OpenAPI JSON files
- **Core APIs**: booking, payment, inventory, identity, webhook, configuration, automation, distribution, integration, rateplan
- Use these specifications to generate client code or understand API contracts when implementing integrations
- The project likely serves as a middleware/adapter between Apaleo services and other systems

### Technology Stack
- **Java 21** with Spring Boot 3.5.7
- **Dependencies**: Spring Data REST, Spring Web, PostgreSQL, Lombok, DevTools
- **Build**: Maven with wrapper (`mvnw.cmd` for Windows)
- **Package Structure**: `jdg.digital.oelapa` - follow this naming convention for new classes

## Development Workflows

### Build & Run
```bash
# Build the project
./mvnw.cmd clean compile

# Run tests
./mvnw.cmd test

# Start the application (with DevTools hot reload)
./mvnw.cmd spring-boot:run
```

### Database
- PostgreSQL is configured but connection details not yet in application.properties
- When adding DB configuration, use Spring Boot's standard `spring.datasource.*` properties

## Code Patterns & Conventions

### Project Structure
- Main application class: `OelapaApplication.java` - standard Spring Boot entry point
- **No custom code yet** - this is a fresh Spring Boot project ready for implementation
- Place controllers in `jdg.digital.oelapa.controller`
- Place services in `jdg.digital.oelapa.service`
- Place entities/models in `jdg.digital.oelapa.model`

### Spring Boot Configuration
- Use `@SpringBootApplication` annotation pattern from `OelapaApplication.java`
- Leverage Spring Data REST for rapid API development
- Configuration processing is enabled - use `@ConfigurationProperties` for complex configs

### Lombok Integration
- Lombok is configured with annotation processing in Maven compiler plugin
- Use `@Data`, `@Entity`, `@Builder` etc. for reducing boilerplate

## Integration Guidelines

### Apaleo API Integration
- Reference the OpenAPI specs in `src/main/resources/apaleo/` before implementing any Apaleo-related features
- Consider generating client code from these specifications using OpenAPI Generator Maven plugin
- Implement proper error handling for external API calls
- Use Spring's `@RestTemplate` or `WebClient` for HTTP calls to Apaleo APIs

### RESTful Services
- Follow Spring Data REST conventions for exposing entities
- Use standard Spring MVC annotations (`@RestController`, `@RequestMapping`)
- Implement proper HTTP status codes and response patterns

## Testing
- Basic test structure exists in `OelapaApplicationTests.java`
- Use `@SpringBootTest` for integration tests
- Follow the test package structure matching main source (`jdg.digital.oelapa`)