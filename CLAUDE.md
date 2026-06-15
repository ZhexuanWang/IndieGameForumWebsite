# CLAUDE.md

This file provides guidance to Claude Code when working in the `flashdevgameweb` repository.

## Commands

```bash
# Install all workspace dependencies
bun install

# Start PostgreSQL
docker compose up -d db

# Run dev servers (each in a separate terminal if not using concurrently)
bun run dev:web       # Vite at http://localhost:5173
bun run dev:api       # Builds shared, then NestJS watch at http://localhost:3001

# Production builds — always run before committing to surface TypeScript errors
bun run build:web
bun run build:api     # builds shared first
bun run build:shared  # compile packages/shared to dist/

# Tests
bun run test          # runs tests in apps/*
bun run --cwd apps/api test
bun run --cwd apps/web test

# Add a package to a workspace
bun add --cwd apps/api <package>
bun add --cwd apps/web <package>
```

## Architecture

Bun workspace monorepo:

```
apps/web/          React 18 + TypeScript + Vite (port 5173)
apps/api/          NestJS 10 + TypeScript (port 3001)
packages/shared/   Shared TypeScript types
```

Docker Compose runs PostgreSQL 16 locally. API and Web can be added to Docker later.

## Frontend (`apps/web/src/`)

- **Routing**: React Router v6. Routes live in `App.tsx`.
- **Auth**: `AuthContext` will restore session on mount and silently refresh on 401. Access token in `localStorage('flashdev.access_token')`; refresh token in httpOnly cookie.
- **API client**: `lib/api.ts` exports an axios `api` instance with auth interceptor. Domain libs (`lib/projects.ts`, `lib/forum.ts`, etc.) wrap it — never call `api` directly from components.
- **State**: Zustand for global UI state; React Context for auth and language.
- **Styling**: Tailwind v3 + `index.css` custom properties. Brand colors are real hex values so opacity modifiers work.
- **i18n**: i18next + react-i18next. Default locale is **en**.
- **Path alias**: `@/` maps to `apps/web/src/`.

## Backend (`apps/api/src/`)

- **Module pattern**: one folder per domain: `auth/`, `users/`, `projects/`, `forum/`, `marketplace/`, etc. Each has `entities/`, `dto/`, `*.module.ts`, `*.service.ts`, `*.controller.ts`.
- **Guards**: `@UseGuards(JwtAuthGuard)` for any-auth; add `RolesGuard` + `@Roles('admin','company')` for elevated access.
- **Decorators**: `@CurrentUser()` extracts the JWT payload; `@Roles(...)` for RBAC.
- **Entities**: TypeORM, `synchronize: true` in dev. Every new entity must be added to `config/typeorm.config.ts`.
- **Validation**: all DTOs use `class-validator`. `ValidationPipe` is global in `main.ts`.
- **API prefix**: `/api`.

## Key Invariants

- Do not modify `D:\PersonalProjects\FlashDev\flashdevplatform` — it is a read-only reference.
- Default UI language is English.
- Use the same conventions as the main FlashDev platform.
- No emojis in `.tsx` string literals.
- Tailwind brand colors must be real hex values.
- Entity IDs are UUIDs.
- Run `bun run build:web` and `bun run build:api` before committing.
