## Why
The current frontend application has hardcoded configuration for menu items and Keycloak authentication settings, making it difficult to deploy the same application across different environments or customize the user interface without code changes. Dynamic configuration loading would enable environment-specific customization and external management of frontend behavior.

## What Changes
- Add new frontend configuration service that loads config from external API endpoint
- **BREAKING**: Modify navigation service to use dynamic menu configuration instead of hardcoded menu items  
- **BREAKING**: Modify authentication configuration to use dynamic Keycloak settings
- Implement configuration caching and error handling for reliability
- Add configuration models and validation
- Update application bootstrap to load configuration before app initialization

## Impact
- Affected specs: authentication (MODIFIED), user-interface (MODIFIED), frontend-configuration (NEW)
- Affected code: `src/app/shared/navigation.service.ts`, `src/app/auth/auth.config.ts`, `src/main.ts`, `src/app/app.config.ts`
- New services: `ConfigurationService`
- Enhanced deployment flexibility - same build can work across environments
- Reduced need for environment-specific builds
- Improved maintainability through externalized configuration
- Foundation for multi-tenant or white-label deployments