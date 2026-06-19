# Arquitectura

Visió tècnica de Stashly per entendre límits i fluxos abans de canviar codi.

---

## Diagrama de flux

```mermaid
flowchart TD
  subgraph static [Build time]
    INV[data/inventory.json]
    BUILD[next build + generateStaticParams]
    OUT[/out HTML/JS/CSS/]
    INV --> BUILD --> OUT
  end

  subgraph runtime [Browser]
    HOME[Home /]
    SEARCH[/search]
    SPACE[/space/id]
    QR[/qr]
    FUSE[fuse-search.ts index]
    INV --> FUSE
    HOME --> FUSE
    SEARCH --> FUSE
    SPACE --> FUSE
  end
```

Tot passa al client després del primer load. No hi ha backend propi.

---

## Static export (Next.js)

| Regla | Detall |
| ----- | ------ |
| Config | `next.config.js` → `output: "export"`, `trailingSlash: true` |
| Imatges | `images.unoptimized: true` |
| Base path | `NEXT_PUBLIC_BASE_PATH` per GitHub Pages en subpath |
| Rutes dinàmiques | `app/space/[id]/page.tsx` exporta `generateStaticParams()` des de `getAllSpaces()` |

### Suspense obligatori

`useSearchParams()` provoca errors en export estàtic si s'usa directament en Server Components.

Patró:

```tsx
// page.tsx (server)
export default function Page() {
  return (
    <Suspense fallback={…}>
      <ClientComponent />
    </Suspense>
  );
}
```

Fitxers: `app/search/page.tsx`, `app/space/[id]/page.tsx`.

---

## Capa de dades

```
data/inventory.json
       ↓
lib/inventory.ts     → tipus, getSpace, getAllSpaces, buildSearchIndex
       ↓
lib/fuse-search.ts   → Fuse (keys: item.name, item.tags), searchAll, searchWithinSpace
       ↓
Components / pages
```

`lib/search.ts` només re-exporta — preferir importar des de `inventory` o `fuse-search` en codi nou.

---

## Cerca

- **Debounce:** 200 ms via `lib/useDebouncedValue.ts` (home, search, space)
- **Threshold Fuse:** `0.35` a `fuse-search.ts`
- **Index:** es construeix una vegada al carregar el mòdul

---

## Routing i estat URL

| URL | Estat |
| --- | ----- |
| `/search?q=…` | Query global; `SearchResults` fa `router.replace` debounced |
| `/space/[id]?highlight=Nom` | Destaca objecte i secció al plànol; scroll a item |
| Canvi de secció al plànol | `onSectionSelect` elimina `?highlight=` si cal |

---

## Code splitting

Imports dinàmics (`ssr: false`):

- `LocateItemSheet`
- `AboutSheet`
- `QRCode` (qrcode.react)

Redueix el JS inicial de la home.

---

## PWA / offline

- `public/sw.js` — cache d'assets
- `components/ServiceWorkerRegistration.tsx` — registre al client
- `app/manifest.ts` — manifest web

---

## i18n i tema

| Concern | Fitxer | Persistència |
| ------- | ------ | ------------ |
| Locale | `lib/i18n.tsx` | `localStorage` `stashly-locale` |
| Theme | `lib/theme.tsx` | `localStorage` `stashly-theme` |
| Anti-flicker | `app/layout.tsx` inline script | Abans del primer paint |

---

## CI / desplegament

`.github/workflows/deploy.yml`:

1. `pnpm install`
2. `pnpm build` → `out/`
3. Publica a `gh-pages` (peaceiris/actions-gh-pages o equivalent)

---

## Accessibilitat

- `lib/useDialogA11y.ts` — focus trap i Escape en modals
- `components/SearchStatus.tsx` — `aria-live` per resultats de cerca
- `components/SkipLink.tsx` — enllaç «salta al contingut»
- SearchBar amb `<label>` sr-only
