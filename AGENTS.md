Outline is a fast, collaborative knowledge base built for teams. It's built with React and TypeScript in both frontend and backend, uses a real-time collaboration engine, and is designed for excellent performance and user experience. The backend is a Koa server with an RPC API and uses PostgreSQL and Redis. The application can be self-hosted or used as a cloud service.

There is a web client which is fully responsive and works on mobile devices.

## Monorepo Structure

- **`app/`** - React web application with MobX state management
- **`server/`** - Koa API server with Sequelize ORM and background workers
- **`shared/`** - Shared TypeScript types, utilities, and editor components
- **`plugins/`** - Plugin system for extending functionality
- **`public/`** - Static assets served directly
- **Various config files** - TypeScript, Vite, Jest, Prettier, Oxlint configurations

### Frontend (`app/`)

```
app
├── actions     - Reusable actions such as navigating, opening, creating entities
├── components  - React components reusable across scenes
├── editor      - React components specific to the editor
├── hooks       - Reusable React hooks
├── menus       - Context menus, often appear in multiple places in the UI
├── models      - Client-side state models using MobX observables
├── routes      - Route definitions (chunks are async loaded with Suspense)
├── scenes      - Full-page views that contain several components
├── stores      - Collections of models and associated fetch logic (MobX)
├── types       - TypeScript types
└── utils       - Utility methods specific to the frontend
```

### Backend (`server/`)

```
server
├── routes            - All API routes
│   ├── api           - API routes (organized by resource)
│   └── auth          - Authentication routes
├── collaboration     - Hocuspocus extensions for real-time collaboration
├── commands          - Complex commands that perform actions across multiple models
├── config            - Database configuration
├── emails            - Transactional email templates (React-based via oy-vey)
│   └── templates     - Classes that define each possible email template
├── middlewares       - Shared Koa middlewares
├── migrations        - Sequelize database migrations
├── models            - Sequelize models
├── onboarding        - Markdown templates for onboarding documents
├── policies          - Authorization logic based on cancan
├── presenters        - JSON presenters for database models (backend → frontend)
├── queues            - Async queue definitions (Bull/Redis)
│   ├── processors    - Processors perform jobs on events from the event bus
│   └── tasks         - Arbitrary async jobs not from the event bus
├── services          - Distinct portions of the application (api, worker, collaboration, websockets, cron, admin)
├── tools             - MCP (Model Context Protocol) server tool definitions
├── utils             - Utility methods specific to the backend
└── validation.ts     - Zod-based request validation schemas
```

### Shared (`shared/`)

```
shared
├── components        - Shared React components used in both frontend and backend (emails)
├── editor            - The Prosemirror-based text editor (nodes, marks, extensions, plugins)
│   ├── commands      - Editor commands
│   ├── extensions    - Prosemirror extensions
│   ├── marks         - Inline marks (bold, italic, code, etc.)
│   ├── nodes         - Block nodes (paragraph, heading, table, etc.)
│   └── plugins       - Prosemirror plugins
├── i18n              - Internationalization configuration
│   └── locales       - Language-specific translation files
├── styles            - Styles, colors, and global aesthetics
└── utils             - Shared utility methods
```

### Plugins (`plugins/`)

Each plugin follows this structure:

```
plugins/<name>
├── plugin.json   - Plugin metadata (id, name, priority, description)
├── client/       - Frontend plugin code (React components, settings UI)
├── server/       - Backend plugin code (routes, tasks, env config)
└── shared/       - Code shared between client and server within the plugin
```

Available plugins: `azure`, `diagrams`, `discord`, `email`, `enterprise`, `figma`, `github`, `gitlab`, `google`, `googleanalytics`, `iframely`, `linear`, `matomo`, `notion`, `oidc`, `passkeys`, `slack`, `storage`, `umami`, `webhooks`, `zapier`.

## Instructions

You're an expert in the following areas:

- TypeScript
- React and React Router
- MobX and MobX-React
- Node.js and Koa
- Sequelize ORM
- PostgreSQL
- Redis
- HTML, CSS and Styled Components
- Prosemirror (rich text editor)
- WebSockets and real-time collaboration

## General Guidelines

- Critical – Do not create new markdown (.md) files.
- Use early returns for readability.
- Emphasize type safety and static analysis.
- Follow consistent Prettier formatting.
- Do not replace smart quotes ("") or ('') with simple quotes ("").
- Do not add translation strings manually; they will be extracted automatically from the codebase.

## Dependencies and Upgrading

- Use yarn for all dependency management.
- After updating dependency versions, install to update lockfiles:

```bash
yarn install
```

## TypeScript Usage

- Use strict mode.
- Avoid "unknown" unless absolutely necessary.
- Never use "any".
- Prefer type definitions; avoid type assertions (as, !).
- Always use curly braces for if statements.
- Avoid # for private properties.
- Prefer interface over type for object shapes.

## Classes & Code Organization

### Class Member Order

1. Public static variables
2. Public static methods
3. Public variables
4. Public methods
5. Protected variables & methods
6. Private variables & methods

### Exports

- Exported members must appear at the top of the file.
- Prefer named exports for components & classes.
- Document ALL public/exported functions with JSDoc.

## React Usage

- Use functional components with hooks.
- Event handlers should be prefixed with "handle", like "handleClick" for onClick.
- Avoid unnecessary re-renders by using React.memo, useMemo, and useCallback appropriately.
- Use descriptive prop types with TypeScript interfaces.
- Do not import React unless it is used directly.
- Use styled-components for component styling.
- Ensure high accessibility (a11y) standards using ARIA roles and semantic HTML.

## MobX State Management

- Use MobX stores for global state management.
- Keep stores in `app/stores/`.
- Use `observable`, `action`, and `computed` decorators appropriately.
- Prefer computed values over manual calculations in render.
- Keep business logic in stores, not components.

## Database & ORM

- Use Sequelize models in `server/models/`.
- Generate migrations with Sequelize CLI:

```bash
yarn db:create-migration --name=add-field-to-table
```

- Run migrations with `yarn db:migrate`.
- Roll back with `yarn db:rollback`.
- Reset (drop, create, migrate) with `yarn db:reset`.
- Use transactions for multi-table operations.
- Add appropriate indexes for query performance.
- Always handle database errors gracefully.

## API Design

- RESTful endpoints under `/api/`.
- Authentication endpoints under `/auth/`.
- Use consistent error responses.
- Validate request data using the validation middleware and Zod schemas in `server/validation.ts`.
- Use presenters to format API responses.
- Keep API routes thin; use model methods for business logic or commands if logic spans multiple models.

## Commands

- Place cross-model business logic in `server/commands/`.
- Commands are plain async functions (not classes).
- Examples: `documentCreator.ts`, `documentMover.ts`, `accountProvisioner.ts`.

## Authentication & Authorization

- JWT tokens for authentication.
- Policies in `server/policies/` for authorization.
- Use cancan-style ability checks.
- Use authenticated middleware for protected routes.
- Always verify user permissions before data access.

## Real-time Collaboration

- WebSocket connections for real-time updates via Socket.io.
- Collaborative editing uses Y.js + Hocuspocus (`@hocuspocus/server`).
- Hocuspocus extensions are in `server/collaboration/` (authentication, persistence, connection limits, etc.).
- Handle connection state changes gracefully.

## MCP Tools

- MCP (Model Context Protocol) server tools live in `server/tools/`.
- Each tool file exports self-contained functionality (collections, comments, documents, users).
- To test the MCP server with Claude locally, run:

```bash
NODE_EXTRA_CA_CERTS=$(mkcert -CAROOT)/rootCA.pem claude
```

## Plugin Development

- Each plugin has a `plugin.json` with `id`, `name`, `priority`, and `description`.
- Plugin server code (routes, tasks) is in `plugins/<name>/server/`.
- Plugin client code (React UI, settings) is in `plugins/<name>/client/`.
- Plugin shared code goes in `plugins/<name>/shared/`.
- Plugins can define their own `env.ts` for environment variable declarations.

## Email System

- Transactional emails use React components rendered server-side via oy-vey.
- Email templates live in `server/emails/templates/`.
- Each template extends `BaseEmail` and defines its own props and render logic.

## Queue & Background Jobs

- Background jobs use Bull queues backed by Redis.
- Event-driven processors live in `server/queues/processors/` (extend `BaseProcessor`).
- Arbitrary async tasks live in `server/queues/tasks/`.

## Environment Configuration

- Server environment is declared in `server/env.ts` using class-validator decorators.
- Frontend environment is accessed via `app/env.ts` which reads `window.env`.
- Plugin-specific env vars are declared in each plugin's `server/env.ts`.
- Use `@Public` decorator for env vars that should be exposed to the frontend.

## Documentation

- All public/exported functions & classes must have JSDoc.
- Include:
  - Description
  - @param and @return (start lowercase, end with period)
  - @throws if applicable
- Add a newline between the description and the @ block.
- Use correct punctuation.

## Development Workflow

```bash
# Full-stack development (recommended): hot-reloads both frontend and backend
yarn dev:watch

# Backend only (auto-rebuilds on changes to server/, shared/, plugins/)
yarn dev:backend

# Frontend only (Vite dev server)
yarn vite:dev
```

## Build

```bash
# Full production build (clean, frontend, i18n, backend)
yarn build

# Individual steps
yarn vite:build        # Build frontend
yarn build:server      # Build backend
yarn build:i18n        # Extract and build i18n strings
```

## Testing

- Run tests with Jest:

```bash
# Run a specific test file (preferred)
yarn test path/to/test.spec.ts

# Run every test (avoid)
yarn test

# Run test suites (avoid)
yarn test:app      # All frontend tests
yarn test:server   # All backend tests
yarn test:shared   # All shared code tests
```

- Write unit tests for utilities and business logic in a collocated `.test.ts` file.
- Do not create new test directories.
- Mock external dependencies appropriately in `__mocks__` folders.
- Aim for high code coverage but focus on critical paths.
- Tests run with `TZ=UTC` to ensure date consistency.

## Code Quality

- Use Oxlint for linting: `yarn lint`
- Format code with Prettier: `yarn format`
- Check types with TypeScript: `yarn tsc`
- Pre-commit hooks run automatically via Husky.
- Fix linting issues before committing.

## Error Handling

- Use custom error classes in `server/errors.ts`.
- Always catch and handle errors appropriately.
- Log errors with appropriate context.
- Return user-friendly error messages.
- Never expose sensitive information in errors.

## Performance

- Use React.memo for expensive components.
- Implement pagination for large lists.
- Use database indexes effectively.
- Cache expensive computations.
- Monitor performance with appropriate tools.
- Lazy load routes and components where appropriate.
- Avoid instantiating editor extensions not required in read-only mode.

## Security

- Sanitize all user input.
- Use CSRF protection.
- Use rateLimiter middleware for sensitive endpoints.
- Follow OWASP guidelines.
- Never store sensitive data in plain text.
- Use environment variables for secrets.
- Use `request-filtering-agent` for outgoing HTTP requests in plugins to prevent SSRF.
