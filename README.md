# FlashDev Indie Game Forum

An integrated web forum for indie game design, development, sharing, advertising, and trading. This is a sub-project of the FlashDev platform and shares its architecture with the main project.

## Features (planned)

- Project showcase & discussion (Project Plaza / Forum)
- Development collaboration tools
- Advertising & promotion listings
- Project selling / source-code trading (Marketplace)
- Project hosting & demo distribution

## Tech Stack

- **Runtime / PM**: Bun 1.x workspaces
- **Frontend**: React 18 + TypeScript + Vite 5 + React Router v6 + Tailwind CSS v3
- **Backend**: NestJS 10 + TypeScript
- **Database**: PostgreSQL 16 + TypeORM
- **Auth**: JWT access token + httpOnly refresh cookie
- **Testing**: Jest (API) + Vitest (Web) + Playwright (E2E)
- **Containers**: Docker Compose

## Getting Started

```bash
# Install dependencies
bun install

# Start PostgreSQL
docker compose up -d db

# Copy environment variables
cp .env.example .env

# Build shared package
bun run build:shared

# Run dev servers
bun run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## Scripts

```bash
bun run dev:web      # Vite dev server
bun run dev:api      # NestJS dev server
bun run build:web    # Production web build
bun run build:api    # Production API build
bun run test         # Run all workspace tests
bun run db:up        # Start Postgres container
```

## Project Structure

```
flashdevgameweb/
├── apps/web/          # React frontend
├── apps/api/          # NestJS backend
├── packages/shared/   # Shared TypeScript types
├── docs/reference/    # Original flashdev-spa reference
├── docker-compose.yml
└── .env.example
```

## License

Proprietary — FlashDev.
