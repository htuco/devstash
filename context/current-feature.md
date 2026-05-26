# Current Feature

<!-- Feature Name -->

Dashboard UI - Phase 3

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

Phase 3 of 3 for the dashboard UI layout. Build out the main area to the right of the sidebar using mock data (`src/lib/mock-data.ts`) until the DB is wired up. Reference: `context/screenshots/dashboard-ui-main.png`.

- Main area to the right of the sidebar
- 4 stats cards at the top: total items, total collections, favorite items, favorite collections (not in screenshot)
- Recent collections
- Pinned items
- 10 recent items

## Notes

<!-- Any extra notes -->

- Spec: @context/features/dashboard-phase-3-spec.md
- Import mock data directly from `src/lib/mock-data.ts` for now
- Stats cards are an addition beyond the screenshot

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** — bootstrapped with `create-next-app` (Next 16, React 19, TypeScript, Tailwind v4, ESLint).
- **Project scaffold & boilerplate cleanup** — stripped default starter content, set up project structure (`src/app`, `src/components`, `src/lib`), added context docs (project overview, coding standards, AI interaction).
- **Mock data** — added `src/lib/mock-data.ts` with `User`, `ItemType`, `Collection`, `Item` types and seed data for use until the DB is wired up.
- **Dashboard UI - Phase 1** — shadcn/ui initialized (base-nova style, neutral palette), dark mode by default, `/dashboard` route with layout + top bar (search + New item button), placeholder sidebar/main regions.
- **Dashboard UI - Phase 2** — collapsible sidebar with type links (`/items/[type]`) using color-coded icons, favorite + all-collections sections, user avatar footer, drawer toggle in top bar, mobile drawer with overlay.
- **Dashboard UI - Phase 3** — main content area: 4 stats cards (items, collections, favorite items, favorite collections), Collections grid with type-icon previews, Pinned items list, Recent items list (top 10 by updated date). Constrained `max-w-5xl` centered layout with generous side padding.
