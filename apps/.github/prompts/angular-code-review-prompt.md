# Angular Code Review Prompt

## Overview
This prompt is designed to guide thorough code reviews within Angular projects, ensuring adherence to best practices, performance standards, and architectural consistency. Use this checklist during peer reviews to maintain code quality and project standards.

---

## 1. Project Structure & Angular CLI Compliance

- [ ] **Angular CLI Version**: Verify the project is using a supported Angular CLI version (`ng --version`). Ensure consistency across team environments.
- [ ] **Directory Structure**: Confirm compliance with Angular CLI conventions:
  - `/src` - source files
  - `/src/app` - application components, services, and modules
  - `/src/assets` - static assets
  - `/src/environments` - environment configurations
  - `/angular.json` - properly configured build and serve targets
- [ ] **Module Organization**: Verify lazy-loaded modules are properly configured via `ng generate module` or Angular CLI conventions.
- [ ] **Generated Files**: Check if files were generated using Angular CLI commands (`ng generate component|service|module|guard|interceptor`, etc.) to ensure naming conventions and boilerplate consistency.

---

## 2. Component Review

- [ ] **Component Declaration**: 
  - Verify component is properly declared in a module or standalone (using `standalone: true` in Angular 14+)
  - Check selector naming follows kebab-case convention
  - Verify component generated via `ng generate component` follows correct structure
- [ ] **Template File**:
  - Template syntax is correct (property binding `[prop]`, event binding `(event)`, two-way binding `[(ngModel)]`)
  - No direct DOM manipulation (use ViewChild/ViewChildren with `@ViewChild()` decorator instead)
  - Change detection strategy optimized (use `OnPush` where appropriate)
  - No complex logic in templates; defer to component class
- [ ] **Component Class**:
  - Implements appropriate lifecycle hooks (`OnInit`, `OnDestroy`, etc.)
  - Properly unsubscribes from Observables in `ngOnDestroy`
  - Uses `async` pipe where possible to handle subscriptions automatically
  - Class follows single responsibility principle
- [ ] **Inputs & Outputs**:
  - Inputs/outputs properly typed with `@Input()` and `@Output()` decorators
  - Default values provided where appropriate
  - Two-way binding patterns follow conventions

---

## 3. Service & Dependency Injection

- [ ] **Service Generation**: Verify services were created via `ng generate service` to follow DI conventions.
- [ ] **Singleton Pattern**: Services provided at root level use `providedIn: 'root'` instead of declaring in module providers.
- [ ] **HTTP Services**:
  - Use `HttpClient` for API calls (not deprecated `Http`)
  - Proper error handling with `catchError` operator
  - Typed responses with proper interfaces/models
  - Request interceptors properly configured via `HTTP_INTERCEPTORS` token
- [ ] **Observable Management**:
  - Services return Observables rather than Promises
  - No memory leaks from subscription chains
  - Proper use of RxJS operators (`map`, `switchMap`, `shareReplay`, etc.)

---

## 4. Routing & Guards

- [ ] **Routing Configuration**:
  - Routes properly defined in routing modules or `ng generate module --routing`
  - Lazy loading configured for feature modules: `loadChildren`
  - Route parameters typed correctly
  - Wildcard route (`**`) placed at the end of routes array
- [ ] **Route Guards**:
  - Guards generated via `ng generate guard`
  - Implements appropriate interfaces (`CanActivate`, `CanDeactivate`, `Resolve`, etc.)
  - Authentication/authorization logic properly implemented
  - Guards handle asynchronous operations (e.g., API calls) correctly

---

## 5. State Management (if applicable)

- [ ] **Store Pattern Consistency**:
  - State structure is normalized and immutable
  - Actions properly typed and dispatched
  - Selectors memoized to prevent unnecessary change detection
  - Effects handle side effects (API calls, navigation, etc.)
- [ ] **NgRx/Alternative Implementation**:
  - Follows the chosen library's conventions
  - No direct store mutations
  - Proper use of actions, effects, and selectors

---

## 6. Forms (Reactive & Template-Driven)

- [ ] **Form Approach**:
  - Reactive forms preferred for complex forms; template-driven for simple forms
  - Form groups/controls properly typed
  - Validators applied and custom validators implemented correctly
- [ ] **Validation**:
  - Built-in validators used (`required`, `minLength`, `pattern`, etc.)
  - Custom validators implemented with proper error handling
  - Validation messages conditionally displayed
- [ ] **Form Submission**:
  - `submit` event properly handled
  - Form state validation checked before submission
  - Error messages displayed to users appropriately

---

## 7. Testing

- [ ] **Unit Tests**:
  - Test files generated via `ng generate component --spec` (default behavior)
  - Tests cover happy path, edge cases, and error scenarios
  - Mocking dependencies properly (services, HTTP calls)
  - Using `TestBed` for component testing
- [ ] **Test Coverage**:
  - Minimum coverage targets met (e.g., 80% for critical code)
  - Tests run via `ng test` without failures
- [ ] **E2E Tests**:
  - Critical user flows tested
  - Generated via `ng e2e` (or modern alternatives like Cypress/Playwright)

---

## 8. Performance & Build Optimization

- [ ] **Build Configuration**:
  - Production build via `ng build --configuration production` verified
  - Bundle size analyzed and optimized
  - Lazy loading configured for feature modules
- [ ] **Change Detection**:
  - Components use `ChangeDetectionStrategy.OnPush` where applicable
  - Avoid triggering unnecessary change detection cycles
- [ ] **Image Optimization**:
  - Images optimized and lazy-loaded
  - Responsive images using `srcset` or Angular image directives
- [ ] **Code Splitting**:
  - Feature modules properly lazy-loaded
  - No circular dependencies
- [ ] **AOT Compilation**:
  - Project compiles with AOT enabled (default in Angular 12+)
  - Template errors caught at build time

---

## 9. Styling & CSS

- [ ] **CSS Architecture**:
  - Component-scoped styles using `styles` or `styleUrls` (view encapsulation)
  - Global styles in `styles.css`/`styles.scss`
  - Consistent naming conventions (BEM, utility-first, etc.)
- [ ] **CSS Preprocessor**:
  - SCSS/SASS used consistently if applicable
  - Variables and mixins properly utilized
- [ ] **Responsive Design**:
  - Mobile-first approach
  - Media queries properly tested
  - Flex/Grid used for layouts

---

## 10. Environment & Configuration

- [ ] **Environment Files**:
  - Multiple environment configurations managed in `src/environments/`
  - `environment.ts` (development) and `environment.prod.ts` (production)
  - Sensitive data (API keys) not hardcoded; use environment variables
  - Built correctly via `ng serve --configuration development|production`
- [ ] **Secrets Management**:
  - API keys and secrets stored securely (environment variables, CI/CD secrets)
  - No credentials committed to version control

---

## 11. Security

- [ ] **XSS Prevention**:
  - User inputs sanitized using Angular's built-in sanitization
  - Avoid using `bypassSecurityTrustHtml`, `bypassSecurityTrustUrl` unnecessarily
  - Template interpolation used safely
- [ ] **CSRF Protection**:
  - CSRF tokens included in HTTP requests if required
  - HTTP interceptors properly configured
- [ ] **Authentication & Authorization**:
  - Tokens securely stored and transmitted
  - Route guards enforce access control
  - Sensitive data not exposed in console or local storage unencrypted
- [ ] **Dependency Vulnerabilities**:
  - Run `ng npm audit` or `npm audit` to check for vulnerabilities
  - Dependencies kept up-to-date

---

## 12. Code Quality & Style

- [ ] **TypeScript Compliance**:
  - Strict mode enabled (`strict: true` in `tsconfig.json`)
  - All variables properly typed; no excessive `any` types
  - Strict null checks enforced
- [ ] **Naming Conventions**:
  - Classes use PascalCase
  - Properties/variables use camelCase
  - Constants use UPPER_SNAKE_CASE
  - Components/files use kebab-case (generated via Angular CLI)
- [ ] **Code Comments**:
  - Complex logic documented with comments
  - Avoid redundant comments
  - JSDoc used for public API documentation
- [ ] **Linting**:
  - `ng lint` passes without errors
  - ESLint rules configured and enforced
  - Prettier or similar formatter applied consistently
- [ ] **DRY Principle**:
  - No duplicated code; extract shared logic to utilities/services
  - Reusable components created for repeated UI patterns

---

## 13. Documentation

- [ ] **README**: Project setup and running instructions documented
- [ ] **Component Documentation**: Purpose, inputs, outputs, and usage examples documented
- [ ] **API Documentation**: Service methods documented with JSDoc
- [ ] **Configuration**: Build, deployment, and environment setup documented

---

## 14. Git & Version Control

- [ ] **Commit Messages**: Clear, descriptive commit messages following conventions
- [ ] **Branch Naming**: Feature/bugfix branches follow naming conventions
- [ ] **Code Review Process**: PR includes description of changes and linked issues
- [ ] **No Large Commits**: Changes are logical and reviewable

---

## 15. Angular CLI Commands Verification

- [ ] All generated files used Angular CLI:
  - Components: `ng generate component component-name`
  - Services: `ng generate service service-name`
  - Modules: `ng generate module module-name --routing`
  - Guards: `ng generate guard guard-name`
  - Interceptors: `ng generate interceptor interceptor-name`
- [ ] Project builds successfully: `ng build`
- [ ] Development server runs: `ng serve` or `ng serve --open`
- [ ] Tests execute: `ng test`
- [ ] Lint checks pass: `ng lint`

---

## Review Checklist Summary

| Category | Status | Notes |
|----------|--------|-------|
| Project Structure | ☐ | |
| Components | ☐ | |
| Services & DI | ☐ | |
| Routing & Guards | ☐ | |
| State Management | ☐ | |
| Forms | ☐ | |
| Testing | ☐ | |
| Performance | ☐ | |
| Styling | ☐ | |
| Configuration | ☐ | |
| Security | ☐ | |
| Code Quality | ☐ | |
| Documentation | ☐ | |
| Version Control | ☐ | |
| Angular CLI Compliance | ☐ | |

---

## Tips for Effective Reviews

1. **Use Angular CLI Consistently**: Ensure all artifacts are generated via Angular CLI to maintain consistency.
2. **Reference Angular Docs**: Link to official Angular documentation when suggesting improvements.
3. **Automate Where Possible**: Use linters, formatters, and automated tests to catch issues before review.
4. **Focus on Architecture**: Identify patterns that could improve maintainability and scalability.
5. **Be Constructive**: Provide actionable feedback and suggest improvements, not just criticism.
6. **Test Locally**: Check out the branch and test the code locally when reviewing significant changes.

---

## References

- [Angular Official Documentation](https://angular.io/docs)
- [Angular CLI Documentation](https://angular.io/cli)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
