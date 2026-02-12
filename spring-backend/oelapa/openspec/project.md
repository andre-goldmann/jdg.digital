# Project Context

## Purpose

This project aims to create a **backend clone of the apaleo Property Management System (PMS)**, implementing a modern, cloud-native hotel management platform with an **API-first architecture**. The system will provide core hospitality functionalities including reservation management, inventory control, housekeeping operations, accounting, payment processing, and guest profile management.

### Project Goals

1. **Develop a comprehensive hotel PMS backend** that replicates apaleo's core business capabilities
2. **Implement API-first design principles** with full REST API exposure following OpenAPI 3.0 specifications
3. **Create a microservices-based architecture** that enables scalability, flexibility, and independent service deployment
4. **Establish secure authentication and authorization** using Keycloak as the identity and access management provider
5. **Enable workflow automation capabilities** through n8n integration for business process automation
6. **Ensure containerized deployment** with Docker for consistent environments across development and production
7. **Enforce high code quality standards** through static analysis, architectural validation, and comprehensive test coverage

### Business Domain

The system covers the complete hospitality property management lifecycle:
- **Reservation Management**: Booking creation, modification, check-in/check-out workflows
- **Inventory & Housekeeping**: Room categories, unit management, housekeeping status tracking
- **Rate Management**: Dynamic pricing, rate plans, seasonal adjustments, promotional codes
- **Accounting & Finance**: Double-entry bookkeeping, invoicing, folio management, tax handling
- **Payment Processing**: Credit card handling, payment automation, settlement reports
- **Distribution**: Multi-channel integration (OTAs, direct bookings), availability/rate/inventory (ARI) updates
- **Guest Profiles**: CRM functionality, guest history, preferences, loyalty management
- **Automation**: Automated check-in/check-out, night audit, payment collection

## Tech Stack

### Apaleo API Integration
- **API Specifications**: All Apaleo API references are available in `src/main/resources/apaleo/` as OpenAPI JSON files
- **Available APIs**: booking, payment, inventory, identity, webhook, configuration, automation, distribution, integration, rateplan
- **Usage**: These specifications can be used to generate client code or understand API contracts when implementing Apaleo integrations
- **Purpose**: The project serves as a middleware/adapter between Apaleo services and other systems

### Core Technologies
- **Java 21** - Latest LTS with modern features (Virtual Threads, Pattern Matching, Record Patterns)
- **Spring Boot 3.4.x** - Latest stable release with enhanced observability and structured logging
- **Spring Framework 6.2** - Modern Spring features including improved REST support
- **PostgreSQL 16** - Primary relational database for transactional data
- **Keycloak 26.x** - Identity and Access Management (IAM) with OAuth2/OIDC support
- **n8n** - Workflow automation platform for business process orchestration
- **Docker & Docker Compose** - Container orchestration for multi-service deployment

### Spring Boot Ecosystem
- **Spring Security 6.4** - Security framework with OAuth2 Resource Server support
- **Spring Data JPA 2024.1** - Data access layer with Hibernate 6.6
- **Spring Boot Actuator** - Production-ready monitoring and management endpoints
- **Spring Cloud Gateway** (optional) - API Gateway for routing and load balancing
- **SpringDoc OpenAPI 3** - Automatic OpenAPI documentation generation with Swagger UI

### Development & Documentation
- **Maven** - Build automation and dependency management
- **Lombok** - Reduce boilerplate code (constructors, getters/setters, builders)
- **MapStruct** - Type-safe bean mapping for DTOs
- **Swagger UI / SpringDoc** - Interactive API documentation
- **Testcontainers** - Integration testing with containerized dependencies
- **JUnit 5** - Unit and integration testing framework
- **MockMvc / RestAssured** - API testing

### Code Quality & Static Analysis Tools
- **ArchUnit** - Enforce architectural rules and design patterns validation
- **Checkstyle** - Enforce consistent code style and formatting conventions
- **PMD** - Detect common programming mistakes and potential bugs
- **SpotBugs** - Find potential bugs through static bytecode analysis
- **SonarQube** - Comprehensive code quality platform (security, maintainability, reliability)
- **JaCoCo** - Code coverage measurement and reporting

### Infrastructure & DevOps
- **Docker** - Application containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL Docker Image** - Database container
- **Keycloak Docker Image** - IAM container
- **n8n Docker Image** - Workflow automation container

## Project Conventions

### Code Style

#### General Guidelines
- **Follow Java naming conventions**: PascalCase for classes, camelCase for methods/variables
- **Use meaningful, descriptive names**: Avoid abbreviations except for well-known acronyms (DTO, API, PMS)
- **Maximum line length**: 120 characters (enforced by Checkstyle)
- **Indentation**: 4 spaces (no tabs)
- **Package structure**: Organize by business domain/bounded context, not by technical layer

#### Formatting Rules
- **Use Lombok annotations** to reduce boilerplate:
  - `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` for entities
  - `@Slf4j` for logging
  - `@RequiredArgsConstructor` for constructor injection in services
- **Prefer constructor injection** over field injection for better testability
- **Use Java 21 features**:
  - **Virtual Threads** for high-concurrency operations
  - **Record classes** for immutable DTOs
  - **Pattern Matching** for cleaner conditional logic
  - **Sealed classes** for restricted inheritance hierarchies

#### Code Organization
```
src/
├── main/
│   ├── java/
│   │   └── com/yourcompany/pms/
│   │       ├── booking/               # Booking Bounded Context
│   │       │   ├── api/               # REST Controllers
│   │       │   ├── domain/            # Domain Entities, Aggregates
│   │       │   ├── application/       # Application Services, DTOs
│   │       │   ├── infrastructure/    # Repositories, External APIs
│   │       │   └── config/            # Module-specific configuration
│   │       ├── inventory/             # Inventory Bounded Context
│   │       ├── finance/               # Finance Bounded Context
│   │       ├── payment/               # Payment Bounded Context
│   │       ├── profile/               # Guest Profile Bounded Context
│   │       ├── distribution/          # Distribution Bounded Context
│   │       ├── shared/                # Shared Kernel
│   │       │   ├── domain/            # Shared domain concepts
│   │       │   ├── infrastructure/    # Shared infrastructure
│   │       │   └── security/          # Security configuration
│   │       └── PmsApplication.java    # Main application class
│   └── resources/
│       ├── application.yml            # Main configuration
│       ├── application-dev.yml        # Development profile
│       ├── application-prod.yml       # Production profile
│       └── db/migration/              # Flyway/Liquibase migrations
└── test/
    └── java/
        └── com/yourcompany/pms/       # Mirror main structure
```

### Architecture Patterns

#### Microservices Architecture
The system follows a **domain-driven microservices architecture** with clear bounded contexts:

1. **Booking Service** - Reservation lifecycle management
2. **Inventory Service** - Room categories, units, housekeeping
3. **Finance Service** - Accounting, invoicing, folios
4. **Payment Service** - Payment processing, merchant account management
5. **Profile Service** - Guest profiles and CRM
6. **Distribution Service** - Channel management, ARI updates
7. **Rate Plan Service** - Pricing, rate plans, policies
8. **Identity Service** - Keycloak integration for authentication/authorization

#### Domain-Driven Design (DDD) Principles
- **Bounded Contexts**: Each microservice represents a bounded context with clear boundaries
- **Aggregates**: Design aggregates with consistency boundaries (e.g., Reservation aggregate, RoomUnit aggregate)
- **Entities**: Use JPA entities with proper identity management (Long ID with @GeneratedValue)
- **Value Objects**: Use Java Records for immutable value objects
- **Domain Events**: Publish events for cross-context communication
- **Repositories**: One repository per aggregate root
- **Domain Services**: Business logic that doesn't fit in entities

#### Layered Architecture (within each microservice)

1. **API Layer** (Controllers)
   - REST endpoints following RESTful principles
   - Request/Response DTOs (use Records)
   - Input validation using Bean Validation
   - OpenAPI annotations for documentation
   - Exception handling with @ControllerAdvice

2. **Application Layer** (Services)
   - Business logic orchestration
   - Transaction management with @Transactional
   - DTO to Entity mapping (MapStruct)
   - Command/Query handlers (CQRS pattern recommended)

3. **Domain Layer**
   - Entities with business logic
   - Value objects
   - Domain services
   - Domain events

4. **Infrastructure Layer**
   - JPA Repositories
   - External API clients
   - Message publishers/consumers
   - Configuration classes

#### CQRS Pattern (Recommended)
- **Commands**: Write operations that modify state (POST, PUT, PATCH, DELETE)
  - Use command objects with validation
  - Return 201 Created with Location header for resource creation
  - Return 202 Accepted for asynchronous operations
- **Queries**: Read operations (GET)
  - Separate read models optimized for querying
  - Use DTOs/Projections to avoid exposing entities
  - Implement pagination for list endpoints

#### REST API Design Principles
- **Resource-based URLs**: Use plural nouns (e.g., `/api/v1/reservations`, `/api/v1/rooms`)
- **HTTP Methods**: Proper use of GET, POST, PUT, PATCH, DELETE
- **Status Codes**: 
  - 200 OK, 201 Created, 204 No Content for success
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found for client errors
  - 500 Internal Server Error for server errors
- **Versioning**: URL-based versioning (`/api/v1/...`)
- **HATEOAS**: Include links to related resources (optional, but recommended for maturity)
- **Content Negotiation**: Support JSON (primary), XML (optional)
- **Idempotency**: Implement idempotency keys for critical POST operations

### Testing Strategy

#### Testing Pyramid
1. **Unit Tests** (60-70% of tests)
   - Test business logic in services and domain entities
   - Use JUnit 5 with AssertJ for assertions
   - Mock dependencies with Mockito
   - Target: 80%+ code coverage

2. **Integration Tests** (20-30% of tests)
   - Test API endpoints with MockMvc or @SpringBootTest
   - Use Testcontainers for PostgreSQL
   - Test repository queries against real database
   - Verify Keycloak integration with test realm

3. **End-to-End Tests** (5-10% of tests)
   - Test complete workflows across services
   - Use Docker Compose to spin up full environment
   - Validate business scenarios

#### Testing Best Practices
- **Test naming**: Use Given-When-Then format (`givenValidReservation_whenCreate_thenReturns201`)
- **Test data builders**: Use Builder pattern or test fixtures for test data
- **Isolation**: Each test should be independent and idempotent
- **CI/CD Integration**: Run tests automatically on every commit
- **Performance tests**: Use JMeter or Gatling for load testing critical endpoints

#### Example Test Structure
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
class ReservationApiIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    @WithMockKeycloakUser(roles = "RECEPTIONIST")
    void givenValidReservation_whenCreateReservation_thenReturns201() {
        // Given
        var request = ReservationRequest.builder()
            .guestName("John Doe")
            .checkIn(LocalDate.now().plusDays(1))
            .checkOut(LocalDate.now().plusDays(3))
            .build();
        
        // When
        var response = restTemplate.postForEntity(
            "/api/v1/reservations", 
            request, 
            ReservationResponse.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().id()).isNotNull();
    }
}
```

### Code Quality Tools & Static Analysis

#### ArchUnit
**Purpose**: Enforce architectural constraints and design patterns across the codebase.

**Maven Configuration**:
```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <version>1.3.0</version>
    <scope>test</scope>
</dependency>
```

**Key Validations**:
- Services should not directly call repositories from other bounded contexts
- Controllers should only exist in API layer (not in domain, application, or infrastructure)
- Domain entities should not depend on infrastructure (e.g., Spring, JPA annotations in domain logic)
- No circular dependencies between modules
- Proper package organization by bounded context

**Example ArchUnit Test**:
```java
@AnalyzeClasses(packages = "com.yourcompany.pms")
public class ArchitectureTest {
    
    @ArchTest
    static final ArchRule controllers_should_reside_in_api_layer =
        classes()
            .that().haveSimpleNameEndingWith("Controller")
            .should().resideInAPackage("..api..")
            .andShould().notDependOnClassesThat()
                .resideInAPackage("..domain..");
    
    @ArchTest
    static final ArchRule services_should_not_depend_on_other_bounded_contexts =
        classes()
            .that().resideInAPackage("..booking.application..")
            .should().onlyDependOnClassesThat()
                .resideInAnyPackage("..booking..", "..shared..");
    
    @ArchTest
    static final ArchRule no_circular_dependencies =
        slices().matching("..(*)..")
            .should().beFreeOfCycles();
}
```

**Run ArchUnit Tests**:
```bash
mvn test -Dtest=ArchitectureTest
```

#### Checkstyle
**Purpose**: Enforce consistent code style and formatting conventions across the project.

**Maven Plugin Configuration**:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <configLocation>checkstyle.xml</configLocation>
        <consoleOutput>true</consoleOutput>
        <failsOnError>true</failsOnError>
        <linkXRef>false</linkXRef>
    </configuration>
    <executions>
        <execution>
            <id>validate</id>
            <phase>validate</phase>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Sample checkstyle.xml Rules**:
- Maximum line length: 120 characters
- Indentation: 4 spaces
- No trailing whitespace
- No unused imports
- Naming conventions: PascalCase for classes, camelCase for methods/fields
- JavaDoc required for public methods
- Proper spacing around operators and keywords
- Brace placement (opening brace on same line for methods)

**Run Checkstyle**:
```bash
mvn checkstyle:check
mvn checkstyle:checkstyle  # Generate HTML report in target/site/checkstyle.html
```

#### PMD (Programming Mistake Detector)
**Purpose**: Detect common programming mistakes, code quality issues, and potential bugs.

**Maven Plugin Configuration**:
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-pmd-plugin</artifactId>
    <version>3.21.2</version>
    <configuration>
        <rulesets>
            <ruleset>pmd-ruleset.xml</ruleset>
        </rulesets>
        <failOnViolation>true</failOnViolation>
        <printFailingTests>true</printFailingTests>
        <targetJdk>21</targetJdk>
    </configuration>
    <executions>
        <execution>
            <id>pmd-check</id>
            <phase>verify</phase>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**PMD Rule Categories**:
- **Performance**: Inefficient code patterns (e.g., StringBuffer in loops, unused variables)
- **Error Prone**: Potential bugs (e.g., empty catch blocks, equals() without hashCode())
- **Best Practices**: Anti-patterns (e.g., using primitives for optional values, overly complex methods)
- **Code Style**: Naming and structure conventions
- **Multithreading**: Thread-safety issues
- **Security**: Security vulnerabilities

**Run PMD**:
```bash
mvn pmd:check
mvn pmd:pmd     # Generate detailed report in target/site/pmd.html
```

#### SpotBugs
**Purpose**: Find potential bugs and suspicious code patterns through static bytecode analysis.

**Maven Plugin Configuration**:
```xml
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <version>4.8.3</version>
    <configuration>
        <effort>max</effort>
        <threshold>low</threshold>
        <failOnError>true</failOnError>
        <plugins>
            <plugin>
                <groupId>com.h3xstream.findsecbugs</groupId>
                <artifactId>findsecbugs-plugin</artifactId>
                <version>1.12.0</version>
            </plugin>
        </plugins>
    </configuration>
    <executions>
        <execution>
            <id>analyze-compile</id>
            <phase>verify</phase>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Common Bug Patterns Detected**:
- Null pointer dereferences
- Inefficient string comparisons
- Improper exception handling
- Missing null checks
- Suspicious method calls
- Potential SQL injection vulnerabilities (with findsecbugs plugin)
- Hardcoded credentials
- Resource leaks

**Run SpotBugs**:
```bash
mvn spotbugs:check
mvn spotbugs:spotbugs  # Generate HTML report in target/spotbugsXml.xml
```

#### JaCoCo (Java Code Coverage)
**Purpose**: Measure test code coverage and identify untested code paths.

**Maven Plugin Configuration**:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>jacoco-check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <excludes>
                            <exclude>*Test</exclude>
                        </excludes>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                            <limit>
                                <counter>BRANCH</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.75</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

**Coverage Metrics**:
- **Line Coverage**: Percentage of executable lines covered by tests (minimum: 80%)
- **Branch Coverage**: Percentage of decision branches covered (minimum: 75%)
- **Method Coverage**: Percentage of methods executed during tests
- **Reporting**: HTML reports and CI/CD integration

**Run JaCoCo**:
```bash
mvn clean test
# Report generated in: target/site/jacoco/index.html
```

#### SonarQube
**Purpose**: Comprehensive code quality platform for detecting bugs, vulnerabilities, and code smells.

**Maven Plugin Configuration** (pom.xml):
```xml
<properties>
    <sonar.projectKey>hotel-pms</sonar.projectKey>
    <sonar.organization>your-org</sonar.organization>
    <sonar.host.url>https://sonarcloud.io</sonar.host.url>
    <sonar.login>${env.SONAR_TOKEN}</sonar.login>
</properties>

<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.10.0.2594</version>
</plugin>
```

**SonarQube Analysis Categories**:
- **Reliability**: Bugs that could cause runtime failures
- **Security**: Vulnerabilities and security hotspots (OWASP Top 10)
- **Maintainability**: Code smells that reduce code clarity and maintainability
- **Code Duplication**: Duplicated code blocks (target: < 5%)
- **Test Coverage**: Integration with JaCoCo for coverage metrics (target: 80%+)
- **Complexity**: Cyclomatic complexity metrics

**Quality Gates**:
- No critical or blocker issues
- Minimum 80% test coverage
- Code duplication < 5%
- Maintainability rating A/B
- Security rating A

**Run SonarQube Analysis**:
```bash
# Local SonarQube Server
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your-token

# SonarCloud (cloud-based)
mvn clean verify sonar:sonar
```

**SonarQube Dashboard**: Access at http://localhost:9000 (or your SonarCloud project URL)

### Maven Build Profiles for Quality Checks

```xml
<profiles>
    <profile>
        <id>quality</id>
        <description>Run all code quality checks</description>
        <build>
            <plugins>
                <!-- ArchUnit (runs as part of tests) -->
                <!-- Checkstyle - Style validation -->
                <!-- PMD - Programming mistakes -->
                <!-- SpotBugs - Bug detection -->
                <!-- JaCoCo - Code coverage -->
            </plugins>
        </build>
    </profile>
    
    <profile>
        <id>sonar</id>
        <description>Run SonarQube analysis</description>
        <build>
            <plugins>
                <!-- SonarQube Scanner -->
            </plugins>
        </build>
    </profile>
</profiles>
```

**Run All Quality Checks**:
```bash
# Run standard quality checks (Checkstyle, PMD, SpotBugs, JaCoCo, ArchUnit)
mvn clean verify -Pquality

# Run with SonarQube analysis
mvn clean verify sonar:sonar -Psonar

# Run everything
mvn clean verify -Pquality,sonar
```

### CI/CD Pipeline Integration

#### GitHub Actions Workflow Example
```yaml
name: Code Quality & Build

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      # Build
      - name: Build with Maven
        run: mvn clean install
      
      # ArchUnit runs as part of tests
      - name: Run Tests with ArchUnit
        run: mvn test
      
      # Checkstyle
      - name: Checkstyle Analysis
        run: mvn checkstyle:check
        continue-on-error: true
      
      # PMD
      - name: PMD Analysis
        run: mvn pmd:check
        continue-on-error: true
      
      # SpotBugs
      - name: SpotBugs Analysis
        run: mvn spotbugs:check
        continue-on-error: true
      
      # JaCoCo Coverage Report
      - name: JaCoCo Coverage Report
        run: mvn jacoco:report
      
      # Upload coverage to Codecov
      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./target/site/jacoco/jacoco.xml
      
      # SonarQube Scan
      - name: SonarQube Scan
        run: mvn sonar:sonar
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        continue-on-error: true
```

### Quality Standards & Enforcement

#### Pre-Commit Checks (Local Development)
- All developers must run `mvn clean verify` before committing
- Optional: `mvn clean verify -Pquality` for comprehensive checks
- IDE integration with Checkstyle and SpotBugs plugins (IntelliJ IDEA, Eclipse)
- Git pre-commit hooks to enforce checks

**Setup Pre-Commit Hook** (`.git/hooks/pre-commit`):
```bash
#!/bin/bash
echo "Running pre-commit quality checks..."
mvn clean verify
if [ $? -ne 0 ]; then
    echo "Quality checks failed. Commit aborted."
    exit 1
fi
```

#### Pull Request Checks
- CI/CD pipeline automatically runs all quality tools
- Quality gates must pass before merge to develop/main
- Code coverage must not decrease
- No critical or blocker issues in SonarQube
- Requires code review approval

#### Reporting & Dashboards
- **SonarQube Dashboard**: Central project visibility
- **JaCoCo Reports**: Per-build coverage metrics
- **GitHub/GitLab Actions**: Real-time build status
- **Weekly Reports**: Quality trends and metrics
- **Alerts**: Notifications for quality gate failures

#### Fixing Quality Issues
```bash
# Run checks and generate reports
mvn clean verify -Pquality

# Analyze reports
# - Checkstyle: target/site/checkstyle.html
# - PMD: target/site/pmd.html
# - SpotBugs: target/spotbugsXml.xml
# - JaCoCo: target/site/jacoco/index.html

# Fix issues automatically (where supported)
mvn checkstyle:check -DfailOnViolation=false  # Identify issues
# Manual fixes required for most issues
```

### Git Workflow

#### Branching Strategy (Git Flow)
- **main**: Production-ready code (protected branch)
- **develop**: Integration branch for features (protected branch)
- **feature/**: Feature branches (e.g., `feature/booking-api`, `feature/payment-integration`)
- **bugfix/**: Bug fix branches (e.g., `bugfix/invoice-calculation`)
- **hotfix/**: Emergency production fixes (e.g., `hotfix/security-patch`)
- **release/**: Release preparation branches (e.g., `release/v1.0.0`)

#### Commit Conventions (Conventional Commits)
Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, tooling
- `perf`: Performance improvements

**Examples:**
```
feat(booking): implement reservation creation endpoint
fix(payment): correct tax calculation for invoices
docs(readme): update setup instructions for Docker
refactor(inventory): extract room allocation logic to service
test(finance): add integration tests for folio closure
chore(deps): update Spring Boot to 3.4.1
```

#### Pull Request Process
1. **Create feature branch** from `develop`
2. **Implement feature** with tests and documentation
3. **Run quality checks locally**: `mvn clean verify -Pquality`
4. **Create PR** with descriptive title and description
5. **CI/CD checks** must pass (build, tests, code quality)
6. **Code review** required by at least one team member
7. **Merge to develop** after approval
8. **Delete feature branch** after merge

#### Code Review Checklist
- [ ] Code follows project conventions and style guide (enforced by Checkstyle)
- [ ] Tests are included and passing (minimum 80% coverage)
- [ ] No critical/blocker issues from PMD or SpotBugs
- [ ] Architectural rules validated by ArchUnit
- [ ] API documentation updated (OpenAPI/Swagger)
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Backward compatibility maintained

## Domain Context

### Hotel Property Management System (PMS) Domain

#### Core Concepts

**Property Hierarchy:**
- **Property**: A hotel or hospitality establishment (e.g., "Grand Hotel Berlin")
- **Unit Group**: A category of rooms/units (e.g., "Standard Room", "Deluxe Suite", "Meeting Room")
- **Unit**: Individual room or space instance (e.g., "Room 101", "Suite 205")
- **Unit Attributes**: Characteristics like floor level, view type (sea view, city view), amenities (bathtub, balcony)

**Reservation Lifecycle:**
1. **Availability Check**: Query available units for date range and guest count
2. **Offer Creation**: Generate pricing offers based on rate plans
3. **Booking/Reservation**: Create confirmed reservation with deposit
4. **Pre-Arrival**: Send confirmation, collect payment, enable online check-in
5. **Check-In**: Guest arrives, assign unit, activate key card
6. **In-House**: Guest stay, service charges (minibar, room service)
7. **Check-Out**: Final payment, invoice generation, key return
8. **Post-Stay**: Review request, loyalty points, marketing follow-up

**Rate Plans:**
- **Base Rate**: Standard pricing structure per unit group
- **Derived Rates**: Percentage-based adjustments from base rate
- **Time Slices**: Overnight (check-in to check-out) or Day-Use (check-out to check-in)
- **Occupancy Surcharges**: Additional charges per adult/child
- **Included Services**: Services bundled in rate (e.g., breakfast included)
- **Additional Services**: Services added to rate (e.g., breakfast additional)
- **Restrictions**: Min/max advanced booking, minimum stay, booking periods
- **Distribution Channels**: Which channels can sell this rate (Direct, Booking.com, Expedia)
- **Corporate/Promo Codes**: Restricted rates requiring specific codes

**Folio & Accounting:**
- **Folio**: Guest account ledger containing all charges and payments
- **Charges**: Room rate, services, taxes (city tax, VAT)
- **Payments**: Credit card, cash, bank transfer, corporate billing
- **Invoice**: Finalized document for accounting and guest
- **Double-Entry Bookkeeping**: Every transaction has debit and credit entries
- **Revenue Categories**: Room revenue, F&B revenue, service revenue
- **VAT Handling**: Multiple VAT rates per service type

**Housekeeping:**
- **Room Status**: Clean, Dirty, Inspected, Out of Service, Out of Order, Out of Inventory
- **Housekeeping Tasks**: Daily cleaning, turndown service, deep cleaning
- **Maintenance Requests**: Reported issues requiring technical attention

**Guest Profile:**
- **Guest Details**: Name, contact, preferences, documents (ID, passport)
- **Stay History**: Previous reservations, spending patterns
- **Preferences**: Room type, floor level, pillow type, dietary restrictions
- **Loyalty Status**: Points, tier level, benefits
- **Marketing Consent**: Email, SMS, phone permissions

**Distribution & Channel Management:**
- **ARI Updates**: Availability, Rates, Inventory synchronization to OTAs
- **Channel Manager**: System managing multiple distribution channels
- **Rate Parity**: Ensuring consistent pricing across channels
- **Overbooking Protection**: Inventory management to prevent double-booking

#### Business Rules & Constraints

**Reservation Rules:**
- Check-in time default: 3:00 PM (15:00)
- Check-out time default: 11:00 AM (11:00)
- Minimum stay: Configurable per rate plan (e.g., 2 nights for weekend rate)
- Maximum advance booking: Configurable per rate plan (e.g., 365 days)
- Cancellation policy: Free cancellation, non-refundable, or percentage-based penalties

**Pricing Rules:**
- Base price per night per unit group
- Occupancy surcharges calculated on base price, not cumulative
- Dynamic pricing adjustments based on occupancy and demand
- Seasonal pricing variations
- Length-of-stay discounts

**Inventory Rules:**
- Overbooking strategy: Configurable percentage (e.g., 5% overbooking allowed)
- Unit allocation: Automatic or manual assignment at check-in
- Blocked inventory: Units unavailable for sale (maintenance, renovation)

**Payment Rules:**
- Deposit required: Configurable per rate plan
- Payment automation: Charge at booking, check-in, or check-out
- Payment retries: Automatic retry logic for failed transactions
- Settlement: Daily, weekly, or monthly reconciliation

**Security & Compliance:**
- GDPR compliance for guest data
- PCI DSS for payment card data
- Data retention policies
- Audit logging for all financial transactions

### Integration Points

**n8n Workflow Automation Examples:**
- **Guest Communication**: Automated pre-arrival emails, check-in reminders, post-stay review requests
- **Housekeeping Automation**: Trigger cleaning tasks when guest checks out
- **Revenue Management**: Automated rate adjustments based on occupancy thresholds
- **Reporting**: Scheduled daily/weekly/monthly reports via email
- **Payment Processing**: Automated payment collection and retry logic
- **OTA Integration**: ARI updates pushed to distribution channels
- **Maintenance Workflows**: Automatically create maintenance tickets from housekeeping reports

**Keycloak Integration:**
- **Authentication**: OAuth2/OIDC for API access
- **Authorization**: Role-based access control (RBAC)
  - Roles: SuperAdmin, PropertyManager, Receptionist, Housekeeper, Accountant, Guest
  - Permissions: Read, Write, Delete per resource type
- **Multi-Tenancy**: Realm per property or property group
- **User Management**: Centralized user administration
- **SSO**: Single sign-on across multiple applications

## Important Constraints

### Technical Constraints

#### Performance Requirements
- **API Response Time**: 95th percentile < 200ms for read operations, < 500ms for write operations
- **Database Queries**: All queries must use indexes, avoid N+1 queries
- **Concurrency**: Support 100+ concurrent users per property
- **Availability**: 99.9% uptime SLA (target)

#### Scalability Requirements
- **Horizontal Scaling**: Services must be stateless to allow horizontal scaling
- **Database Scaling**: Read replicas for reporting queries
- **Caching Strategy**: Redis/Caffeine for frequently accessed data (rate plans, inventory)

#### Security Requirements
- **Authentication**: All API endpoints secured with JWT tokens from Keycloak
- **Authorization**: Implement role-based and resource-based access control
- **Data Encryption**: 
  - At rest: Database encryption for sensitive fields (payment card data)
  - In transit: TLS 1.3 for all API communication
- **API Security**: 
  - Rate limiting to prevent abuse (e.g., 100 requests/minute per user)
  - Input validation to prevent injection attacks
  - CORS configuration for allowed origins
- **Secrets Management**: Use environment variables or secret management tools (Vault, AWS Secrets Manager)

#### Data Integrity Requirements
- **Transactional Consistency**: Use database transactions for multi-table operations
- **Idempotency**: Implement idempotency keys for critical operations (payment, booking)
- **Audit Trail**: Log all state changes with user, timestamp, and reason
- **Data Validation**: 
  - Bean Validation (JSR-380) on all input DTOs
  - Database constraints (NOT NULL, UNIQUE, FOREIGN KEY)

#### Technology Constraints
- **Java Version**: Java 21 LTS only (no backward compatibility required)
- **Spring Boot Version**: 3.4.x (keep updated with patch releases)
- **Database**: PostgreSQL 16+ only
- **Container Runtime**: Docker 24+, Docker Compose 2.x
- **Build Tool**: Maven 3.9+ (Gradle allowed as alternative)

#### Code Quality Constraints
- **Test Coverage**: Minimum 80% line coverage, 75% branch coverage (enforced by JaCoCo)
- **Static Analysis**: 
  - Zero critical/blocker issues from PMD, SpotBugs
  - SonarQube quality gates must pass
  - Checkstyle violations must be resolved before merge
  - ArchUnit rules must validate correctly
- **Code Duplication**: Maximum 5% duplication (SonarQube)
- **Complexity**: Cyclomatic complexity < 15 per method

### Business Constraints

#### Multi-Tenancy
- **Data Isolation**: Each property's data must be isolated (schema-per-tenant or tenant-id filtering)
- **Configuration**: Property-specific settings (currency, language, tax rates, check-in time)

#### Compliance & Regulatory
- **GDPR**: 
  - Right to access: Provide guest data export
  - Right to erasure: Implement data deletion (with retention rules for accounting)
  - Consent management: Track marketing consents
- **PCI DSS**: 
  - No storing of full credit card numbers (use tokenization)
  - Use secure payment gateway integration
- **Accounting Standards**: 
  - Support multiple accounting schemas
  - Generate audit-compliant reports
- **Tax Regulations**: 
  - Multiple VAT rates support
  - City tax, tourist tax calculations
  - Country-specific invoicing requirements

#### Operational Constraints
- **24/7 Operations**: System must handle night audit process automatically
- **Time Zone Handling**: Support properties in different time zones
- **Multi-Currency**: Support multiple currencies for international guests
- **Multi-Language**: API should support localization (i18n)

### Development Constraints

#### Documentation Requirements
- **API Documentation**: OpenAPI 3.0 specification with examples
- **Code Documentation**: JavaDoc for public APIs and complex logic
- **Architecture Documentation**: C4 model diagrams or equivalent
- **Deployment Documentation**: Step-by-step Docker Compose setup guide
- **Quality Standards Documentation**: Code quality tool configurations and standards

#### Quality Assurance
- **Code Coverage**: Minimum 80% line coverage (enforced by JaCoCo)
- **Static Code Analysis**: SonarQube or similar (no critical issues)
- **Code Style**: Checkstyle must pass
- **Architectural Validation**: ArchUnit tests must pass
- **Bug Detection**: PMD and SpotBugs must pass
- **Dependency Management**: Keep dependencies up-to-date, avoid vulnerabilities

#### Environment Requirements
- **Development**: Local Docker Compose setup with all services
- **Testing**: Automated integration tests with Testcontainers
- **Production-Ready**: Dockerfile optimization (multi-stage builds, minimal base image)
- **CI/CD Environment**: GitHub Actions or similar with quality gates

## External Dependencies

### Required Services

#### Keycloak (Identity & Access Management)
- **Version**: 26.0+
- **Purpose**: OAuth2/OIDC authentication, user management, RBAC
- **Configuration**:
  - Realm: `hotel-pms` or property-specific realms
  - Clients: Backend API client, Frontend clients
  - Roles: SuperAdmin, PropertyManager, Receptionist, Housekeeper, Accountant, Guest
  - User Federation: LDAP/AD integration (optional)
- **Docker Image**: `quay.io/keycloak/keycloak:26.0`
- **Integration**: 
  - Spring Security OAuth2 Resource Server
  - JWT token validation
  - Role mapping to Spring Security authorities

#### PostgreSQL (Primary Database)
- **Version**: 16+
- **Purpose**: Transactional data storage
- **Configuration**:
  - Connection pooling: HikariCP (default in Spring Boot)
  - Multiple databases: One per microservice or schema-per-tenant
  - Extensions: pg_trgm for full-text search, uuid-ossp for UUID generation
- **Docker Image**: `postgres:16`
- **Migration Tools**: Flyway or Liquibase for schema versioning

#### n8n (Workflow Automation)
- **Version**: Latest stable
- **Purpose**: Business process automation, webhook handling
- **Configuration**:
  - Webhook triggers for PMS events
  - Scheduled workflows for night audit, reporting
  - Integration nodes: HTTP Request, Email, PostgreSQL, Keycloak
- **Docker Image**: `n8nio/n8n:latest`
- **Use Cases**:
  - Guest communication workflows
  - Automated rate adjustments
  - Housekeeping task scheduling
  - Report generation and distribution
  - OTA integration (ARI updates)

### Optional External Services

#### Payment Gateway Integration
- **Providers**: Stripe, Adyen, PayPal, Authorize.net
- **Purpose**: Credit card processing, tokenization
- **Integration**: REST API clients with retry logic

#### Email Service Provider (ESP)
- **Providers**: SendGrid, AWS SES, Mailgun
- **Purpose**: Transactional emails (confirmation, invoice, marketing)
- **Integration**: SMTP or REST API

#### SMS Provider
- **Providers**: Twilio, AWS SNS, Nexmo
- **Purpose**: SMS notifications, OTP for guest verification
- **Integration**: REST API

#### Channel Manager / OTA Integration
- **Providers**: Booking.com, Expedia, Airbnb
- **Purpose**: Multi-channel distribution, ARI synchronization
- **Integration**: XML/JSON APIs with webhook support

#### Revenue Management System (RMS)
- **Purpose**: Dynamic pricing recommendations
- **Integration**: REST API for rate updates

#### Reporting & Analytics
- **Tools**: Grafana, Kibana, Tableau
- **Purpose**: Business intelligence, operational dashboards
- **Integration**: Database read replicas, REST API for data export

#### SonarQube Server
- **Version**: Community or Enterprise
- **Purpose**: Centralized code quality platform
- **Deployment**: Docker container or cloud (SonarCloud)
- **Integration**: Maven plugin, CI/CD pipeline

### Infrastructure Dependencies

#### Docker & Docker Compose
- **Docker Engine**: 24.0+
- **Docker Compose**: 2.x
- **Purpose**: Local development environment, service orchestration
- **Network**: Bridge network for inter-container communication
- **Volumes**: Persistent data storage for PostgreSQL, Keycloak

#### CI/CD (Future)
- **Tools**: GitHub Actions, GitLab CI, Jenkins
- **Purpose**: Automated build, test, deployment
- **Stages**: Build → Quality Checks → Test → SonarQube → Docker Build → Deploy

#### Monitoring & Observability (Recommended)
- **Metrics**: Prometheus with Spring Boot Actuator
- **Tracing**: Zipkin or Jaeger for distributed tracing
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or Loki
- **Alerting**: Alertmanager or PagerDuty

### Development Tools

#### Required Development Tools
- **JDK 21**: OpenJDK, Oracle JDK, or Eclipse Temurin
- **Maven 3.9+**: Build automation
- **Docker Desktop**: For running containers locally
- **IDE**: IntelliJ IDEA (recommended), Eclipse, VS Code with Java extensions
- **Database Client**: DBeaver, pgAdmin, or DataGrip for PostgreSQL access
- **API Client**: Postman, Insomnia, or HTTP Client for API testing

#### Recommended IDE Plugins (IntelliJ IDEA)
- Checkstyle-IDEA: Real-time checkstyle validation
- SpotBugs: Real-time bug detection
- SonarLint: SonarQube integration for IDE
- ArchUnit IDE Plugin: Architecture validation
- PMD: Programming mistake detection

#### Recommended Development Tools
- **Git Client**: Git CLI, GitHub Desktop, or IDE integration
- **Docker Compose UI**: Portainer for container management visualization
- **Keycloak Admin Console**: Web UI for realm/user management
- **n8n Editor**: Web UI for workflow creation

---

## Getting Started (Quick Setup)

### Prerequisites
1. Install Java 21 (OpenJDK or Oracle)
2. Install Maven 3.9+
3. Install Docker Desktop and Docker Compose
4. Clone the repository

### Running the Application

#### 1. Start Infrastructure Services (Docker Compose)
```bash
# Navigate to project root
cd hotel-pms

# Start all infrastructure services
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Services started:**
- PostgreSQL: `localhost:5432`
- Keycloak: `localhost:8080` (admin: admin/admin)
- n8n: `localhost:5678` (admin: [email protected]/admin123)
- SonarQube (optional): `localhost:9000` (admin: admin/admin)

#### 2. Configure Application
Create `application-dev.yml` with connection details:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/pms_booking
    username: pms_user
    password: pms_password
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/hotel-pms
```

#### 3. Run Spring Boot Application
```bash
# Build the application with quality checks
mvn clean install -Pquality

# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### 4. Access Services
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **Keycloak Admin**: http://localhost:8080
- **n8n Editor**: http://localhost:5678
- **SonarQube**: http://localhost:9000
- **API Base URL**: http://localhost:8081/api/v1

#### 5. Run Quality Checks
```bash
# Run all quality checks
mvn clean verify -Pquality

# View reports
# Checkstyle: target/site/checkstyle.html
# PMD: target/site/pmd.html
# JaCoCo: target/site/jacoco/index.html
```

---

## Code Quality & Best Practices Guidelines

### Development Standards

This project follows strict coding standards and best practices to ensure maintainability, security, and performance. All development work should adhere to the following guidelines:

#### Java & Spring Boot Best Practices
- **Primary Reference**: Follow the comprehensive guidelines in `@/openspec/java-best-practices.md`
- **Code Style**: Adhere to Google Java Style Guide and Spring Boot conventions
- **Architecture Patterns**: Implement Domain-Driven Design (DDD) and SOLID principles
- **Security**: Follow Spring Security best practices and secure coding standards
- **Performance**: Apply recommended optimization patterns for Java and Spring Boot applications

#### Context7 MCP Integration
For up-to-date library documentation and best practices:
- **Use Context7 MCP**: Leverage the Context7 Model Context Protocol to access current documentation for:
  - Spring Boot and Spring Framework latest practices
  - PostgreSQL optimization techniques
  - Keycloak integration patterns
  - Docker and containerization best practices
  - Java 21 modern feature usage
- **Stay Current**: Always reference the latest official documentation through Context7 MCP rather than relying on potentially outdated information
- **Integration Examples**: Use Context7 MCP to find current code examples and implementation patterns

#### Code Review Requirements
Before implementing any new features or making significant changes:
1. **Review java-best-practices.md** for applicable patterns and standards
2. **Query Context7 MCP** for the latest documentation on relevant libraries/frameworks
3. **Apply quality standards** enforced by ArchUnit, Checkstyle, PMD, SpotBugs
4. **Ensure test coverage** meets minimum 80% threshold
5. **Validate architectural compliance** with DDD and microservices patterns

#### Implementation Workflow
1. **Planning**: Consult both java-best-practices.md and Context7 MCP for architectural guidance
2. **Development**: Follow established patterns and use current library documentation
3. **Testing**: Implement comprehensive tests following best practices
4. **Quality Gates**: Ensure all static analysis tools pass
5. **Documentation**: Update relevant documentation and API specs

This approach ensures that all code implementations:
- Follow proven Java and Spring Boot patterns
- Use the most current library features and security practices
- Maintain consistency across the entire codebase
- Meet enterprise-level quality standards

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project scaffolding and multi-module Maven setup
- [ ] Docker Compose infrastructure (PostgreSQL, Keycloak, n8n)
- [ ] Spring Security with Keycloak integration
- [ ] Base entity classes and shared kernel
- [ ] OpenAPI documentation setup
- [ ] Maven build profiles for quality checks
- [ ] SonarQube server setup
- [ ] CI/CD pipeline configuration

### Phase 2: Core Services (Weeks 5-12)
- [ ] Inventory Service (Unit Groups, Units, Housekeeping)
- [ ] Rate Plan Service (Pricing, Policies, Distribution)
- [ ] Booking Service (Reservations, Check-in/Check-out)
- [ ] Guest Profile Service (CRM, Preferences)
- [ ] Ensure 80%+ code coverage for all services
- [ ] Enforce quality gates on all PRs

### Phase 3: Financial Services (Weeks 13-16)
- [ ] Finance Service (Folios, Invoices, Accounting)
- [ ] Payment Service (Payment processing, Settlement)
- [ ] ArchUnit validation for DDD patterns

### Phase 4: Distribution & Automation (Weeks 17-20)
- [ ] Distribution Service (Channel Manager integration)
- [ ] n8n workflow templates (Guest communication, Housekeeping)
- [ ] Webhook infrastructure for event-driven workflows

### Phase 5: Polish & Production-Ready (Weeks 21-24)
- [ ] Integration testing suite with Testcontainers
- [ ] Performance optimization and caching
- [ ] Production Docker images (multi-stage builds)
- [ ] Documentation finalization (API docs, deployment guide)
- [ ] Observability setup (Prometheus, Grafana, Zipkin)
- [ ] Zero critical/blocker issues in SonarQube
- [ ] 85%+ code coverage achievement

---

## Key Design Decisions

### Why Java 21?
- **Virtual Threads**: Dramatically improve concurrency for I/O-bound operations (database queries, API calls)
- **Pattern Matching**: Cleaner, more maintainable code for conditional logic
- **Record Classes**: Immutable DTOs with minimal boilerplate
- **Long-Term Support**: Stable platform with 8+ years of support

### Why Spring Boot 3.4?
- **Latest Features**: Structured logging, enhanced Testcontainers support, improved observability
- **Production-Ready**: Battle-tested framework with extensive ecosystem
- **Developer Experience**: Auto-configuration, embedded servers, comprehensive documentation
- **Microservices Support**: Spring Cloud integration for advanced patterns

### Why Keycloak?
- **Open Source**: No vendor lock-in, active community
- **Standards-Based**: Full OAuth2/OIDC compliance
- **Feature-Rich**: User federation, social login, MFA, fine-grained authorization
- **Enterprise-Ready**: Used by major organizations worldwide

### Why n8n?
- **Open Source**: Self-hosted, full control over automation workflows
- **Visual Workflow Editor**: Non-technical users can create/modify workflows
- **Extensible**: Custom nodes, webhook support, JavaScript code execution
- **Hotel-Specific Use Cases**: Proven success in hospitality automation (apaleo integration examples)

### Why PostgreSQL?
- **ACID Compliance**: Strong transactional guarantees for financial data
- **JSON Support**: Flexible schema for property-specific configurations
- **Performance**: Excellent query performance with proper indexing
- **Extensions**: Rich ecosystem (full-text search, UUID, time-series)

### Why Microservices?
- **Scalability**: Scale individual services based on load (Booking service scales independently from Housekeeping)
- **Independent Deployment**: Deploy new features without full system downtime
- **Technology Flexibility**: Future services can use different tech stacks if needed
- **Team Autonomy**: Teams can work on different services without coordination overhead
- **Fault Isolation**: Failure in one service doesn't bring down the entire system

### Why These Code Quality Tools?

#### ArchUnit
- **Enforces Architectural Integrity**: Prevents violations of DDD and layered architecture patterns
- **Prevents Technical Debt**: Catches architectural decay before it becomes costly
- **Team Communication**: Codifies architectural rules that developers must follow
- **Automated Validation**: Makes architectural constraints executable and testable

#### Checkstyle + PMD + SpotBugs
- **Consistency**: Ensures all code follows the same style and conventions
- **Early Bug Detection**: Catches common mistakes during development (not in production)
- **Learning Tool**: Educates developers about best practices
- **Automated Enforcement**: No need for subjective code review discussions about style

#### JaCoCo
- **Visibility**: Provides clear metrics on test quality
- **Accountability**: Holds team to minimum coverage standards
- **Risk Reduction**: Identifies untested code paths that could cause production issues
- **Continuous Improvement**: Tracks coverage trends over time

#### SonarQube
- **Executive Visibility**: Provides high-level quality metrics for stakeholders
- **Multi-Dimensional Analysis**: Combines findings from multiple tools into one platform
- **Trend Analysis**: Shows quality improvements/regressions over time
- **Security Focus**: Identifies potential security vulnerabilities proactively

---

## References & Resources

### Official Documentation
- [apaleo Developer Documentation](https://apaleo.dev)
- [Spring Boot 3.4 Reference](https://docs.spring.io/spring-boot/docs/3.4.x/reference/htmlsingle/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [n8n Documentation](https://docs.n8n.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/16/)
- [Java 21 Features](https://openjdk.org/projects/jdk/21/)

### Code Quality Tools
- [ArchUnit Documentation](https://www.archunit.org/)
- [Checkstyle Documentation](https://checkstyle.sourceforge.io/)
- [PMD Documentation](https://pmd.github.io/)
- [SpotBugs Documentation](https://spotbugs.readthedocs.io/)
- [JaCoCo Documentation](https://www.jacoco.org/)
- [SonarQube Documentation](https://docs.sonarqube.org/)

### Architecture Patterns
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) by Martin Fowler
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html) by Martin Fowler
- [Microservices Patterns](https://microservices.io/patterns/index.html) by Chris Richardson
- [REST API Design Best Practices](https://restfulapi.net/)

### Integration Examples
- [Keycloak + Spring Boot Integration](https://www.baeldung.com/spring-boot-keycloak)
- [n8n Hotel Automation Case Study](https://makeitfuture.com/insights/automate-hotel-billing-n8n-apaleo)
- [Docker Compose Multi-Container Apps](https://docs.docker.com/compose/)