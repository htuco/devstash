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
