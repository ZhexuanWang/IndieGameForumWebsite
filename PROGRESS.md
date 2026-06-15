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

## Current Version: v0.03

v0.03 adds the core forum and project APIs: full project CRUD with filters, forum categories/threads/posts with nested replies, likes, follows, and expanded seed data.

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

## Database Structure

Implemented in v0.02–v0.03:

- **users** — `id` (UUID PK), `email` (unique), `password_hash`, `avatar_url`, `display_name`, `email_verified`, `role` enum, `permissions` JSONB, `theme`, `created_at`, `updated_at`
- **user_profiles** — `id` (UUID PK), `user_id` (unique FK), `bio`, `avatar_url`, `links` JSONB, `created_at`, `updated_at`
- **project_categories** — `id` (UUID PK), `name`, `slug`, `display_order`, `created_at`
- **projects** — `id` (UUID PK), `title`, `description`, `type` enum, `status` enum, `price`, `tags`, `thumbnail_url`, `demo_url`, `author_id` FK, `category_id` FK, `created_at`, `updated_at`
- **forum_categories** — `id` (UUID PK), `name`, `slug`, `description`, `display_order`, `created_at`
- **forum_threads** — `id` (UUID PK), `category_id` FK, `author_id` FK, `title`, `body`, `pinned`, `view_count`, `created_at`, `updated_at`
- **forum_posts** — `id` (UUID PK), `thread_id` FK, `author_id` FK, `content`, `parent_id` FK, `depth`, `created_at`, `updated_at`
- **likes** — `id` (UUID PK), `user_id` FK, `target_type` enum, `target_id`, `created_at`
- **follows** — `id` (UUID PK), `follower_id` FK, `following_id` FK, `created_at`

Planned for future versions:

- **project_versions** — `id`, `project_id` FK, `version`, `changelog`, `download_url`
- **project_files** — `id`, `project_id` FK, `version_id` FK, `file_url`, `file_type`
- **market_listings** — `id`, `type` enum (sell/buy/promo/host), `project_id` FK (optional), `seller_id` FK, `title`, `description`, `price`, `status`, `created_at`, `updated_at`
- **inquiries** — `id`, `listing_id` FK, `sender_id` FK, `message`, `created_at`

## Phase Plan

| Phase | Name | Version | Status |
|---|---|---|---|
| 1 | Project Scaffold & Dev Workflow | v0.01 | done |
| 2 | Database & Authentication Foundation | v0.02 | done |
| 3 | Forum & Project Core API | v0.03 | done |
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

## Current Progress Detail (v0.02)

### Completed
- Added TypeORM configuration in `apps/api/src/config/typeorm.config.ts` connected to PostgreSQL 16.
- Implemented core entities: `User`, `UserProfile`, `ProjectCategory`, `Project`.
- Implemented `UsersModule`, `ProjectsModule`, `SeedModule`.
- Implemented `AuthModule` with endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Implemented JWT strategies and guards: `JwtAuthGuard`, `JwtRefreshGuard`, `RolesGuard`, `@CurrentUser()`, `@Roles()`.
- Configured JWT access token in response body + httpOnly refresh cookie (`refresh_token`).
- Added `SeedService` that idempotently seeds an admin account and 7 game categories on startup.
- Added `auth.service.spec.ts` unit tests.
- Updated `.env.example` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` seed variables.

### Verification (v0.02)
- `bun install`, `bun run build:shared`, `bun run build:api`, `bun run build:web` all succeed.
- `bun run --cwd apps/api test` passes (health + auth service tests).
- `bun run --cwd apps/web test` passes.
- `docker compose up -d db` starts Postgres on port `5433` and API connects successfully.
- `curl` verification:
  - `POST /api/auth/register` returns user + access token and sets refresh cookie.
  - `POST /api/auth/login` returns user + access token for valid credentials.
  - `GET /api/auth/me` returns current user when authenticated and `401` when not.
  - `POST /api/auth/refresh` returns a new access token using the httpOnly cookie.
  - `POST /api/auth/logout` clears the refresh cookie.
  - Invalid login returns `401`.

## Current Progress Detail (v0.03)

### Completed
- Implemented `ProjectsModule`:
  - `GET /api/projects/categories`
  - `GET /api/projects` with filters (type, status, categoryId, authorId, search) and pagination
  - `GET /api/projects/:id`
  - `POST /api/projects` (JWT required)
  - `PATCH /api/projects/:id` (owner or admin/company)
  - `DELETE /api/projects/:id` (owner or admin/company)
- Added `CreateProjectDto`, `UpdateProjectDto`, and `ProjectQueryDto` with `class-validator` rules.
- Implemented `ForumModule`:
  - Entities: `ForumCategory`, `ForumThread`, `ForumPost` (with `parentId` and `depth` for nested replies).
  - Endpoints for categories, thread list/detail, posts, nested replies, thread creation, posting, pinning, and deletion.
- Implemented `LikesModule`: toggle/status/me endpoints for `PROJECT` and `FORUM_THREAD` targets.
- Implemented `FollowsModule`: toggle/status/followers/following endpoints.
- Expanded `SeedService` to create demo projects, forum categories, and a pinned welcome thread on startup.
- Added `projects.service.spec.ts` Jest unit tests.
- Updated `TypeOrmModule` entities and `AppModule` imports.

### Verification (v0.03)
- `bun install`, `bun run build:shared`, `bun run build:api`, `bun run build:web` all succeed.
- `bun run --cwd apps/api test` passes (3 suites, 11 tests).
- `bun run --cwd apps/web test` passes.
- `docker compose up -d db` starts Postgres and the API connects with all new tables synchronized.
- `curl` verification:
  - Project categories/list/detail return seeded data.
  - Authenticated project create/update works.
  - Forum thread/post/reply creation works, with reply `depth` > 0.
  - Liking a project returns `{ liked: true, count: 1 }` and status reflects it.
  - Unauthorized project creation returns `401`.

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
