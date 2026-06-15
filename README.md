# Stashly — Storage Organizer App

Mobile-first static web app that helps find where household items are stored. Scan a QR code on a physical storage unit → the app opens showing that unit's contents with a local search bar.

**Live URL:** deployed to GitHub Pages via `gh-pages` branch.

---

## Stack

| Layer           | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | Next.js 14 · App Router · TypeScript                |
| Styling         | Tailwind CSS (`darkMode: "class"`)                  |
| Search          | fuse.js — fuzzy, client-side, no backend            |
| QR codes        | qrcode.react                                        |
| Package manager | **pnpm** (enforced via `packageManager` + `.npmrc`) |
| Deployment      | Static export (`output: 'export'`) → GitHub Pages   |

---

## Quick start

```bash
corepack enable      # once — activates pnpm via Corepack
pnpm install
pnpm dev             # http://localhost:3000
```

Build + preview static output:

```bash
pnpm build           # outputs to /out
```

---

## Project structure

```
app/
  layout.tsx           # Root layout — ThemeProvider + I18nProvider + anti-flicker script
  globals.css          # Tailwind base + dark body override
  page.tsx             # Home: sticky search bar + space cards grid
  space/[id]/
    page.tsx           # Server wrapper — generateStaticParams
    SpaceClient.tsx    # Client: list/plan toggle, local search, item highlight
  search/
    page.tsx           # Suspense boundary (required for useSearchParams in static export)
    SearchResults.tsx  # Client: global search with URL sync
  qr/
    page.tsx           # QR code generator + print button

components/
  SearchBar.tsx        # Controlled input with clear button
  ItemCard.tsx         # Item name + Space › Section breadcrumb, highlight state
  SpaceFloorPlan.tsx   # Visual plan view: accordion of shelves/drawers
  LocaleSwitcher.tsx   # CA / ES / EN buttons
  ThemeToggle.tsx      # Light/dark toggle (moon/sun icon)

lib/
  search.ts            # Fuse.js index builder + searchAll / searchWithinSpace / getSpace / getAllSpaces
  i18n.tsx             # I18nProvider + useI18n() hook — persists locale to localStorage
  theme.tsx            # ThemeProvider + useTheme() hook — persists theme to localStorage
  translations/
    ca.ts              # Català (default UI language)
    es.ts              # Castellà
    en.ts              # English

data/
  inventory.json       # Single source of truth for all spaces, sections and items

.github/workflows/
  deploy.yml           # pnpm install → next build → peaceiris/actions-gh-pages → gh-pages branch
```

---

## Data model

All inventory lives in `data/inventory.json`. **The content language is fixed (Catalan) — translations only cover UI chrome.**

```jsonc
{
  "spaces": [
    {
      "id": "armari-soterrani", // used in URL: /space/armari-soterrani
      "name": "Armari soterrani",
      "type": "cabinet", // cabinet | drawers | shelf
      "sections": [
        {
          "id": "prestatge-a",
          "name": "Prestatge A",
          "items": [
            { "name": "Barbacoa", "tags": ["barbacoa", "graella", "cuina"] },
          ],
        },
      ],
    },
  ],
}
```

To **add a new space**: add an entry to `spaces[]` and rerun `pnpm build` — `generateStaticParams` picks it up automatically.

To **add items**: edit the relevant `sections[].items[]` array.

---

## Routes

| Route         | Description                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `/`           | Home — sticky search bar + space cards                                                                  |
| `/space/[id]` | Space detail — QR code landing page. Supports `?highlight=Item%20name` to scroll to + highlight an item |
| `/search?q=…` | Global fuzzy search across all spaces                                                                   |
| `/qr`         | Printable QR codes for all spaces                                                                       |

---

## i18n

- Default locale: **ca** (Catalan)
- Supported: `ca`, `es`, `en`
- Locale stored in `localStorage` key `stashly-locale`
- To add a new locale: copy `lib/translations/en.ts`, fill in strings, add the key to `lib/i18n.tsx`

**Inventory content is not translated** — item names and tags are fixed in Catalan.

---

## Dark / light mode

- Toggled by `ThemeToggle` component (moon/sun icon in home header)
- Theme stored in `localStorage` key `stashly-theme`
- Anti-flicker inline script in `app/layout.tsx` applies the `dark` class before first paint
- Implemented via Tailwind `darkMode: "class"`

---

## Deployment

Push to `main` → GitHub Actions builds and deploys to `gh-pages` branch automatically.

If the site lives at `https://username.github.io/whereis-app/` (not a root/custom domain), set the environment variable in `.github/workflows/deploy.yml`:

```yaml
NEXT_PUBLIC_BASE_PATH: "/whereis-app"
```

Go to **Settings → Pages → Source: gh-pages branch** after the first deploy.
