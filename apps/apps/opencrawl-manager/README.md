# OpenCrawl Manager

OpenCrawl Manager is an Angular application for managing web crawling operations.

## Development

### Serve the application

```bash
npx nx serve opencrawl-manager
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npx nx build opencrawl-manager
```

Build artifacts will be stored in the `dist/` directory.

### Running unit tests

```bash
npx nx test opencrawl-manager
```

### Running lint

```bash
npx nx lint opencrawl-manager
```

## Project Structure

- `src/app/` - Application components and logic
- `src/assets/` - Static assets
- `src/styles.scss` - Global styles
- `public/` - Public files (favicon, etc.)

## Technologies

- Angular 21
- TypeScript
- SCSS
- Nx (Build System)
- Jest (Testing)
- ESLint (Linting)

## Features

This is a standalone Angular application using:
- Standalone components (no NgModules)
- Angular Router for navigation
- Strict TypeScript configuration
- ESBuild bundler
- Modern Angular features
