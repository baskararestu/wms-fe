# Warehouse Management System Frontend

Frontend boilerplate and architecture guide for a WMS technical test using **React + TypeScript + Vite**.

This project adopts a **Layered Feature-First** approach: clear boundaries, scalable structure, and practical implementation speed.

## Tech Stack

- `react`, `react-dom`, `typescript`, `vite`
- `react-router-dom` for routing
- `@tanstack/react-query` for server state
- `zustand` for local UI state
- `axios` for HTTP client
- `tailwindcss` for styling

## Why Layered Feature-First?

Because this test needs both speed and maintainability.

- Faster than strict enterprise patterns.
- More scalable than flat `components/pages/store` only.
- Keeps business logic near each feature while preserving shared boundaries.

## Proposed Project Structure

```txt
src/
  app/
    providers/          # App-level providers (Router, QueryClient, Theme)
    router/             # Route definitions
    styles/             # Global styles and tokens
  shared/
    api/                # Axios instance, interceptors, base HTTP utilities
    lib/                # Generic helpers (formatters, guards, utils)
    ui/                 # Reusable UI primitives (Button, Input, Modal)
    types/              # Global/shared type definitions
  entities/
    order/
      model/            # Entity-level types, mappers, selectors
      ui/               # Entity-scoped UI snippets
  features/
    order-list/
      api/              # Feature API calls (query functions)
      model/            # Feature hooks/state orchestration
      ui/               # Feature components
    order-status-update/
      api/
      model/
      ui/
  pages/
    orders/
      ui/               # Page composition only
  widgets/              # Optional complex composed sections
  main.tsx
```

## Dependency Rules (Important)

Use these rules to avoid architecture drift:

1. `pages` can import from `features`, `entities`, `shared`.
2. `features` can import from `entities`, `shared`.
3. `entities` can import from `shared` only.
4. `shared` must not import from upper layers.
5. Avoid direct cross-feature imports unless promoted to `entities` or `shared`.

## State Management Rules

### React Query (server state)

Use for anything fetched from backend/API:

- Order list
- Order detail
- Mutation (status update)
- Cache invalidation/revalidation

### Zustand (local UI state)

Use only for ephemeral UI state:

- Sidebar open/close
- Table filter panel visibility
- Local wizard step index

Do **not** copy React Query data into Zustand.

## API Layer Rules

Keep API concerns isolated and testable:

- One `axios` instance in `shared/api`.
- Handle auth/token and common error mapping in interceptors.
- Keep endpoint functions in feature/entity folders, not in UI components.
- Components/pages must call hooks/services, not raw `axios` directly.

## SOLID in Frontend (Practical, Yes It Applies)

Yes, SOLID can be applied in frontend. Use it pragmatically:

### S — Single Responsibility Principle

- Component: render UI only.
- Hook: orchestrate state/effects only.
- Service/API function: perform I/O only.

### O — Open/Closed Principle

- Extend behavior via composition and props.
- Add variants through strategy/config, not by editing stable core repeatedly.

### L — Liskov Substitution Principle

- Keep component contracts consistent.
- If `DataTable` expects `columns + rows`, all replacements must preserve behavior.

### I — Interface Segregation Principle

- Prefer small focused interfaces.
- Avoid giant “do everything” hooks/services.

### D — Dependency Inversion Principle

- Depend on abstractions (`OrderRepository` shape), not concrete transport.
- Inject implementation at boundary (e.g., via module composition/provider).

## Recommended Conventions

- Naming: `kebab-case` for folders, `PascalCase` for React components.
- File boundaries: keep `index.ts` as explicit public API for each module.
- Keep pages thin: compose features; avoid business logic in page files.
- Keep reusable UI in `shared/ui`; move domain-specific UI to entity/feature `ui`.

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
