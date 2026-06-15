# AI Agent context — Stashly

This file gives AI coding assistants (GitHub Copilot, Claude, etc.) the essential context to work on this codebase without re-reading every file.

---

## What the app does

Stashly is a **static mobile-first web app** that helps find where household items are stored. Primary use case: scan a QR sticker on a physical cabinet/drawer → app opens showing that unit's contents → user searches by keyword.

---

## Critical conventions

### Package manager — pnpm only
- Run `pnpm install`, `pnpm dev`, `pnpm build`
- Never suggest `npm` or `yarn` — blocked by `.npmrc` `engine-strict=true`
- `packageManager` field in `package.json` pins `pnpm@9.15.0`

### Static export
- `next.config.js` has `output: 'export'` and `trailingSlash: true`
- No server-side code, no API routes, no `getServerSideProps`
- Pages using `useSearchParams` must be wrapped in `<Suspense>` — see `app/search/page.tsx`
- Dynamic routes need `generateStaticParams` — see `app/space/[id]/page.tsx`

### Dark mode
- Tailwind `darkMode: "class"` — toggle the `dark` class on `<html>`
- `lib/theme.tsx` exports `ThemeProvider` and `useTheme()` — reads initial state from `document.documentElement.classList` (set by anti-flicker inline script in `app/layout.tsx`)
- Always add `dark:` variants when touching UI components

### i18n
- `lib/i18n.tsx` exports `I18nProvider` and `useI18n()` — returns `{ t, locale, setLocale }`
- Translation shape is defined in `lib/translations/ca.ts` (Catalan, the source of truth)
- `es.ts` and `en.ts` are typed as `typeof ca` — adding a key to `ca.ts` requires adding it to all three files
- **Inventory content (item names, tags) is NOT translated** — it stays in Catalan regardless of locale

### Data
- `data/inventory.json` is the **only** data source — no database, no API
- Schema: `Space → Section → Item[]`; each item has `name: string` and `tags: string[]`
- `lib/search.ts` builds the Fuse.js index at module load time and exports `searchAll`, `searchWithinSpace`, `getSpace`, `getAllSpaces`
- Adding a space requires only editing `inventory.json` — routing is automatic via `generateStaticParams`

---

## Component responsibilities

| Component | What it does |
|---|---|
| `SearchBar` | Controlled input + clear button. `autoFocus` prop for first-load focus |
| `ItemCard` | Shows `itemName` + `Space › Section` breadcrumb. `highlighted` prop = amber style |
| `SpaceFloorPlan` | Accordion representing physical shelves/drawers. `highlightItemName` auto-expands the right section |
| `LocaleSwitcher` | CA / ES / EN pill buttons, reads/writes via `useI18n()` |
| `ThemeToggle` | Moon/sun icon button, reads/writes via `useTheme()` |

---

## Page structure

| File | Type | Notes |
|---|---|---|
| `app/layout.tsx` | Server | Wraps with `ThemeProvider` + `I18nProvider`. Contains anti-flicker `<script>` |
| `app/page.tsx` | Client | Home. Inline top-5 results on typing; space cards otherwise |
| `app/space/[id]/page.tsx` | Server | `generateStaticParams` + `<Suspense>` boundary only |
| `app/space/[id]/SpaceClient.tsx` | Client | List/plan toggle, local search, `?highlight=` scroll |
| `app/search/page.tsx` | Server | `<Suspense>` boundary only (required for `useSearchParams` in static export) |
| `app/search/SearchResults.tsx` | Client | Global search, URL sync via `router.replace` |
| `app/qr/page.tsx` | Client | QR codes with `window.location.origin` (hydration-safe) |

---

## Common tasks

### Add a new storage space
1. Add an entry to `data/inventory.json` `spaces[]` with a unique `id`, `name`, `type` (`cabinet` | `drawers` | `shelf`), and `sections[]`
2. No code changes needed — routing and QR generation are automatic

### Add a new UI string
1. Add the key + Catalan value to `lib/translations/ca.ts`
2. Add the same key to `lib/translations/es.ts` and `lib/translations/en.ts` (both typed as `typeof ca`, so TypeScript will error until all three are updated)

### Add a new locale
1. Create `lib/translations/xx.ts` following the shape of `ca.ts`
2. Import and add to the `dict` map in `lib/i18n.tsx`
3. Add the locale code to `LOCALES` and a label to `LOCALE_LABELS` in `lib/i18n.tsx`

### GitHub Pages base path
If deploying to `username.github.io/whereis-app/` (not a custom domain), set `NEXT_PUBLIC_BASE_PATH=/whereis-app` in `.github/workflows/deploy.yml` and in any local `.env.local`.

---

## What NOT to do
- Do not add server components that use `useSearchParams` directly — wrap in `<Suspense>` with a Client component
- Do not call `window` or `document` at module scope in any file — use `useEffect` or `typeof window !== 'undefined'` guards
- Do not use `npm` or `yarn` — pnpm only
- Do not add API routes — this is a fully static export
- Do not translate `data/inventory.json` content — item names are fixed in Catalan
