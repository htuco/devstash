# Current Feature: Add PRO Badge to Sidebar

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Display a visible "PRO" badge in the sidebar to indicate Pro subscription status
- Badge should reflect the user's `isPro` field from the `User` model
- Show the badge near the user avatar/footer area of the sidebar (where the user identity already lives)
- For non-Pro users, show an upgrade affordance (or hide the badge entirely — decide during implementation)
- Match the existing sidebar visual style (dark mode first, minimal, developer-friendly)

## Notes

<!-- Any extra notes -->

- The `User` model already has an `isPro: Boolean @default(false)` field — no schema change needed
- Sidebar currently is a server component receiving props from the dashboard layout (see "Stats & Sidebar — DB wiring" history entry)
- Demo user (`demo@devstash.io`) currently has `isPro: false` from seed — may need to flip in seed or via script to visually verify the Pro state
- Use shadcn `Badge` component if available, otherwise a small Tailwind-styled pill

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
- **Dashboard Collections — DB wiring** — replaced mock collection data in the dashboard main area with live Neon/Prisma data. Added `src/lib/db/collections.ts` (`getRecentCollections`, `getCollectionStats`) that returns a per-collection type breakdown sorted by count. `RecentCollections` card now takes a `DashboardCollection`, applies a left-border color derived from the most-used type, and renders an icon for each type present. `TypeIcon` extended with `getTypeBorderColor` / `getIconNameForType` helpers and a `link` alias for the existing `url` color. Dashboard page is now an async server component that looks up the demo user by email (auth not wired yet) and fetches collections + collection stats; items/pinned/recent remain on mock for now.
- **Dashboard Items — DB wiring** — replaced remaining mock item data in the dashboard with live Neon/Prisma data. Added `src/lib/db/items.ts` (`getPinnedItems`, `getRecentItems`, `getItemStats`) returning a `DashboardItem` shape with type name and flattened tag names. `ItemRow` now takes a `DashboardItem`, derives its icon from the type name via `getIconNameForType`, and adds a left-border accent matching the type color (consistent with collection cards). Dashboard page fetches pinned, recent, and item stats in parallel with collection data; `StatsCards` now uses live item counts. The Pinned section is hidden when there are no pinned items.
- **Stats & Sidebar — DB wiring** — sidebar now reads from Neon/Prisma instead of `mock-data`. Added `getItemTypeCounts(userId)` in `src/lib/db/items.ts` (returns system + user types with per-user item counts, sorted by the fixed system order: snippet, prompt, command, note, file, image, link) and `getSidebarCollections(userId)` in `src/lib/db/collections.ts` (returns `{ favorites, recents }`, each entry carrying `primaryTypeName`). Dashboard layout converted to an async server component that fetches sidebar data in parallel and passes it to `Sidebar`. `Sidebar` now takes props; type links go to `/items/[name]` with live counts; favorite collections keep the star, recent collections show a colored dot via new `getTypeBgColor` helper in `TypeIcon.tsx`. Added a "View all collections" link below the lists pointing to `/collections`. Seed now marks "React Patterns" and "AI Workflows" as `isFavorite: true` so the Favorites group has data.
