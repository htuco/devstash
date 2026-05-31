# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

Completed

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility (`src/auth.config.ts` + `src/auth.ts`)
- Add GitHub OAuth provider
- Create NextAuth API route handler at `src/app/api/auth/[...nextauth]/route.ts`
- Create Next.js 16 proxy at `src/proxy.ts` protecting `/dashboard/*` routes
- Redirect unauthenticated users to NextAuth's default sign-in page
- Extend Session type with `user.id` via `src/types/next-auth.d.ts`
- Verify flow: `/dashboard` → sign-in → GitHub OAuth → back to `/dashboard`

## Notes

**Key gotchas**:
- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` — use NextAuth's default page
- Verify newest config/conventions with Context7 before implementing

**Env vars required**:
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`

**Files to create**:
1. `src/auth.config.ts` — Edge-compatible config (providers only, no adapter)
2. `src/auth.ts` — Full config with Prisma adapter and JWT strategy
3. `src/app/api/auth/[...nextauth]/route.ts` — Export handlers from `auth.ts`
4. `src/proxy.ts` — Route protection with redirect logic
5. `src/types/next-auth.d.ts` — Extend Session type with `user.id`

**Testing flow**:
1. Visit `/dashboard` → expect redirect to sign-in
2. Click "Sign in with GitHub"
3. Verify redirect back to `/dashboard` after auth

**References**:
- Edge compatibility: https://authjs.dev/getting-started/installation#edge-compatibility
- Prisma adapter: https://authjs.dev/getting-started/adapters/prisma

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
- **Code audit fixes (round 1)** — addressed High/Medium findings from the code-scanner audit. Replaced unbounded nested item loads in `getRecentCollections` and `getSidebarCollections` with a `prisma.item.groupBy(['collectionId','typeId'])` query joined to type names; collection rows now use `_count` for item totals. Added `src/lib/server/demo-user.ts` with a `React.cache()`-wrapped `getDemoUser()` so the dashboard layout and page share one DB round-trip (also unifies `DEMO_EMAIL`). Switched collection URLs in `Sidebar.tsx` and `RecentCollections.tsx` from name-derived slugs to `collection.id`. `getPinnedItems` now takes a `limit = 20` cap; `src/lib/prisma.ts` throws if `DATABASE_URL` is missing. Exported `iconMap` / `iconColorMap` from `TypeIcon.tsx` and imported them in `Sidebar.tsx` to drop duplication. Parallelized system-type upserts in `prisma/seed.ts`. Reordered `isProType` for clarity, removed dead `typeof window` guard in `TopBar`, and switched `StatsCards` icon class to `cn()`.
- **Auth Phase 1 — NextAuth v5 + GitHub** — installed `next-auth@beta` and `@auth/prisma-adapter`. Split config for edge compatibility: `src/auth.config.ts` (GitHub provider only, edge-safe) and `src/auth.ts` (Prisma adapter + `session.strategy: "jwt"` + jwt/session callbacks that surface `user.id`). Route handler at `src/app/api/auth/[...nextauth]/route.ts` re-exports `{ GET, POST }` from `handlers`. `src/proxy.ts` lazily initializes NextAuth with `auth.config` only and wraps `auth(...)` as a named `proxy` export; unauthenticated requests to `/dashboard/*` redirect to `/api/auth/signin?callbackUrl=...`. Matcher excludes `api`, `_next/static`, `_next/image`, `favicon.ico`. Session type augmented with `user.id` via `src/types/next-auth.d.ts`. `.env.example` updated with `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` placeholders. No custom sign-in page — uses NextAuth default. Verified: `curl /dashboard` → `302 /api/auth/signin?callbackUrl=%2Fdashboard`; sign-in page renders "Sign in with GitHub"; `npm run build` passes.
