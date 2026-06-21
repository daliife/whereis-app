# Stashly

App web **mobile-first** i **100% estàtica** per trobar on tens guardades les coses de casa. Enganxa un codi QR a cada armari o calaixera → escaneja → cerca per paraula clau.

---

## Inici ràpid

```bash
corepack enable          # una vegada — activa pnpm via Corepack
pnpm install
pnpm dev                 # http://localhost:3000
```

Comprovacions abans de desplegar:

```bash
pnpm check               # validate:data + test + lint + typecheck + format + build
```

O pas a pas:

```bash
pnpm exec tsc --noEmit   # tipus
pnpm test                # tests unitaris (Vitest)
pnpm build               # export estàtic → carpeta /out
pnpm validate:data       # valida data/inventory.json
```

**Gestor de paquets:** només `pnpm` (blocat per `.npmrc`).

---

## Què fa l'app

| Flux           | Descripció                                                        |
| -------------- | ----------------------------------------------------------------- |
| **Cerca**      | Escriu a la home o a `/search` → resultats fuzzy (Fuse.js)        |
| **Localitzar** | Toca un resultat → modal amb plànol del moble i secció destacada  |
| **Navegar**    | Toca un espai a «Navega pels espais» → plànol interactiu + llista |
| **QR**         | `/qr` genera codis per obrir cada espai directament               |

Contingut de l'inventari en **català** (noms d'objectes). La UI suporta **ca / es / en**.

---

## Stack

| Capa         | Tecnologia                                       |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js 14 · App Router · TypeScript             |
| Estils       | Tailwind CSS (`darkMode: "class"`)               |
| Cerca        | fuse.js · client-side · sense backend            |
| QR           | qrcode.react (import dinàmic)                    |
| Desplegament | `output: 'export'` → GitHub Pages                |
| PWA          | Service worker (`out/sw.js`, generated at build) |
| Qualitat     | ESLint (Next + TS + Vitest), Prettier            |

---

## Estructura del repositori

```
app/                    # Pàgines Next.js (App Router)
  page.tsx              # Home: cerca + espais
  space/[id]/           # Detall d'un espai (plànol + cerca local)
  search/               # Cerca global
  qr/                   # Codis QR
  globals.css           # Classes reutilitzables (cards, buscador, botons)
components/             # UI reutilitzable
lib/
  inventory.ts          # Tipus + getSpace / getAllSpaces
  fuse-search.ts        # Índex Fuse (una instància)
  i18n.tsx / theme.tsx  # Locale i tema (localStorage)
  translations/         # ca.ts (font de veritat), es.ts, en.ts
data/
  inventory.json        # Única font de dades
docs/                   # Documentació per humans i IA → docs/README.md
AGENTS.md               # Context curt per assistents d'IA (Cursor, Copilot…)
scripts/
  validate-data.ts      # CLI: valida data/inventory.json
```

---

## Dades i rutes

- **Dades:** `data/inventory.json` — veure [docs/DATA.md](docs/DATA.md)
- **Rutes:** `/` · `/space/[id]` · `/space/[id]?highlight=…` · `/search?q=…` · `/qr`
- **Afegir un espai:** edita `inventory.json` → `pnpm build` (routing automàtic)

---

## Desplegament

Push a `main` → GitHub Actions → branca `gh-pages`.

Si l'URL és `https://usuari.github.io/whereis-app/`, configura `NEXT_PUBLIC_BASE_PATH=/whereis-app` a `.github/workflows/deploy.yml` i en local (`.env.local`).

---

## Documentació

| Fitxer                                       | Per a qui       | Contingut                                |
| -------------------------------------------- | --------------- | ---------------------------------------- |
| [AGENTS.md](AGENTS.md)                       | IA              | Convencions crítiques, mapa ràpid        |
| [docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md)   | Tu + IA         | Com demanar canvis, plantilles de prompt |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Desenvolupament | Flux de dades, static export, límits     |
| [docs/DATA.md](docs/DATA.md)                 | Contingut       | Esquema JSON, convencions de noms        |
| [docs/UI.md](docs/UI.md)                     | Disseny         | Components, classes CSS, modes clar/fosc |

---

## Llicència

Projecte privat (`"private": true`).
