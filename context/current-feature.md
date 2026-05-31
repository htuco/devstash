# Current Feature

<!-- Feature Name -->

Code audit fixes (round 1)

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

Address the High and Medium severity findings from the code-scanner audit, plus a few high-value Low items. Each fix should be minimal and preserve existing behavior unless explicitly noted.

### High

1. **Bound the nested items load in collection helpers** — `getRecentCollections` and `getSidebarCollections` in `src/lib/db/collections.ts` currently `include: { items }` with no `take` and aggregate type counts in memory. Replace with a Prisma `groupBy` on `item` (`by: ['collectionId', 'typeId']`, filtered to the user's collections) and join the counts back to the collection rows. Keep the existing return shape (`DashboardCollection` / `SidebarCollection` with `typeBreakdown` and `primaryTypeName`).

2. **Deduplicate the demo user lookup** — `src/app/dashboard/layout.tsx` and `src/app/dashboard/page.tsx` both call `prisma.user.findUnique({ where: { email: DEMO_EMAIL } })` in the same render. Extract a `getDemoUser()` helper in `src/lib/server/demo-user.ts` wrapped in React's `cache()` so both consumers share one DB round-trip. Move `DEMO_EMAIL` into that file and import from both call sites (also closes the Low-severity duplicate-constant finding).

3. **Use collection IDs in URLs, not name slugs** — Replace `` `/collections/${name.toLowerCase().replace(/\s+/g, '-')}` `` with `` `/collections/${collection.id}` `` in `src/components/dashboard/Sidebar.tsx` (favorites + recents) and `src/components/dashboard/RecentCollections.tsx`. No route exists yet, so this is a pre-emptive fix.

### Medium

4. **Cap `getPinnedItems`** — Add a `limit = 20` parameter to `getPinnedItems` in `src/lib/db/items.ts` and pass it through to `take`. Dashboard call site stays on the default.

5. **Guard `DATABASE_URL` in `src/lib/prisma.ts`** — Throw an explicit `Error("DATABASE_URL environment variable is not set")` before constructing `PrismaPg` so missing env fails fast with a clear message.

6. **Deduplicate `iconMap` / `iconColorMap`** — Export both maps from `src/components/dashboard/TypeIcon.tsx` and import them in `src/components/dashboard/Sidebar.tsx` instead of redeclaring. Keep behavior identical.

7. **Parallelize system-type seed upserts** — Replace the sequential `for...of await` loop in `prisma/seed.ts` with `Promise.all(SYSTEM_TYPES.map(...))`. Preserves the find-then-create logic (needed because `userId` is nullable on the unique key).

### Low (bundled with the above)

8. **Reorder `isProType` boolean** — In `src/components/dashboard/Sidebar.tsx`, write `PRO_SYSTEM_TYPES.has(type.name) || !type.isSystem` for clarity. No behavior change.

9. **Remove dead `typeof window` guard in `TopBar`** — `src/components/dashboard/TopBar.tsx` is a client component; drop the SSR check.

10. **Use `cn()` for icon classes in `StatsCards`** — Replace the template literal at `src/components/dashboard/StatsCards.tsx:62` with `cn("size-6", stat.iconClass)`.

Skipping for now: explicit return types on `getItemStats` / `getCollectionStats` (Low, low payoff), and the misleading `ChevronDown` in `SectionLabel` (needs a UX call — collapse the sections, or just remove the chevron?).

## Notes

<!-- Any extra notes -->

- All changes are in-place; no schema migrations and no new dependencies.
- After implementation: run `npm run build` and verify the dashboard renders correctly in the browser before committing.
- Branch: `fix/audit-round-1`.

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
- **Pro badge on Pro-only type links** — Pro-gated item types now render a small gold `PRO` pill in the sidebar between the label and the count. Pro types are derived as system types `file` and `image` plus any non-system (user-created) types via a new `PRO_SYSTEM_TYPES` set and `isProType()` helper in `Sidebar.tsx`. The inline badge is hidden in collapsed mode alongside the label. `ProBadge` was parameterized with `size: "xs" | "sm"` and a `className` passthrough so the inline variant fits cleanly on one row without redefining styles. `SidebarItemType` (and `getItemTypeCounts`) now expose `isSystem` so the sidebar can identify custom types. Badge is shown to all users (Pro and free) since it marks the feature itself. No schema change.
