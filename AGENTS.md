# AI Agent context — Stashly

Essential context for AI coding assistants. For deeper docs see `docs/` (especially `docs/AI-WORKFLOW.md`).

---

## What the app does

Stashly is a **static mobile-first web app** to find household items. Primary flow: scan QR on a cabinet/drawer → open space → search by keyword. Secondary: browse spaces from home.

**Product name:** Stashly (not Guarda'm or other variants).

---

## Critical conventions

### Package manager — pnpm only

- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm validate:data`
- Never `npm` or `yarn` — blocked by `.npmrc` `engine-strict=true`

### Lint & format

- **ESLint:** `.eslintrc.cjs` → `next/core-web-vitals`, `next/typescript`, `eslint-config-prettier`; Vitest rules on `*.{test,spec}.{ts,tsx}`
- **Prettier:** `.prettierrc` + `prettier-plugin-tailwindcss` (class order)
- **Do not** use `eslint-plugin-prettier` — format runs via `pnpm format` / `pnpm format:check`, separate from lint
- Before deploy: `pnpm check`

### Static export

- `next.config.js`: `output: 'export'`, `trailingSlash: true`
- No API routes, no SSR data fetching, no `getServerSideProps`
- `useSearchParams` only inside Client components wrapped in `<Suspense>` — see `app/search/page.tsx`, `app/space/[id]/page.tsx`
- Dynamic routes need `generateStaticParams` — see `app/space/[id]/page.tsx`
- No `window` / `document` at module scope — use `useEffect` or guards

### Dark mode

- Tailwind `darkMode: "class"` on `<html>`
- `lib/theme.tsx` + anti-flicker script in `app/layout.tsx`
- Always add `dark:` variants for UI changes

### i18n

- `lib/translations/ca.ts` is the source of truth; `es.ts` and `en.ts` are `typeof ca`
- Add keys to **all three** files
- **Do not translate** `data/inventory.json` item names/tags

### Data & search

- `data/inventory.json` — single source of truth
- `lib/inventory.ts` — types, `getSpace`, `getAllSpaces`, `buildSearchIndex`
- `lib/fuse-search.ts` — single Fuse instance; `searchAll`, `searchWithinSpace`

---

## Key components

| Component               | Role                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `SearchBar`             | Controlled search input; class `search-field`                                                    |
| `ItemCard`              | Result card; `card-interactive` / `card-highlighted`                                             |
| `SpaceFloorPlan`        | Interactive shelf/drawer diagram; props: `planOnly`, `compact`, `interactive`, `onSectionSelect` |
| `LocateItemSheet`       | Modal preview on home search tap (dynamic import)                                                |
| `AboutSheet`            | How-it-works modal (dynamic import)                                                              |
| `SettingsMenu`          | Theme + locale; portal-based panel                                                               |
| `SpaceIcon` / `AppIcon` | Type icons and app logo                                                                          |

Removed / do not recreate: `ThemeToggle.tsx`, `LocaleSwitcher.tsx` (logic lives in `SettingsMenu`).

---

## Page map

| File                             | Notes                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `app/page.tsx`                   | Home: search → results → `LocateItemSheet`; browse spaces grid                |
| `app/space/[id]/SpaceClient.tsx` | Sticky `page-toolbar`, local search, `SpaceFloorPlan`, `?highlight=`          |
| `app/search/SearchResults.tsx`   | Global search, debounced URL sync                                             |
| `app/qr/page.tsx`                | QR grid + print                                                               |
| `app/globals.css`                | Shared classes: `btn-header-action`, `card-*`, `search-field`, `page-toolbar` |

---

## UI principles (current)

- **Minimal:** no nested “card around card” on floor plan; sections are tappable rows
- **Header actions:** `btn-header-action` — neutral text, amber icons only
- **Floor plan:** cabinet = shelves + feet; drawers = stack + optional frame in compact preview
- **Single active section** on plan; changing section clears `?highlight=` via `onSectionSelect`

---

## Common tasks

### New space

1. Add entry to `data/inventory.json` (`id`, `name`, `type`, `sections[]`)
2. Run `pnpm validate:data` and `pnpm build`

### New UI string

1. `lib/translations/ca.ts` → `es.ts` → `en.ts`

### GitHub Pages base path

Set `NEXT_PUBLIC_BASE_PATH=/whereis-app` in deploy workflow and `.env.local` when not using a custom domain.

---

## What NOT to do

- No API routes or server-only features incompatible with static export
- No translating inventory content
- No npm/yarn
- No heavy visual nesting on search or floor plan without user request
- Do not commit unless explicitly asked
