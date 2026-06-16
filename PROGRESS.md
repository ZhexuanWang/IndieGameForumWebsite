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

## Current Version: v0.06

v0.06 adds Media Uploads & Hosting: a local-disk upload service for project thumbnails and downloadable files, plus project file management so developers can distribute builds, source archives, and demos directly from a project page.

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
- **market_listings** — `id` (UUID PK), `type` enum (`sell`/`buy`/`promo`/`host`), `project_id` FK (optional), `seller_id` FK, `title`, `description`, `price`, `status` enum (`draft`/`published`/`closed`), `created_at`, `updated_at`
- **inquiries** — `id` (UUID PK), `listing_id` FK, `sender_id` FK, `message`, `status` enum (`pending`/`replied`/`closed`), `created_at`, `updated_at`
- **project_files** — `id` (UUID PK), `project_id` FK, `original_name`, `filename`, `mime_type`, `size`, `file_url`, `version`, `created_at`

Planned for future versions:

- **project_versions** — `id`, `project_id` FK, `version`, `changelog`, `download_url`
- **project_files** — `id`, `project_id` FK, `version_id` FK, `file_url`, `file_type`

## Phase Plan

| Phase | Name | Version | Status |
|---|---|---|---|
| 1 | Project Scaffold & Dev Workflow | v0.01 | done |
| 2 | Database & Authentication Foundation | v0.02 | done |
| 3 | Forum & Project Core API | v0.03 | done |
| 4 | Frontend Pages & API Integration | v0.04 | done |
| 5 | Marketplace Module | v0.05 | done |
| 6 | Media Uploads & Hosting | v0.06 | done |
| 7 | Search, Admin & Polish | v0.07 | planned |
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

## Current Progress Detail (v0.04)

### Completed
- Added shared types for forum, likes, follows, and public user profiles.
- Added `lucide-react` icon library and expanded Tailwind component layer (cards, buttons, inputs, chips).
- Implemented `AuthContext` with session restore, silent 401 refresh, and `ProtectedRoute` guard.
- Added domain API wrappers: `auth.ts`, `projects.ts`, `forum.ts`, `likes.ts`, `follows.ts`, `users.ts`.
- Built layout components (`Layout`, `Nav`, `Footer`) and reusable UI components (`Button`, `Card`, `Input`, `Select`, `Textarea`, `Pagination`, etc.).
- Implemented frontend pages:
  - Home, Login, Register, 404.
  - Projects (list, detail, create, edit) with filtering and pagination.
  - Forum (thread list, thread detail, create thread, nested replies).
  - Profile (own and public) with follow counts.
- Implemented `LikeButton` and `FollowButton` social components.
- Added backend `UsersController` with `GET /api/users/:id` for public profiles.
- Aligned paginated API responses (`projects`, `forum`) with the shared `PaginatedResponse<T>` shape (`data`, `totalPages`).
- Fixed `cookie-parser` import for Bun/SWC compatibility.
- Added Vitest unit tests for API domain modules and Playwright E2E tests for home, navigation, and auth flows.

### Verification (v0.04)
- `bun install` completes without errors.
- `bun run build:shared`, `bun run build:api`, `bun run build:web` all succeed.
- `bun run --cwd apps/api test` passes (3 suites, 11 tests).
- `bun run --cwd apps/web test` passes (3 suites, 13 tests).
- `bun run --cwd apps/web test:e2e` passes (home, navigation, auth register/login/logout).
- Manual checks:
  - Register/login/logout through the UI.
  - Create/edit/delete project.
  - Create thread and post nested replies.
  - Like a project/thread and follow a user.

## Current Progress Detail (v0.05)

### Completed
- Added shared marketplace types: `MarketListing`, `Inquiry`, enums for listing type/status and inquiry status.
- Implemented backend `MarketplaceModule`:
  - Entities `MarketListing` and `Inquiry` with optional `Project` relation and seller/sender authorization.
  - DTOs for creating/updating listings, querying listings, and creating/updating inquiries.
  - `MarketplaceService` with paginated listing search, listing detail with inquiry count, owner/admin/company edit/delete guards, and inquiry lifecycle management.
  - `MarketplaceController` with endpoints under `/api/marketplace` for listings and inquiries.
- Registered marketplace entities in `typeorm.config.ts`, imported `MarketplaceModule` in `AppModule`, and expanded `SeedService` with demo marketplace listings.
- Added frontend marketplace support:
  - Domain API wrapper and Zod validation schemas in `apps/web/src/lib/marketplace.ts` and `validation.ts`.
  - Pages: Marketplace list, Listing detail, Create listing, Edit listing, My Inquiries.
  - Components: `ListingCard`, `InquiryRow`.
  - Updated `App.tsx` routes and `Nav.tsx` with a Marketplace link.
- Added API unit tests for `MarketplaceService` and a Vitest validation test for listing/inquiry schemas.
- Added Playwright E2E test covering listing creation by a seller and inquiry submission by a second buyer, plus navigation assertions for the Marketplace link.
- Fixed a circular entity dependency between `MarketListing` and `Inquiry` by replacing the bidirectional relation with a manual inquiry count query.
- Updated the frontend API client default base URL to `/api` so dev and E2E requests use the Vite proxy and avoid cross-origin issues.
- Configured Playwright `webServer` as an ordered array (API health check first, then Vite dev server) for reliable E2E startup.

### Verification (v0.05)
- `bun install` completes without errors.
- `bun run build:shared`, `bun run build:api`, `bun run build:web` all succeed.
- `bun run --cwd apps/api test` passes (4 suites, 19 tests).
- `bun run --cwd apps/web test` passes (4 suites, 18 tests).
- `bun run --cwd apps/web test:e2e` passes (home, navigation, auth, and marketplace listing/inquiry flow).
- Manual checks:
  - Create a marketplace listing as a seller.
  - View listing detail with seller info, price, and inquiry count.
  - Send an inquiry as another user and view it under My Inquiries.
  - Seller can update inquiry status and edit/delete their own listings.

## Current Progress Detail (v0.06)

### Completed
- Added `multer` for multipart uploads and created `UploadsModule` with `POST /api/uploads` endpoint (JWT required).
- Configured upload storage under `uploads/` with UUID filenames, file type whitelist (images, archives, PDFs), and 50 MB size limit.
- Added `ProjectFile` entity and registered it in TypeORM; linked files to projects with cascade delete.
- Created `ProjectFilesService` and `ProjectFilesController` with endpoints:
  - `GET /api/projects/:id/files` (public)
  - `POST /api/projects/:id/files` (owner/admin/company)
  - `DELETE /api/projects/:id/files/:fileId` (owner/admin/company)
- Updated `ProjectsService` to load `files` in project detail and delete physical files when a project is removed.
- Updated shared `ProjectFile` type and added optional `files` array to `Project`.
- Frontend:
  - Added `uploads.ts` API wrapper.
  - Added reusable `FileInput` component with upload state, error display, and image preview.
  - Replaced the `thumbnailUrl` text field in `ProjectForm` with thumbnail upload.
  - Added `ProjectFilesManager` component on the edit page for uploading/removing project files with optional version labels.
  - Added a Downloads section to `ProjectDetailPage` showing file cards with size, version, and download links.
- Added API unit tests for `ProjectFilesService`, a Vitest module test for `uploads.ts`, and a Playwright E2E test for project thumbnail + file upload flow.

### Verification (v0.06)
- `bun install` completes without errors.
- `bun run build:shared`, `bun run build:api`, `bun run build:web` all succeed.
- `bun run --cwd apps/api test` passes (5 suites, 25 tests).
- `bun run --cwd apps/web test` passes (5 suites, 19 tests).
- `bun run --cwd apps/web test:e2e` passes (home, navigation, auth, marketplace, and project upload flows).
- Manual checks:
  - Create a project with an uploaded thumbnail; detail page displays the image.
  - Edit the project to upload a ZIP file; detail page shows Downloads with the file.
  - Delete the project; associated files are removed from `uploads/`.

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
