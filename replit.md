# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Applications

### ToolShare (artifacts/toolshare)
- Peer-to-peer tool rental marketplace
- Landing page, tool browsing, tool details, booking, renter/owner dashboards
- Frontend at: `/` (previewPath)
- Deep Blue (#1E3A8A), Teal (#14B8A6), Orange (#F59E0B) color scheme
- Rich Framer Motion animations throughout

### API Server (artifacts/api-server)
- Express 5 REST API at `/api`
- Endpoints: /tools, /bookings, /users, /stats
- Uses PostgreSQL with Drizzle ORM schema

## Database Schema
- `users` table: id, name, email, role (renter/owner), avatarUrl, location, bio, rating, reviewCount, createdAt
- `tools` table: id, ownerId, name, description, category, imageUrl, pricePerDay, pricePerHour, available, rating, reviewCount, location, createdAt
- `bookings` table: id, toolId, userId, startDate, endDate, totalDays, totalPrice, status (pending/approved/rejected/completed), message, createdAt

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Note on api-zod index
After running codegen, the `lib/api-zod/src/index.ts` is regenerated. If it includes references to `./generated/types` or `./generated/api.schemas` that don't exist, manually update it to only export `export * from "./generated/api";`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
