# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** — bootstrapped with `create-next-app` (Next 16, React 19, TypeScript, Tailwind v4, ESLint).
- **Project scaffold & boilerplate cleanup** — stripped default starter content, set up project structure (`src/app`, `src/components`, `src/lib`), added context docs (project overview, coding standards, AI interaction).
- **Mock data** — added `src/lib/mock-data.ts` with `User`, `ItemType`, `Collection`, `Item` types and seed data for use until the DB is wired up.
- **Dashboard UI - Phase 1** — shadcn/ui initialized (base-nova style, neutral palette), dark mode by default, `/dashboard` route with layout + top bar (search + New item button), placeholder sidebar/main regions.
- **Dashboard UI - Phase 2** — collapsible sidebar with type links (`/items/[type]`) using color-coded icons, favorite + all-collections sections, user avatar footer, drawer toggle in top bar, mobile drawer with overlay.
- **Dashboard UI - Phase 3** — main content area: 4 stats cards (items, collections, favorite items, favorite collections), Collections grid with type-icon previews, Pinned items list, Recent items list (top 10 by updated date). Constrained `max-w-5xl` centered layout with generous side padding.
- **Prisma + Neon PostgreSQL setup** — Prisma 7.8 with `prisma-client` generator outputting to `src/generated/prisma`, `prisma.config.ts` at root for datasource/migrations, `PrismaPg` driver adapter, HMR-safe singleton at `src/lib/prisma.ts`. Initial schema with NextAuth models (Account, Session, VerificationToken) and core models (User, Item, ItemType, Collection, Tag, ItemTag) with indexes and cascade rules. Initial migration applied to Neon dev branch.
- **Seed data** — `prisma/seed.ts` populates demo user (`demo@devstash.io`, bcryptjs-hashed password), 7 system item types, and 5 collections with 18 items (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources). Idempotent: user/types upsert; collections + items wiped per user then recreated. Wired via `migrations.seed` in `prisma.config.ts`. Added `scripts/test-db.ts` for inspecting DB state. Scripts: `npm run db:seed`, `npm run db:test`.
