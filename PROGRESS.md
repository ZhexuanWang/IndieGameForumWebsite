# FlashDev Indie Game Forum — Progress Tracker

## Project Overview

FlashDev Indie Game Forum (`flashdevgameweb`) is a sub-project of the FlashDev platform (`D:\PersonalProjects\FlashDev\flashdevplatform`). It is an integrated web forum designed for independent game developers, covering the full lifecycle from idea to distribution:

- Project showcase and discussion
- Development collaboration
- Advertising and promotion
- Project selling / source-code trading
- Project hosting and demo distribution

The project mirrors the architecture, stack, and conventions of the main FlashDev platform so it can evolve independently while remaining compatible for future integration.

**Default UI language:** English.  
**Versioning:** `v0.0x`.

## Current Version: v0.01

v0.01 establishes the monorepo, containerized development environment, Git workflow, documentation, and a minimal runnable skeleton for the frontend and backend.

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Runtime / PM | Bun 1.x workspaces | Fast installs, native TypeScript, workspace support |
| Frontend | React 18 + TypeScript + Vite 5 | Fast DX, flexible routing, no SSR overhead |
| Styling | Tailwind CSS v3 + CSS custom properties | Utility-first with brand token layer |
| Animation | Framer Motion | Same convention as main project |
| State | Zustand + React Context | Lightweight, matches main project |
| Forms | React Hook Form + Zod | Type-safe validation |
| i18n | i18next + react-i18next | Default locale `en`, extensible |
| Backend | NestJS 10 + TypeScript | Structured DI, decorators, RBAC support |
| Database | PostgreSQL 16 + TypeORM | Relational data, JSONB support for permissions |
| Auth | JWT access + refresh | Stateless, works with NestJS Guards |
| Testing | Jest (API) + Vitest (Web) + Playwright (E2E) | Matches verification requirements |
| Containers | Docker Compose | Reproducible local environment |

## Project Structure

```
flashdevgameweb/
├── README.md                 # Human-readable quick start
├── PROGRESS.md               # This file
├── CLAUDE.md                 # Agent coding guide
├── package.json              # Bun workspace root
├── docker-compose.yml        # PostgreSQL 16 dev container
├── .env.example              # Environment variable template
├── .gitignore
├── apps/
│   ├── web/                  # React frontend
│   └── api/                  # NestJS backend
├── packages/
│   └── shared/               # Shared TypeScript types
└── docs/
    └── reference/flashdev-spa/  # Original UI reference (read-only)
```

## Database Structure (planned)

The following entities will be implemented in v0.02 and beyond using TypeORM with PostgreSQL:

- **users** — `id` (UUID PK), `email` (unique), `passwordHash`, `role` enum, `permissions` JSONB, `createdAt`, `updatedAt`
- **user_profiles** — `id`, `userId` FK, `bio`, `avatarUrl`, `socialLinks` JSONB
- **follows** — `id`, `followerId` FK, `followingId` FK, `createdAt`
- **project_categories** — `id`, `name`, `slug`, `displayOrder`
- **projects** — `id`, `title`, `description`, `type` enum, `status` enum, `price`, `tags`, `thumbnailUrl`, `demoUrl`, `authorId` FK, `categoryId` FK, `createdAt`, `updatedAt`
- **project_versions** — `id`, `projectId` FK, `version`, `changelog`, `downloadUrl`
- **project_files** — `id`, `projectId` FK, `versionId` FK, `fileUrl`, `fileType`
- **forum_categories** — `id`, `name`, `slug`, `description`
- **forum_threads** — `id`, `categoryId` FK, `authorId` FK, `title`, `pinned`, `createdAt`, `updatedAt`
- **forum_posts** — `id`, `threadId` FK, `authorId` FK, `content`, `parentId` FK (nested replies), `createdAt`, `updatedAt`
- **market_listings** — `id`, `type` enum (sell/buy/promo/host), `projectId` FK (optional), `sellerId` FK, `title`, `description`, `price`, `status`, `createdAt`, `updatedAt`
- **inquiries** — `id`, `listingId` FK, `senderId` FK, `message`, `createdAt`

## Phase Plan

| Phase | Name | Version | Status |
|---|---|---|---|
| 1 | Project Scaffold & Dev Workflow | v0.01 | done |
| 2 | Database & Authentication Foundation | v0.02 | planned |
| 3 | Forum & Project Core API | v0.03 | planned |
| 4 | Frontend Pages & API Integration | v0.04 | planned |
| 5 | Marketplace Module | v0.05 | planned |
| 6 | Media Uploads & Hosting | v0.06 | planned |
| 7 | Search, Admin & Polish | v0.07 | planned |

## Current Progress Detail (v0.01)

### Completed
- Initialized an isolated Git repository inside `flashdevgameweb/`.
- Moved the `flashdev-spa` reference into `docs/reference/`.
- Created root workspace configuration and scripts.
- Created `apps/web` React + Vite skeleton with a landing page.
- Created `apps/api` NestJS skeleton with a `/api/health` endpoint.
- Created `packages/shared` with placeholder shared types.
- Added `docker-compose.yml` for PostgreSQL 16 (exposed on host port `5433` to avoid conflicts with the main project).
- Added `.env.example`, `README.md`, `PROGRESS.md`, and `CLAUDE.md`.

### Verification (v0.01)
- `bun install` completes without errors.
- `bun run build:shared` compiles the shared package.
- `bun run --cwd apps/api test` runs Jest placeholder tests.
- `bun run --cwd apps/web test` runs Vitest placeholder tests.
- `docker compose up -d db` starts Postgres healthy.
- `curl http://localhost:3001/api/health` returns a JSON response.

## Project Goals

1. Provide a dedicated community space for indie game developers to share work-in-progress, receive feedback, and find collaborators.
2. Enable transparent project trading through a marketplace for source code, complete IPs, ad slots, and hosting services.
3. Offer lightweight project hosting and demo distribution tools.
4. Maintain architectural consistency with the main FlashDev platform for future integration.
5. Keep the default experience in English while retaining an extensible internationalization layer.

## Positioning

A futuristic, developer-first community platform that combines the social dynamics of a forum with the commercial capabilities of a marketplace. The visual language inherits the deep-space cosmic aesthetic of the FlashDev brand, with the `flashdev-spa` orange accent used to highlight game-related calls to action.

## Design Philosophy

- **Consistency first**: follow the main project's module patterns, naming conventions, and design tokens.
- **API-first**: build backend modules with REST endpoints and DTOs before wiring the UI.
- **Test-backed verification**: every version must pass command checks, API curl tests, and Playwright frontend checks before release.
- **Incremental delivery**: each `v0.0x` adds one coherent slice of functionality and is pushed to GitHub before the next begins.
