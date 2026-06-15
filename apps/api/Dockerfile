FROM oven/bun:1-slim AS base
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3001
CMD ["bun", "run", "start"]
