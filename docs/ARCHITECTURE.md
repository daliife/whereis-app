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

| Regla            | Detall                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| Config           | `next.config.js` → `output: "export"`, `trailingSlash: true`                       |
| Imatges          | `images.unoptimized: true`                                                         |
| Base path        | `NEXT_PUBLIC_BASE_PATH` per GitHub Pages en subpath                                |
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

Importar des de `inventory` o `fuse-search` segons calgui.

---

## Cerca

- **Debounce:** 200 ms via `lib/useDebouncedValue.ts` (home, search, space)
- **Threshold Fuse:** `0.35` a `fuse-search.ts`
- **Index:** es construeix una vegada al carregar el mòdul

---

## Routing i estat URL

| URL                         | Estat                                                       |
| --------------------------- | ----------------------------------------------------------- |
| `/search?q=…`               | Query global; `SearchResults` fa `router.replace` debounced |
| `/space/[id]?highlight=Nom` | Destaca objecte i secció al plànol; scroll a item           |
| Canvi de secció al plànol   | `onSectionSelect` elimina `?highlight=` si cal              |

---

## Code splitting

Imports dinàmics (`ssr: false`):

- `LocateItemSheet`
- `AboutSheet`
- `QRCode` (qrcode.react)

Redueix el JS inicial de la home.

---

## PWA / offline

- `scripts/generate-sw.mjs` → `out/sw.js` (precache + offline pages)
- `components/ServiceWorkerRegistration.tsx` — registre al client (prod only; dev unregisters stale workers)
- `app/manifest.ts` — manifest web

---

## i18n i tema

| Concern      | Fitxer                         | Persistència                    |
| ------------ | ------------------------------ | ------------------------------- |
| Locale       | `lib/i18n.tsx`                 | `localStorage` `stashly-locale` |
| Theme        | `lib/theme.tsx`                | `localStorage` `stashly-theme`  |
| Anti-flicker | `app/layout.tsx` inline script | Abans del primer paint          |

---

## CI / desplegament

Metodologia: **validar en PR**, **desplegar només quan passa `pnpm check`**, lògica de deploy compartida via composite action (no apareix com a workflow a la UI).

| Nom a Actions                 | Fitxer              | Quan s'executa                  |
| ----------------------------- | ------------------- | ------------------------------- |
| **CI · checks (PR)**          | `ci.yml`            | Pull requests                   |
| **Deploy · automatic (main)** | `deploy-main.yml`   | Push a `main`                   |
| **Deploy · manual (branch)**  | `deploy-manual.yml` | Manual (Actions → triar branca) |

Lògica compartida: `.github/actions/deploy-pages/` (composite action).

### CI · checks (PR)

```bash
pnpm check
# validate:data → test → lint → typecheck → format:check → build (+ bundle budget)
```

- Permisos mínims (`contents: read`)
- `concurrency`: cancel·la execucions antigues del mateix PR

### Deploy · automatic (main)

Push a `main` → checkout → `pnpm check` → publica `out/` a `gh-pages`.

### Deploy · manual (branch)

1. **Actions** → **Deploy · manual (branch)** → **Run workflow**
2. Indica la branca (p. ex. `main`, `feature/xyz`)
3. Mateix pipeline que producció

`concurrency` compartit (`github-pages-deploy`): no es solapen dos desplegaments.

### `pages-build-deployment` a GitHub

Si encara apareix, és el workflow intern de GitHub Pages. A **Settings → Pages**, configura **Source: Deploy from a branch → `gh-pages`**, no «GitHub Actions» com a font de build.

---

## Accessibilitat

- `lib/useDialogA11y.ts` — focus trap i Escape en modals
- `components/SearchStatus.tsx` — `aria-live` per resultats de cerca
- `components/SkipLink.tsx` — enllaç «salta al contingut»
- SearchBar amb `<label>` sr-only
