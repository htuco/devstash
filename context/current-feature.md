# Current Feature: Pro badge on Pro-only type links

## Status

In Progress

## Goals

- Mark Pro-only item types in the sidebar's Types list with a small `PRO` badge so free users immediately see which features require an upgrade.
- Per `context/project-overview.md`, file uploads (Files), images (Images), and custom (user-created) item types are Pro features. Snippets, Prompts, Commands, Notes, and Links remain free.
- Badge placement: between the type label and the count in the expanded sidebar; hidden when the sidebar is collapsed (icons-only mode already removes the label).
- Visual style consistent with the existing user `ProBadge` (gold gradient pill, uppercase, small) but sized down to suit an inline row.
- Works for both Pro and non-Pro users — the badge marks the *feature*, not the user's status. (Optionally suppress for Pro users since they already have access; decide during implementation.)

## Notes

- Source of truth for which types are Pro-only: derive from type name for system types (`file`, `image` → Pro) and from `ItemType.isSystem === false` for custom types. No schema change needed; `SidebarItemType` may need to expose `isSystem` if it doesn't already.
- Check `src/lib/db/items.ts#getItemTypeCounts` to confirm what fields `SidebarItemType` carries today, and extend if necessary.
- The reusable `ProBadge` is currently defined inline in `Sidebar.tsx`. Either parameterize its size or extract a smaller variant for inline use.
- No routing or data-layer changes expected — purely a sidebar render tweak (+ possibly one extra field on `SidebarItemType`).

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
- **Sidebar PRO badge** — dashboard layout now selects `isPro` for the demo user and passes it to `Sidebar`. `Sidebar` user prop gained `isPro: boolean`; when true, a gold gradient `PRO` pill renders next to the user name and a small amber dot decorates the avatar in collapsed mode so the Pro state stays visible. Non-Pro users see a subtle `Upgrade` chip linking to `/upgrade` instead. Flipped the seed demo user (`demo@devstash.io`) to `isPro: true` so the badge is visible in the demo by default. No schema change required — `User.isPro` already existed.
