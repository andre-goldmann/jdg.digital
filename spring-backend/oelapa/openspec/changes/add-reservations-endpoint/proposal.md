# Add Reservations API Endpoint

## Why

The project currently has a complete reservation domain model but lacks API endpoints to expose reservation functionality. To provide external access to reservation operations, we need to create the foundational REST API endpoint structure following the `/booking/v1/reservations` pattern established in the project documentation.

## What Changes

- Add REST API controller for reservations endpoint at `/booking/v1/reservations`
- Implement basic CRUD endpoints (GET, POST, PUT, DELETE) without business logic
- Add Spring Web MVC configuration and dependencies
- Create API response structure and DTOs for external communication
- Set up proper HTTP status code handling and error responses
- Add OpenAPI documentation structure for the endpoints

## Impact

- Affected specs: `booking-api` (new capability)
- Affected code:
  - New controller class: `src/main/java/jdg/digital/oelapa/controller/ReservationController.java`
  - New DTOs for API responses
  - Spring Boot configuration for web endpoints
  - pom.xml dependencies (spring-boot-starter-web if not present)
- Dependencies: Requires Spring Boot Web starter dependency
- Breaking changes: None (additive change)